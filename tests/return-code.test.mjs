import test from 'node:test';
import assert from 'node:assert/strict';
import {sandbox} from './harness.mjs';

for (const kind of ['current', 'minified']) {
  for (const mode of ['absent', 'invalid', 'legacy-keys', 'async-only', 'error', 'success', 'unspecified', 'throws']) {
    test(`${kind}: fetch/XHR return-code handling ${mode}`, async () => {
      const env = sandbox(kind, {body: {code: 123}});
      try {
        env.w.fetch = () => env.w.Promise.resolve(new env.w.Response('{"code":123}', {
          status: 200, headers: {'content-type': 'application/json'},
        }));
        const sdk = env.create({reportApiSpeed: true, enableWhitelist: false, enableRateConfig: false,
          api: {reportRequest: true}});
        let calls = 0;
        if (mode === 'invalid') sdk.config.api.retCodeHandler = true;
        if (mode === 'legacy-keys') sdk.config.api.ret = ['code'];
        if (mode === 'async-only') sdk.config.api.retCodeHandlerAsync = () => { throw new Error('must not execute'); };
        if (['error', 'success', 'unspecified', 'throws'].includes(mode)) {
          sdk.config.api.retCodeHandler = data => {
            calls++;
            if (mode === 'throws') throw new Error('handler failed');
            const code = JSON.parse(data).code;
            return mode === 'unspecified' ? {code} : {code, isErr: mode === 'error'};
          };
        }
        await env.clock.tickAsync(700);
        await env.run("fetch('https://api.example.test/orders')");
        env.run("var xhr=new XMLHttpRequest();xhr.open('GET','https://api.example.test/users');xhr.send();");
        await env.clock.tickAsync(200);
        const speeds = env.requests.filter(r => new URL(r.url).pathname.endsWith('/speed'))
          .flatMap(r => JSON.parse(JSON.parse(r.body).payload).duration.fetch);
        assert.equal(speeds.length, 2, 'both transports report timings');
        for (const speed of speeds) {
          if (['error', 'success'].includes(mode)) {
            assert.equal(speed.isErr, mode === 'error' ? 1 : 0);
          } else {
            assert.equal(Object.hasOwn(speed, 'isErr'), false, 'no implicit success/error flag');
          }
          assert.equal(speed.ret, ['error', 'success', 'unspecified'].includes(mode) ? 123 : 'unknown');
        }
        assert.equal(calls, ['error', 'success', 'unspecified', 'throws'].includes(mode) ? 2 : 0);
      } finally { env.close(); }
    });
  }
}

for (const configured of [false, true]) {
  test(`Bridge return-code handling configured=${configured}`, async () => {
    const env = sandbox();
    try {
      env.run(`var bridgeValue;var sdk=new Aegis({id:'bridge',hostUrl:'https://collector.example.test/monitor',delay:20,gzip:false,onError:false,device:false,pagePerformance:false,webVitals:false,onClose:false,reportBridgeSpeed:true,
        api:${configured ? "{retCodeHandler:function(data){return {code:data.code,isErr:true}}}" : '{}'},
        h5Bridge:{call:function(service,method,params,callback){callback({code:123})}},h5BridgeFunc:['call']});`);
      await env.clock.tickAsync(700);
      env.run("sdk.config.h5Bridge.call('device','read',{},function(data){bridgeValue=data});");
      await env.clock.tickAsync(200);
      const speeds = env.requests.filter(r => new URL(r.url).pathname.endsWith('/speed'))
        .flatMap(r => JSON.parse(JSON.parse(r.body).payload).duration.bridge);
      assert.equal(speeds.length, 1);
      assert.equal(speeds[0].ret, configured ? 123 : 'unknown');
      assert.equal(speeds[0].isErr, configured ? 1 : undefined);
      assert.equal(env.w.bridgeValue.code, 123, 'business callback is preserved');
    } finally { env.close(); }
  });
}
