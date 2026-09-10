import test from 'node:test';
import assert from 'node:assert/strict';
import {sandbox,source,compareScenario} from './harness.mjs';

function same(results) {
  const [reference,...candidates]=results;
  for(const result of candidates){
    assert.deepEqual(result.requests,reference.requests,`${result.kind}: wire differs`);
    assert.deepEqual(result.value,reference.value,`${result.kind}: return/state differs`);
    assert.deepEqual(result.diagnostics,reference.diagnostics,`${result.kind}: diagnostics differ`);
  }
  return reference;
}
test('all prototype members, log levels, environments and 15 plugins are preserved',async()=>{
  same(await compareScenario(async env=>{
    const sdk=env.create();
    const members=[];
    for(let proto=sdk;proto&&proto!==env.w.Object.prototype;proto=Object.getPrototypeOf(proto))
      members.push(...Object.getOwnPropertyNames(proto).filter(k=>k!=='constructor'));
    return {members:[...new Set(members)].sort(),plugins:env.w.Aegis.installedPlugins.map(p=>p.name),levels:env.w.Aegis.logType,env:env.w.Aegis.environment,config:sdk.config,bean:sdk.bean};
  }));
});

test('manual logs, event overloads, timing overloads, PV, extension columns and page grouping match',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({ext1:'中文 空格 &=%',ext4:123});
    await env.clock.tickAsync(600);
    sdk.info('info');sdk.infoAll('all');sdk.report('report',{nested:true});sdk.error('error');
    sdk.report({msg:'first page',level:'2048',from:encodeURIComponent('https://app.example.test/a'),ext2:'local'});
    sdk.report({msg:'second page',level:'4',from:encodeURIComponent('https://app.example.test/b'),code:'E42'});
    sdk.reportEvent('opened');sdk.reportEvent({name:'buy',ext1:'product',ext10:'extra'});
    sdk.reportTime('render',42);sdk.reportTime({name:'database',duration:75,ext3:'sql'});
    sdk.time('timer');await env.clock.tickAsync(15);sdk.timeEnd({name:'timer',ext2:'finish'});
    sdk.reportPageView('https://app.example.test/virtual');
    await env.clock.tickAsync(100);
    return {version:sdk.__version__,bean:sdk.getBean(['sessionId']),origin:sdk.getOriginFrom()};
  }));
  assert.ok(result.requests.some(r=>r.url.endsWith('/collect')&&r.body.count>0));
  assert.ok(result.requests.some(r=>r.url.endsWith('/collect/events')));
  assert.ok(result.requests.some(r=>r.url.endsWith('/speed/custom')));
});

test('rateConfig blocks queues until ready and applies percentage sampling by category',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create();
    sdk.error('dropped error');sdk.reportEvent('allowed event');
    await env.clock.tickAsync(40);
    assert.equal(env.requests.length,0);
    await env.clock.tickAsync(700);
    return {ready:sdk.rateLimitReady,sampled:sdk.rateLimitSampled};
  },{rate:{retcode:0,configs:[{limit_type:'jsError',sample_rate:0},{limit_type:'event',sample_rate:100}],ttl:60}}));
  assert.ok(!result.requests.some(r=>r.body?.msg?.includes('dropped error')));
  assert.ok(result.requests.some(r=>r.url.endsWith('/collect/events')&&r.query.sampled==='1'));
});

test('whitelist filters info, preserves infoAll, and negotiates gzip',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({gzip:true});
    sdk.info('private info');sdk.infoAll('always info');
    await env.clock.tickAsync(800);
    sdk.info('private after');sdk.infoAll('always after');
    await env.clock.tickAsync(100);
    return {white:sdk.isWhiteList,gzip:sdk.isGzipReportEnabled(true)};
  },{whitelist:{retcode:0,result:{is_in_white_list:false,rate:1,use_gzip:0}}}));
  const logs=result.requests.filter(r=>r.url.endsWith('/collect'));
  assert.ok(logs.length);assert.ok(logs.every(r=>r.body.msg.every(m=>!m.includes('private'))));
});

