/** Apply maintained CMES extensions after reconstructing the reference runtime. */
export function applyControlOptions(source) {
  function replaceOnce(before, after) {
    if (!source.includes(before) || source.indexOf(before) !== source.lastIndexOf(before))
      throw new Error('Control option patch context changed: ' + before.slice(0, 80));
    source = source.replace(before, after);
  }
  function replaceRegion(start, end, replacement) {
    const a = source.indexOf(start);
    const b = source.indexOf(end, a);
    if (a < 0 || b < 0) throw new Error('Control region context changed');
    source = source.slice(0, a) + replacement + source.slice(b);
  }
  replaceOnce('import { DEFAULT_HOST_URL } from "./config.js";', 'import { DEFAULT_HOST_URL } from "./config.js";\nimport { installRateConfig, createWhitelistStage, isControlRequestAllowed } from "./control-plane.js";');
  replaceRegion('    function t() {\n      i ||', '    var a;\n', '');
  replaceRegion('    a = this;\n    i = !1;\n    o = [3, 30, 300];', '    for (var f = 0; f < MonitorCore.installedPlugins.length;', '    installRateConfig(this, applyRateLimit);\n');
  replaceRegion('      ((o = l = s = !1),', '      function (e, t) {\n        try {\n          var n = e.filter', '      createWhitelistStage(this, { LogLevel, normalizeInfoAll, createLogSender }),\n');
  replaceOnce('      hostUrl: DEFAULT_HOST_URL,', '      hostUrl: DEFAULT_HOST_URL,\n      enableWhitelist: false,\n      enableRateConfig: false,');
  replaceOnce('  MonitorCore.prototype.setConfig = function (e) {\n', '  MonitorCore.prototype.setConfig = function (e) {\n    const patch = e;\n');
  replaceOnce('    e && this.lifeCycle.emit("onConfigChange", this.config);', '    this.lifeCycle.emit("_controlConfigUpdate", patch);\n    e && this.lifeCycle.emit("onConfigChange", this.config);');
  replaceOnce('  function applyRateLimit(e, t, n, r) {\n', '  function applyRateLimit(e, t, n, r) {\n    if (!e.config.enableRateConfig) return n(t);\n');
  replaceOnce('(!this.config.whiteListUrl ||', '(!this.config.enableWhitelist || !this.config.whiteListUrl ||');
  replaceOnce('return r.rateLimitReady\n', 'return !r.config.enableRateConfig || r.rateLimitReady\n');
  replaceOnce('              o.rateLimitSampled &&', '              o.config.enableRateConfig && o.rateLimitSampled &&');
  replaceOnce('  CmesMonitor.prototype.$request = function (s, e, t) {\n', '  CmesMonitor.prototype.$request = function (s, e, t) {\n    if (!isControlRequestAllowed(s)) return;\n');
  return source;
}
