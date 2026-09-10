import Monitor = require('../src/index.cjs');
const monitor = new Monitor({id:'commonjs',hostUrl:'/monitor'});
monitor.report('direct constructor');
Monitor.logType.ERROR;
// @ts-expect-error numeric duration required
monitor.reportTime('time','invalid');
