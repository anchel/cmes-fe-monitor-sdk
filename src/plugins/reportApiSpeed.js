/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createReportApiSpeedOptions(shared) {
  return {
    name: "reportApiSpeed",
    override: !1,
    onNewAegis: function (e) {
      var t;
      var n;
      this.override ||
        ((this.override = !0),
        null != (n = e.config.api) &&
          n.injectTraceHeader &&
          (this.traceRequestHeader = new shared.TraceHeaders(
            n.injectTraceHeader,
            null != (t = null == n ? void 0 : n.injectTraceIgnoreUrls) ? t : [],
            null == n ? void 0 : n.injectTraceUrls,
            null == n ? void 0 : n.traceFlag,
          )),
        this.overrideFetch(e.config, e),
        this.overrideXhr(e.config, e));
    },
    getFromParam: function (e) {
      return e.getCurrentPageUrl();
    },
    overrideFetch: function (b, E) {
      var S = this;
      var e = b.api;
      var e = {
        name: this.name,
        traceRequestHeader:
          null != e && e.injectTraceHeader ? this.traceRequestHeader : null,
        getCurrentFrom: function () {
          return S.getFromParam(E);
        },
        then: function (f, h, p, m, g, v, y) {
          var e;
          var w;
          (0, shared.isIgnoredUrl)(p, b.hostUrl) ||
            ((e = f.headers ? f.headers.get("content-type") : ""),
            "fetch" === (w = (0, shared.getResourceType)(b, e || "", p))
              ? f
                  .clone()
                  .text()
                  .then(function (r) {
                    var e;
                    var i = f.status <= 0 || 400 <= f.status;
                    var t = (null == (t = b.api) ? void 0 : t.reqHeaders) || [];
                    var o = (0, shared.formatHeaders)(
                      null == m ? void 0 : m.headers,
                      t,
                      "req",
                    );
                    var t = (null == (t = b.api) ? void 0 : t.resHeaders) || [];
                    var a = (0, shared.formatHeaders)(f.headers, t, "res");
                    var s = (0, shared.readTraceId)(
                      null == m ? void 0 : m.headers,
                    );
                    var t = (0, shared.parseReturnCode)(r, b.api, {
                      url: p,
                      ctx: f,
                      payload: null == m ? void 0 : m.body,
                    });
                    var l = t.code;
                    var c = t.isErr;
                    var t = null == (t = b.api) ? void 0 : t.apiDetail;
                    var u = t
                      ? (0, shared.formatApiContent)(
                          null == m ? void 0 : m.body,
                          null == (e = b.api) ? void 0 : e.reqParamHandler,
                          {
                            url: p,
                          },
                        )
                      : "";
                    var d = t
                      ? (0, shared.formatApiContent)(
                          r,
                          null == (e = b.api) ? void 0 : e.resBodyHandler,
                          {
                            url: p,
                            ctx: f,
                          },
                        )
                      : "";
                    setTimeout(function () {
                      var e = (0, shared.readResourceTiming)(b, {
                        url: p,
                        duration: h,
                        type: w,
                        status: f.status || 0,
                        method: (null == m ? void 0 : m.method) || "get",
                      });
                      var t = [
                        i ? "FETCH_ERROR: " + r : "",
                        "fetch req url: " + p,
                        "res status: " + (e.status || 0),
                        "res duration: " + e.duration + "ms",
                        "res startTime: " + g,
                        o,
                        a,
                        "req method: " + (e.method || "GET"),
                        "res retcode: " + l,
                        (0, shared.formatApiField)(u, "req param"),
                        (0, shared.formatApiField)(d, "res data"),
                      ]
                        .filter(function (e) {
                          return e;
                        })
                        .join("\n\n");
                      var t =
                        ((e.payload = null == m ? void 0 : m.body),
                        (e.ret = l),
                        (e.isErr = +c),
                        (e.from = v || S.getFromParam(E)),
                        {
                          msg: t,
                          code: l,
                          trace: s,
                          errorMsg: "",
                          from: v || S.getFromParam(E),
                          originFrom: y,
                          level: shared.LogLevel.API_RESPONSE,
                        });
                      var n =
                        b.slowApiLog &&
                        (0, shared.isSlowApi)(
                          null == e ? void 0 : e.duration,
                          b,
                          e,
                        );
                      t.level = n
                        ? shared.LogLevel.SLOW_NET_REQUEST
                        : (0, shared.getApiLogLevel)(i, c);
                      (n ||
                        t.level !== shared.LogLevel.API_RESPONSE ||
                        E.isWhiteList ||
                        (null !=
                          (n = null == (n = E.config) ? void 0 : n.api) &&
                          n.reportRequest)) &&
                        S.publishNormalLog(t, E);
                      S.publishSpeed(e, E);
                    }, 0);
                  })
                  .catch(function (e) {
                    console.info(
                      "ignore something error when process resp " + e,
                    );
                  })
              : setTimeout(function () {
                  var e = (0, shared.readResourceTiming)(b, {
                    url: p,
                    duration: h,
                    type: w,
                    status: f.status || 0,
                    method: (null == m ? void 0 : m.method) || "get",
                  });
                  e.type = "static";
                  e.urlQuery = (0, shared.splitUrlQuery)(p, !0);
                  e.from = v || S.getFromParam(E);
                  S.publishSpeed(e, E);
                }, 0));
        },
        catch: function (t, n, r, i, o, a, s) {
          var l;
          var e;
          var c;
          var u;
          var d;
          throw (
            (0, shared.isIgnoredUrl)(r, b.hostUrl) ||
              ((l = (0, shared.getResourceType)(b, "", r)),
              (e = (null == (e = b.api) ? void 0 : e.reqHeaders) || []),
              (c = (0, shared.formatHeaders)(
                null == i ? void 0 : i.headers,
                e,
                "req",
              )),
              (u = (0, shared.readTraceId)(null == i ? void 0 : i.headers)),
              (d =
                null != (e = b.api) && e.apiDetail
                  ? (0, shared.formatApiContent)(
                      null == i ? void 0 : i.body,
                      null == (e = b.api) ? void 0 : e.reqParamHandler,
                      {
                        url: r,
                      },
                    )
                  : ""),
              setTimeout(function () {
                var e = (0, shared.readResourceTiming)(b, {
                  url: r,
                  duration: n,
                  type: l,
                  status: 0,
                  method: (null == i ? void 0 : i.method) || "get",
                });
                var e =
                  ((e.from = a || S.getFromParam(E)),
                  S.publishSpeed(e, E),
                  "AJAX_ERROR: " +
                    t +
                    "\n                          \nreq url: " +
                    r +
                    "\n                          \nres status: 0\n                          \nres duration: " +
                    e.duration +
                    "ms\n                          \nreq method: " +
                    ((null == i ? void 0 : i.method) || "get") +
                    "\n                          \nreq param: " +
                    d +
                    "\n                          \nres startTime: " +
                    o +
                    "\n                          \n" +
                    c);
                S.publishNormalLog(
                  {
                    msg: e,
                    level: shared.LogLevel.AJAX_ERROR,
                    code: -400,
                    trace: u,
                    errorMsg: "",
                    from: a || S.getFromParam(E),
                    originFrom: s,
                  },
                  E,
                );
              }, 0)),
            t
          );
        },
      };
      var f = ((this.hackFetchOptions = e), this.hackFetchOptions);
      var h = null == (e = b.api) ? void 0 : e.ignoreHackReg;
      if (
        (void 0 === h && (h = /\.flv(\?|$)/i),
        shared.fetchHooks.find(function (e) {
          return e.name === f.name;
        }))
      )
        throw new Error(
          "name '" + f.name + "' is already in hackFetch option list",
        );
      shared.fetchHooks.push(f);
      !shared.fetchInstrumentationReady &&
        window.fetch &&
        ((shared.fetchInstrumentationReady = !0),
        (shared.originalFetch = window.fetch),
        (window.fetch = function (e, i) {
          void 0 === i && (i = {});
          var o = "string" == typeof e ? e : null == e ? void 0 : e.url;
          if (null != (a = null == h ? void 0 : h.test) && a.call(h, o))
            return (0, shared.originalFetch)(o, i);
          shared.relativeUrlPattern.test(o) && (o = "" + location.origin + o);
          var t;
          var n;
          var r;
          var a = (f || {}).traceRequestHeader;
          a &&
            ((t = void 0 === (t = (i || {}).headers) ? {} : t),
            (n = (r = (0, shared.getPageOrigin)()).host),
            (n = (a =
              a.generate(o, t, {
                host: n,
                pathname: r.pathname,
              }) || {}).name),
            (r = a.value)) &&
            n &&
            (i.headers = Object.assign(t, (((a = {})[n] = r), a)));
          for (
            var s = new Map(), l = window.location.href, c = 0;
            c < shared.fetchHooks.length;
            c++
          ) {
            var u = shared.fetchHooks[c];
            try {
              "function" == typeof u.beforeFetch && u.beforeFetch(o, i);
              "function" == typeof u.getCurrentFrom &&
                s.set(u.name, u.getCurrentFrom());
            } catch (e) {}
          }
          var d = Date.now();
          return (0, shared.originalFetch)(e, i)
            .then(function (e) {
              for (
                var t = e.clone(), n = 0;
                n < shared.fetchHooks.length;
                n++
              ) {
                var r = shared.fetchHooks[n];
                try {
                  "function" == typeof r.then &&
                    r.then(t, Date.now() - d, o, i, d, s.get(r.name), l);
                } catch (e) {}
              }
              return t;
            })
            .catch(function (e) {
              for (var t = 0; t < shared.fetchHooks.length; t++) {
                var n = shared.fetchHooks[t];
                try {
                  "function" == typeof n.catch &&
                    n.catch(e, Date.now() - d, o, i, d, s.get(n.name), l);
                } catch (e) {}
              }
              throw e;
            });
        }));
    },
    overrideXhr: function (b, E) {
      var i;
      var S = this;
      var e = {
        name: this.name,
        ignoreHackReg: null == (e = b.api) ? void 0 : e.ignoreHackReg,
        traceRequestHeader:
          null != (e = b.api) && e.injectTraceHeader
            ? this.traceRequestHeader
            : null,
        getCurrentFrom: function () {
          return S.getFromParam(E);
        },
        send: function (f, h, p, m) {
          var e;
          var t;
          var g = Date.now();
          var v =
            (((null == b ? void 0 : b.api) || {}).injectTraceHeader &&
              ((t = (e = (0, shared.getPageOrigin)()).host),
              (e = (t =
                S.traceRequestHeader.generate(
                  f.aegisUrl,
                  {},
                  {
                    host: t,
                    pathname: e.pathname,
                  },
                ) || {}).name),
              (t = t.value),
              e) &&
              t &&
              f.setRequestHeader(e, t),
            f.addEventListener("loadend", function () {
              var c;
              var n;
              var e;
              var u;
              var d = f.aegisUrl || "";
              (0, shared.isIgnoredUrl)(d, b.hostUrl) ||
                "abort" === f.failType ||
                ((c = ""),
                (f.failType || !f.status || 400 <= f.status) &&
                  (c = f.failType || "failed"),
                (n = Date.now() - g),
                (e = f.getResponseHeader("content-type") || ""),
                (u = (0, shared.getResourceType)(b, e, d)),
                setTimeout(function () {
                  var r = (0, shared.readResourceTiming)(b, {
                    url: d,
                    duration: n,
                    type: u,
                    status: f.status,
                    method: f.aegisMethod || "get",
                  });
                  if (((r.from = p || S.getFromParam(E)), "fetch" === u)) {
                    var e = (null == (e = b.api) ? void 0 : e.reqHeaders) || [];
                    var i = (0, shared.formatHeaders)(
                      f.aegisXhrReqHeader,
                      e,
                      "req",
                    );
                    var e = (null == (e = b.api) ? void 0 : e.resHeaders) || [];
                    var t = f
                      .getAllResponseHeaders()
                      .split("\r\n")
                      .reduce(function (e, t) {
                        t = t.split(": ");
                        t[0] && t[1] && (e[t[0]] = t[1]);
                        return e;
                      }, {});
                    var o = (0, shared.formatHeaders)(t, e, "res");
                    var a = (0, shared.readTraceId)(f.aegisXhrReqHeader);
                    var e = null == (t = b.api) ? void 0 : t.apiDetail;
                    var s = e
                      ? (0, shared.formatApiContent)(
                          h,
                          null == (t = b.api) ? void 0 : t.reqParamHandler,
                          {
                            url: d,
                          },
                        )
                      : "";
                    var l = e
                      ? (0, shared.formatApiContent)(
                          f.response,
                          null == (t = b.api) ? void 0 : t.resBodyHandler,
                          {
                            url: d,
                          },
                        )
                      : "";
                    try {
                      ((e, t, n, r) => {
                        var i;
                        var o;
                        var a;
                        try {
                          if (
                            "function" ==
                            typeof (null == t ? void 0 : t.retCodeHandlerAsync)
                          )
                            return t.retCodeHandlerAsync(
                              e,
                              null == n ? void 0 : n.url,
                              null == n ? void 0 : n.ctx,
                              function (e) {
                                var t = e.code;
                                null != r &&
                                  r({
                                    code: void 0 === t ? shared.UNKNOWN : t,
                                    isErr: e.isErr,
                                  });
                              },
                            );
                          if (
                            "function" ==
                            typeof (null == t ? void 0 : t.retCodeHandler)
                          ) {
                            a = (o =
                              t.retCodeHandler(
                                e,
                                null == n ? void 0 : n.url,
                                null == n ? void 0 : n.ctx,
                                null == n ? void 0 : n.payload,
                              ) || {}).code;
                            return (
                              null != r &&
                              r({
                                code: void 0 === a ? shared.UNKNOWN : a,
                                isErr: o.isErr,
                              })
                            );
                          }
                          if (!(e = "string" == typeof e ? JSON.parse(e) : e))
                            return (
                              null != r &&
                              r({
                                code: shared.UNKNOWN,
                                isErr: !1,
                              })
                            );
                          "function" ==
                            typeof (null == (i = null == t ? void 0 : t.ret)
                              ? void 0
                              : i.join) &&
                            (shared.returnCodeKeys = [].concat(
                              t.ret.map(function (e) {
                                return e.toLowerCase();
                              }),
                            ));
                          var s = Object.getOwnPropertyNames(e).filter(
                            function (e) {
                              return (
                                -1 !==
                                shared.returnCodeKeys.indexOf(e.toLowerCase())
                              );
                            },
                          );
                          if (s.length) {
                            ("未知" !== (a = e[s[0]]) && "" !== a) ||
                              (a = shared.UNKNOWN);
                            return (
                              null != r &&
                              r({
                                code: "" + a,
                                isErr:
                                  0 !== a && "0" !== a && a !== shared.UNKNOWN,
                              })
                            );
                          }
                          null != r &&
                            r({
                              code: shared.UNKNOWN,
                              isErr: !1,
                            });
                        } catch (e) {
                          null != r &&
                            r({
                              code: shared.UNKNOWN,
                              isErr: !1,
                            });
                        }
                      })(
                        f.response,
                        b.api,
                        {
                          url: d,
                          ctx: f,
                          payload: h,
                        },
                        function (e) {
                          var t = e.code;
                          var e = e.isErr;
                          var n = [
                            c ? "AJAX_ERROR: request " + c : "",
                            "fetch req url: " + d,
                            "res status: " + (r.status || 0),
                            "res duration: " + r.duration + "ms",
                            "res startTime: " + g,
                            i,
                            o,
                            "req method: " + (r.method || "GET"),
                            "res retcode: " + t,
                            (0, shared.formatApiField)(s, "req param"),
                            (0, shared.formatApiField)(l, "res data"),
                          ]
                            .filter(function (e) {
                              return e;
                            })
                            .join("\n\n");
                          r.ret = t;
                          r.isErr = +e;
                          r.payload = h;
                          b.slowApiLog &&
                          (0, shared.isSlowApi)(
                            null == r ? void 0 : r.duration,
                            b,
                            r,
                          )
                            ? S.publishNormalLog(
                                {
                                  msg: n,
                                  level: shared.LogLevel.SLOW_NET_REQUEST,
                                  code: t,
                                  trace: a,
                                  errorMsg: "",
                                  from: p || S.getFromParam(E),
                                  originFrom: m,
                                },
                                E,
                              )
                            : S.publishNormalLog(
                                {
                                  msg: n,
                                  level: (0, shared.getApiLogLevel)(!!c, e),
                                  code: t,
                                  trace: a,
                                  errorMsg: "",
                                  from: p || S.getFromParam(E),
                                  originFrom: m,
                                },
                                E,
                              );
                          S.publishSpeed(r, E);
                        },
                      );
                    } catch (e) {
                      r.ret = shared.UNKNOWN;
                      S.publishSpeed(r, E);
                    }
                  } else {
                    r.type = "static";
                    r.urlQuery = (0, shared.splitUrlQuery)(d, !0);
                    S.publishSpeed(r, E);
                  }
                  f.removeEventListener("abort", v);
                  f.removeEventListener("error", y);
                  f.removeEventListener("timeout", w);
                }, 0));
            }),
            function () {
              f.failType = "abort";
            });
          var y = function () {
            f.failType = "error";
          };
          var w = function () {
            f.failType = "timeout";
          };
          f.addEventListener("abort", v);
          f.addEventListener("error", y);
          f.addEventListener("timeout", w);
        },
      };
      this.hackXHROptions = e;
      i = this.hackXHROptions;
      shared.xhrHooks.find(function (e) {
        return e.name === i.name;
      }) ||
        (shared.xhrHooks.push(i),
        !shared.xhrInstrumentationReady &&
          window.XMLHttpRequest &&
          ((shared.originalXhrSend = window.XMLHttpRequest.prototype.send),
          (shared.originalXhrOpen = window.XMLHttpRequest.prototype.open),
          (shared.originalSetRequestHeader =
            window.XMLHttpRequest.prototype.setRequestHeader),
          (shared.xhrInstrumentationReady = !0),
          (window.XMLHttpRequest.prototype.open = function () {
            this.aegisMethod = arguments[0];
            var e;
            var t = arguments[1];
            if (
              (shared.relativeUrlPattern.test(t) &&
                (t = "" + location.origin + t),
              (this.aegisUrl = t),
              null == (t = null == (e = i.ignoreHackReg) ? void 0 : e.test) ||
                !t.call(e, this.aegisUrl))
            )
              if (((this.aegisXhrStartTime = Date.now()), this.sendByAegis))
                shared.deviceDetection.isIE() || (this.timeout = 5e3);
              else
                for (var n = 0; n < shared.xhrHooks.length; n++) {
                  var r = shared.xhrHooks[n];
                  try {
                    "function" == typeof r.open && r.open(this);
                  } catch (e) {}
                }
            return shared.originalXhrOpen.apply(this, arguments);
          }),
          (window.XMLHttpRequest.prototype.setRequestHeader = function () {
            var e;
            var t;
            var n;
            return null !=
              (t = null == (n = i.ignoreHackReg) ? void 0 : n.test) &&
              t.call(n, this.aegisUrl)
              ? shared.originalSetRequestHeader.apply(this, arguments)
              : ((t = arguments[0]),
                (n = arguments[1]),
                (this.aegisXhrReqHeader =
                  null != (e = this.aegisXhrReqHeader) ? e : {}),
                null != i &&
                i.traceRequestHeader &&
                -1 < ["traceparent", "b3", "sw8", "sentry-trace"].indexOf(t) &&
                (this.aegisXhrReqHeader[t] || (arguments[1] = n),
                this.aegisXhrReqHeader[t])
                  ? void 0
                  : ((this.aegisXhrReqHeader[t] = arguments[1]),
                    shared.originalSetRequestHeader.apply(this, arguments)));
          }),
          (window.XMLHttpRequest.prototype.send = function () {
            var e;
            var t;
            if (!(
              (null != (t = null == (e = i.ignoreHackReg) ? void 0 : e.test) &&
                t.call(e, this.aegisUrl)) ||
              this.sendByAegis
            ))
              for (var n = 0; n < shared.xhrHooks.length; n++) {
                var r = shared.xhrHooks[n];
                try {
                  "function" == typeof r.send &&
                    r.send(
                      this,
                      arguments[0],
                      "function" == typeof r.getCurrentFrom
                        ? r.getCurrentFrom()
                        : void 0,
                      window.location.href,
                    );
                } catch (e) {}
              }
            return shared.originalXhrSend.apply(this, arguments);
          })));
    },
    publishSpeed: function (n) {
      var r = this;
      this.$walk(function (e) {
        var t = r.$getConfig(e);
        "fetch" !== n.type ||
        "function" != typeof (null == t ? void 0 : t.urlHandler)
          ? ((n.url = (0, shared.splitUrlQuery)(n.url)), e.speedLogPipeline(n))
          : e.speedLogPipeline(
              (0, shared.assign)((0, shared.assign)({}, n), {
                url: (0, shared.splitUrlQuery)(t.urlHandler(n.url, n.payload)),
              }),
            );
      });
    },
    publishNormalLog: function (t) {
      this.$walk(function (e) {
        e.normalLogPipeline(t);
      });
    },
    destroy: function () {
      var t;
      var n;
      var e;
      this.option.publishSpeed = function () {};
      this.option.publishNormalLog = function () {};
      this.option.hackXHROptions &&
        ((t = this.option.hackXHROptions),
        -1 !==
          (e = shared.xhrHooks.findIndex(function (e) {
            return e.name === t.name;
          }))) &&
        shared.xhrHooks.splice(e, 1);
      this.option.hackFetchOptions &&
        ((n = this.option.hackFetchOptions),
        -1 !==
          (e = shared.fetchHooks.findIndex(function (e) {
            return e.name === n.name;
          }))) &&
        shared.fetchHooks.splice(e, 1);
      this.option.override = !1;
    },
  };
}
