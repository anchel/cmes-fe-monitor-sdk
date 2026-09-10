import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeReport} from './protocol.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
export function createDemoServer({quiet=false,whitelist=true,useGzip=1,rateConfigs=[]}={}) {
  const reports=[];
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Content-Encoding,traceparent,b3,sw8,sentry-trace');
    if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
    try {
      if(url.pathname==='/monitor/__requests'){json(200,reports);return;}
      if(url.pathname==='/monitor/rateConfig'){json(200,{retcode:0,configs:rateConfigs,ttl:300});return;}
      if(url.pathname==='/monitor/collect/whitelist'){json(200,{retcode:0,result:{is_in_white_list:whitelist,rate:1,use_gzip:useGzip}});return;}
      if(url.pathname.startsWith('/monitor/')) {
        const chunks=[];let size=0;
        for await(const chunk of req){size+=chunk.length;if(size>2*1024*1024){json(413,{retcode:1,message:'Payload too large'});return;}chunks.push(chunk);}
        const report={receivedAt:Date.now(),method:req.method,...decodeReport({url:req.url,headers:req.headers,body:Buffer.concat(chunks)})};
        reports.push(report);if(reports.length>500)reports.shift();
        if(!quiet)console.log(`[${report.method}] ${report.path} id=${report.query.id||''} records=${report.records.length} encoding=${report.encoding}`);
        json(200,{retcode:0});return;
      }
      if(url.pathname==='/api/orders'){json(200,{retcode:0,data:{orderId:'demo-1'}});return;}
      if(url.pathname==='/api/error'){json(503,{retcode:500,message:'Demonstration API failure'});return;}
      const relative=url.pathname==='/'?'examples/index.html':decodeURIComponent(url.pathname.slice(1));
      const target=path.resolve(root,relative);
      if(!target.startsWith(root)||!(relative.startsWith('dist/')||relative.startsWith('examples/')||relative==='reference/aegis-1.43.60.min.js')){json(404,{error:'Not found'});return;}
      const contents=await fs.readFile(target);
      const type=target.endsWith('.html')?'text/html; charset=utf-8':target.endsWith('.js')?'text/javascript; charset=utf-8':target.endsWith('.map')?'application/json':'text/plain';
      res.writeHead(200,{'Content-Type':type});res.end(contents);
    }catch(error){json(error.code==='ENOENT'?404:400,{retcode:1,message:error.message});}
  });
  return {server,reports};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const {server}=createDemoServer();
  const port=Number(process.env.PORT||8787);
  server.listen(port,'127.0.0.1',()=>console.log(`CMES SDK demo: http://127.0.0.1:${port}`));
}
