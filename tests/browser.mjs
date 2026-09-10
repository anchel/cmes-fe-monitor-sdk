import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createDemoServer} from '../examples/server.mjs';

const {server,reports}=createDemoServer({quiet:true});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chromium'});
const summaries=[];
async function until(predicate,label,timeout=10000) {
  const end=Date.now()+timeout;
  while(Date.now()<end){if(predicate())return;await new Promise(r=>setTimeout(r,40));}
  throw new Error(`Timed out: ${label}`);
}
try {
  for(const variant of ['reference','umd','minified','esm']) {
    const context=await browser.newContext({viewport:{width:1000,height:700}});
    const unexpected=[];
    await context.route('**/*',route=>{
      const url=route.request().url();
      if(url.startsWith(origin+'/'))return route.continue();
      unexpected.push(url);return route.abort();
    });
    const page=await context.newPage();
    await page.route(origin+'/test',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>SDK test</title></head><body><button id="test">Click</button><main style="height:500px;background:#ccc">Test application</main></body></html>'}));
    await page.goto(origin+'/test');
    if(variant==='esm') {
      await page.evaluate(async()=>{
        const module=await import('/dist/cmes-monitor.esm.js');
        if(module.default!==module.Aegis||module.default!==module.CmesMonitor)throw new Error('ESM aliases differ');
        window.SDK=module.default;
      });
    } else {
      const url=variant==='reference'?'/reference/aegis-1.43.60.min.js':variant==='umd'?'/dist/cmes-monitor.js':'/dist/cmes-monitor.min.js';
      await page.addScriptTag({url:origin+url});
      await page.evaluate(()=>{window.SDK=window.Aegis;});
    }
    const start=reports.length;
    const id=`browser-${variant}`;
    await page.evaluate(id=>{
      // The whitelist and rateConfig stages are opt-in on CmesMonitor and always on upstream;
      // enable them so every distribution is compared against reference on the same wire.
      window.sdk=new window.SDK({id,uin:'test-user',hostUrl:'/monitor',delay:30,enableWhitelist:true,enableRateConfig:true,reportApiSpeed:true,reportAssetSpeed:true,
        consoleLog:true,clickElementLog:true,webVitals:{manualReport:true},
        api:{reportRequest:true,apiDetail:true,injectTraceHeader:'traceparent'},
        gzip:{enable:true,threshold:256,useWorker:true,workerThreshold:512}});
    },id);
    await page.waitForFunction(()=>window.sdk.rateLimitReady&&window.sdk.isWhiteList);
    await page.evaluate(async()=>{
      sdk.report('browser-manual');sdk.reportEvent('browser-event');sdk.reportTime('browser-time',28);
      sdk.reportPageView(location.origin+'/virtual');
      const error=new Error('browser-error');error.stack='Error: browser-error\n at app.js:1:1';
      window.dispatchEvent(new ErrorEvent('error',{message:error.message,error,filename:location.origin+'/app.js',lineno:1,colno:1}));
      console.log('browser-console');document.querySelector('button').click();
      await fetch('/api/orders');await fetch('/api/error');
      const asset=document.createElement('script');asset.src='/examples/missing-asset.js';document.head.appendChild(asset);
      const xhr=new XMLHttpRequest();xhr.open('GET','/api/orders');xhr.send();
      sdk.report('gzip-worker-'+Array.from({length:1600},(_,i)=>`中文${i%97}`).join(''));
      sdk.reportWebVitals({LCP:123,FCP:99});sdk.reportWebVitals({LCP:123,FCP:99});
    });
    const own=()=>reports.slice(start).filter(r=>r.query.id===id);
    await until(()=>own().some(r=>r.encoding==='gzip'&&r.records.some(x=>String(x.msg).startsWith('gzip-worker-'))),`${variant} worker gzip`);
    await until(()=>own().some(r=>r.path==='/monitor/speed'),`${variant} API/resource speed`);
    await page.evaluate(()=>{
      sdk.resolvedGzipConfig.useWorker=false;
      sdk.report('gzip-main-'+Array.from({length:1600},(_,i)=>`文本${i%67}`).join(''));
    });
    await until(()=>own().some(r=>r.encoding==='gzip'&&r.records.some(x=>String(x.msg).startsWith('gzip-main-'))),`${variant} main-thread gzip`);
    await page.evaluate(()=>{
      sdk.disableWhitelistGzipState();sdk.report('identity-'+ 'x'.repeat(2000));
    });
    await until(()=>own().some(r=>r.encoding==='identity'&&r.records.some(x=>String(x.msg).startsWith('identity-'))),`${variant} gzip opt-out`);
    await page.evaluate(()=>{
      sdk.config.delay=1000;sdk.report('page-exit');window.dispatchEvent(new Event('pagehide'));
    });
    await until(()=>own().some(r=>r.records.some(x=>x.msg==='page-exit')),`${variant} beacon flush`);
    const paths=[...new Set(own().map(r=>r.path))].sort();
    const levels=[...new Set(own().flatMap(r=>r.records.map(x=>x.level)).filter(Boolean))].sort();
    for(const path of ['/monitor/collect','/monitor/collect/events','/monitor/collect/pv','/monitor/speed','/monitor/speed/custom','/monitor/speed/performance','/monitor/speed/webvitals'])assert.ok(paths.includes(path),`${variant}: missing ${path}`);
    for(const level of ['4','32','1030','1031'])assert.ok(levels.includes(level),`${variant}: missing level ${level}`);
    assert.deepEqual(unexpected,[],`${variant}: unexpected remote traffic`);
    summaries.push({variant,paths,levels,gzip:true,beacon:true});
    console.log(`PASS ${variant}: 7 endpoints, errors/clicks/console, fetch/XHR/resources, Worker/main gzip, identity fallback, beacon`);
    await context.close();
  }

  // Full DOM/canvas white-screen path, with original and derivative in separate realms.
  for(const variant of ['reference','umd']) {
    const context=await browser.newContext({viewport:{width:600,height:400}});
    const page=await context.newPage();
    await page.route(origin+'/blank',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><div id="app"></div></body></html>'}));
    await page.goto(origin+'/blank');
    await page.addScriptTag({url:origin+(variant==='reference'?'/reference/aegis-1.43.60.min.js':'/dist/cmes-monitor.js')});
    const id=`blank-${variant}`;
    await page.evaluate(id=>{
      window.sdk=new Aegis({id,uin:'u',hostUrl:'/monitor',delay:20,enableWhitelist:true,enableRateConfig:true,pagePerformance:false,webVitals:false,gzip:false,
        blankScreen:{debounceDuration:20,reDetectInterval:20,enableScreenshot:true}});
      const error=new Error('blank app');window.dispatchEvent(new ErrorEvent('error',{message:error.message,error}));
    },id);
    await until(()=>reports.some(r=>r.query.id===id&&r.records.some(x=>x.level==='1032')),`${variant} white-screen detection`,12000);
    const record=reports.filter(r=>r.query.id===id).flatMap(r=>r.records).find(x=>x.level==='1032');
    assert.match(record.msg,/blankscreen/);
    assert.ok(record.errorMsg&&record.errorMsg.startsWith('data:image/'),`${variant} screenshot not captured`);
    console.log(`PASS ${variant}: blank-screen detection with canvas screenshot`);
    await context.close();
  }
  console.log(`Browser checks passed: ${summaries.length} distributions + 2 white-screen/screenshot scenarios.`);
} finally {
  await browser.close();
  server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
}
