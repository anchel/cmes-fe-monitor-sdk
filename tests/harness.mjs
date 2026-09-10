import fs from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
import FakeTimers from '@sinonjs/fake-timers';

export const source = {
  reference: await fs.readFile(new URL('../reference/aegis-1.43.60.min.js',import.meta.url),'utf8'),
  current: await fs.readFile(new URL('../dist/cmes-monitor.js',import.meta.url),'utf8'),
  minified: await fs.readFile(new URL('../dist/cmes-monitor.min.js',import.meta.url),'utf8'),
};
export function sandbox(kind = 'current', backend = {}) {
  const diagnostics=[];
  const virtualConsole = new VirtualConsole();
  for (const event of ['warn','error','jsdomError']) virtualConsole.on(event,(...args)=>diagnostics.push([event,...args.map(String)]));
  const dom = new JSDOM('<!doctype html><html><body><button id="buy">Buy</button><main id="app">Application</main></body></html>',{
    url:'https://app.example.test/home?lang=zh#start',referrer:'https://app.example.test/login',
    runScripts:'outside-only',pretendToBeVisual:true,virtualConsole,
  });
  const w=dom.window;
  const clock=FakeTimers.withGlobal(w).install({now:1800000000000,toFake:['Date','setTimeout','clearTimeout','setInterval','clearInterval','performance','requestAnimationFrame','cancelAnimationFrame']});
  let seed=7;
  w.Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const requests=[];
  const observers=[];
  w.performance.getEntriesByType=()=>[];
  w.performance.getEntriesByName=()=>[];
  w.PerformanceObserver=class {
    static supportedEntryTypes=['resource','navigation','paint','longtask','first-input','largest-contentful-paint','layout-shift','event','long-animation-frame'];
    constructor(callback){this.callback=callback;observers.push(this);}
    observe(options){this.options=options;this.active=true;}
    disconnect(){this.active=false;}
    takeRecords(){return [];}
  };
  const respond=(url)=>{
    if(url.pathname.endsWith('/rateConfig')) return backend.rate ?? {retcode:0,configs:[],ttl:3600};
    if(url.pathname.endsWith('/collect/whitelist')) return backend.whitelist ?? {retcode:0,result:{is_in_white_list:true,rate:1,use_gzip:0}};
    return backend.body ?? {retcode:0};
  };
  class RecordingXHR extends w.EventTarget {
    constructor(){super();this.headers={};this.readyState=0;this.status=0;this.responseText='';this.response='';this.responseType='';}
    open(method,url){this.method=method;this.url=new URL(url,w.location.href).href;this.readyState=1;}
    setRequestHeader(name,value){this.headers[name.toLowerCase()]=String(value);}
    getAllResponseHeaders(){return 'content-type: application/json\r\n';}
    getResponseHeader(name){return name.toLowerCase()==='content-type'?'application/json':null;}
    send(data){
      const url=new URL(this.url);
      requests.push({transport:'xhr',method:this.method.toUpperCase(),url:this.url,headers:{...this.headers},body:typeof data==='string'?data:data==null?null:String(data)});
      w.setTimeout(()=>{
        this.status=backend.status?.(url)??200;this.readyState=4;
        this.responseURL=this.url;
        this.responseText=JSON.stringify(respond(url));this.response=this.responseText;
        this.dispatchEvent(new w.Event('readystatechange'));this.onreadystatechange?.();
        this.dispatchEvent(new w.Event('load'));this.onload?.();
        this.dispatchEvent(new w.Event('loadend'));this.onloadend?.();
      },backend.latency??0);
    }
    abort(){this.dispatchEvent(new w.Event('abort'));}
  }
  w.XMLHttpRequest=RecordingXHR;
  w.Headers=globalThis.Headers;w.Request=globalThis.Request;w.Response=globalThis.Response;
  w.fetch=function(url,options={}) {
    if(this!==undefined&&this!==w)throw new TypeError('Illegal fetch receiver');
    return w.Promise.resolve(new w.Response(JSON.stringify({retcode:0,result:'ok'}),{status:200,headers:{'content-type':'application/json'}}));
  };
  w.navigator.sendBeacon=(url,data)=>{
    requests.push({transport:'beacon',method:'POST',url:new URL(url,w.location.href).href,headers:{},body:typeof data==='string'?data:data==null?null:String(data)});
    return true;
  };
  w.eval(source[kind]);
  // The compatibility suite measures parity with upstream Aegis, whose whitelist and
  // rateConfig stages are always on. CmesMonitor defaults them off, so the scenarios opt in
  // explicitly; tests/control-options.test.mjs covers the disabled path.
  const defaults={id:'project-test',uin:'user-test',aid:'aid-test',hostUrl:'https://collector.example.test/monitor',delay:20,gzip:false,onError:false,device:false,pagePerformance:false,webVitals:false,onClose:false,enableWhitelist:true,enableRateConfig:true};
  return {
    w,clock,requests,diagnostics,observers,
    create(config={}) {return new w.Aegis(w.JSON.parse(JSON.stringify({...defaults,...config})));},
    run(code){return w.eval(code);},
    emitPerformance(type,entries){for(const o of observers)if(o.active&&o.options?.type===type)o.callback({getEntries:()=>entries,getEntriesByName:(name)=>entries.filter(e=>e.name===name)});},
    close(){clock.uninstall();dom.window.close();},
  };
}
export function normalizedRequests(requests) {
  return requests.map(r=>{
    const url=new URL(r.url);
    let body=r.body;
    try {body=body==null?null:JSON.parse(body);} catch { /* Upstream /memory sends [object Object]; the query is authoritative. */ }
    return {...r,url:url.origin+url.pathname,query:Object.fromEntries([...url.searchParams].sort(([a],[b])=>a.localeCompare(b))),body};
  });
}
export async function compareScenario(action, backend={}) {
  const results=[];
  for(const kind of ['reference','current','minified']) {
    const env=sandbox(kind,backend);
    try {const value=await action(env);results.push({kind,requests:normalizedRequests(env.requests),value:value===undefined?null:JSON.parse(JSON.stringify(value)),diagnostics:env.diagnostics});}
    finally {env.close();}
  }
  return results;
}
