import CmesMonitor, { Aegis, ENDPOINT_PATHS, type MonitorConfig, type Plugin } from '../src/index.js';
const config: MonitorConfig = {
  id: 'demo', hostUrl: '/monitor', reportApiSpeed: true,
  enableWhitelist: false, enableRateConfig: false,
  api: {injectTraceHeader:'traceparent', retCodeHandler: () => ({code:0,isErr:false})},
  beforeReport: log => log.level !== '2',
  onBeforeRequest: (request, sdk) => sdk.config.id ? request : false,
};
const monitor = new CmesMonitor(config);
new Aegis(config);
monitor.report('hello', {foo:1});
monitor.reportEvent({name:'buy',ext4:42});
monitor.reportTime('render',123);
monitor.reportTime({name:'render',duration:123});
monitor.timeEnd({name:'render',ext1:'home'});
monitor.reportPageView('/page');
monitor.setConfig({uin:'user'});
monitor.setConfig({enableWhitelist:true,enableRateConfig:true});
monitor.lifeCycle.on('beforeReport', (logs) => { logs.length; });
const plugin: Plugin = {aegisPlugin:true,name:'myPlugin',patch(sdk){sdk.report('patch')},unpatch(){}};
CmesMonitor.use(plugin);
CmesMonitor.unuse(plugin);
ENDPOINT_PATHS.memoryUrl.toUpperCase();
window.Aegis.version;
// @ts-expect-error duration must be numeric
monitor.reportTime('bad','100');
// @ts-expect-error id is required
new CmesMonitor({});
// @ts-expect-error control switches must be booleans
monitor.setConfig({enableWhitelist:'true'});
monitor.destroy();
