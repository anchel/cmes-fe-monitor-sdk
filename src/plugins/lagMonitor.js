/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createLagMonitorOptions(shared) {
  return {
    name: "lagMonitor",
    observer: null,
    lagRecords: [],
    onNewAegis: function (e) {
      var t;
      var n = this.$getConfig(e);
      n &&
        n.enabled &&
        "undefined" != typeof PerformanceObserver &&
        PerformanceObserver.supportedEntryTypes &&
        PerformanceObserver.supportedEntryTypes.includes(
          "long-animation-frame",
        ) &&
        ((t = n.sampleRate || 1), Math.random() < t) &&
        this.initLagMonitor(e, n);
    },
    initLagMonitor: function (n, e) {
      var r = this;
      var i = e.threshold || 2e3;
      var o = e.noResponseThreshold || 5e3;
      try {
        this.observer = new PerformanceObserver(function (e) {
          e.getEntries().forEach(function (e) {
            var t;
            e.duration > i &&
              ((t = e.scripts && 0 < e.scripts.length ? e.scripts[0] : null),
              (e = {
                name: e.name,
                timestamp: Date.now(),
                entryType: e.entryType,
                startTime: e.startTime,
                duration: e.duration,
                invoker: null == t ? void 0 : t.invoker,
                sourceURL: null == t ? void 0 : t.sourceURL,
              }),
              r.lagRecords.push(e),
              100 < r.lagRecords.length && r.lagRecords.shift(),
              r.publishLagLog(e, n, o <= e.duration));
          });
        });
        this.observer.observe({
          type: "long-animation-frame",
          buffered: !1,
        });
        "undefined" != typeof window && (window.__longTasks = this.lagRecords);
      } catch (n) {
        if (
          ("undefined" != typeof console &&
            console.warn &&
            console.warn("Lag monitor initialization failed:", n),
          this.observer)
        ) {
          try {
            this.observer.disconnect();
          } catch (n) {}
          this.observer = null;
        }
      }
    },
    publishLagLog: function (n, r, i) {
      void 0 === i && (i = !1);
      try {
        this.$walk(function (e) {
          if (e === r) {
            var t = {
              msg: JSON.stringify({
                type: i ? "NORESPONSE_DETECTED" : "LAG_DETECTED",
                duration: Math.round(100 * n.duration) / 100,
                startTime: Math.round(100 * n.startTime) / 100,
                entryType: n.entryType,
                sourceURL: n.sourceURL || "unknown",
                invoker: n.invoker || "unknown",
                timestamp: n.timestamp,
              }),
              level: i
                ? shared.LogLevel.NORESPONSE_LOG
                : shared.LogLevel.LAG_MONITOR,
              time: n.timestamp,
              originFrom: e.getOriginFrom(),
            };
            try {
              e.normalLogPipeline(t);
            } catch (e) {
              "undefined" != typeof console &&
                console.warn &&
                console.warn("Lag log pipeline failed:", e);
            }
          }
        });
      } catch (n) {
        "undefined" != typeof console &&
          console.warn &&
          console.warn("Lag log publish failed:", n);
      }
    },
    getLagRecords: function () {
      return (0, shared.concatArrays)(this.lagRecords);
    },
    clearLagRecords: function () {
      this.lagRecords.length = 0;
      "undefined" != typeof window && (window.__longTasks = []);
    },
    destroy: function () {
      if (this.observer) {
        try {
          this.observer.disconnect();
        } catch (e) {
          "undefined" != typeof console &&
            console.warn &&
            console.warn("Observer disconnect failed:", e);
        }
        this.observer = null;
      }
      this.clearLagRecords();
    },
  };
}
