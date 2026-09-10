import '../src/index.js';
const monitor = new CmesMonitor({id:'script-tag'});
new Aegis({id:'legacy-script-tag'});
window.CmesMonitor.sdkVersion;
monitor.report('global constructor');
