import {lengthRecommendation} from './sizing.mjs';
export const genderLabels={Women:'女款',Men:'男款',Unisex:'Unisex',Youth:'青少年 / 儿童'};
export function displayImageUrl(original){const u=new URL(original);if(u.hostname==='cdn.shopify.com'||u.pathname.includes('/cdn/shop/'))u.searchParams.set('width','600');else if(u.hostname==='cdn.dam.salomon.com')u.searchParams.set('width','600');return u.href;}
export function imageCandidates(images,selected=0){const order=images.map((_,i)=>(selected+i)%images.length),seen=new Set(),out=[];for(const index of order){const original=images[index].url;for(const url of [images[index].local,displayImageUrl(original),original])if(url&&!seen.has(url)){seen.add(url);out.push({url,index});}}return out;}
export function matchingSizes(p,weight){return weight>0?p.fit.filter(x=>weight>=x.weightKg[0]&&(x.weightKg[1]===null||weight<=x.weightKg[1])).map(x=>x.length):[];}
export function filterProducts(products,f,saved=[]){return products.filter(p=>{
 const query=(f.search||'').trim().toLowerCase();
 if(query&&!`${p.brand} ${p.model} ${p.season} ${p.terrains.join(' ')}`.toLowerCase().includes(query))return false;
 for(const key of ['brand','shape','gender','season'])if(f[key]&&(f[key]==='unknown'?p[key]!==null:p[key]!==f[key]))return false;
 const modelGender=p.riderGender??p.gender;
 if((f.riderGender==='Men'&&modelGender==='Women')||(f.riderGender==='Women'&&modelGender==='Men'))return false;
 if(f.min!==''&&f.min!=null&&(p.flex.value===null||p.flex.value<Number(f.min)))return false;
 if(f.max!==''&&f.max!=null&&(p.flex.value===null||p.flex.value>Number(f.max)))return false;
 if(f.official&&p.flex.kind!=='official')return false;
 if(f.level&&!p.levels.includes(f.level)||f.terrain&&!p.terrains.includes(f.terrain))return false;
 if(f.length&&!p.sizes.some(x=>parseFloat(x)===Number(f.length)))return false;
 if(f.currency&&p.price?.currency!==f.currency)return false;
 if(f.budget!==''&&f.budget!=null&&f.currency&&(!p.price||p.price.amount>Number(f.budget)))return false;
 if(f.saved&&!saved.includes(p.id))return false;
 if(f.fit&&!lengthRecommendation(p,{weight:f.weight,height:f.height,general:f.sizingMode!=='official'}).sizes.length)return false;
 return true;
});}
const featured=['burton-mens-burton-custom-camber','neversummer-mens-proto-type-3','capita-capita-d-o-a-mens','jones-mens-mountain-twin-snowboard','k2-afterblack','ride-shadowban','salomon-assassin','thirtytwo-permanent-vacation','ogasaka-ct-2027','yonex-sm26','bataleon-2627-evil-twin-mens','arbor-element-snowboard-27','yes-standard','011-double-fly'];
export function score(p){const n=featured.findIndex(x=>p.id.includes(x));return n<0?99:n;}
export function sortProducts(products,sort,currency){const a=[...products];const nullLast=(a,b,dir=1)=>a===null?(b===null?0:1):b===null?-1:(a-b)*dir;return a.sort((a,b)=>{
 if(sort==='flex-asc'||sort==='flex-desc')return nullLast(a.flex.value,b.flex.value,sort==='flex-asc'?1:-1);
 if(sort==='price-asc'||sort==='price-desc'){if(!currency)return 0;return nullLast(a.price?.amount??null,b.price?.amount??null,sort==='price-asc'?1:-1);}
 if(sort==='name')return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
 if(sort==='season')return a.season==='待核实'?(b.season==='待核实'?0:1):b.season==='待核实'?-1:b.season.localeCompare(a.season);
 return score(a)-score(b)||b.season.localeCompare(a.season)||a.brand.localeCompare(b.brand);
});}
export function groupProducts(products){const map=new Map();for(const p of products){const key=p.brand+'|'+p.family+'|'+(p.gender||'unknown')+(p.season==='待核实'?'|'+p.id:'');const row=map.get(key)||[];row.push(p);map.set(key,row);}return [...map.entries()].flatMap(([key,editions])=>new Set(editions.map(p=>p.season)).size<editions.length?editions.map(p=>({key:key+'|'+p.id,editions:[p]})):[{key,editions:editions.sort((a,b)=>b.season.localeCompare(a.season))}]);}
export function safeIds(input,products){const valid=new Set(products.map(p=>p.id));return Array.isArray(input)?[...new Set(input.filter(x=>typeof x==='string'&&valid.has(x)))]:[];}
