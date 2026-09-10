/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createBlankScreenOptions(shared) {
  return {
    name: "blankScreen",
    captureScreenshotWithStrategy: function () {
      return (0, shared.awaiter)(this, void 0, void 0, function () {
        var i;
        var o;
        var a;
        var s;
        var l;
        var c;
        return (0, shared.generator)(this, function (e) {
          switch (e.label) {
            case 0:
              e.trys.push([0, 3, , 4]);
              i = window.innerWidth;
              i = i * window.innerHeight;
              o = Date.now();
              return [4, (0, shared.resizeScreenshot)()];
            case 1:
              c = e.sent();
              l = Date.now() - o;
              return "object" == typeof c && null !== c
                ? [
                    2,
                    {
                      error: "capture_failed",
                      details: {
                        firstCaptureTime: l,
                        errorMessage: null == c ? void 0 : c.message,
                      },
                    },
                  ]
                : c
                  ? !(s = (null == (a = c) ? void 0 : a.length) / 1024) ||
                    s <= 0 ||
                    !isFinite(s)
                    ? [
                        2,
                        {
                          error: "invalid_size",
                          details: {
                            reason: "screenshot_size_invalid",
                            size: s,
                          },
                        },
                      ]
                    : 90 < s
                      ? [
                          2,
                          {
                            error: "complex_page",
                            details: {
                              firstSize: Math.round(s),
                              threshold: 90,
                            },
                          },
                        ]
                      : s <= 30
                        ? [2, a]
                        : (l = 26 / s) < 0.5
                          ? [
                              2,
                              {
                                error: "over_compression",
                                details: {
                                  firstSize: Math.round(s),
                                  requiredRatio: Math.round(100 * l),
                                  minRatio: Math.round(50),
                                },
                              },
                            ]
                          : ((n = l),
                            (r = (0, shared.getScreenshotQuality)(
                              (t = i),
                            ).defaultQuality),
                            (t =
                              t <=
                              shared.screenshotQualityLevels.THRESHOLDS.SMALL
                                ? 0.25
                                : 0.3),
                            (c = Math.max(t, r * n)),
                            [4, (0, shared.resizeScreenshot)(c)])
                  : [
                      2,
                      {
                        error: "capture_failed",
                        details: {
                          reason: "empty_result",
                        },
                      },
                    ];
            case 2:
              return "object" == typeof (l = e.sent()) && null !== l
                ? [
                    2,
                    {
                      error: "retry_capture_failed",
                      details: {
                        firstSize: Math.round(s),
                        errorMessage: null == l ? void 0 : l.message,
                      },
                    },
                  ]
                : (a = l)
                  ? a && (null == a ? void 0 : a.length) <= 30720
                    ? [2, a]
                    : [
                        2,
                        {
                          error: "retry_failed",
                          details: {
                            firstSize: Math.round(s),
                            finalSize: a
                              ? Math.round(
                                  (null == a ? void 0 : a.length) / 1024,
                                )
                              : 0,
                            maxSize: 30,
                          },
                        },
                      ]
                  : [
                      2,
                      {
                        error: "retry_capture_failed",
                        details: {
                          reason: "empty_result",
                        },
                      },
                    ];
            case 3:
              return [
                2,
                {
                  error: "exception",
                  details: {
                    message:
                      (c = e.sent()) instanceof Error ? c.message : String(c),
                    stack: c instanceof Error ? c.stack : void 0,
                  },
                },
              ];
            case 4:
              return [2];
          }
          var t;
          var n;
          var r;
        });
      });
    },
    isDestroyed: !1,
    isAwaitingClientScreenshot: !1,
    pendingTimeouts: [],
    notifyClientScreenshot: function (e, t, n, r) {
      var i = this;
      if (!this.isDestroyed) {
        var o = !(this.isAwaitingClientScreenshot = !0);
        var a = t.timestamp + "_" + Math.random().toString(36).slice(2, 10);
        var t = (0, shared.assign)((0, shared.assign)({}, t), {
          requestId: a,
        });
        var s = setTimeout(function () {
          i.pendingTimeouts = i.pendingTimeouts.filter(function (e) {
            return e !== s;
          });
          i.isDestroyed
            ? (i.isAwaitingClientScreenshot = !1)
            : o ||
              ((o = !0),
              (i.isAwaitingClientScreenshot = !1),
              r(null, {
                success: !1,
                source: "client",
                reason: "timeout",
                timeout: n,
                requestId: a,
              }));
        }, n);
        this.pendingTimeouts.push(s);
        try {
          e(t, function (e) {
            i.isDestroyed
              ? ((i.isAwaitingClientScreenshot = !1), clearTimeout(s))
              : o ||
                ((o = !0),
                (i.isAwaitingClientScreenshot = !1),
                clearTimeout(s),
                (i.pendingTimeouts = i.pendingTimeouts.filter(function (e) {
                  return e !== s;
                })),
                e && "string" == typeof e
                  ? r(e, {
                      success: !0,
                      source: "client",
                      requestId: a,
                    })
                  : r(null, {
                      success: !1,
                      source: "client",
                      reason: "client_returned_null",
                      requestId: a,
                    }));
          });
        } catch (e) {
          o ||
            this.isDestroyed ||
            ((o = !0),
            (this.isAwaitingClientScreenshot = !1),
            clearTimeout(s),
            (this.pendingTimeouts = this.pendingTimeouts.filter(function (e) {
              return e !== s;
            })),
            r(null, {
              success: !1,
              source: "client",
              reason: "callback_error",
              error: e instanceof Error ? e.message : String(e),
              requestId: a,
            }));
        }
      }
    },
    onNewAegis: function (H) {
      var U;
      var D;
      var e;
      var q;
      var t;
      var j;
      var W;
      var B;
      var z;
      var G;
      var n;
      var V;
      var J;
      var X;
      var $;
      var re;
      var K;
      var ie;
      var Q;
      var Y;
      var Z;
      var r;
      var ee;
      var te;
      var i;
      var o;
      var ne;
      var a;
      var g;
      var s;
      var v;
      var l;
      var c;
      var u;
      var y;
      var d;
      var f;
      var h;
      var p;
      var m = this;
      document.elementFromPoint &&
        (this.pendingTimeouts.forEach(function (e) {
          clearTimeout(e);
        }),
        (this.pendingTimeouts = []),
        (this.isDestroyed = !1),
        (this.isAwaitingClientScreenshot = !1),
        (e = (0, shared.resolveBlankScreenConfig)(H)),
        (q = e.everySideSampleNumber),
        (t = e.sameElementsPercent),
        (j = e.containers),
        (W = e.ignoreContainers),
        (B = e.containerMatchers),
        (z = e.ignoreMatchers),
        (G = e.detectStartPosition),
        (n = e.ignoreElesWhenDomChange),
        (V = e.reDetectInterval),
        (J = e.disableSameElementsCheck),
        (X = e.samePointDepth),
        ($ = e.enableScreenshot),
        (re = e.needScreenShotMeta),
        (K = e.onBlankScreenCapture),
        (ie = e.clientScreenshotTimeout),
        (Q = 4 * q - 3),
        (Y = Math.floor((Q * e.emptyElementsPercent) / 100)),
        (Z = Math.floor((Q * t) / 100)),
        (r = shared.BlankScreenTrigger.UNKNOWN),
        (te = null),
        (i = ee = !1),
        (o = function () {
          return (0, shared.awaiter)(m, void 0, void 0, function () {
            var i;
            var o;
            var a;
            var s;
            var l;
            var c;
            var u;
            var d;
            var f;
            var h;
            var p;
            var m;
            var g;
            var v;
            var y;
            var w;
            var b;
            var E;
            var S;
            var R;
            var T;
            var O;
            var x;
            var P;
            var L;
            var C;
            var k;
            var I;
            var A;
            var M;
            var N;
            var _;
            var F = this;
            return (0, shared.generator)(this, function (e) {
              switch (e.label) {
                case 0:
                  if (
                    ((i = window.innerHeight),
                    (o = window.innerWidth),
                    (a = G.x),
                    (s = G.y),
                    o <= a || i <= s)
                  )
                    return [2];
                  for (
                    l = a + (o - a) / 2,
                      c = s + (i - s) / 2,
                      u = [],
                      d = q + 1,
                      h = f = 0,
                      p = 1;
                    p < d;
                    p++
                  ) {
                    v = s + ((i - s) * p) / d;
                    w = (0, shared.elementsAtPoint)(
                      (m = a + ((o - a) * p) / d),
                      c,
                    );
                    g = (0, shared.elementsAtPoint)(l, v);
                    y = (0, shared.elementsAtPoint)(m, v);
                    m = (0, shared.elementsAtPoint)(m, i - v);
                    v = (0, shared.classifyBlankPoint)(w, j, W, B, z);
                    v.isWhitePoint && (f += 1);
                    u.push(v.selectorPointers);
                    p !== d / 2 &&
                      ((w = (0, shared.classifyBlankPoint)(g, j, W, B, z)),
                      (v = w.isWhitePoint),
                      (g = w.selectorPointers),
                      v && (f += 1),
                      (w = (0, shared.classifyBlankPoint)(y, j, W, B, z)),
                      (v = w.isWhitePoint),
                      (y = w.selectorPointers),
                      v && (f += 1),
                      (w = (0, shared.classifyBlankPoint)(m, j, W, B, z)),
                      w.isWhitePoint && (f += 1),
                      u.push(g, y, w.selectorPointers));
                  }
                  k = Y <= f;
                  I = !1;
                  b = {
                    samePointerMap: {},
                    maximumSamePointer: {},
                  };
                  J ||
                    ((S = u.map(function (e) {
                      return e.slice(0, X);
                    })),
                    (t = S.map(function (e) {
                      return e.join(" < ");
                    }).reduce(function (e, t) {
                      e[t] = e[t] ? e[t] + 1 : 1;
                      return e;
                    }, {})),
                    (n = Object.keys(t)
                      .map(function (e) {
                        return [e, t[e]];
                      })
                      .sort(function (e, t) {
                        return t[1] - e[1];
                      })[0]),
                    (r = n[0]),
                    (S = {
                      samePointerMap: t,
                      maximumSamePointerClass: r,
                      maximumSamePointerCounter: n[1],
                    }),
                    (b = {
                      samePointerMap: S.samePointerMap,
                      maximumSamePointer:
                        (((_ = {})[(E = S.maximumSamePointerClass)] = S =
                          S.maximumSamePointerCounter),
                        _),
                    }),
                    (h = S),
                    (_ = shared.visibleMediaTags.some(function (e) {
                      return E.startsWith(e);
                    })),
                    (I = Z <= S && !_));
                  return k || I ? [3, 1] : ((ee = !1), (te = null), [3, 8]);
                case 1:
                  return ee
                    ? ((S = (null == te ? void 0 : te.whitePointCount) >= Y),
                      (_ = (null == te ? void 0 : te.samePointCount) >= Z),
                      (R = S && _ ? "both" : S ? "whitePoint" : "sameElement"),
                      (T = U ? "error" : "domChange"),
                      (O = window.innerWidth),
                      (x = window.innerHeight),
                      (P = Math.round(
                        ((null == te ? void 0 : te.samePointCount) / Q) * 100,
                      )),
                      (L = {
                        whitePointCount:
                          null == te ? void 0 : te.whitePointCount,
                        samePointCount: null == te ? void 0 : te.samePointCount,
                        maximumSamePointer:
                          null == te ? void 0 : te.maximumSamePointer,
                        linkMsg: null == te ? void 0 : te.linkMsg,
                      }),
                      (C = function (e, t) {
                        t = {
                          msg:
                            "decect blankscreen triggerReason: " +
                            R +
                            " triggerType: " +
                            T +
                            "\n\nwhitePointCount: " +
                            L.whitePointCount +
                            " whitePointerThreshold: " +
                            Y +
                            (J
                              ? ""
                              : "\n\nsameElementsCount: " +
                                L.samePointCount +
                                " samePointerThreshold: " +
                                Z +
                                " sameElementPercent: " +
                                P +
                                "%") +
                            "\n\nviewport: " +
                            O +
                            "x" +
                            x +
                            " totalSamplePoints: " +
                            Q +
                            (J
                              ? ""
                              : "\n\nmaxSameElement: " +
                                (0, shared.stringifyLog)(
                                  L.maximumSamePointer,
                                )) +
                            (re && $ && t
                              ? "\n\nscreenShotMeta: " + JSON.stringify(t)
                              : "") +
                            (L.linkMsg ? "\n\nlinkError: " + L.linkMsg : ""),
                          level: shared.LogLevel.BLANK_SCREEN,
                          errorMsg: e || null,
                          originFrom: H.getOriginFrom(),
                        };
                        H.normalLogPipeline(t);
                      }),
                      $
                        ? K
                          ? ((k = (0, shared.getScreenshotQuality)(O * x)),
                            (I = {
                              triggerReason: R,
                              triggerType: T,
                              whitePointCount: L.whitePointCount || 0,
                              samePointCount: L.samePointCount || 0,
                              viewportWidth: O,
                              viewportHeight: x,
                              url: window.location.href,
                              timestamp: Date.now(),
                              recommendedScale: k.scale,
                              recommendedQuality: k.defaultQuality,
                              maxSizeKB: 30,
                            }),
                            this.notifyClientScreenshot(
                              K,
                              I,
                              ie,
                              function (e, t) {
                                if (e && "string" == typeof e) {
                                  var n = e.length / 1024;
                                  if (30 < n)
                                    return void C(
                                      null,
                                      (0, shared.assign)(
                                        (0, shared.assign)({}, t),
                                        {
                                          success: !1,
                                          reason: "size_exceeded",
                                          size: Math.round(n),
                                          maxSize: 30,
                                        },
                                      ),
                                    );
                                }
                                C(e, t);
                              },
                            ),
                            [3, 4])
                          : [3, 2]
                        : [3, 5])
                    : [3, 7];
                case 2:
                  return [4, this.captureScreenshotWithStrategy()];
                case 3:
                  A = e.sent();
                  N = M = null;
                  N =
                    "string" == typeof A
                      ? ((M = A),
                        {
                          success: !0,
                          source: "sdk",
                        })
                      : ((M = null),
                        {
                          success: !1,
                          source: "sdk",
                          error: A.error,
                          details: A.details,
                        });
                  C(M, N);
                  e.label = 4;
                case 4:
                  return [3, 6];
                case 5:
                  C(null, null);
                  e.label = 6;
                case 6:
                  ee = !1;
                  te = null;
                  return [3, 8];
                case 7:
                  te = (0, shared.assign)(
                    (0, shared.assign)(
                      {
                        msg: "blank_screen",
                        level: shared.LogLevel.BLANK_SCREEN,
                        whitePointCount: f,
                        samePointCount: h,
                      },
                      b,
                    ),
                    U
                      ? {
                          linkLogType: null == U ? void 0 : U.type,
                          linkLogLevel: null == U ? void 0 : U.level,
                          linkErrorMsg: null == U ? void 0 : U.errorMsg,
                          linkMsg: null == U ? void 0 : U.msg,
                        }
                      : {},
                  );
                  ee = !0;
                  D = setTimeout(function () {
                    return (0, shared.awaiter)(F, void 0, void 0, function () {
                      return (0, shared.generator)(this, function (e) {
                        switch (e.label) {
                          case 0:
                            return [4, ne()];
                          case 1:
                            e.sent();
                            return [2];
                        }
                      });
                    });
                  }, V);
                  e.label = 8;
                case 8:
                  return [2];
              }
              var t;
              var n;
              var r;
            });
          });
        }),
        (ne = function () {
          return (0, shared.awaiter)(m, void 0, void 0, function () {
            var n = this;
            return (0, shared.generator)(this, function (e) {
              switch (e.label) {
                case 0:
                  return "requestIdleCallback" in window
                    ? (window.requestIdleCallback(function (t) {
                        return (0, shared.awaiter)(
                          n,
                          void 0,
                          void 0,
                          function () {
                            return (0, shared.generator)(this, function (e) {
                              switch (e.label) {
                                case 0:
                                  return 0 < t.timeRemaining()
                                    ? [4, o()]
                                    : [3, 2];
                                case 1:
                                  e.sent();
                                  e.label = 2;
                                case 2:
                                  return [2];
                              }
                            });
                          },
                        );
                      }),
                      [3, 3])
                    : [3, 1];
                case 1:
                  return [4, o()];
                case 2:
                  e.sent();
                  e.label = 3;
                case 3:
                  return [2];
              }
            });
          });
        }),
        (a = function () {
          var e;
          ee ||
            m.isAwaitingClientScreenshot ||
            (r === shared.BlankScreenTrigger.ERROR && !U) ||
            ((r = U
              ? shared.BlankScreenTrigger.ERROR
              : shared.BlankScreenTrigger.DOM_CHANGE),
            clearTimeout(D),
            (e = (0, shared.resolveBlankScreenConfig)(H).debounceDuration),
            (D = setTimeout(function () {
              return (0, shared.awaiter)(m, void 0, void 0, function () {
                return (0, shared.generator)(this, function (e) {
                  switch (e.label) {
                    case 0:
                      clearTimeout(D);
                      return [4, ne()];
                    case 1:
                      e.sent();
                      return [2];
                  }
                });
              });
            }, e)));
        }),
        H.lifeCycle.on(
          "errorOccurred",
          (g = function (e) {
            e = e.filter(function (e) {
              return e.level !== shared.LogLevel.BLANK_SCREEN;
            });
            0 < e.length && ((U = e[e.length - 1]), a());
          }),
        ),
        (s = null),
        window.MutationObserver &&
          ((d = f = null),
          (v =
            window.cancelAnimationFrame ||
            function (e) {
              clearTimeout(e);
            }),
          (l =
            window.requestAnimationFrame ||
            function (e) {
              return setTimeout(e, 1e3 / 60);
            }),
          (c = function () {
            (s = new MutationObserver(function (e) {
              var t = (0, shared.describeElement)(e[0].target);
              var t = n.includes(t.selector);
              (1 === e.length && t) || a();
            })).observe(document.body, {
              childList: !0,
              subtree: !0,
            });
          }),
          (u = function () {
            f && (clearTimeout(f), (f = null));
            d && (v(d), (d = null));
          }),
          document.body
            ? c()
            : ((d = l(
                (y = function () {
                  document.body ? (u(), c()) : (d = l(y));
                }),
              )),
              (f = setTimeout(function () {
                u();
              }, 1e4)))),
        (h = function () {
          i && ((i = !0), ee) && (clearTimeout(D), o());
        }),
        (p = function () {
          "visible" === document.visibilityState && (i = !1);
          "hidden" === document.visibilityState && h();
        }),
        window.addEventListener("pagehide", h),
        window.addEventListener("beforeunload", h),
        window.addEventListener("visibilitychange", p),
        (this.destroyBlanckScreenDetect = function () {
          window.removeEventListener("pagehide", h);
          window.removeEventListener("beforeunload", h);
          window.removeEventListener("visibilitychange", p);
          H.lifeCycle.remove("errorOccurred", g);
          null != s && s.disconnect();
        }));
    },
    destroy: function () {
      this.isDestroyed = !0;
      this.isAwaitingClientScreenshot = !1;
      this.pendingTimeouts.forEach(function (e) {
        clearTimeout(e);
      });
      this.pendingTimeouts = [];
      this.destroyBlanckScreenDetect();
    },
  };
}
