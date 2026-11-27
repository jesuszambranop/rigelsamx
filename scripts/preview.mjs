import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../public');
// Reproduce también las restricciones reales de cPanel durante la revisión local.
const apacheConfig=await readFile(resolve(root,'.htaccess'),'utf8');
const contentSecurityPolicy=apacheConfig.match(/^\s*Header always set Content-Security-Policy "([^"]+)"/m)?.[1];
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
  if(contentSecurityPolicy)res.setHeader('Content-Security-Policy',contentSecurityPolicy);
  let path;
  try {path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/(mx|rigelsamx)(\/|$)/,'/');} catch {res.writeHead(400).end();return;}
  if(path.includes('/api/')){res.writeHead(503,{'Content-Type':'application/json'}).end(JSON.stringify({ok:false,message:'La vista estática no ejecuta PHP. Usa el servidor PHP para probar formularios.'}));return;}
  if(path.endsWith('/'))path+='index.html';
  const file=resolve(root,'.'+path);
  if(!file.startsWith(root+sep)||path.split('/').some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}
  try {if(!(await stat(file)).isFile())throw new Error();res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(file));}catch{res.writeHead(404,{'Content-Type':'text/html'}).end(await readFile(resolve(root,'404.html')));}
}).listen(8787,'127.0.0.1',()=>console.log('Rigel México: http://127.0.0.1:8787/mx/'));