test('request and reporting hooks, lifecycle and filtering retain order and mutations',async()=>{
  same(await compareScenario(async env=>{
    env.run(`var calls=[]; var sdk=new Aegis({id:'hooks',uin:'u',hostUrl:'https://collector.example.test/monitor',delay:10,gzip:false,onError:false,device:false,pagePerformance:false,webVitals:false,onClose:false,enableWhitelist:true,enableRateConfig:true,
      logCreated:function(log){calls.push('created:'+log.msg);return log.msg!=='drop-created';},
      beforeReport:function(log){calls.push('report:'+log.msg);return log.msg!=='drop-report';},
      beforeRequest:function(stage){calls.push('before:'+stage.logType);return stage;},
      modifyRequest:function(options){calls.push('modify:'+options.type);return options;},
      onBeforeRequest:function(options){calls.push('transport:'+options.type);options.url+='&hook=1';return options;},
      afterRequest:function(result){calls.push('after:'+result.logType);}
    }); sdk.lifeCycle.on('beforeWrite',function(logs){calls.push('beforeWrite:'+logs.length)});`);
    await env.clock.tickAsync(700);
    env.run(`sdk.report('drop-created');sdk.report('drop-report');sdk.report('keep');`);
    await env.clock.tickAsync(100);return env.w.calls;
  }));
});

test('reportImmediately=false, ready(), setConfig() and custom endpoint override',async()=>{
  same(await compareScenario(async env=>{
    const sdk=env.create({reportImmediately:false});
    sdk.reportEvent('queued');await env.clock.tickAsync(800);
    assert.equal(env.requests.length,0);
    sdk.ready();await env.clock.tickAsync(100);
    sdk.setConfig({uin:'new-user',ext2:'updated',url:'https://custom.example.test/logs'});
    sdk.report('custom');await env.clock.tickAsync(700);
    return {bean:sdk.bean,ready:sdk.isReportReady,range:[sdk.validateRange(-1),sdk.validateRange(127),sdk.validateRange(128)]};
  }));
});

test('sampling fallback on bad config response, repeat suppression and maxLength',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({repeat:1,maxLength:12});
    for(let i=0;i<6;i++)sdk.error('repeated error too long');
    await env.clock.tickAsync(800);
    return {ready:sdk.rateLimitReady,sampled:sdk.rateLimitSampled};
  },{rate:{retcode:1},whitelist:{retcode:1}}));
  assert.equal(result.value.ready,true);assert.equal(result.value.sampled,false);
  assert.ok(result.requests.some(r=>r.body?.msg?.includes('repeated err')));
});

test('error/rejection/resource capture and console/click plugins emit compatible logs',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({onError:true,consoleLog:true,clickElementLog:true});
    await env.clock.tickAsync(700);
    env.run(`var err=new Error('runtime failure');err.stack='Error: runtime failure\\n at app.js:10:2';window.dispatchEvent(new ErrorEvent('error',{message:err.message,error:err,filename:'https://app.example.test/app.js',lineno:10,colno:2}));
      var rejection=new Event('unhandledrejection');rejection.reason='rejected value';window.dispatchEvent(rejection);
      var img=document.createElement('img');img.src='https://assets.example.test/missing.png';document.body.appendChild(img);img.dispatchEvent(new Event('error'));
      console.log('console captured');document.getElementById('buy').click();`);
    await env.clock.tickAsync(100);return sdk.isWhiteList;
  }));
  const levels=result.requests.flatMap(r=>r.body?.level??[]);
  for(const expected of ['4','8','64','1031','1030']) assert.ok(levels.includes(expected),`missing ${expected}`);
});

