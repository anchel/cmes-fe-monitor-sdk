/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createReportAssetSpeedOptions(shared) {
  return {
    name: "reportAssetSpeed",
    collectCur: 0,
    collectEntryType: "resource",
    ASSETS_INITIATOR_TYPE: ["img", "css", "script", "link", "audio", "video"],
    getFromParam: function (e) {
      return e.getCurrentPageUrl();
    },
    onNewAegis: function (e) {
      var t = this;
      (0, shared.hasPerformanceTiming)() &&
        (setTimeout(function () {
          t.collectSuccessLog(e);
          t.collectFailLog(e);
        }, 5e3),
        (performance.onresourcetimingbufferfull = function () {
          "function" == typeof performance.clearResourceTimings &&
            ((t.collectCur = 0), performance.clearResourceTimings());
        }));
    },
    processLog: function (e, t) {
      var n = t.duration || 0;
      var r = t.transferSize || 0;
      var i = !1;
      var o = e.config;
      if (
        null != (s = null == o ? void 0 : o.api) &&
        s.isSlowAsset &&
        "function" ==
          typeof (null == (s = null == o ? void 0 : o.api)
            ? void 0
            : s.isSlowAsset)
      )
        try {
          i =
            null == (a = null == o ? void 0 : o.api)
              ? void 0
              : a.isSlowAsset(t);
        } catch (e) {
          return void console.warn(
            "[Aegis] isSlowAsset function happen error:",
            e,
            ", this data will not be reported.",
          );
        }
      else
        i =
          null != (s = null == o ? void 0 : o.api) &&
          s.assetSlowThreshold &&
          "number" ==
            typeof (null == (a = null == o ? void 0 : o.api)
              ? void 0
              : a.assetSlowThreshold)
            ? n >
              (null == (s = null == o ? void 0 : o.api)
                ? void 0
                : s.assetSlowThreshold)
            : 1e3 < n;
      var a = [
        "ASSET_REQUEST: " + t.url,
        "status: " + t.status,
        "duration: " + n + "ms",
        "type: " + t.type,
        "domainLookup: " + t.domainLookup + "ms",
        "connectTime: " + t.connectTime + "ms",
        "transferSize: " + (0 < r ? r + "bytes" : "unknown"),
      ]
        .filter(Boolean)
        .join("\n\n");
      var o = e.isWhiteList && e.config.assetLog;
      var s = e.config.slowAssetLog && i;
      var t = {
        level: i ? e.LogType.SLOW_ASSET_REQUEST : e.LogType.ASSERT_REQUEST,
        msg: a,
        ext1: n.toString() || "",
        errorMsg: "",
        originFrom: e.getOriginFrom(),
      };
      (o || s) && e.normalLogPipeline(t);
    },
    publish: function (t, n) {
      var r = this;
      this.$walk(function (e) {
        e === n &&
          (e.speedLogPipeline(t),
          Array.isArray(t) ? t.forEach(r.processLog) : r.processLog(n, t));
      });
    },
    publishMany: function (e, t) {
      for (
        var n = t.config, r = this.getFromParam(t), i = 0, o = e.length;
        i < o;
        i++
      ) {
        var a = e[i];
        -1 === this.ASSETS_INITIATOR_TYPE.indexOf(a.initiatorType) ||
          (0, shared.isIgnoredUrl)(a.name, n.hostUrl) ||
          this.publish(this.generateLog(a, n, r), t);
      }
    },
    collectSuccessLog: function (n) {
      var e;
      var t;
      var r = this;
      "function" == typeof window.PerformanceObserver
        ? (this.publishMany(
            performance.getEntriesByType(this.collectEntryType),
            n,
          ),
          (e = new window.PerformanceObserver(function (e) {
            r.publishMany(e.getEntries(), n);
          })).observe({
            entryTypes: [this.collectEntryType],
          }),
          n.lifeCycle.on("destroy", function () {
            0 === shared.assetPluginAlias.countInstance() && e.disconnect();
          }))
        : ((t = setInterval(function () {
            var e = performance.getEntriesByType(r.collectEntryType);
            var t = e.slice(r.collectCur);
            r.collectCur = e.length;
            r.publishMany(t, n);
          }, 3e3)),
          n.lifeCycle.on("destroy", function () {
            0 === shared.assetPluginAlias.countInstance() && clearInterval(t);
          }));
    },
    collectFailLog: function (o) {
      function e(e) {
        var t;
        var n;
        var r;
        var i;
        e &&
          ((e = e.target || e.srcElement),
          !(t =
            (null == e ? void 0 : e.src) || (null == e ? void 0 : e.href)) ||
            "string" != typeof t ||
            -1 < window.location.href.indexOf(t) ||
            ((e =
              "function" ==
              typeof (null == (e = s.api) ? void 0 : e.resourceTypeHandler)
                ? null == (e = s.api)
                  ? void 0
                  : e.resourceTypeHandler(t)
                : ""),
            (n = performance
              .getEntriesByType(a.collectEntryType)
              .find(function (e) {
                return e.name === t;
              })),
            (0, shared.isIgnoredUrl)(t, s.hostUrl)) ||
            ((r = a.getFromParam(o)),
            (i = Number(null == (i = n) ? void 0 : i.responseStatus)),
            (i = Number.isFinite(i) && 0 < i ? i : 400),
            (i = {
              url: (0, shared.sanitizeUrl)(t),
              status: i,
              duration: Number(
                ((null == n ? void 0 : n.duration) || 0).toFixed(2),
              ),
              method: "get",
              type: e || "static",
              isHttps: (0, shared.isHttps)(t),
              urlQuery: (0, shared.splitUrlQuery)(t, !0),
              nextHopProtocol: "",
              domainLookup: 0,
              connectTime: 0,
              from: r,
            }),
            a.publish(i, o)));
      }
      var a = this;
      var s = o.config;
      window.document.addEventListener("error", e, !0);
      o.lifeCycle.on("destroy", function () {
        0 === shared.assetPluginAlias.countInstance() &&
          window.document.removeEventListener("error", e, !0);
      });
    },
    generateLog: function (e, t, n) {
      var t =
        "function" ==
        typeof (null == (r = t.api) ? void 0 : r.resourceTypeHandler)
          ? null == (r = t.api)
            ? void 0
            : r.resourceTypeHandler(e.name)
          : "";
      var r = e.transferSize;
      var i = Number(e.responseStatus);
      var i = Number.isFinite(i) && 0 < i ? i : 200;
      return {
        url: (0, shared.sanitizeUrl)(e.name),
        method: "get",
        duration: Number(e.duration.toFixed(2)),
        status: i,
        type: t || "static",
        isHttps: (0, shared.isHttps)(e.name),
        nextHopProtocol: e.nextHopProtocol || "",
        urlQuery: (0, shared.splitUrlQuery)(e.name, !0),
        domainLookup: (0, shared.toPrimitive)(
          e.domainLookupEnd - e.domainLookupStart,
        ),
        connectTime: (0, shared.toPrimitive)(e.connectEnd - e.connectStart),
        transferSize: 0 < r ? r : -1,
        from: n,
      };
    },
    collectNotReportedLog: function (e) {
      var t;
      var n;
      (0, shared.hasPerformanceTiming)() &&
        ((t = (n = performance.getEntriesByType(this.collectEntryType)).length),
        "function" != typeof window.PerformanceObserver) &&
        this.collectCur !== t &&
        ((n = n.slice(this.collectCur)),
        (this.collectCur = t),
        this.publishMany(n, e));
    },
    destroy: function () {
      this.option.publish = function () {};
    },
  };
}
