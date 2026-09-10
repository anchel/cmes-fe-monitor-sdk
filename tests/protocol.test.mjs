import test from 'node:test';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {decodeReport} from '../examples/protocol.mjs';
import {sandbox} from './harness.mjs';

test('backend decoder parses real reference requests including nested speed/event/custom payloads',async()=>{
  const env=sandbox('reference');
  try{
    const sdk=env.create();await env.clock.tickAsync(700);
    sdk.report({msg:'中文 & = %',ext4:10});sdk.reportEvent('event');sdk.reportTime('time',12);
    sdk.speedLogPipeline({url:'https://api.test/a',type:'fetch',duration:23,status:200});
    await env.clock.tickAsync(100);
    const decoded=env.requests.map(r=>decodeReport({url:r.url,headers:r.headers,body:Buffer.from(r.body??'')}));
    assert.ok(decoded.some(r=>r.records.some(x=>x.msg==='中文 & = %')));
    assert.ok(decoded.some(r=>r.records.some(x=>x.name==='event')));
    assert.ok(decoded.some(r=>r.records.some(x=>x.name==='time'&&x.duration===12)));
    assert.ok(decoded.some(r=>r.records.some(x=>x.url==='https://api.test/a'&&x.duration===23)));
    for(const r of decoded)assert.equal(r.query.id,'project-test');
  }finally{env.close();}
});
test('gzip JSON and beacon text/plain use the same decoder; memory uses query fields',()=>{
  const body=JSON.stringify({msg:['hello'],level:['4'],count:1});
  const plain=decodeReport({url:'/monitor/collect?id=project',body:Buffer.from(body)});
  const gzip=decodeReport({url:'/monitor/collect?id=project',headers:{'content-encoding':'gzip','content-type':'text/plain'},body:gzipSync(body)});
  assert.deepEqual(gzip.records,plain.records);
  const memory=decodeReport({url:'/monitor/memory?memoryUsed=42',body:Buffer.from('[object Object]')});
  assert.deepEqual(memory.records,[{memoryUsed:'42'}]);
});
