import test from 'node:test';
import assert from 'node:assert/strict';
import {sandbox} from './harness.mjs';

// harness.mjs turns both controls on for the parity suite, so every scenario here states
// them explicitly; `create` below is the neutral both-off starting point.
const create=(env,config={})=>env.create({enableWhitelist:false,enableRateConfig:false,...config});

const controlUrls=requests=>requests
  .map(r=>new URL(r.url).pathname)
  .filter(p=>p.endsWith('/rateConfig')||p.endsWith('/collect/whitelist'));

test('both controls default to off and issue no control requests',async()=>{
  const env=sandbox();
  try{
    // undefined keys are dropped by the harness JSON round trip, so the SDK defaults apply
    const sdk=env.create({enableWhitelist:undefined,enableRateConfig:undefined});
    assert.equal(sdk.config.enableWhitelist,false);
    assert.equal(sdk.config.enableRateConfig,false);
    await env.clock.tickAsync(700);
    assert.deepEqual(controlUrls(env.requests),[]);
  }finally{env.close();}
});

test('with controls off, info() is not withheld and logs are not queued for rate config',async()=>{
  const env=sandbox();
  try{
    const sdk=create(env);
    assert.equal(sdk.rateLimitReady,true,'no rate config means no gate');
    sdk.info('plain info');sdk.report('report');
    await env.clock.tickAsync(700);
    assert.deepEqual(controlUrls(env.requests),[]);
    const collected=env.requests.filter(r=>new URL(r.url).pathname.endsWith('/collect'));
    assert.ok(collected.length>0,'logs reach /collect without a whitelist response');
    assert.ok(collected.some(r=>r.body.includes('plain info')));
    assert.equal(sdk.rateLimitPool.length,0);
  }finally{env.close();}
});

test('each control can be enabled on its own',async()=>{
  for(const [option,path] of [['enableWhitelist','/collect/whitelist'],['enableRateConfig','/rateConfig']]){
    const env=sandbox();
    try{
      create(env,{[option]:true});
      await env.clock.tickAsync(700);
      const seen=controlUrls(env.requests);
      assert.ok(seen.every(p=>p.endsWith(path)),`${option} triggered ${seen}`);
      assert.ok(seen.length>0,`${option} issued no request`);
    }finally{env.close();}
  }
});

test('setConfig turns the controls on and off at runtime',async()=>{
  const env=sandbox();
  try{
    const sdk=create(env);
    await env.clock.tickAsync(700);
    assert.deepEqual(controlUrls(env.requests),[]);

    sdk.setConfig({enableWhitelist:true,enableRateConfig:true});
    await env.clock.tickAsync(700);
    const afterEnable=controlUrls(env.requests);
    assert.ok(afterEnable.some(p=>p.endsWith('/collect/whitelist')));
    assert.ok(afterEnable.some(p=>p.endsWith('/rateConfig')));

    const count=afterEnable.length;
    sdk.setConfig({enableWhitelist:false,enableRateConfig:false});
    await env.clock.tickAsync(5000);
    assert.equal(controlUrls(env.requests).length,count,'disabling stops scheduled refreshes');
    assert.equal(sdk.rateLimitReady,true);
  }finally{env.close();}
});

test('disabling the whitelist mid-flight flushes info logs buffered while it was pending',async()=>{
  const env=sandbox('current',{latency:10000});
  try{
    const sdk=create(env,{enableWhitelist:true,random:1});
    await env.clock.tickAsync(600);
    sdk.info('buffered while awaiting whitelist');
    await env.clock.tickAsync(100);
    const collected=()=>env.requests.filter(r=>new URL(r.url).pathname.endsWith('/collect'));
    assert.equal(collected().length,0,'info is withheld until the whitelist answers');

    sdk.setConfig({enableWhitelist:false});
    await env.clock.tickAsync(200);
    assert.ok(collected().some(r=>r.body.includes('buffered while awaiting whitelist')));
  }finally{env.close();}
});

test('the whitelist rate applies while enabled and the local rate returns when disabled',async()=>{
  const env=sandbox('current',{whitelist:{retcode:0,result:{is_in_white_list:true,rate:0.42,use_gzip:0}}});
  try{
    const sdk=create(env,{enableWhitelist:true,random:1});
    await env.clock.tickAsync(700);
    assert.equal(sdk.config.random,0.42,'whitelist rate overrides the local one');

    sdk.setConfig({enableWhitelist:false});
    await env.clock.tickAsync(100);
    assert.equal(sdk.config.random,1,'the local rate is restored, not left at the whitelist rate');

    sdk.setConfig({random:0.75});
    sdk.setConfig({enableWhitelist:true});
    await env.clock.tickAsync(700);
    assert.equal(sdk.config.random,0.42);
    sdk.setConfig({enableWhitelist:false});
    await env.clock.tickAsync(100);
    assert.equal(sdk.config.random,0.75,'a rate set while enabled survives the round trip');
  }finally{env.close();}
});

test('a late control response is ignored once the option is turned off',async()=>{
  const env=sandbox('current',{latency:500});
  try{
    const sdk=create(env,{enableWhitelist:true,enableRateConfig:true,random:0.25});
    await env.clock.tickAsync(100);
    sdk.setConfig({enableWhitelist:false,enableRateConfig:false});
    await env.clock.tickAsync(2000);
    assert.equal(sdk.isWhiteList,true,'whitelist filtering stays off');
    assert.equal(sdk.config.random,0.25);
    assert.equal(sdk.rateLimitConfigs,null);
    assert.equal(sdk.rateLimitSampled,false);
  }finally{env.close();}
});

test('destroy stops control refreshes',async()=>{
  const env=sandbox();
  try{
    const sdk=create(env,{enableWhitelist:true,enableRateConfig:true});
    await env.clock.tickAsync(700);
    const count=controlUrls(env.requests).length;
    assert.ok(count>0);
    sdk.destroy();
    await env.clock.tickAsync(10000);
    assert.equal(controlUrls(env.requests).length,count);
  }finally{env.close();}
});
