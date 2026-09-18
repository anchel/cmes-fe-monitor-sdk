/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createReportBridgeSpeedOptions(shared) {
  return {
    name: "reportBridgeSpeed",
    override: !1,
    onNewAegis: function (e) {
      this.override || ((this.override = !0), this.overrideBridge(e));
    },
    getFromParam: function (e) {
      return e.getCurrentPageUrl();
    },
    publishSpeed: function (t, n) {
      this.$walk(function (e) {
        e === n && e.speedLogPipeline(t);
      });
    },
    overrideBridge: function (c) {
      var u = this;
      var d = c.config;
      d.reportBridgeSpeed &&
        d.h5Bridge &&
        d.h5BridgeFunc.length &&
        d.h5BridgeFunc.forEach(function (e) {
          var l = d.h5Bridge[e];
          shared.bridgeState[e] = l;
          d.h5Bridge[e] = function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            var r = e[0];
            var i = e[1];
            var n = e[2];
            var o = e[3];
            var a = Date.now();
            var s = u.getFromParam(c);
            l(r, i, n, function (e) {
              var t = (0, shared.parseReturnCode)(e, d.api);
              var n = t.code;
              var t = t.isErr;
              var n = {
                url: r + "-" + i,
                name: r + "-" + i,
                duration: Date.now() - a,
                type: "bridge",
                ret: n,
                from: s,
              };
              "boolean" === typeof t && (n.isErr = +t);
              u.publishSpeed(n, c);
              o(e);
            });
          };
        });
    },
    unHackBridge: function (t) {
      Object.keys(shared.bridgeState).forEach(function (e) {
        shared.bridgeState[e] && (t.config.h5Bridge[e] = shared.bridgeState[e]);
      });
      shared.bridgeState = {};
    },
    destroy: function (e) {
      this.option.publishSpeed = function () {};
      this.option.unHackBridge(e);
      this.option.override = !1;
    },
  };
}
