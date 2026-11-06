import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html','.css':'text/css','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.md':'text/plain','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2'};
http.createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.writeHead(302,{Location:'/examples/catalog.html'});return res.end();}const p=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!p.startsWith(root)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[path.extname(p)]||'text/plain');res.end(fs.readFileSync(p));}catch{res.writeHead(404);res.end('Not found');}}).listen(4173,'127.0.0.1',()=>console.log('Design-system preview: http://127.0.0.1:4173'));
