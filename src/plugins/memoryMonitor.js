/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createMemoryMonitorOptions(shared) {
  return {
    name: "memoryMonitor",
    memoryReportTimer: null,
    oomCheckTimer: null,
    lastOOMTime: 0,
    memoryRecords: [],
    onNewAegis: function (e) {
      var t;
      var n;
      var r = this.$getConfig(e);
      r &&
        r.enabled &&
        (0, shared.hasMemoryAPI)() &&
        ((t = r.sampleRate || 1), Math.random() < t) &&
        (!(t = r.monitorPages) ||
          0 === t.length ||
          ((n = "undefined" != typeof window ? window.location.href : ""),
          t.some(function (e) {
            return "string" == typeof e
              ? n.includes(e)
              : e instanceof RegExp && e.test(n);
          }))) &&
        this.initMemoryMonitor(e, r);
    },
    initMemoryMonitor: function (e, t) {
      var n;
      var r = this;
      var i = !1 !== t.enableMemoryReport;
      var o = !1 !== t.enableOOMReport;
      var a = t.memoryReportInterval || 6e4;
      var s = t.oomCheckInterval || 1e4;
      var l =
        t.oomThreshold ||
        (() => {
          try {
            var e;
            var t;
            return (0, shared.hasMemoryAPI)()
              ? 0 < (e = window.performance.memory.jsHeapSizeLimit || 0)
                ? ((t = (0, shared.bytesToMegabytes)(e)), Math.round(0.9 * t))
                : 100
              : 100;
          } catch (e) {
            return 100;
          }
        })();
      try {
        i &&
          (this.memoryReportTimer = setInterval(function () {
            r.reportCurrentMemory(e, "MEMORY_REPORT");
          }, a));
        o &&
          (this.oomCheckTimer = setInterval(function () {
            r.checkOOMCondition(e, l);
          }, s));
        "undefined" != typeof window &&
          (window.addEventListener(
            "beforeunload",
            (n = function () {
              r.cleanup();
            }),
          ),
          window.addEventListener("pagehide", n));
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("Memory monitor initialization failed:", e);
        this.cleanup();
      }
    },
    reportCurrentMemory: function (e, t) {
      try {
        var n;
        var r = (0, shared.readMemory)();
        r &&
          ((n = {
            type: t,
            memoryInfo: r,
            url: "undefined" != typeof window ? window.location.href : "",
            userAgent:
              "undefined" != typeof navigator ? navigator.userAgent : "",
            timestamp: Date.now(),
          }),
          this.memoryRecords.push(n),
          50 < this.memoryRecords.length && this.memoryRecords.shift(),
          this.publishMemoryLog(n, e));
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("Memory report failed:", e);
      }
    },
    checkOOMCondition: function (e, t) {
      try {
        var n;
        var r;
        var i = (0, shared.readMemory)();
        i &&
          ((n = (0, shared.bytesToMegabytes)(i.usedJSHeapSize)),
          (r = Date.now()),
          t < n) &&
          3e5 < r - this.lastOOMTime &&
          ((this.lastOOMTime = r), this.reportCurrentMemory(e, "MEMORY_OOM"));
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("OOM check failed:", e);
      }
    },
    publishMemoryLog: function (e, t) {
      try {
        "MEMORY_REPORT" === e.type
          ? this.publishMemoryReport(e, t)
          : "MEMORY_OOM" === e.type && this.publishOOMLog(e, t);
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("Memory log publish failed:", e);
      }
    },
    publishMemoryReport: function (e, t) {
      try {
        var n = {
          memoryUsed: e.memoryInfo.usedJSHeapSize,
          memoryAllocated: e.memoryInfo.totalJSHeapSize,
          memoryUsage: e.memoryInfo.usageRatio,
        };
        this.$walk(function (i) {
          var e;
          if (i === t)
            try {
              null != (e = i.sendPipeline) &&
                e.call(
                  i,
                  [
                    function (n, e) {
                      var t =
                        i.config.memoryUrl || i.config.hostUrl + "/memory";
                      var r = new URLSearchParams();
                      Object.keys(n).forEach(function (e) {
                        var t = n[e];
                        null != t && "" !== t && r.append(e, String(t));
                      });
                      e({
                        url: t + "?" + r.toString(),
                        method: "post",
                        type: shared.SendType.MEMORY,
                        log: n,
                        success: function () {
                          "undefined" != typeof console &&
                            console.debug &&
                            console.debug(
                              "Memory report success:",
                              n.memory_used,
                              "bytes",
                            );
                        },
                        fail: function (e) {
                          "undefined" != typeof console &&
                            console.warn &&
                            console.warn("Memory report failed:", e);
                        },
                      });
                    },
                  ],
                  shared.SendType.MEMORY,
                )(n);
            } catch (i) {
              "undefined" != typeof console &&
                console.warn &&
                console.warn("Memory pipeline failed:", i);
            }
        });
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("Memory report publish failed:", e);
      }
    },
    publishOOMLog: function (e, n) {
      try {
        var t = e.memoryInfo;
        var r =
          "Memory OOM detected: Used " +
          (0, shared.bytesToMegabytes)(t.usedJSHeapSize) +
          "MB / Total " +
          (0, shared.bytesToMegabytes)(t.totalJSHeapSize) +
          "MB / Limit " +
          (0, shared.bytesToMegabytes)(t.jsHeapSizeLimit) +
          "MB (" +
          t.usageRatio +
          "%)";
        var i = {
          msg: r,
          level: shared.LogLevel.MEMORY_OOM,
          time: e.timestamp,
          originFrom: n.getOriginFrom(),
        };
        this.$walk(function (e) {
          var t;
          if (e === n)
            try {
              null != (t = e.normalLogPipeline) && t.call(e, i);
              "undefined" != typeof console &&
                console.warn &&
                console.warn("OOM detected and reported:", r);
            } catch (e) {
              "undefined" != typeof console &&
                console.warn &&
                console.warn("OOM pipeline failed:", e);
            }
        });
      } catch (e) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("OOM log publish failed:", e);
      }
    },
    getMemoryRecords: function () {
      return (0, shared.concatArrays)(this.memoryRecords);
    },
    getCurrentMemoryStatus: shared.readMemory,
    clearMemoryRecords: function () {
      this.memoryRecords.length = 0;
    },
    cleanup: function () {
      this.memoryReportTimer &&
        (clearInterval(this.memoryReportTimer),
        (this.memoryReportTimer = null));
      this.oomCheckTimer &&
        (clearInterval(this.oomCheckTimer), (this.oomCheckTimer = null));
    },
    destroy: function () {
      this.cleanup();
      this.clearMemoryRecords();
      this.lastOOMTime = 0;
    },
  };
}
