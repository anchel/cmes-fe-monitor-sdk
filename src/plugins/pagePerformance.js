/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createPagePerformanceOptions(shared) {
  return {
    name: "pagePerformance",
    performanceMap: {},
    onNewAegis: function (t) {
      var e;
      (0, shared.hasPerformanceTiming)() &&
        (shared.pagePerformanceState.set(t, {
          isPagePerformanceReported: !1,
        }),
        shared.pagePerformanceCache
          ? this.publish(shared.pagePerformanceCache, t)
          : this.startCalcPerformance(t),
        (e = this.publishWhenObHidden.bind(this, t)),
        (0, shared.onPageExit)(e, {
          once: !0,
        }),
        t.lifeCycle.on("destroy", function () {
          var e = shared.pagePerformanceState.get(t);
          e && (e.isPagePerformanceReported = !1);
        }));
    },
    publishWhenObHidden: function (e) {
      var t;
      var n = shared.pagePerformanceState.get(e);
      if (null == n || !n.isPagePerformanceReported) {
        n = 0;
        if (null != (t = e.firstScreenInfo) && t.timing)
          n = e.firstScreenInfo.timing;
        else if ((0, shared.supportsPerformanceEntry)("paint"))
          try {
            var r;
            var i = performance.getEntriesByName("first-contentful-paint");
            i &&
              0 < i.length &&
              (r = i[0]) &&
              0 < r.startTime &&
              (n = r.startTime);
          } catch (e) {}
        (shared.pagePerformanceCache = this.buildPerformanceLog(
          e,
          n,
          this.getPageUrl(e),
          window.location.href,
        )) && this.publish(shared.pagePerformanceCache, e, !0);
      }
    },
    buildPerformanceLog: function (e, t, n, r) {
      var i = performance.timing;
      if (i) {
        n = {
          from: n,
          originFrom: r,
          dnsLookup: (0, shared.clampTiming)(
            i.domainLookupEnd - i.domainLookupStart,
          ),
          tcp: (0, shared.clampTiming)(i.connectEnd - i.connectStart),
          ssl: (0, shared.clampTiming)(
            0 === i.secureConnectionStart
              ? 0
              : i.requestStart - i.secureConnectionStart,
          ),
          ttfb: (0, shared.clampTiming)(i.responseStart - i.requestStart),
          contentDownload: (0, shared.clampTiming)(
            i.responseEnd - i.responseStart,
          ),
          domParse: (0, shared.clampTiming)(
            i.domInteractive - i.domLoading,
            0,
            15e3,
            1070,
          ),
          resourceDownload: (0, shared.clampTiming)(
            i.loadEventStart - i.domInteractive,
            0,
            15e3,
            1070,
          ),
          firstScreenTiming: (0, shared.clampTiming)(
            Math.floor(t),
            0,
            15e3,
            15e3,
          ),
        };
        (r = e.config).extraPerformanceData &&
          "{}" !== JSON.stringify(r.extraPerformanceData) &&
          ((t = (i = r.extraPerformanceData).engineInit),
          (e = i.bundleLoad),
          (n = (0, shared.assign)((0, shared.assign)({}, n), {
            engineInit: (0, shared.clampTiming)(t, 0, 1e4),
            bundleLoad: (0, shared.clampTiming)(e, 0, 1e4),
          })));
        return n;
      }
    },
    publish: function (a, s, l) {
      var c = this;
      void 0 === l && (l = !1);
      this.$walk(function (o) {
        var e;
        var i;
        o === s &&
          ((e = shared.pagePerformanceState.get(o)) &&
            (e.isPagePerformanceReported = !0),
          (i = a.originFrom || window.location.href),
          a.originFrom && delete a.originFrom,
          o.sendPipeline(
            [
              function (e, t) {
                var n;
                var r;
                var i = [];
                for (n in e) "from" !== n && i.push(n + "=" + e[n]);
                if (c.$getConfig(o)) {
                  r =
                    -1 ===
                    (null == (r = o.config.performanceUrl)
                      ? void 0
                      : r.indexOf("?"))
                      ? "?"
                      : "&";
                  return t({
                    url: o.config.performanceUrl + r + i.join("&"),
                    type: shared.SendType.PERFORMANCE,
                    log: e,
                    sendBeacon: l,
                  });
                }
              },
            ],
            shared.SendType.PERFORMANCE,
          )((0, shared.assign)({}, a)),
          setTimeout(function () {
            var e = [
              "duration: " +
                (a.dnsLookup +
                  a.tcp +
                  a.ssl +
                  a.ttfb +
                  a.contentDownload +
                  a.domParse +
                  a.resourceDownload) +
                "ms",
              "firstScreenTiming: " + a.firstScreenTiming + "ms",
              "dnsLookup: " + a.dnsLookup + "ms",
              "tcp: " + a.tcp + "ms",
              "ssl: " + a.ssl + "ms",
              "ttfb: " + a.ttfb + "ms",
              "contentDownload: " + a.contentDownload + "ms",
              "domParse: " + a.domParse + "ms",
              "resourceDownload: " + a.resourceDownload + "ms",
              "lcp: " + shared.vitalMetrics.LCP + "ms",
              "fid: " + shared.vitalMetrics.FID + "ms",
              "cls: " + shared.vitalMetrics.CLS + "ms",
              "fcp: " + shared.vitalMetrics.FCP + "ms",
              a.engineInit ? "engineInit: " + a.engineInit + "ms" : "",
              a.bundleLoad ? "bundleLoad: " + a.bundleLoad + "ms" : "",
            ]
              .filter(function (e) {
                return e;
              })
              .join("\n\n");
            var t = c.$getConfig(o);
            var n = !1;
            if ("function" == typeof (null == t ? void 0 : t.isSlowPage))
              try {
                n = null == t ? void 0 : t.isSlowPage(a, shared.vitalMetrics);
              } catch (e) {
                return void console.warn(
                  "[Aegis] isSlowPage function happen error:",
                  e,
                  ", this data will not be reported.",
                );
              }
            else
              null != t &&
              t.slowPageThreshold &&
              "number" == typeof t.slowPageThreshold
                ? a.firstScreenTiming >
                    (null == t ? void 0 : t.slowPageThreshold) && (n = !0)
                : (n = 1e3 < a.firstScreenTiming);
            var t = s.config.pageLoadLog;
            var r = s.config.slowPageLoadLog && n;
            var e = {
              msg: e,
              ext1:
                (null == (e = a.firstScreenTiming) ? void 0 : e.toString()) ||
                "",
              level: n
                ? shared.LogLevel.SLOW_PAGE_LOAD
                : shared.LogLevel.PAGE_LOAD,
              errorMsg: "",
              originFrom: i,
            };
            (t || r) && o.normalLogPipeline(e);
          }, 3e3));
      });
    },
    getPageUrl: function (e) {
      var t = this.$getConfig(e);
      if (
        null != t &&
        t.urlHandler &&
        "function" == typeof (null == t ? void 0 : t.urlHandler)
      ) {
        t = null == t ? void 0 : t.urlHandler();
        if (t) return encodeURIComponent(t);
      }
      return e.getCurrentPageUrl();
    },
    startCalcPerformance: function (t) {
      var n = this;
      try {
        var r = this.getPageUrl(t);
        var i = t.getOriginFrom();
        this.getFirstScreenTiming(t, function (e) {
          shared.pagePerformanceCache = n.buildPerformanceLog(t, e, r, i);
          e = shared.pagePerformanceState.get(t);
          !shared.pagePerformanceCache ||
            (null != e && e.isPagePerformanceReported) ||
            n.publish(shared.pagePerformanceCache, t);
        });
      } catch (t) {}
    },
    getFirstScreenTiming: function (l, c) {
      var u = this;
      l.lifeCycle.on("destroy", function () {
        v && clearTimeout(v);
      });
      var d;
      var f = this;
      var n = ["script", "style", "link", "br"];
      var h = [];
      var p = {};
      var m =
        ((0, shared.supportsPerformanceEntry)("paint") &&
          (d = new PerformanceObserver(function (e) {
            e.getEntries().forEach(function (e) {
              var t;
              "paint" === e.entryType &&
                "first-contentful-paint" === e.name &&
                0 <
                  (t = document.querySelectorAll("[AEGIS-FIRST-SCREEN-TIMING]"))
                    .length &&
                l.config.id &&
                !u.performanceMap[l.config.id] &&
                (u.setFirstScreenInfo(l, e.startTime, t[0], t),
                null != c && c(e.startTime),
                m.disconnect(),
                d.disconnect(),
                v) &&
                clearTimeout(v);
            });
          })).observe({
            entryTypes: ["paint"],
          }),
        new MutationObserver(function (e) {
          var t = {
            roots: [],
            ignores: [],
            rootsDomNum: [],
            time: performance.now(),
          };
          e.forEach(function (e) {
            e &&
              e.addedNodes &&
              Array.prototype.slice.call(e.addedNodes).forEach(function (e) {
                f.isEleInArray(e, t.ignores)
                  ? t.ignores.push(e)
                  : 1 === e.nodeType &&
                      e.hasAttribute("AEGIS-FIRST-SCREEN-TIMING")
                    ? (Object.prototype.hasOwnProperty.apply(p, [t.time]) ||
                        (p[t.time] = []),
                      p[t.time].push(e))
                    : 1 === e.nodeType &&
                      (f.hasAncestorOrSelfWithAttribute(
                        e,
                        "AEGIS-IGNORE-FIRST-SCREEN-TIMING",
                      )
                        ? t.ignores.push(e)
                        : -1 !== n.indexOf(e.nodeName.toLocaleLowerCase()) ||
                          f.isEleInArray(e, t.roots) ||
                          (t.roots.push(e),
                          t.rootsDomNum.push(f.walkAndCount(e) || 0)));
              });
          });
          t.roots.length && h.push(t);
        }));
      var g =
        (m.observe(document, {
          childList: !0,
          subtree: !0,
        }),
        function (n) {
          (n = void 0 === n ? 0 : n) ||
            ((r = 0),
            (e = Object.keys(p)),
            (i = null),
            e.length
              ? ((n = Math.max.apply(null, e)),
                (i = null == (e = p[n]) ? void 0 : e[0]))
              : h.forEach(function (e) {
                  for (var t = 0; t < e.roots.length; t++)
                    e.rootsDomNum[t] > r &&
                      f.isInFirstScreen(e.roots[t]) &&
                      ((r = e.rootsDomNum[t]), (n = e.time), (i = e.roots[t]));
                }),
            i && u.setFirstScreenInfo(l, n, i, p),
            (h.length = 0),
            Object.keys(p).forEach(function (e) {
              p[e] = p[e].map(function (e) {
                var t = {
                  tagName: e.tagName,
                };
                var n = e.attributes;
                if (!n) return e;
                for (var r = 0; r < n.length; r++) {
                  var i = n[r];
                  i.name && (t[i.name] = e.getAttribute(i.name));
                }
                return t;
              });
            }));
          var r;
          var i;
          var e = performance.timing;
          var t = e.domInteractive - e.domLoading;
          var o = n;
          v = null;
          for (
            var a = 0, s = [t, e.loadEventStart - e.domInteractive, o];
            a < s.length;
            a++
          )
            if (s[a] <= 0 && 0 < shared.navigationEntryAttempts) {
              v = setTimeout(function () {
                return g(o);
              }, 3e3);
              break;
            }
          v
            ? --shared.navigationEntryAttempts
            : (m.disconnect(), null != d && d.disconnect(), null != c && c(n));
        });
      var v = setTimeout(function () {
        return g();
      }, 3e3);
    },
    setFirstScreenInfo: function (e, t, n, r) {
      var i;
      (e.config.id && this.performanceMap[e.config.id]) ||
        (e.config.id && (this.performanceMap[e.config.id] = !0),
        ("object" !=
          typeof (null == (i = e.config) ? void 0 : i.pagePerformance) ||
          (null != (i = e.config.pagePerformance) && i.firstScreenInfo)) &&
          (e.firstScreenInfo = {
            element: n,
            timing: t,
            markDoms: r,
          }));
    },
    isEleInArray: function (e, t) {
      return (
        !(!e || e === document.documentElement) &&
        (-1 !== t.indexOf(e) || this.isEleInArray(e.parentElement, t))
      );
    },
    isInFirstScreen: function (e) {
      var t;
      return (
        !(!e || "function" != typeof e.getBoundingClientRect) &&
        ((e = e.getBoundingClientRect()),
        (t = window.innerHeight),
        0 <= e.left) &&
        e.left < window.innerWidth &&
        0 <= e.top &&
        e.top < t &&
        0 < e.width &&
        0 < e.height
      );
    },
    walkAndCount: function (e) {
      var t = 0;
      if (e && 1 === e.nodeType) {
        t += 1;
        var n = e.children;
        if (null != n && n.length)
          for (var r = 0; r < n.length; r++)
            (1 === n[r].nodeType &&
              n[r].hasAttribute("AEGIS-IGNORE-FIRST-SCREEN-TIMING")) ||
              (t += this.walkAndCount(n[r]));
      }
      return t;
    },
    hasAncestorOrSelfWithAttribute: function (e, t) {
      for (var n = e; n && n !== document.body;) {
        if (n.hasAttribute(t)) return !0;
        n = n.parentElement;
      }
      return !1;
    },
  };
}
