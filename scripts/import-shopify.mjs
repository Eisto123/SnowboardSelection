// Fetch public catalog candidates. Never overwrites curated brand data.
import fs from 'node:fs/promises';
const [brand,origin,season]=process.argv.slice(2);
if(!brand||!origin||!/^20\d{2}\/\d{2}$/.test(season||''))throw Error('Usage: node scripts/import-shopify.mjs "Brand" https://official-brand.com 2026/27');
const base=new URL(origin);if(base.protocol!=='https:')throw Error('HTTPS required');
const candidates=[];let complete=false;
for(let page=1;page<=20;page++){
 const url=new URL(`/products.json?limit=250&page=${page}`,base);
 const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${url}: ${r.status}`);
 const {products}=await r.json();if(!Array.isArray(products))throw Error('Not a Shopify products endpoint');
 if(!products.length){complete=true;break;}
 for(const p of products){candidates.push({brand,candidateSeason:season,seasonVerified:false,handle:p.handle,title:p.title,productType:p.product_type,tags:p.tags,source:new URL('/products/'+p.handle,base).href,observedVariants:p.variants.map(v=>({title:v.title,price:v.price,compareAtPrice:v.compare_at_price,sku:v.sku})),observedImages:p.images.map(i=>({url:i.src,alt:i.alt})),checkedAt:new Date().toISOString().slice(0,10),reviewRequired:['Is this a snowboard, not boots/bindings/merchandise?','Confirm season from product page / SKU / catalog','Confirm currency, region, taxes and MSRP versus list/sale price','Verify shape, flex scale, size-weight chart, image season and rights']});}
 if(products.length<250){complete=true;break;}
}
await fs.mkdir('work',{recursive:true});const name=brand.toLowerCase().replace(/[^a-z0-9-]/g,'-');const dest=`work/${name}-candidates-${Date.now()}.json`;
await fs.writeFile(dest,JSON.stringify({complete,candidates},null,2));console.log(`${candidates.length} unreviewed candidates saved to ${dest}. No production data was changed. Pagination complete: ${complete}`);
