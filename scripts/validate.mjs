import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const schema=JSON.parse(await fs.readFile(new URL('../data/schema.json',import.meta.url),'utf8'));
// Implements every validation keyword used in this project's schema; no dependencies.
export function checkSchema(value,s= schema,at='$'){
 if(s.$ref){const target=s.$ref.split('/').slice(1).reduce((o,k)=>o[k],schema);return checkSchema(value,target,at);}
 if(s.anyOf){const valid=s.anyOf.some(x=>{try{checkSchema(value,x,at);return true;}catch{return false;}});if(!valid)throw Error(at+' does not match anyOf');return;}
 const fail=msg=>{throw Error(at+' '+msg);};
 const type=value===null?'null':Array.isArray(value)?'array':typeof value;
 if(s.type&&![s.type].flat().includes(type))fail('invalid type '+type);
 if(s.enum&&!s.enum.includes(value))fail('invalid enum');
 if(type==='number'){if(!Number.isFinite(value))fail('nonfinite number');if(s.minimum!==undefined&&value<s.minimum)fail('below minimum');if(s.maximum!==undefined&&value>s.maximum)fail('above maximum');if(s.exclusiveMinimum!==undefined&&value<=s.exclusiveMinimum)fail('below exclusive minimum');}
 if(type==='string'){if(s.pattern&&!new RegExp(s.pattern).test(value))fail('invalid pattern');if(s.minLength&&value.length<s.minLength)fail('too short');}
 if(type==='array'){if(s.minItems&&value.length<s.minItems)fail('too few items');if(s.maxItems&&value.length>s.maxItems)fail('too many items');if(s.uniqueItems&&new Set(value.map(x=>JSON.stringify(x))).size!==value.length)fail('duplicate item');if(s.items)value.forEach((x,i)=>checkSchema(x,s.items,at+'['+i+']'));}
 if(type==='object'){for(const k of s.required||[])if(!(k in value))fail('missing '+k);for(const [k,v] of Object.entries(value)){if(s.properties?.[k])checkSchema(v,s.properties[k],at+'.'+k);else if(s.additionalProperties===false)fail('unexpected '+k);}}
}
export async function validate(){
 const dir=new URL('../data/brands/',import.meta.url),files=(await fs.readdir(dir)).filter(n=>n.endsWith('.json')).sort();let products=[];
 for(const file of files){const data=JSON.parse(await fs.readFile(new URL(file,dir),'utf8'));checkSchema(data,schema,file);products.push(...data);}
 const ids=new Set();
 for(const p of products){
  if(ids.has(p.id))throw Error('Duplicate ID '+p.id);ids.add(p.id);
  if(p.flex.kind==='unknown'&&(p.flex.value!==null||p.flex.source!==null))throw Error('Unknown flex must be null '+p.id);
  if(p.flex.kind!=='unknown'&&(!p.flex.source||!p.flex.original||p.flex.value===null))throw Error('Missing flex evidence '+p.id);
  if(p.flex.kind==='converted'&&!p.flex.method)throw Error('Missing conversion method '+p.id);
  if(p.price&&(p.price.season!==p.season||p.price.maxAmount<p.price.amount))throw Error('Invalid price '+p.id);
  for(const x of p.fit)if(!p.sizes.includes(x.length)||x.weightKg[0]===null||(x.weightKg[1]!==null&&x.weightKg[0]>x.weightKg[1]))throw Error('Invalid size fit '+p.id);
  for(const x of p.images){if(x.season!=='待核实'&&x.season!==p.season)throw Error('Image season mismatch '+p.id);if(x.local){const bytes=await fs.readFile(new URL('../site/'+x.local.slice(2),import.meta.url));if(bytes[0]!==255||bytes[1]!==216)throw Error('Invalid cached JPEG '+p.id);}}
  for(const x of p.sizes)if(parseFloat(x)<65||parseFloat(x)>220)throw Error('Implausible length '+p.id);
 }
 return {products,files};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const {products,files}=await validate();console.log(`Validated ${products.length} records in ${files.length} brand files.`);}
