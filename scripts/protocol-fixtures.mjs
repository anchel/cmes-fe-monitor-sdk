/** Capture request examples from the reference implementation, never invent sample bodies. */
import fs from 'node:fs/promises';
import {sandbox} from '../tests/harness.mjs';
import {decodeReport} from '../examples/protocol.mjs';
const env=sandbox('reference');
try {
  const sdk=env.create({ext1:'demo'});
  await env.clock.tickAsync(700);
  sdk.report({msg:'订单提交失败',level:'4',ext2:'order-42'});
  sdk.reportEvent({name:'checkout',ext1:'cart'});
  sdk.reportTime({name:'checkout_duration',duration:123,ext3:'done'});
  sdk.speedLogPipeline({url:'https://api.example.test/orders',method:'POST',type:'fetch',duration:87,status:200,ret:'0',isErr:0});
  sdk.reportPageView('https://app.example.test/checkout');
  await env.clock.tickAsync(100);
  const examples=env.requests.map(r=>({method:r.method,url:r.url,headers:r.headers,body:r.body,decoded:decodeReport({url:r.url,headers:r.headers,body:Buffer.from(r.body??'')})}));
  await fs.writeFile('docs/wire-examples.json',JSON.stringify({source:'Captured from supplied Aegis 1.43.60 in a deterministic browser sandbox',examples},null,2)+'\n');
  console.log(`Wrote ${examples.length} reference wire examples`);
}finally{env.close();}
