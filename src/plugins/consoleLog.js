/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createConsoleLogOptions(shared) {
  return {
    name: "consoleLog",
    onNewAegis: function (e) {
      this.startListen(e);
    },
    startListen: function (e) {
      var o;
      o = e;
      ["log", "error", "warn", "info", "debug", "trace"].forEach(function (r) {
        var i = shared.originalConsole[r];
        console[r] = function () {
          for (var e, t = [], n = 0; n < arguments.length; n++)
            t[n] = arguments[n];
          try {
            i.apply(console, t);
            (!o.isWhiteList && ["log", "info", "debug", "trace"].includes(r)) ||
              ((e = t
                .map(function (e) {
                  if ("object" == typeof e && null !== e)
                    try {
                      return JSON.stringify(e);
                    } catch (e) {}
                  return String(e);
                })
                .join(" ")),
              o.normalLogPipeline({
                msg: "method: console." + r + "\nmessage: " + e,
                level: shared.LogLevel.CONSOLE_LOG,
                errorMsg: "",
                originFrom: o.getOriginFrom(),
              }));
          } catch (e) {
            shared.originalConsole.error("Console hook error:", e);
          }
        };
      });
    },
    destroy: function () {
      Object.keys(shared.originalConsole).forEach(function (e) {
        console[e] = shared.originalConsole[e];
      });
    },
  };
}