test('fetch/XHR timing, return-code parsing, trace headers and speed payload match',async()=>{
  const result=same(await compareScenario(async env=>{
    env.create({reportApiSpeed:true,api:{apiDetail:true,reportRequest:true,injectTraceHeader:'traceparent'}});
    await env.clock.tickAsync(700);
    await env.run(`fetch('https://api.example.test/orders',{method:'POST',body:'{"sku":"demo"}',headers:{'content-type':'application/json'}})`);
    env.run(`var xhr=new XMLHttpRequest();xhr.open('GET','https://api.example.test/users');xhr.send();`);
    await env.clock.tickAsync(200);
  }));
  const speeds=result.requests.filter(r=>r.url.endsWith('/speed'));
  assert.ok(speeds.length);
  assert.ok(speeds.some(r=>JSON.parse(r.body.payload).duration.fetch.length>0));
});

test('SPA navigation and page-exit beacon flushing preserve URLs and request bodies',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({spa:true,onClose:true,delay:1000});
    await env.clock.tickAsync(700);
    env.run(`history.pushState({},'', '/details?x=1#more');`);
    sdk.report('unload report');sdk.reportEvent('unload event');sdk.reportTime({name:'unload time',duration:1});
    env.w.dispatchEvent(new env.w.Event('pagehide'));
    await env.clock.tickAsync(100);
  }));
  assert.ok(result.requests.some(r=>r.transport==='beacon'&&r.url.endsWith('/collect')));
});

test('memory/OOM and long-animation-frame plugins preserve metric fields and levels',async()=>{
  const result=same(await compareScenario(async env=>{
    env.w.performance.memory={usedJSHeapSize:120*1048576,totalJSHeapSize:150*1048576,jsHeapSizeLimit:200*1048576};
    env.create({memoryMonitor:{enabled:true,memoryReportInterval:200,oomCheckInterval:200,oomThreshold:100},lagMonitor:{enabled:true,threshold:100,noResponseThreshold:500}});
    await env.clock.tickAsync(700);
    env.emitPerformance('long-animation-frame',[{name:'frame',duration:250,startTime:1,entryType:'long-animation-frame',scripts:[{invoker:'click',sourceURL:'app.js'}]},{name:'frame',duration:900,startTime:2,entryType:'long-animation-frame',scripts:[]}]);
    await env.clock.tickAsync(100);
  }));
  assert.ok(result.requests.some(r=>r.url.endsWith('/memory')&&r.query.memoryUsed));
  const levels=result.requests.flatMap(r=>r.body?.level??[]);
  for(const expected of ['1033','1034','1035'])assert.ok(levels.includes(expected));
});

test('public custom plugin use/unuse and destroy retain lifecycle behavior',async()=>{
  same(await compareScenario(async env=>{
    env.run(`var calls=[];var plugin={name:'custom',aegisPlugin:true,patch:function(sdk){calls.push('patch:'+sdk.config.id)},unpatch:function(sdk){calls.push('unpatch:'+sdk.config.id)}};Aegis.use(plugin);Aegis.use(plugin);`);
    const sdk=env.create();await env.clock.tickAsync(700);
    sdk.destroy();env.w.Aegis.unuse(env.w.plugin);
    return {calls:env.w.calls,instances:env.w.Aegis.instances.length,plugins:env.w.Aegis.installedPlugins.map(p=>p.name)};
  }));
});

test('default host is self-hosted and legacy global alias is the same constructor',async()=>{
  const env=sandbox();
  try{
    assert.equal(env.w.CmesMonitor,env.w.Aegis);
    assert.equal(env.w.CmesMonitor.sdkName,'cmes-monitor-sdk');
    const sdk=new env.w.CmesMonitor({id:'self-hosted',uin:'u',onError:false,device:false,pagePerformance:false,webVitals:false});
    assert.equal(sdk.config.hostUrl,'/monitor');assert.equal(sdk.config.url,'/monitor/collect');
    await env.clock.tickAsync(800);
    assert.ok(env.requests.length);
    assert.ok(env.requests.every(r=>new URL(r.url).origin==='https://app.example.test'));
  }finally{env.close();}
});

