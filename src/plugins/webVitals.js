/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createWebVitalsOptions(shared) {
  return {
    name: "webVitals",
    onNewAegis: function (e) {
      var t;
      var n;
      var a;
      var s;
      var l;
      var c;
      var u;
      var d;
      var r = this;
      if (
        (0, shared.hasPerformanceTiming)() &&
        "function" == typeof window.PerformanceObserver &&
        "function" == typeof performance.getEntriesByName
      )
        try {
          shared.vitalState.set(e, {
            isWebVitalsReported: !1,
            hasFirstEntry: !1,
            custom: null,
          });
          (0, shared.observeFCP)(shared.storeVital);
          u = shared.storeVital;
          d = {};
          (0, shared.whenActivated)(function () {
            function e(e) {
              (e = d.reportAllChanges ? e : e.slice(-1)).forEach(function (e) {
                e.startTime < r.firstHiddenTime &&
                  ((i.value = Math.max(
                    e.startTime - (0, shared.getActivationStart)(),
                    0,
                  )),
                  (i.entries = [e]),
                  t());
              });
            }
            var t;
            var n;
            var r = (0, shared.getVisibilityWatcher)();
            var i = (0, shared.createVitalMetric)("LCP");
            var o = (0, shared.observePerformance)(
              "largest-contentful-paint",
              e,
            );
            o &&
              ((t = (0, shared.bindVitalReporter)(
                u,
                i,
                shared.lcpThresholds,
                d.reportAllChanges,
              )),
              (n = (0, shared.once)(function () {
                shared.reportedLcpIds[i.id] ||
                  (e(o.takeRecords()),
                  o.disconnect(),
                  (shared.reportedLcpIds[i.id] = !0),
                  t(!0));
              })),
              ["keydown", "click"].forEach(function (e) {
                addEventListener(
                  e,
                  function () {
                    return (0, shared.whenIdleOrHidden)(n);
                  },
                  {
                    once: !0,
                    capture: !0,
                  },
                );
              }),
              (0, shared.onVisibilityHidden)(n),
              (0, shared.onBFCacheRestore)(function (e) {
                i = (0, shared.createVitalMetric)("LCP");
                t = (0, shared.bindVitalReporter)(
                  u,
                  i,
                  shared.lcpThresholds,
                  d.reportAllChanges,
                );
                (0, shared.afterTwoFrames)(function () {
                  i.value = performance.now() - e.timeStamp;
                  shared.reportedLcpIds[i.id] = !0;
                  t(!0);
                });
              }));
          });
          l = shared.storeVital;
          c = {};
          (0, shared.observeFCP)(
            (0, shared.once)(function () {
              function e(e) {
                e.forEach(function (e) {
                  var t;
                  var n;
                  e.hadRecentInput ||
                    ((t = i[0]),
                    (n = i[i.length - 1]),
                    r &&
                    e.startTime - n.startTime < 1e3 &&
                    e.startTime - t.startTime < 5e3
                      ? ((r += e.value), i.push(e))
                      : ((r = e.value), (i = [e])));
                });
                r > n.value && ((n.value = r), (n.entries = i), t());
              }
              var t;
              var n = (0, shared.createVitalMetric)("CLS", 0);
              var r = 0;
              var i = [];
              var o = (0, shared.observePerformance)("layout-shift", e);
              o &&
                ((t = (0, shared.bindVitalReporter)(
                  l,
                  n,
                  shared.clsThresholds,
                  c.reportAllChanges,
                )),
                (0, shared.onVisibilityHidden)(function () {
                  e(o.takeRecords());
                  t(!0);
                }),
                (0, shared.onBFCacheRestore)(function () {
                  n = (0, shared.createVitalMetric)("CLS", (r = 0));
                  t = (0, shared.bindVitalReporter)(
                    l,
                    n,
                    shared.clsThresholds,
                    c.reportAllChanges,
                  );
                  (0, shared.afterTwoFrames)(function () {
                    return t();
                  });
                }),
                setTimeout(t, 0));
            }),
          );
          (0, shared.observeINP)(shared.storeVital);
          a = shared.storeVital;
          s = {};
          (0, shared.whenActivated)(function () {
            function t(e) {
              e.startTime < n.firstHiddenTime &&
                ((r.value = e.processingStart - e.startTime),
                r.entries.push(e),
                o(!0));
            }
            function e(e) {
              e.forEach(t);
            }
            var n = (0, shared.getVisibilityWatcher)();
            var r = (0, shared.createVitalMetric)("FID");
            var i = (0, shared.observePerformance)("first-input", e);
            var o = (0, shared.bindVitalReporter)(
              a,
              r,
              shared.fidThresholds,
              s.reportAllChanges,
            );
            i &&
              ((0, shared.onVisibilityHidden)(
                (0, shared.once)(function () {
                  e(i.takeRecords());
                  i.disconnect();
                }),
              ),
              (0, shared.onBFCacheRestore)(function () {
                r = (0, shared.createVitalMetric)("FID");
                o = (0, shared.bindVitalReporter)(
                  a,
                  r,
                  shared.fidThresholds,
                  s.reportAllChanges,
                );
                shared.firstInputCallbacks = [];
                shared.firstInputDelay = -1;
                shared.firstInputEvent = null;
                (0, shared.listenFirstInput)(addEventListener);
                shared.firstInputCallbacks.push(t);
                (0, shared.dispatchFirstInput)();
              }));
          });
          n = function (e) {
            (0, shared.storeVital)({
              name: "TTI",
              value: e,
            });
          };
          (0, shared.hasPerformanceTiming)() &&
            new shared.TTIObserver(n).start();
          (0, shared.onPageExit)(
            function () {
              r.tryReport(e, null, "onHidden");
            },
            {
              once: !0,
              delay: {
                visibilitychange: 10,
              },
            },
          );
          shared.vitalMetrics.from =
            null == (t = e) ? void 0 : t.getCurrentPageUrl();
        } catch (e) {}
    },
    tryReport: function (t, n, r) {
      var i = this;
      void 0 === r && (r = "manual");
      this.$walk(function (e) {
        e === t &&
          (("object" == typeof (e = i.$getConfig(t)) &&
            !0 === e.manualReport) ||
          "onHidden" !== r
            ? (e = shared.vitalState.get(t)) && !e.hasFirstEntry
              ? ((e.hasFirstEntry = !0), "manual" === r && n && (e.custom = n))
              : i.doReport(t, (null == e ? void 0 : e.custom) || n)
            : i.doReport(t, null));
      });
    },
    doReport: function (n, r) {
      var e = shared.vitalState.get(n);
      if (e) {
        if (null != e && e.isWebVitalsReported) return;
        e.isWebVitalsReported = !0;
      }
      this.$walk(function (o) {
        var e;
        var t;
        o === n &&
          ((t = (0, shared.assign)({}, shared.vitalMetrics)),
          r &&
            Object.keys(r).forEach(function (e) {
              null != r[e] && (t[e] = r[e]);
            }),
          null != (e = o.sendPipeline)) &&
          e.call(
            o,
            [
              function (e, t) {
                var n;
                var r = [];
                for (n in e) "from" !== n && r.push(n + "=" + e[n]);
                var i =
                  -1 ===
                  (null ==
                  (i = null == (i = o.config) ? void 0 : i.performanceUrl)
                    ? void 0
                    : i.indexOf("?"))
                    ? "?"
                    : "&";
                t({
                  url: o.config.webVitalsUrl + i + r.join("&"),
                  type: shared.SendType.VITALS,
                  log: e,
                  sendBeacon: !0,
                });
              },
            ],
            shared.SendType.VITALS,
          )(t);
      });
    },
    publish: function (e, t) {
      this.tryReport(e, t, "manual");
    },
    destroy: function () {
      this.option.publish = function () {};
    },
  };
}
