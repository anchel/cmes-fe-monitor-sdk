import fs from 'node:fs/promises';
const string={type:'string'};
const metric={type:'number'};
const ref=name=>({$ref:`#/components/schemas/${name}`});
const response=(description,schema)=>({description,content:{'application/json':{schema}}});
const beanFields={id:'项目标识',uin:'用户标识',aid:'匿名标识',version:'SDK wire 版本，默认 1.43.60',env:'环境',from:'页面 URL',originFrom:'实际页面 URL',sessionId:'会话',referer:'来源页面',sampled:'成功取得限流配置时为 1',platform:'平台',netType:'网络类型',netStatus:'网络状态',vp:'视口',sr:'屏幕'};
for(let i=1;i<=10;i++)beanFields[`ext${i}`]='扩展字段';
const bean=Object.entries(beanFields).map(([name,description])=>({name,in:'query',required:name==='id',schema:string,description}));
const accepted={200:response('接收成功',ref('Success'))};
const paths={
  '/rateConfig':{get:{summary:'分类采样配置（可选端点，需 enableRateConfig: true）',parameters:bean,responses:{200:response('sample_rate 单位 0…100；ttl 单位秒',ref('RateConfig'))}}},
  '/collect/whitelist':{get:{summary:'日志白名单、全局采样及 gzip 协商（可选端点，需 enableWhitelist: true）',parameters:bean,responses:{200:response('rate 单位 0…1；use_gzip 为 0/1',ref('Whitelist'))}}},
};
function bodyEndpoint(path,title,schema) {
  paths[path]={post:{summary:title,parameters:bean,description:'可能有 Content-Encoding:gzip。先解压。Beacon 的 Content-Type 可为 text/plain。',requestBody:{required:false,content:{'application/json':{schema:ref(schema)},'text/plain':{schema:{type:'string',description:'与 application/json 相同的 JSON 文本；先解压再解析'}}}},responses:accepted}};
}
bodyEndpoint('/collect','批量列式日志','LogColumns');
bodyEndpoint('/collect/events','自定义事件','NestedPayload');
bodyEndpoint('/speed','Fetch/XHR/资源/Bridge 测速','NestedPayload');
bodyEndpoint('/speed/custom','自定义耗时','NestedPayload');
paths['/collect'].get={summary:'SDK 自身诊断或自定义 GET 传输',parameters:[...bean,{name:'count',in:'query',schema:{type:'integer'}},{name:'msg[0]',in:'query',schema:string},{name:'level[0]',in:'query',schema:string}],responses:accepted};
function queryEndpoint(path,title,fields) {
  const parameters=[...bean,...fields.map(name=>({name,in:'query',schema:{type:'string'},description:'指标值通过查询字符串传递'}))];
  const operation={summary:title,parameters,responses:accepted,description:'GET 或 Beacon POST，指标均在查询参数。body 可为空。'};
  paths[path]={get:operation,post:{...operation}};
}
queryEndpoint('/collect/pv','PV',[]);
queryEndpoint('/speed/performance','页面性能',['dnsLookup','tcp','ssl','ttfb','contentDownload','domParse','resourceDownload','firstScreenTiming','engineInit','bundleLoad']);
queryEndpoint('/speed/webvitals','Web Vitals',['FCP','LCP','FID','CLS','INP','TTI']);
queryEndpoint('/memory','内存指标',['memoryUsed','memoryAllocated','memoryUsage']);
paths['/memory'].post.description='指标来自查询参数，原 SDK body 可能为 [object Object]，不得要求其为合法 JSON。';
const spec={openapi:'3.1.0',info:{title:'cmes-monitor-sdk compatible receiver',version:'1.0.0',description:'Derived from supplied Aegis 1.43.60. See backend-protocol.md for transport quirks and inactive cross-platform paths.'},servers:[{url:'/monitor',description:'替换为你的 hostUrl'}],paths,components:{schemas:{
  Success:{type:'object',properties:{retcode:{const:0}},required:['retcode']},
  RateConfig:{type:'object',required:['retcode','configs'],properties:{retcode:{const:0},ttl:{type:'number',description:'秒'},configs:{type:'array',items:{type:'object',required:['limit_type','sample_rate'],properties:{limit_type:{type:'string',enum:['log','jsError','whiteScreen','assetsException','speed','performance','webvitals','pv','event','custom','miniProgramData']},sample_rate:{type:'number',minimum:0,maximum:100}}}}}},
  Whitelist:{type:'object',required:['retcode','result'],properties:{retcode:{const:0},result:{type:'object',properties:{is_in_white_list:{type:'boolean'},rate:{type:'number',minimum:0,maximum:1},use_gzip:{oneOf:[{type:'integer',enum:[0,1]},{type:'string',enum:['0','1']}]}}}}},
  LogColumns:{type:'object',required:['count','msg','level'],properties:{count:{type:'integer',minimum:0},msg:{type:'array',items:{}},level:{type:'array',items:string}},additionalProperties:{type:'array',items:{}},description:'按列存储，按下标还原 count 条记录，列包括 ext1…ext10、errorMsg、time、trace、originFrom 等。'},
  NestedPayload:{type:'object',required:['payload'],properties:{payload:{type:'string',description:'字符串内还是 JSON：events 为 Event[]；speed 为 SpeedPayload；custom 为 {custom: CustomTime[]}'}}},
  Event:{type:'object',required:['name'],properties:{name:string,originFrom:string,...Object.fromEntries(Array.from({length:10},(_,i)=>[`ext${i+1}`,string]))},additionalProperties:true},
  CustomTime:{type:'object',required:['name','duration'],properties:{name:string,duration:{type:'number',minimum:0,maximum:2147483646}},additionalProperties:true},
  SpeedLog:{type:'object',required:['url','type','duration'],properties:{url:string,type:{enum:['fetch','static','bridge']},duration:metric,status:metric,method:string,ret:{type:['string','number']},isErr:metric,isHttps:{type:'boolean'},domainLookup:metric,connectTime:metric,transferSize:metric},additionalProperties:true},
  SpeedPayload:{type:'object',required:['duration'],properties:{duration:{type:'object',properties:Object.fromEntries(['fetch','static','bridge'].map(name=>[name,{type:'array',items:ref('SpeedLog')}]))}},additionalProperties:true},
}}};
await fs.writeFile('docs/openapi.json',JSON.stringify(spec,null,2)+'\n');
console.log(`OpenAPI: ${Object.keys(paths).length} active endpoints`);