test('UMD CommonJS and AMD exports preserve direct construction',()=>{
  for(const mode of ['commonjs','amd']){
    const env=sandbox();
    try{
      if(mode==='commonjs'){env.w.exports={};env.w.module={exports:env.w.exports};}
      else{env.w.define=factory=>{env.w.amdExport=factory()};env.w.define.amd=true;}
      env.w.eval(source.current);
      const SDK=mode==='commonjs'?env.w.module.exports:env.w.amdExport;
      assert.equal(typeof SDK,'function');assert.equal(SDK.sdkName,'cmes-monitor-sdk');
    }finally{env.close();}
  }
});

test('persistent retry repeats failed logs and cleans the bounded queue on exhaustion',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({reportRetry:{maxRetryCount:1,retryInterval:20,maxStorageCount:20}});
    await env.clock.tickAsync(700);sdk.report('retry-me');await env.clock.tickAsync(200);
    return JSON.parse(env.w.localStorage.getItem('aegis-web-retry-report-requests')??'[]');
  },{status:url=>url.pathname.endsWith('/collect')?503:200}));
  assert.equal(result.requests.filter(r=>r.url.endsWith('/collect')).length,2);
  assert.deepEqual(result.value,[]);
});

test('Bridge callback preserves duration and payload',async()=>{
  const result=same(await compareScenario(async env=>{
    env.run(`var bridgeResult;var sdk=new Aegis({id:'bridge',uin:'u',hostUrl:'https://collector.example.test/monitor',delay:20,gzip:false,onError:false,device:false,pagePerformance:false,webVitals:false,onClose:false,reportBridgeSpeed:true,enableWhitelist:true,enableRateConfig:true,
      h5Bridge:{call:function(service,method,params,callback){setTimeout(function(){callback({retcode:0,value:'done'})},8)}},h5BridgeFunc:['call']});`);
    await env.clock.tickAsync(700);
    env.run(`sdk.config.h5Bridge.call('device','read',{},function(data){bridgeResult=data});`);
    await env.clock.tickAsync(100);return env.w.bridgeResult;
  }));
  const speed=result.requests.find(r=>r.url.endsWith('/speed'));
  assert.equal(JSON.parse(speed.body.payload).duration.bridge[0].duration,8);
});

test('multiple instances keep distinct ids and extension fields',async()=>{
  const result=same(await compareScenario(async env=>{
    const first=env.create({id:'first',ext1:'one'});
    const second=env.create({id:'second',ext1:'two'});
    await env.clock.tickAsync(700);
    first.report('first-log');second.reportEvent('second-event');await env.clock.tickAsync(100);
    first.destroy();second.report('still-active');await env.clock.tickAsync(100);
    return env.w.Aegis.instances.map(sdk=>sdk.config.id);
  }));
  assert.deepEqual(result.value,['second']);
  assert.ok(result.requests.some(r=>r.query.id==='first'&&r.body?.msg?.includes('first-log')));
  assert.ok(result.requests.some(r=>r.query.id==='second'&&r.body?.msg?.includes('still-active')));
});

test('Error and circular-object serialization preserve original text and columns',async()=>{
  const result=same(await compareScenario(async env=>{
    env.w.sdk=env.create();await env.clock.tickAsync(700);
    env.run(`var object={name:'circular'};object.self=object;var error=new Error('example');error.stack='Error: example\\n at example.js:1:1';sdk.report(object);sdk.error(error);sdk.infoAll('extra',undefined,42);`);
    await env.clock.tickAsync(100);
  }));
  assert.ok(result.requests.some(r=>r.body?.msg?.some(m=>m.includes('[Circular self]'))));
});

test('zero global sampling prevents all automatic and manual requests',async()=>{
  const result=same(await compareScenario(async env=>{
    const sdk=env.create({random:0});sdk.error('drop');sdk.reportEvent('drop');await env.clock.tickAsync(1000);
  }));
  assert.deepEqual(result.requests,[]);
});
