import {gunzipSync} from 'node:zlib';

/** Decode actual upstream wire formats. Content-Type is not reliable on sendBeacon. */
export function decodeReport({url,headers={},body=Buffer.alloc(0)}) {
  const parsedUrl=new URL(url,'http://localhost');
  const encoding=String(headers['content-encoding']||'identity').toLowerCase();
  if(encoding==='gzip') body=gunzipSync(body,{maxOutputLength:16*1024*1024});
  else if(encoding!=='identity') throw new Error(`Unsupported content encoding: ${encoding}`);
  const text=body.toString('utf8');
  let outer=null;
  if(text&&text!=='[object Object]') outer=JSON.parse(text);
  let payload=outer?.payload;
  if(typeof payload==='string') payload=JSON.parse(payload);
  const query=Object.fromEntries(parsedUrl.searchParams);
  let records=[];
  if(/\/collect$/.test(parsedUrl.pathname)&&outer&&Number.isInteger(outer.count)) {
    if(outer.count<0||outer.count>10000)throw new Error('Invalid log count');
    records=Array.from({length:outer.count},(_,index)=>Object.fromEntries(Object.entries(outer)
      .filter(([key,column])=>key!=='count'&&Array.isArray(column))
      .map(([key,column])=>[key,column[index]??''])));
  } else if(/\/collect\/events$/.test(parsedUrl.pathname)) {
    records=Array.isArray(payload)?payload:[];
  } else if(/\/speed\/custom$/.test(parsedUrl.pathname)) {
    records=payload?.custom??[];
  } else if(/\/speed$/.test(parsedUrl.pathname)) {
    records=Object.entries(payload?.duration??{}).flatMap(([type,rows])=>rows.map(row=>({...row,type:row.type??type})));
  } else if(/\/(memory|speed\/performance|speed\/webvitals|collect\/pv)$/.test(parsedUrl.pathname)) {
    records=[query];
  } else if(/\/collect$/.test(parsedUrl.pathname)&&query.count) {
    // SDK-internal diagnostics use the legacy GET msg[0]/level[0] format.
    records=Array.from({length:Math.min(10000,Math.max(0,Number(query.count)||0))},(_,index)=>({msg:query[`msg[${index}]`],level:query[`level[${index}]`]}));
  }
  return {path:parsedUrl.pathname,query,encoding,rawBody:text,body:outer,payload:payload??null,records};
}
