import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=path.resolve(process.argv[2]||'dist'),port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{try{const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(base,'.'+(route.endsWith('/')?route+'index.html':route));if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);return res.end();}const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/`));
