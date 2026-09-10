/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
import { DEFAULT_HOST_URL } from "./config.js";
import {
  installRateConfig,
  createWhitelistStage,
  isControlRequestAllowed,
} from "./control-plane.js";
import createAidOptions from "./plugins/aid.js";
import createReportAssetSpeedOptions from "./plugins/reportAssetSpeed.js";
import createReportApiSpeedOptions from "./plugins/reportApiSpeed.js";
import createReportBridgeSpeedOptions from "./plugins/reportBridgeSpeed.js";
import createDeviceOptions from "./plugins/device.js";
import createOnErrorOptions from "./plugins/onError.js";
import createClickElementLogOptions from "./plugins/clickElementLog.js";
import createConsoleLogOptions from "./plugins/consoleLog.js";
import createWebVitalsOptions from "./plugins/webVitals.js";
import createPagePerformanceOptions from "./plugins/pagePerformance.js";
import createSpaOptions from "./plugins/spa.js";
import createOnCloseOptions from "./plugins/onClose.js";
import createBlankScreenOptions from "./plugins/blankScreen.js";
import createLagMonitorOptions from "./plugins/lagMonitor.js";
import createMemoryMonitorOptions from "./plugins/memoryMonitor.js";
export default function createRuntime() {
  var weakSetCounter;
  var WeakSetImplementation;
  function WeakSetPolyfill(e) {
    this.name = "__st" + ((1e9 * Math.random()) >>> 0) + weakSetCounter + "__";
    null != e && e.forEach(this.add, this);
    weakSetCounter += 1;
  }
  Array.prototype.find ||
    Object.defineProperty(Array.prototype, "find", {
      configurable: !0,
      writable: !0,
      value: function (e) {
        if (null === this) throw new TypeError('"this" is null or not defined');
        var t = Object(this);
        var n = t.length >>> 0;
        if ("function" != typeof e)
          throw new TypeError("predicate must be a function");
        for (var r = arguments[1], i = 0; i < n;) {
          var o = t[i];
          if (e.call(r, o, i, t)) return o;
          i += 1;
        }
      },
    });
  window.WeakSet ||
    ((weakSetCounter = Date.now() % 1e9),
    (WeakSetPolyfill.prototype.add = function (e) {
      var t = this.name;
      e[t] ||
        Object.defineProperty(e, t, {
          value: !0,
          writable: !0,
        });
      return this;
    }),
    (WeakSetPolyfill.prototype.delete = function (e) {
      return !!e[this.name] && !(e[this.name] = void 0);
    }),
    (WeakSetPolyfill.prototype.has = function (e) {
      return !!e[this.name];
    }),
    (WeakSetImplementation = WeakSetPolyfill),
    Object.defineProperty(window, "WeakSet", {
      value: function (e) {
        return new WeakSetImplementation(e);
      },
    }));
  Object.assign ||
    Object.defineProperty(Object, "assign", {
      enumerable: !1,
      configurable: !0,
      writable: !0,
      value: function (e) {
        if (null == e)
          throw new TypeError("Cannot convert first argument to object");
        for (var t = Object(e), n = 1; n < arguments.length; n++)
          if (null != (r = arguments[n]))
            for (
              var r = Object(r),
                i = Object.keys(Object(r)),
                o = 0,
                a = i.length;
              o < a;
              o++
            ) {
              var s = i[o];
              var l = Object.getOwnPropertyDescriptor(r, s);
              null != l && l.enumerable && (t[s] = r[s]);
            }
        return t;
      },
    });
  var inheritStatics = function (e, t) {
    return (inheritStatics =
      Object.setPrototypeOf ||
      ({
        __proto__: [],
      } instanceof Array
        ? function (e, t) {
            e.__proto__ = t;
          }
        : function (e, t) {
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          }))(e, t);
  };
  var assign = function () {
    return (assign =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var i in (t = arguments[n]))
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
  };
  function awaiter(e, a, s, l) {
    return new (s = s || Promise)(function (n, t) {
      function r(e) {
        try {
          o(l.next(e));
        } catch (e) {
          t(e);
        }
      }
      function i(e) {
        try {
          o(l.throw(e));
        } catch (e) {
          t(e);
        }
      }
      function o(e) {
        var t;
        e.done
          ? n(e.value)
          : ((t = e.value) instanceof s
              ? t
              : new s(function (e) {
                  e(t);
                })
            ).then(r, i);
      }
      o((l = l.apply(e, a || [])).next());
    });
  }
  function generator(r, i) {
    var o;
    var a;
    var s;
    var l = {
      label: 0,
      sent: function () {
        if (1 & s[0]) throw s[1];
        return s[1];
      },
      trys: [],
      ops: [],
    };
    var e = {
      next: t(0),
      throw: t(1),
      return: t(2),
    };
    "function" == typeof Symbol &&
      (e[Symbol.iterator] = function () {
        return this;
      });
    return e;
    function t(n) {
      return function (e) {
        var t = [n, e];
        if (o) throw new TypeError("Generator is already executing.");
        for (; l;)
          try {
            if (
              ((o = 1),
              a &&
                (s =
                  2 & t[0]
                    ? a.return
                    : t[0]
                      ? a.throw || ((s = a.return) && s.call(a), 0)
                      : a.next) &&
                !(s = s.call(a, t[1])).done)
            )
              return s;
            switch (((a = 0), (t = s ? [2 & t[0], s.value] : t)[0])) {
              case 0:
              case 1:
                s = t;
                break;
              case 4:
                l.label++;
                return {
                  value: t[1],
                  done: !1,
                };
              case 5:
                l.label++;
                a = t[1];
                t = [0];
                continue;
              case 7:
                t = l.ops.pop();
                l.trys.pop();
                continue;
              default:
                if (!(
                  (s = 0 < (s = l.trys).length && s[s.length - 1]) ||
                  (6 !== t[0] && 2 !== t[0])
                )) {
                  l = 0;
                  continue;
                }
                if (3 === t[0] && (!s || (t[1] > s[0] && t[1] < s[3])))
                  l.label = t[1];
                else if (6 === t[0] && l.label < s[1]) {
                  l.label = s[1];
                  s = t;
                } else {
                  if (!(s && l.label < s[2])) {
                    s[2] && l.ops.pop();
                    l.trys.pop();
                    continue;
                  }
                  l.label = s[2];
                  l.ops.push(t);
                }
            }
            t = i.call(r, l);
          } catch (e) {
            t = [6, e];
            a = 0;
          } finally {
            o = s = 0;
          }
        if (5 & t[0]) throw t[1];
        return {
          value: t[0] ? t[1] : void 0,
          done: !0,
        };
      };
    }
  }
  function concatArrays() {
    for (var e = 0, t = 0, n = arguments.length; t < n; t++)
      e += arguments[t].length;
    for (var r = Array(e), i = 0, t = 0; t < n; t++)
      for (var o = arguments[t], a = 0, s = o.length; a < s; a++, i++)
        r[i] = o[a];
    return r;
  }
  var LogLevel;
  var SendType;
  var Environment;
  var timestampQueryPattern = /_?t(\d)?(imestamp)?=\d+&?/g;
  var ignoredReportUrls = [
    "aegis.qq.com",
    "tamaegis.com",
    "/aegis-sdk",
    "rumt-",
    "/flog.core.min.js",
    "pingfore.qq.com",
    "pingfore.tencent.com",
    "zhiyan.tencent-cloud.net",
    "h.trace.qq.com",
    "btrace.qq.com",
    "beacon.qq.com",
    "dmplog.qq.com",
    "qq.com/report",
    "svibeacon.onezapp.com",
    "cube.weixinbridge.com",
    "doubleclick.net",
    "pcmgrmonitor.3g.qq.com",
    "tdm.qq.com",
    "report.qqweb.qq.com",
    "tpstelemetry.tencent.com",
    "galileotelemetry.tencent.com",
    "insight.cloud.tencent.com",
    "facebook.com",
    "facebook.net",
    "google",
    "yahoo.com",
    "twitter.com",
    "ga-audiences",
    "report.idqqimg.com",
    "arms-retcode.aliyuncs.com",
    "px.effirst.com",
    "sentry",
    "baidu.com",
    "hot-update.json",
    "u.c.b.r.o.w.s.e.r",
    "report.url.cn",
    "sockjs-node",
    "m3u8",
    "flv",
  ];
  var ignoredErrorMessages = [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed",
    "Failed to execute 'transaction'",
    "window.indexedDB.deleteDatabase is not a function",
  ];
  var optionalLogFields = [
    "ext1",
    "ext2",
    "ext3",
    "ext4",
    "ext5",
    "ext6",
    "ext7",
    "ext8",
    "ext9",
    "ext10",
    "level",
    "trace",
    "tag",
    "seq",
    "code",
  ];
  var resourceTypes = ["static", "fetch"];
  var UNKNOWN = "unknown";
  (runtimeAlias = LogLevel = LogLevel || {}).INFO_ALL = "-1";
  runtimeAlias.API_RESPONSE = "1";
  runtimeAlias.INFO = "2";
  runtimeAlias.ERROR = "4";
  runtimeAlias.PROMISE_ERROR = "8";
  runtimeAlias.AJAX_ERROR = "16";
  runtimeAlias.SCRIPT_ERROR = "32";
  runtimeAlias.IMAGE_ERROR = "64";
  runtimeAlias.CSS_ERROR = "128";
  runtimeAlias.CONSOLE_ERROR = "256";
  runtimeAlias.MEDIA_ERROR = "512";
  runtimeAlias.RET_ERROR = "1024";
  runtimeAlias.PAGE_LOAD = "1025";
  runtimeAlias.SLOW_PAGE_LOAD = "1026";
  runtimeAlias.SLOW_NET_REQUEST = "1027";
  runtimeAlias.ASSERT_REQUEST = "1028";
  runtimeAlias.SLOW_ASSET_REQUEST = "1029";
  runtimeAlias.CLICK_EVENT = "1030";
  runtimeAlias.CONSOLE_LOG = "1031";
  runtimeAlias.BLANK_SCREEN = "1032";
  runtimeAlias.MEMORY_OOM = "1033";
  runtimeAlias.LAG_MONITOR = "1034";
  runtimeAlias.NORESPONSE_LOG = "1035";
  runtimeAlias.REPORT = "2048";
  runtimeAlias.PV = "4096";
  runtimeAlias.EVENT = "8192";
  runtimeAlias.SPEED_EVENT = "8193";
  runtimeAlias.PAGE_NOT_FOUND_ERROR = "16384";
  runtimeAlias.WEBSOCKET_ERROR = "32768";
  runtimeAlias.BRIDGE_ERROR = "65536";
  runtimeAlias.LAZY_LOAD_ERROR = "131072";
  runtimeAlias.CRASH_ERROR = "262144";
  (runtimeAlias = SendType = SendType || {}).LOG = "log";
  runtimeAlias.SPEED = "speed";
  runtimeAlias.PERFORMANCE = "performance";
  runtimeAlias.OFFLINE = "offline";
  runtimeAlias.WHITE_LIST = "whiteList";
  runtimeAlias.VITALS = "vitals";
  runtimeAlias.PV = "pv";
  runtimeAlias.CUSTOM_PV = "customPV";
  runtimeAlias.EVENT = "event";
  runtimeAlias.CUSTOM = "custom";
  runtimeAlias.SDK_ERROR = "sdkError";
  runtimeAlias.SET_DATA = "setData";
  runtimeAlias.LOAD_PACKAGE = "loadPackage";
  runtimeAlias.MEMORY = "memory";
  (runtimeAlias = Environment = Environment || {}).production = "production";
  runtimeAlias.development = "development";
  runtimeAlias.gray = "gray";
  runtimeAlias.pre = "pre";
  runtimeAlias.daily = "daily";
  runtimeAlias.local = "local";
  runtimeAlias.test = "test";
  runtimeAlias.others = "others";
  function appendQuery(e, n) {
    var t;
    return "string" != typeof e
      ? ""
      : "object" == typeof n && n
        ? ((t = Object.getOwnPropertyNames(n)
            .map(function (e) {
              var t = n[e];
              return (
                e +
                "=" +
                ("string" == typeof t
                  ? encodeURIComponent(t)
                  : encodeURIComponent(JSON.stringify(t)))
              );
            })
            .join("&")
            .replace(/eval/gi, "evaI")),
          e + (-1 === e.indexOf("?") ? "?" : "&") + t)
        : e;
  }
  EventEmitter.prototype.indexOf = function (e, t) {
    for (var n = 0; n < e.length; n++) if (e[n].callback === t) return n;
    return -1;
  };
  EventEmitter.prototype.on = function (e, t, n) {
    var r;
    if ((void 0 === n && (n = 0), this)) {
      (r = this.eventsList[e]) ||
        ((this.eventsList[e] = []), (r = this.eventsList[e]));
      -1 === this.indexOf(r, t) &&
        r.push({
          name: e,
          type: n || 0,
          callback: t,
        });
      return this;
    }
  };
  EventEmitter.prototype.one = function (e, t) {
    this.on(e, t, 1);
  };
  EventEmitter.prototype.remove = function (e, t) {
    if (this) {
      var n = this.eventsList[e];
      if (n) {
        if (t) {
          n.length && ((t = this.indexOf(n, t)), n.splice(t, 1));
          return this;
        }
        try {
          delete this.eventsList[e];
        } catch (e) {}
      }
      return null;
    }
  };
  EventEmitter.prototype.clear = function () {
    this.eventsList = {};
  };
  var primitiveDefaults;
  var Lifecycle = EventEmitter;
  var serializeLogColumns = function (e) {
    if (!e || 0 === e.length) return "{}";
    e = Array.isArray(e) ? e : [e];
    var t = Array.from(
      new Set(
        e.flatMap(function (e) {
          return Object.keys(e);
        }),
      ),
    );
    var n = {};
    t.forEach(function (t) {
      n[t] = e.map(function (e) {
        return e[t] || "";
      });
    });
    n.count = e.length;
    return stringifyJSON(n);
  };
  function EventEmitter() {
    var s = this;
    this.emit = function (e) {
      for (var t, n = [], r = 1; r < arguments.length; r++)
        n[r - 1] = arguments[r];
      if (s) {
        if (null != (i = s.eventsList[e]) && i.length)
          for (var i = i.slice(), o = 0; o < i.length; o++) {
            t = i[o];
            try {
              var a = t.callback.apply(s, n);
              if ((1 === t.type && s.remove(e, t.callback), !1 === a)) break;
            } catch (e) {
              throw e;
            }
          }
        return s;
      }
    };
    this.eventsList = {};
  }
  (runtimeAlias = primitiveDefaults = primitiveDefaults || {})[
    (runtimeAlias.number = -1)
  ] = "number";
  runtimeAlias.string = "";
  function toPrimitive(e, t) {
    return "number" == typeof e || "string" == typeof e
      ? e
      : t
        ? primitiveDefaults.string
        : primitiveDefaults.number;
  }
  function splitUrlQuery(e, t) {
    return "string" == typeof e ? e.split("?")[t ? 1 : 0] || "" : e;
  }
  function sanitizeUrl(e, t) {
    void 0 === t && (t = 2048);
    return String(e).replace(timestampQueryPattern, "").slice(0, t);
  }
  function isHttps(e) {
    return "string" == typeof e && /^\//.test(e)
      ? "https:" === (null == location ? void 0 : location.protocol)
      : /^https/.test(e);
  }
  function parseReturnCode(e, t, n) {
    var r;
    var i;
    var o;
    try {
      if ("function" == typeof (null == t ? void 0 : t.retCodeHandler))
        return {
          code:
            void 0 ===
            (o = (i =
              t.retCodeHandler(
                e,
                null == n ? void 0 : n.url,
                null == n ? void 0 : n.ctx,
                null == n ? void 0 : n.payload,
              ) || {}).code)
              ? UNKNOWN
              : o,
          isErr: i.isErr,
        };
      if (!(e = "string" == typeof e ? JSON.parse(e) : e))
        return {
          code: UNKNOWN,
          isErr: !1,
        };
      "function" ==
        typeof (null == (r = null == t ? void 0 : t.ret) ? void 0 : r.join) &&
        (returnCodeKeys = [].concat(
          t.ret.map(function (e) {
            return e.toLowerCase();
          }),
        ));
      var a = Object.getOwnPropertyNames(e).filter(function (e) {
        return -1 !== returnCodeKeys.indexOf(e.toLowerCase());
      });
      return a.length
        ? {
            code: "" + (o = "未知" !== (o = e[a[0]]) && "" !== o ? o : UNKNOWN),
            isErr: 0 !== o && "0" !== o && o !== UNKNOWN,
          }
        : {
            code: UNKNOWN,
            isErr: !1,
          };
    } catch (e) {
      return {
        code: UNKNOWN,
        isErr: !1,
      };
    }
  }
  function formatApiContent(e, t, n) {
    try {
      var r =
        "function" == typeof t
          ? t(e, null == n ? void 0 : n.url, null == n ? void 0 : n.ctx) || ""
          : e;
      return stringifyLimited(r).slice(0, 10240);
    } catch (e) {
      return "";
    }
  }
  function createSpeedPayload(e, t) {
    var n;
    var r = {
      fetch: [],
      static: [],
      bridge: [],
    };
    var i = {};
    Array.isArray(e)
      ? e.forEach(function (e) {
          var t;
          null != (t = r[e.type]) && t.push(e);
        })
      : null != (n = r[e.type]) && n.push(e);
    i.payload = JSON.stringify(
      assign(
        {
          duration: r,
        },
        t,
      ),
    );
    return i;
  }
  function isIgnoredUrl(t, e) {
    return (
      "string" != typeof t ||
      !t ||
      (e && -1 < t.indexOf(e)) ||
      dataUrlPattern.test(t) ||
      ignoredReportUrls.some(function (e) {
        return -1 < t.indexOf(e);
      })
    );
  }
  function applyRateLimit(e, t, n, r) {
    if (!e.config.enableRateConfig) return n(t);
    var i = e.rateLimitConfigs;
    i
      ? r === SendType.LOG && Array.isArray(t)
        ? (e = t.filter(function (e) {
            e = getLimitName(r, e.level);
            return samplePercentage(i[e]);
          })).length && n(e)
        : ((e = getLimitName(r)), samplePercentage(i[e]) && n(t))
      : n(t);
  }
  function createBatchStage(n, r) {
    var i;
    var o = [];
    var a = n.config;
    n.lifeCycle.on("destroy", function () {
      o.length = 0;
    });
    return function (e, t) {
      Array.isArray(e) ? (o = o.concat(e)) : o.push(e);
      (r && o.length >= r) || (n.sendNow && 0 < o.length)
        ? ((o = deduplicateResources(o)),
          0 < (o = Array.isArray(o) ? o : []).length &&
            t(o.splice(0, o.length)),
          i && clearTimeout(i))
        : (i && clearTimeout(i),
          (i = setTimeout(function () {
            i = null;
            o = deduplicateResources(o);
            0 < (o = Array.isArray(o) ? o : []).length &&
              t(o.splice(0, o.length));
          }, a.delay)));
    };
  }
  function normalizeLogs(e, t) {
    return Array.isArray(e)
      ? t(
          e.map(function (e) {
            t = assign(assign({}, e), {
              msg:
                "string" == typeof e.msg
                  ? e.msg
                  : [].concat(e.msg).map(stringifyLog).join(" "),
            });
            optionalLogFields.forEach(function (e) {
              t[e] || delete t[e];
            });
            return t;
            var t;
          }),
        )
      : t([
          assign(assign({}, e), {
            msg: "string" == typeof e.msg ? e.msg : stringifyLog(e.msg),
          }),
        ]);
  }
  function createPageGroupingStage(l, c) {
    return function (i, o) {
      var a;
      var s;
      var e;
      var t;
      var n;
      null != i && i.log && null != i && i.type
        ? ((a = function (e, t, n) {
            switch (t) {
              case SendType.LOG:
                return serializeLogColumns(stripLogContext(e));
              case SendType.SPEED:
                var r = e,
                  i = n;
                i =
                  i && "undefined" !== i
                    ? assign(assign({}, l.bean), {
                        from: i,
                      })
                    : assign({}, l.bean);
                return stringifyJSON(createSpeedPayload(r, i));
              case SendType.EVENT:
                return stringifyJSON({
                  payload: stringifyJSON(Array.isArray(e) ? e : [e]),
                });
              case SendType.CUSTOM:
                return stringifyJSON({
                  payload: stringifyJSON({
                    custom: Array.isArray(e) ? e : [e],
                  }),
                });
              default:
                return {};
            }
          }),
          1 !== (e = Array.isArray(i.log) ? i.log : [i.log]).length
            ? ((s = {}),
              e.forEach(function (e) {
                var t = e.from || "undefined";
                delete e.from;
                s[t] || (s[t] = []);
                s[t].push(e);
              }),
              Object.keys(s).forEach(function (e) {
                var t;
                var n = s[e];
                var r = null != (r = i.url) && r.includes("?") ? "&" : "?";
                "undefined" === e
                  ? ((t = "" + i.url),
                    o(
                      assign(assign({}, i), {
                        url: t,
                        log: 1 === n.length ? n[0] : n,
                        data: a(n, c, ""),
                      }),
                    ))
                  : ((t = i.url + r + "from=" + e),
                    o(
                      assign(assign({}, i), {
                        url: t,
                        log: 1 === n.length ? n[0] : n,
                        beanFilter: concatArrays(i.beanFilter || [], ["from"]),
                        data: a(n, c, e),
                      }),
                    ));
              }))
            : ((t = (e = e[0]).from),
              delete e.from,
              (n = null != (n = i.url) && n.includes("?") ? "&" : "?"),
              t
                ? ((n = i.url + n + "from=" + t),
                  o(
                    assign(assign({}, i), {
                      url: n,
                      log: e,
                      beanFilter: concatArrays(i.beanFilter || [], ["from"]),
                      data: a(e, c, t),
                    }),
                  ))
                : ((n = "" + i.url),
                  o(
                    assign(assign({}, i), {
                      url: n,
                      log: e,
                      data: a(e, c, ""),
                    }),
                  ))))
        : o(i);
    };
  }
  function createBeforeRequestStage(l, c) {
    return function (e, t) {
      var n;
      var r;
      var i;
      var o = Array.isArray(e);
      var a = o ? e : [e];
      var s = (l.lifeCycle.emit("beforeRequest", e), l.config.beforeRequest);
      (a =
        "function" == typeof s
          ? a
              .map(function (t) {
                try {
                  var e = s({
                    logs: t,
                    logType: c,
                  });
                  return (null == e ? void 0 : e.logType) === c &&
                    null != e &&
                    e.logs
                    ? e.logs
                    : !1 !== e && t;
                } catch (e) {
                  return t;
                }
              })
              .filter(function (e) {
                return !1 !== e;
              })
          : a).length &&
        ((n = a),
        (e = optionalLogFields),
        !Array.isArray(n) ||
          n.length <= 1 ||
          ((r = []), (i = []), !(i = "string" == typeof e ? [e] : e)) ||
          i.length <= 0 ||
          (i.forEach(function (t) {
            n.forEach(function (e) {
              null != e && e[t] && r.push(t);
            });
          }),
          0 < r.length &&
            (n = n.map(function (e) {
              var t = {};
              r.forEach(function (e) {
                t[e] = "";
              });
              return assign(assign({}, t), e);
            }))),
        (a = n),
        t(o ? a : a[0]));
    };
  }
  function createModifyRequestStage(i) {
    return function (e, t) {
      i.lifeCycle.emit("modifyRequest", e);
      var n = i.config.modifyRequest;
      if ("function" == typeof n)
        try {
          var r = n(e);
          "object" == typeof r && "url" in r && (e = r);
        } catch (e) {
          console.error(e);
        }
      t(e);
    };
  }
  function createAfterRequestStage(r) {
    return function (e, t) {
      null != (n = r.lifeCycle) && n.emit("afterRequest", e);
      var n = (r.config || {}).afterRequest;
      ("function" == typeof n && !1 === n(e)) || t(e);
    };
  }
  var assetContentTypes = [
    "application/xhtml+xml",
    "application/xml",
    "application/pdf",
    "application/pkcs12",
    "application/javascript",
    "application/x-javascript",
    "application/ecmascript",
    "application/vnd.mspowerpoint",
    "application/vnd.apple.mpegurl",
    "application/ogg",
    "text/css",
    "text/javascript",
    "image",
    "audio",
    "video",
    "video/mp2t",
  ];
  var assetExtensionPattern =
    /\.(json|js|css|jpg|jpeg|png|svg|apng|webp|gif|bmp|mp4|mp3|ts|mpeg|wav|webm|ogg|flv|m3u8|ttf|woff2|otf|eot|woff|html|htm|shtml|shtm|)$/i;
  var returnCodeKeys = ["ret", "retcode", "code", "errcode"];
  var createCircularReplacer = function () {
    var n = new WeakSet();
    return function (e, t) {
      if (t instanceof Error)
        return "Error.message: " + t.message + " \n  Error.stack: " + t.stack;
      if ("object" == typeof t && null !== t) {
        if (n.has(t)) return "[Circular " + (e || "root") + "]";
        n.add(t);
      }
      return t;
    };
  };
  var stringifyLog = function (e) {
    if ("string" == typeof e) return e;
    try {
      return e instanceof Error
        ? (
            JSON.stringify(e, createCircularReplacer(), 2) || "undefined"
          ).replace(/"/gim, "")
        : JSON.stringify(e, createCircularReplacer(), 2) || "undefined";
    } catch (e) {
      return (
        "error happen when aegis stringify: \n " + e.message + " \n " + e.stack
      );
    }
  };
  var stringifyJSON = function (e) {
    if ("string" == typeof e) return e;
    try {
      return JSON.stringify(e, createCircularReplacer()) || "undefined";
    } catch (e) {
      return (
        "error happen when aegis stringify: \n " + e.message + " \n " + e.stack
      );
    }
  };
  var stringifyLimited = function (n, r) {
    void 0 === r && (r = 3);
    var i;
    var o;
    var a;
    var s = "";
    return null === n
      ? "null"
      : (Array.isArray(n)
          ? ((s += "["),
            (i = n.length),
            n.forEach(function (e, t) {
              s =
                (s +=
                  "object" == typeof e && null !== e && 1 < r
                    ? stringifyLimited(e, r - 1)
                    : stringifyValue(e)) + (t === i - 1 ? "" : ",");
            }),
            (s += "]"))
          : n instanceof Object || "object" == typeof n
            ? ((s = "{"),
              (o = Object.keys(n)),
              (a = o.length),
              o.forEach(function (e, t) {
                "object" == typeof n[e] && null !== n[e] && 1 < r
                  ? (s += '"' + e + '":' + stringifyLimited(n[e], r - 1))
                  : (s += stringifyProperty(e, n[e]));
                s +=
                  t === a - 1 || (t < a - 1 && void 0 === n[o[t + 1]])
                    ? ""
                    : ",";
              }),
              (s += "}"))
            : (s += n),
        s);
  };
  var stringifyProperty = function (e, t) {
    var n = typeof t;
    var r = "";
    null === t
      ? (r += '"' + e + '": null')
      : "string" == n || "object" == n
        ? (r += '"' + e + '":"' + t + '"')
        : "function" == typeof t
          ? (r += '"' + e + '":"function ' + t.name + '"')
          : "symbol" == typeof t
            ? (r += '"' + e + '":"symbol"')
            : ("number" != typeof t && "boolean" != n) ||
              (r += '"' + e + '": ' + t);
    return r;
  };
  var stringifyValue = function (e) {
    var t = typeof e;
    return (
      "" +
      (null === e || "undefined" == t || "symbol" == t || "function" == t
        ? "null"
        : "string" == t || "object" == t
          ? '"' + e + '"'
          : e)
    );
  };
  var dataUrlPattern = /data:(image|text|application|font)\/.*;base64/;
  var sendTypeLimitNames =
    (((runtimeAlias = {})[SendType.LOG] = "log"),
    (runtimeAlias[SendType.MEMORY] = "log"),
    (runtimeAlias[SendType.SPEED] = "speed"),
    (runtimeAlias[SendType.PERFORMANCE] = "performance"),
    (runtimeAlias[SendType.VITALS] = "webvitals"),
    (runtimeAlias[SendType.PV] = "pv"),
    (runtimeAlias[SendType.EVENT] = "event"),
    (runtimeAlias[SendType.CUSTOM] = "custom"),
    (runtimeAlias[SendType.SET_DATA] = "miniProgramData"),
    (runtimeAlias[SendType.LOAD_PACKAGE] = "miniProgramData"),
    runtimeAlias);
  var errorLevelLimitNames =
    (((runtimeAlias = {})[LogLevel.ERROR] = "jsError"),
    (runtimeAlias[LogLevel.PROMISE_ERROR] = "jsError"),
    (runtimeAlias[LogLevel.BLANK_SCREEN] = "whiteScreen"),
    (runtimeAlias[LogLevel.SCRIPT_ERROR] = "assetsException"),
    (runtimeAlias[LogLevel.IMAGE_ERROR] = "assetsException"),
    (runtimeAlias[LogLevel.CSS_ERROR] = "assetsException"),
    (runtimeAlias[LogLevel.MEDIA_ERROR] = "assetsException"),
    runtimeAlias);
  var getLimitName = function (e, t) {
    return e === SendType.LOG && t && errorLevelLimitNames[t]
      ? errorLevelLimitNames[t]
      : sendTypeLimitNames[e] || "";
  };
  var samplePercentage = function (e) {
    return null == e || (!(e <= 0) && (100 <= e || 100 * Math.random() < e));
  };
  var deduplicateResources = function (e) {
    return e.filter(function (n, r) {
      return (
        "static" !== n.type ||
        !e.find(function (e, t) {
          return n.url === e.url && 200 === n.status && r < t;
        })
      );
    });
  };
  var normalizeInfoAll = function (e) {
    e.level === LogLevel.INFO_ALL && (e.level = LogLevel.INFO);
  };
  var repeatResetTimers = {};
  var repeatCounts = {};
  var scheduleRepeatReset = function (e) {
    repeatResetTimers[e] ||
      (repeatResetTimers[e] = setTimeout(function () {
        repeatCounts[e] = {};
        repeatResetTimers[e] = null;
      }, 6e4));
    return repeatResetTimers[e];
  };
  var stripLogContext = function (e) {
    return (Array.isArray(e) ? e : [e]).map(function (n) {
      return Object.getOwnPropertyNames(n).reduce(
        function (e, t) {
          "ctx" !== t && (e[t] = n[t]);
          return e;
        },
        {
          level: LogLevel.INFO,
          msg: "",
        },
      );
    });
  };
  var createLogSender = function (r) {
    return function (e) {
      return r.sendPipeline(
        [
          function (e, n) {
            return n({
              url: r.config.url || "",
              data: serializeLogColumns(stripLogContext(e)),
              method: "post",
              contentType: "application/json",
              type: SendType.LOG,
              log: e,
              requestConfig: {
                timeout: 5e3,
              },
              success: function () {
                var t = r.config.onReport;
                "function" == typeof t &&
                  e.forEach(function (e) {
                    t(e);
                  });
                "function" == typeof n && n([]);
              },
            });
          },
        ],
        SendType.LOG,
      )(e);
    };
  };
  var traceIdGenerators = {
    generateTraceId: createHexIdGenerator(16),
    generateSpanId: createHexIdGenerator(8),
  };
  var traceIdBuffer = Array(32);
  function createHexIdGenerator(t) {
    return function () {
      for (var e = 0; e < 2 * t; e++) {
        traceIdBuffer[e] = Math.floor(16 * Math.random()) + 48;
        58 <= traceIdBuffer[e] && (traceIdBuffer[e] += 39);
      }
      return String.fromCharCode.apply(null, traceIdBuffer.slice(0, 2 * t));
    };
  }
  function createSessionId() {
    return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, function (e) {
      return (e ^ (((16 * Math.random()) & 15) >> (e / 4))).toString(16);
    });
  }
  function createAnonymousId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (e) {
        var t = (16 * Math.random()) | 0;
        return ("x" === e ? t : (3 & t) | 8).toString(16);
      },
    );
  }
  function encodeBase64(e) {
    for (
      var t, n, r, i = "", o = 0, a = (e = String(e)).length % 3;
      o < e.length;
    ) {
      if (
        255 < (t = e.charCodeAt(o++)) ||
        255 < (n = e.charCodeAt(o++)) ||
        255 < (r = e.charCodeAt(o++))
      )
        throw new TypeError(
          "Failed to execute 'btoa': The string to be encoded contains characters outside of the Latin1 range.",
        );
      i +=
        base64Alphabet.charAt(((t = (t << 16) | (n << 8) | r) >> 18) & 63) +
        base64Alphabet.charAt((t >> 12) & 63) +
        base64Alphabet.charAt((t >> 6) & 63) +
        base64Alphabet.charAt(63 & t);
    }
    return a ? i.slice(0, a - 3) + "===".substring(a) : i;
  }
  function decodeBase64(e) {
    if (((e = String(e).replace(/[\t\n\f\r ]+/g, "")), !base64Pattern.test(e)))
      throw new TypeError(
        "Failed to execute 'atob': The string to be decoded is not correctly encoded.",
      );
    var t;
    e += "==".slice(2 - (3 & e.length));
    for (var n, r, i = "", o = 0; o < e.length;) {
      t =
        (base64Alphabet.indexOf(e.charAt(o++)) << 18) |
        (base64Alphabet.indexOf(e.charAt(o++)) << 12) |
        ((n = base64Alphabet.indexOf(e.charAt(o++))) << 6) |
        (r = base64Alphabet.indexOf(e.charAt(o++)));
      i +=
        64 === n
          ? String.fromCharCode((t >> 16) & 255)
          : 64 === r
            ? String.fromCharCode((t >> 16) & 255, (t >> 8) & 255)
            : String.fromCharCode((t >> 16) & 255, (t >> 8) & 255, 255 & t);
    }
    return i;
  }
  function readTraceId(e) {
    var t;
    var n = "";
    return (n =
      "object" == typeof e &&
      (t = (e = ((e, t) => {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          var i = e[r] || ("function" == typeof e.get && e.get(r));
          if (i) return [r, i];
        }
        return ["", ""];
      })(e, Object.keys(traceDecoders)))[0])
        ? traceDecoders[t](e[1])
        : n);
  }
  function composePipeline(n) {
    if (n && n.reduce && n.length)
      return 1 === n.length
        ? function (e, t) {
            n[0](e, t || noop);
          }
        : n.reduce(function (n, r) {
            return function (e, t) {
              void 0 === t && (t = noop);
              return n(e, function (e) {
                return null == r ? void 0 : r(e, t);
              });
            };
          });
    throw new TypeError("createPipeline need at least one function param");
  }
  function disableMethods(n, r) {
    Object.getOwnPropertyNames(n).forEach(function (e) {
      var t;
      "constructor" === e ||
        !(t = Object.getOwnPropertyDescriptor(n, e)) ||
        t.get ||
        t.set ||
        ("function" == typeof t.value &&
          (r
            ? (r[e] =
                "sendPipeline" === e
                  ? function () {
                      return function () {};
                    }
                  : function () {})
            : (n[e] = function () {})));
    });
  }
  var base64Alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var base64Pattern =
    /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  var TraceHeaders =
    ((TraceHeaderGenerator.prototype.generate = function (e, t, n) {
      if (
        (void 0 === t && (t = {}),
        (this.url = e),
        !this.isUrlIgnored() && this.isUrlInTraceUrls() && this.traceType)
      ) {
        switch (this.traceType) {
          case "traceparent":
            this.traceId = this.createTraceparent();
            break;
          case "b3":
            this.traceId = this.createB3();
            break;
          case "sw8":
            this.traceId = this.createSw8(n);
            break;
          case "sentry-trace":
            this.traceId = this.createSentryTrace();
            break;
          default:
            console.warn(
              "this trace key " + this.traceType + " is not supported",
            );
            return void (this.traceId = "");
        }
        t[this.traceType] && (this.traceId = t[this.traceType]);
        return {
          name: this.traceType,
          value: this.traceId,
        };
      }
    }),
    (TraceHeaderGenerator.prototype.createTraceparent = function () {
      var e = traceIdGenerators.generateSpanId();
      return (
        "00-" +
        traceIdGenerators.generateTraceId() +
        "-" +
        e +
        "-0" +
        this.traceFlag.toString(16)
      );
    }),
    (TraceHeaderGenerator.prototype.createB3 = function () {
      var e = traceIdGenerators.generateSpanId();
      return (
        traceIdGenerators.generateTraceId() + "-" + e + "-" + this.traceFlag
      );
    }),
    (TraceHeaderGenerator.prototype.createSw8 = function (e) {
      var t = "function" == typeof btoa ? btoa : encodeBase64;
      var e = e || {};
      var n = e.host;
      var n = void 0 === n ? "" : n;
      var e = e.pathname;
      var e = void 0 === e ? "" : e;
      var r = createAnonymousId();
      var i = createAnonymousId();
      return (
        "1-" +
        String(t(i)) +
        "-" +
        String(t(r)) +
        "-1-" +
        String(t("aegis")) +
        "-" +
        String(t("1.43.60")) +
        "-" +
        String(t(encodeURI(e))) +
        "-" +
        String(t(n))
      );
    }),
    (TraceHeaderGenerator.prototype.createSentryTrace = function () {
      var e = createSessionId().substring(16);
      return createSessionId() + "-" + e + "-" + this.traceFlag;
    }),
    (TraceHeaderGenerator.prototype.isUrlIgnored = function () {
      if (Array.isArray(this.ignoreUrls) && 0 !== this.ignoreUrls.length)
        for (var e = 0, t = this.ignoreUrls; e < t.length; e++) {
          var n = t[e];
          if (this.urlMatches(this.url, n)) return !0;
        }
      return !1;
    }),
    (TraceHeaderGenerator.prototype.isUrlInTraceUrls = function () {
      if (!this.urls) return !0;
      if (Array.isArray(this.urls)) {
        if (0 === this.urls.length) return !1;
        for (var e = 0, t = this.urls; e < t.length; e++) {
          var n = t[e];
          if (this.urlMatches(this.url, n)) return !0;
        }
      }
      return !1;
    }),
    (TraceHeaderGenerator.prototype.urlMatches = function (e, t) {
      return "string" == typeof t ? e === t : !!e.match(t);
    }),
    TraceHeaderGenerator);
  var traceDecoders = {
    sw8: function (e) {
      var t = "function" == typeof atob ? atob : decodeBase64;
      var e = e.split("-")[1];
      return e ? t(e) : "";
    },
    traceparent: function (e) {
      return e.split("-")[1];
    },
    b3: function (e) {
      return e.split("-")[0];
    },
    "sentry-trace": function (e) {
      return e.split("-")[0];
    },
  };
  var noop = function () {};
  function TraceHeaderGenerator(e, t, n, r) {
    void 0 === n && (n = null);
    this.traceType = e;
    this.ignoreUrls = t;
    this.urls = n;
    this.traceFlag = null == r ? 1 : Number(!!r);
  }
  function getContentEncoding(e, t) {
    return e ? (t ? "gzip" : "identity") : null;
  }
  function hasPerformanceTiming() {
    return (
      void 0 !== window.performance &&
      "function" == typeof performance.getEntriesByType &&
      "function" == typeof performance.now
    );
  }
  function supportsPerformanceEntry(e) {
    var t;
    return (
      -1 <
      (null ==
      (t =
        null == (t = window.PerformanceObserver)
          ? void 0
          : t.supportedEntryTypes)
        ? void 0
        : t.indexOf(e))
    );
  }
  function userAgentIncludes(e) {
    return -1 !== userAgent.indexOf(e);
  }
  MonitorCore.use = function (e) {
    -1 === MonitorCore.installedPlugins.indexOf(e) &&
      e.aegisPlugin &&
      MonitorCore.installedPlugins.push(e);
  };
  MonitorCore.unuse = function (e) {
    e = MonitorCore.installedPlugins.indexOf(e);
    -1 !== e && MonitorCore.installedPlugins.splice(e, 1);
  };
  MonitorCore.prototype.init = function (e) {
    var a;
    var n;
    var r;
    var i;
    var o;
    var s;
    var l;
    var c;
    var u;
    var d;
    this.setConfig(e);
    this.config =
      ((d = this.config),
      (e = e.hostUrl),
      (d.url =
        (e =
          "string" != typeof (e = void 0 === e ? DEFAULT_HOST_URL : e)
            ? DEFAULT_HOST_URL
            : e) + "/collect"),
      (d.offlineUrl = e + "/offline"),
      (d.whiteListUrl = e + "/collect/whitelist"),
      (d.rateLimitUrl = e + "/rateConfig"),
      (d.pvUrl = e + "/collect/pv"),
      (d.eventUrl = e + "/collect/events"),
      (d.speedUrl = e + "/speed"),
      (d.customTimeUrl = e + "/speed/custom"),
      (d.performanceUrl = e + "/speed/performance"),
      (d.performanceUrlForHippy = e + "/speed/hippyPerformance"),
      (d.webVitalsUrl = e + "/speed/webvitals"),
      (d.setDataReportUrl = e + "/speed/miniProgramData"),
      (d.memoryUrl = e + "/memory"),
      d);
    this.resetWhitelistGzipState();
    installRateConfig(this, applyRateLimit);
    for (var f = 0; f < MonitorCore.installedPlugins.length; f++)
      try {
        MonitorCore.installedPlugins[f].patch(this);
      } catch (e) {
        this.sendSDKError(e);
      }
    this.lifeCycle.emit("onInited");
  };
  MonitorCore.prototype.destroy = function (e) {
    void 0 === e && (e = !1);
    var t;
    var n;
    var r = MonitorCore.instances.indexOf(this);
    -1 !== r && MonitorCore.instances.splice(r, 1);
    for (var i = MonitorCore.installedPlugins.length - 1; 0 <= i; i--)
      try {
        MonitorCore.installedPlugins[i].unpatch(this);
      } catch (e) {
        this.sendSDKError(e);
      }
    if ((this.lifeCycle.emit("destroy"), this.lifeCycle.clear(), e)) {
      t = this;
      n = Object.getOwnPropertyDescriptors(t);
      Object.keys(n).forEach(function (e) {
        n[e].writable && (t[e] = null);
      });
      Object.setPrototypeOf(this, null);
    } else {
      for (
        var o = this;
        o.constructor !== Object && disableMethods(o, this),
          (o = Object.getPrototypeOf(o));
      );
      0 === MonitorCore.instances.length &&
        ((r = Object.getPrototypeOf(this).constructor),
        disableMethods(r),
        disableMethods(MonitorCore));
    }
  };
  MonitorCore.prototype.setConfig = function (e) {
    const patch = e;
    Object.assign(this.config, e);
    var e = this.config;
    var t = e.id;
    var n = e.uin;
    var r = e.version;
    var i = e.ext1;
    var o = e.ext2;
    var a = e.ext3;
    var s = e.aid;
    var l = e.env;
    var c = void 0 === l ? "production" : l;
    var l = e.pageUrl;
    var e = this.bean.id !== t || this.bean.uin !== n || this.bean.aid !== s;
    this.bean.id = t || "";
    this.bean.uin = n || "";
    this.bean.version = r || "1.43.60";
    this.bean.aid = s || "";
    this.bean.env = (() => {
      switch (c) {
        case Environment.production:
        case Environment.development:
        case Environment.gray:
        case Environment.pre:
        case Environment.daily:
        case Environment.local:
        case Environment.test:
        case Environment.others:
          return 1;
        default:
          return;
      }
    })()
      ? c
      : Environment.others;
    l && this.extendBean("from", encodeURIComponent(l.slice(0, 2048)));
    i && this.extendBean("ext1", encodeURIComponent(i));
    o && this.extendBean("ext2", encodeURIComponent(o));
    a && this.extendBean("ext3", encodeURIComponent(a));
    this.lifeCycle.emit("_controlConfigUpdate", patch);
    e && this.lifeCycle.emit("onConfigChange", this.config);
    return this.config;
  };
  MonitorCore.prototype.extendBean = function (e, t) {
    this.bean[e] = t;
  };
  MonitorCore.prototype.resetWhitelistGzipState = function () {
    this.whitelistUseGzip = !0;
    this.whitelistUseGzipReady = !0;
  };
  MonitorCore.prototype.updateWhitelistGzipState = function (e) {
    this.whitelistUseGzip = null == e || "" === e || 1 === Number(e);
    this.whitelistUseGzipReady = !0;
  };
  MonitorCore.prototype.disableWhitelistGzipState = function () {
    this.whitelistUseGzip = !1;
    this.whitelistUseGzipReady = !0;
  };
  MonitorCore.prototype.isGzipReportEnabled = function (e) {
    return (
      !!e &&
      (!this.config.enableWhitelist ||
        !this.config.whiteListUrl ||
        (this.whitelistUseGzipReady && this.whitelistUseGzip))
    );
  };
  MonitorCore.prototype.send = function (e, i, o) {
    var t = this;
    return composePipeline([
      createModifyRequestStage(this),
      createPageGroupingStage(this, null == e ? void 0 : e.type),
      function (n, r) {
        t.request(
          n,
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            r({
              isErr: !1,
              result: e,
              logType: n.type,
              logs: n.log,
            });
            null != i && i.apply(void 0, e);
          },
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            r({
              isErr: !0,
              result: e,
              logType: n.type,
              logs: n.log,
            });
            null != o && o.apply(void 0, e);
          },
        );
      },
      createAfterRequestStage(this),
    ])(e);
  };
  MonitorCore.prototype.sendSDKError = function (e) {
    var n = this;
    this.sendPipeline(
      [
        function (e, t) {
          t({
            url:
              n.config.url +
              "?id=1085&msg[0]=" +
              encodeURIComponent(stringifyLog(e)) +
              "&level[0]=2&from=" +
              n.config.id +
              "&count=1&version=" +
              n.config.id +
              "(1.43.60)",
            addBean: !1,
            method: "get",
            type: SendType.SDK_ERROR,
            log: e,
          });
        },
      ],
      SendType.SDK_ERROR,
    )(e);
  };
  MonitorCore.prototype.sendPipeline = function (e, t) {
    var n;
    var r;
    var i;
    var o = this;
    return composePipeline(
      concatArrays(
        [
          function (e, t) {
            if (
              ("number" != typeof n.config.random &&
                (console.warn("random must in [0, 1], default is 1."),
                (n.config.random = 1)),
              !n.isHidden || !n.isGetSample)
            )
              if (n.isGetSample) n.isHidden || t(e);
              else {
                if (((n.isGetSample = !0), Math.random() < n.config.random)) {
                  n.isHidden = !1;
                  return t(e);
                }
                n.isHidden = !0;
              }
          },
          function (e, t) {
            if (i !== SendType.SDK_ERROR && i !== SendType.WHITE_LIST)
              return !r.config.enableRateConfig || r.rateLimitReady
                ? void applyRateLimit(r, e, t, i)
                : (r.rateLimitPool || (r.rateLimitPool = []),
                  void (
                    r.rateLimitPool.length < 200 &&
                    r.rateLimitPool.push({
                      logs: e,
                      resolve: t,
                      sendType: i,
                    })
                  ));
            t(e);
          },
          createBeforeRequestStage((r = n = this), (i = t)),
        ],
        e,
        [
          createPageGroupingStage(this, t),
          createModifyRequestStage(this),
          function (e, t) {
            var n;
            e.url &&
              o.config.enableRateConfig &&
              o.rateLimitSampled &&
              ((n = -1 === e.url.indexOf("?") ? "?" : "&"),
              (e.url = e.url + n + "sampled=1"));
            t(e);
          },
          function (r, i) {
            o.request(
              r,
              function () {
                for (var e = [], t = 0; t < arguments.length; t++)
                  e[t] = arguments[t];
                var n = !1;
                -1 <
                  ("" + e[(o.failRequestCount = 0)]).indexOf("403 forbidden") &&
                  ((n = !0), o.destroy());
                i({
                  isErr: n,
                  result: e,
                  logType: null == r ? void 0 : r.type,
                  logs: null == r ? void 0 : r.log,
                });
                null != (n = null == r ? void 0 : r.success) &&
                  n.call.apply(n, concatArrays([r], e));
              },
              function () {
                for (var e, t = [], n = 0; n < arguments.length; n++)
                  t[n] = arguments[n];
                60 <= ++o.failRequestCount && o.destroy();
                -1 < ("" + t[0]).indexOf("403 forbidden") && o.destroy();
                i({
                  isErr: !0,
                  result: t,
                  logType: null == r ? void 0 : r.type,
                  logs: null == r ? void 0 : r.log,
                });
                null != (e = null == r ? void 0 : r.fail) &&
                  e.call.apply(e, concatArrays([r], t));
              },
            );
          },
          createAfterRequestStage(this),
        ],
      ),
    );
  };
  MonitorCore.prototype.validateRange = function (e) {
    return 0 <= e && e <= 127 ? e : -1;
  };
  MonitorCore.prototype.info = function () {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    var n = {
      level: LogLevel.INFO,
      msg: e,
      originFrom: this.getOriginFrom(),
    };
    1 === e.length &&
      e[0].msg &&
      Object.assign(n, assign({}, e[0]), {
        level: LogLevel.INFO,
        originFrom: this.getOriginFrom(),
      });
    this.normalLogPipeline(n);
  };
  MonitorCore.prototype.infoAll = function () {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    var n = {
      level: LogLevel.INFO_ALL,
      msg: e,
      originFrom: this.getOriginFrom(),
    };
    1 === e.length &&
      e[0].msg &&
      Object.assign(n, assign({}, e[0]), {
        level: LogLevel.INFO_ALL,
        originFrom: this.getOriginFrom(),
      });
    this.normalLogPipeline(n);
  };
  MonitorCore.prototype.report = function () {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    var n = {
      level: LogLevel.REPORT,
      msg: e,
      originFrom: this.getOriginFrom(),
    };
    1 === e.length &&
      e[0].msg &&
      Object.assign(n, assign({}, e[0]), {
        originFrom: this.getOriginFrom(),
      });
    this.normalLogPipeline(n);
  };
  MonitorCore.prototype.error = function () {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    var n = {
      level: LogLevel.ERROR,
      msg: e,
      originFrom: this.getOriginFrom(),
    };
    1 === e.length &&
      e[0].msg &&
      Object.assign(n, assign({}, e[0]), {
        level: LogLevel.ERROR,
        originFrom: this.getOriginFrom(),
      });
    this.normalLogPipeline(n);
  };
  MonitorCore.prototype.reportEvent = function (e) {
    e &&
      ((e =
        "string" == typeof e
          ? {
              name: e,
              ext1: this.config.ext1 || "",
              ext2: this.config.ext2 || "",
              ext3: this.config.ext3 || "",
              originFrom: this.getOriginFrom(),
            }
          : assign(assign({}, e), {
              originFrom: e.originFrom || this.getOriginFrom(),
            })).name
        ? ("string" != typeof e.name &&
            (console.warn("reportEvent params name must be string"),
            (e.name = String(e.name))),
          this.eventPipeline(e))
        : console.warn("reportEvent params error"));
  };
  MonitorCore.prototype.reportT = function (e) {
    var t = e.name;
    var n = e.duration;
    var r = e.ext1;
    var r = void 0 === r ? "" : r;
    var i = e.ext2;
    var i = void 0 === i ? "" : i;
    var o = e.ext3;
    var o = void 0 === o ? "" : o;
    var a = e.ext4;
    var s = e.ext5;
    var l = e.ext6;
    var c = e.ext7;
    var u = e.ext8;
    var d = e.ext9;
    var f = e.ext10;
    var e = e.from;
    if (
      "string" == typeof t &&
      "number" == typeof n &&
      "string" == typeof r &&
      "string" == typeof i &&
      "string" == typeof o
    ) {
      if (!(n < 0 || 2147483646 < n))
        return this.submitCustomTime(
          t,
          n,
          r,
          i,
          o,
          void 0 === a ? "" : a,
          void 0 === s ? "" : s,
          void 0 === l ? "" : l,
          void 0 === c ? "" : c,
          void 0 === u ? "" : u,
          void 0 === d ? "" : d,
          void 0 === f ? "" : f,
          void 0 === e ? "" : e,
        );
      console.warn("reportTime: duration must between 0 and 2147483646");
    } else console.warn("reportTime: params error");
  };
  MonitorCore.prototype.reportTime = function (e, t) {
    if ("object" == typeof e) return this.reportT(e);
    "string" == typeof e
      ? "number" == typeof t
        ? t < 0 || 2147483646 < t
          ? console.warn("reportTime: duration must between 0 and 2147483646")
          : (this.submitCustomTime(e, t),
            this.normalLogPipeline({
              level: LogLevel.SPEED_EVENT,
              msg: "key:" + e + "\\n duration:" + t,
              errorMsg: "",
              originFrom: this.getOriginFrom(),
            }))
        : console.warn("reportTime: second param must be number")
      : console.warn("reportTime: first param must be a string");
  };
  MonitorCore.prototype.time = function (e) {
    "string" == typeof e
      ? this.timeMap[e]
        ? console.warn("Timer " + e + " already exists")
        : (this.timeMap[e] = Date.now())
      : console.warn("time: first param must be a string");
  };
  MonitorCore.prototype.timeEnd = function (e) {
    var t;
    "object" != typeof e || null === e
      ? "string" == typeof e
        ? void 0 !== (t = this.getTimeEventDuration(e))
          ? (this.submitCustomTime(e, t), delete this.timeMap[e])
          : console.warn("Timer " + e + " does not exist")
        : console.warn("timeEnd: first param must be a string")
      : void 0 !== (t = this.getTimeEventDuration(e.name))
        ? (this.reportT(
            assign(assign({}, e), {
              duration: t,
            }),
          ),
          delete this.timeMap[e.name])
        : console.warn("Timer " + e.name + " does not exist");
  };
  MonitorCore.prototype.ready = function (e, t, n) {
    throw new Error('You need to override "ready" method');
  };
  MonitorCore.prototype.request = function (e, t, n) {
    throw new Error('You need to override "request" method');
  };
  MonitorCore.prototype.speedLogPipeline = function (e) {
    throw new Error('You need to override "speedLogPipeline" method');
  };
  MonitorCore.prototype.getOriginFrom = function () {
    throw new Error('You need to override "getOriginFrom" method');
  };
  Object.defineProperty(MonitorCore.prototype, "__version__", {
    get: function () {
      return "1.43.60";
    },
    enumerable: !1,
    configurable: !0,
  });
  Object.defineProperty(MonitorCore.prototype, "LogType", {
    get: function () {
      return LogLevel;
    },
    enumerable: !1,
    configurable: !0,
  });
  MonitorCore.prototype.reportPv = function (e) {
    e && console.warn("reportPv is deprecated, please use reportEvent");
  };
  MonitorCore.prototype.submitCustomTime = function (
    e,
    t,
    n,
    r,
    i,
    o,
    a,
    s,
    l,
    c,
    u,
    d,
    f,
  ) {
    e = {
      name: e,
      duration: t,
      ext1: String(n || this.config.ext1 || "").slice(0, 1024),
      ext2: String(r || this.config.ext2 || "").slice(0, 1024),
      ext3: String(i || this.config.ext3 || "").slice(0, 1024),
      ext4: o || this.config.ext4,
      ext5: a || this.config.ext5,
      ext6: s || this.config.ext6,
      ext7: l || this.config.ext7,
      ext8: c || this.config.ext8,
      ext9: u || this.config.ext9,
      ext10: d || this.config.ext10,
      from: f || void 0,
    };
    this.customTimePipeline(e);
  };
  MonitorCore.prototype.getTimeEventDuration = function (e) {
    if (void 0 !== e && this.timeMap[e]) return Date.now() - this.timeMap[e];
  };
  MonitorCore.version = "1.43.60";
  MonitorCore.instances = [];
  MonitorCore.logType = LogLevel;
  MonitorCore.environment = Environment;
  MonitorCore.installedPlugins = [];
  var runtimeAlias = MonitorCore;
  var pluginConstructor =
    ((MonitorPlugin.prototype.patch = function (e) {
      this.canUse(e) &&
        this.exist(e) &&
        (this.instances.push(e),
        this.triggerInit(e),
        this.triggerOnNewAegis(e));
    }),
    (MonitorPlugin.prototype.unpatch = function (e) {
      var t = this.instances.indexOf(e);
      -1 !== t &&
        (this.instances.splice(t, 1), 0 === this.instances.length) &&
        this.uninstall(e);
    }),
    (MonitorPlugin.prototype.countInstance = function () {
      return this.instances.length;
    }),
    (MonitorPlugin.prototype.uninstall = function (e) {
      var t;
      null != (t = null == (t = this.option) ? void 0 : t.destroy) &&
        t.apply(this, [e]);
    }),
    (MonitorPlugin.prototype.walk = function (n) {
      var r = this;
      this.instances.forEach(function (e) {
        var t = r.canUse(e);
        t && n(e, t);
      });
    }),
    (MonitorPlugin.prototype.canUse = function (e) {
      e = this.getConfig(e);
      return !(!e || "object" != typeof e) || !!e;
    }),
    (MonitorPlugin.prototype.getConfig = function (e) {
      return null == (e = e.config) ? void 0 : e[this.name];
    }),
    (MonitorPlugin.prototype.exist = function (e) {
      return -1 === this.instances.indexOf(e);
    }),
    (MonitorPlugin.prototype.triggerInit = function (e) {
      var t;
      this.inited ||
        ((this.inited = !0),
        null == (t = null == (t = this.option) ? void 0 : t.init)) ||
        t.call(this.option, this.getConfig(e));
    }),
    (MonitorPlugin.prototype.triggerOnNewAegis = function (e) {
      var t;
      null != (t = null == (t = this.option) ? void 0 : t.onNewAegis) &&
        t.call(this.option, e, this.getConfig(e));
    }),
    MonitorPlugin);
  var anonymousIdPlugin = new pluginConstructor(
    createAidOptions({
      get createAnonymousId() {
        return createAnonymousId;
      },
      set createAnonymousId(value) {
        createAnonymousId = value;
      },
    }),
  );
  var assetPluginAlias = new pluginConstructor({
    name: "reportAssetSpeed",
  });
  var assetSpeedPlugin = (assetPluginAlias = new pluginConstructor(
    createReportAssetSpeedOptions({
      get assetPluginAlias() {
        return assetPluginAlias;
      },
      set assetPluginAlias(value) {
        assetPluginAlias = value;
      },
      get hasPerformanceTiming() {
        return hasPerformanceTiming;
      },
      set hasPerformanceTiming(value) {
        hasPerformanceTiming = value;
      },
      get isHttps() {
        return isHttps;
      },
      set isHttps(value) {
        isHttps = value;
      },
      get isIgnoredUrl() {
        return isIgnoredUrl;
      },
      set isIgnoredUrl(value) {
        isIgnoredUrl = value;
      },
      get sanitizeUrl() {
        return sanitizeUrl;
      },
      set sanitizeUrl(value) {
        sanitizeUrl = value;
      },
      get splitUrlQuery() {
        return splitUrlQuery;
      },
      set splitUrlQuery(value) {
        splitUrlQuery = value;
      },
      get toPrimitive() {
        return toPrimitive;
      },
      set toPrimitive(value) {
        toPrimitive = value;
      },
    }),
  ));
  var userAgent = window.navigator.userAgent.toLowerCase();
  var deviceDetection = {};
  function MonitorPlugin(e) {
    this.aegisPlugin = !0;
    this.name = "";
    this.instances = [];
    this.inited = !1;
    e.$walk = this.walk.bind(this);
    e.$getConfig = this.getConfig.bind(this);
    this.option = e;
    this.name = e.name;
  }
  function MonitorCore(e) {
    var n;
    var r;
    var i;
    var a;
    var t;
    var s;
    var l;
    var o;
    var c;
    var u;
    var d;
    var f;
    var h;
    var p = this;
    this.isGetSample = !1;
    this.isHidden = !1;
    this.config = {
      version: 0,
      delay: 1e3,
      onError: !0,
      repeat: 60,
      random: 1,
      aid: !0,
      device: !0,
      pagePerformance: !0,
      webVitals: !0,
      speedSample: !0,
      onClose: !0,
      reportLoadPackageSpeed: !0,
      hostUrl: DEFAULT_HOST_URL,
      enableWhitelist: false,
      enableRateConfig: false,
      env: "production",
      url: "",
      offlineUrl: "",
      whiteListUrl: "",
      rateLimitUrl: "",
      pvUrl: "",
      speedUrl: "",
      customTimeUrl: "",
      performanceUrl: "",
      performanceUrlForHippy: "",
      webVitalsUrl: "",
      eventUrl: "",
      setDataReportUrl: "",
      memoryUrl: "",
      reportImmediately: !0,
      gzip: !0,
    };
    this.isWhiteList = !1;
    this.whitelistUseGzip = !0;
    this.whitelistUseGzipReady = !1;
    this.lifeCycle = new Lifecycle();
    this.bean = {};
    this.rateLimitConfigs = null;
    this.rateLimitReady = !1;
    this.rateLimitSampled = !1;
    this.rateLimitPool = [];
    this.normalLogPipeline = composePipeline([
      createBatchStage(this, 5),
      normalizeLogs,
      function (e, t) {
        var r = n.config;
        t(
          (e = e.map(function (e) {
            var t;
            var n = r.maxLength || 10240;
            try {
              if (!e.msg || e.msg.length <= n) return e;
              e.msg = null == (t = e.msg) ? void 0 : t.substring(0, n);
            } catch (t) {
              e.msg = stringifyLog(e.msg).substring(0, r.maxLength);
            }
            return e;
          })),
        );
      },
      ((h = (n = this).config),
      function (e, t) {
        var n = "number" == typeof h.repeat ? h.repeat : 60;
        if (n <= 0) return t(e);
        var r = (null == h ? void 0 : h.id) + "_error";
        var i = repeatCounts[r] || {};
        t(
          e.filter(function (e) {
            if (
              e.level === LogLevel.ERROR ||
              e.level === LogLevel.PROMISE_ERROR ||
              e.level === LogLevel.AJAX_ERROR ||
              e.level === LogLevel.SCRIPT_ERROR ||
              e.level === LogLevel.IMAGE_ERROR ||
              e.level === LogLevel.CSS_ERROR ||
              e.level === LogLevel.MEDIA_ERROR ||
              e.level === LogLevel.RET_ERROR ||
              e.level === LogLevel.BRIDGE_ERROR ||
              e.level === LogLevel.PAGE_NOT_FOUND_ERROR ||
              e.level === LogLevel.WEBSOCKET_ERROR ||
              e.level === LogLevel.LAZY_LOAD_ERROR
            ) {
              e = e.msg.slice(0, 200);
              if (i[e] > n) {
                repeatResetTimers[r] || scheduleRepeatReset(r);
                return !1;
              }
              i[e] = 1 + ~~i[e];
              repeatCounts[r] = i;
            }
            return !0;
          }),
        );
      }),
      ((d = this.lifeCycle.emit),
      (f = this.config),
      function (e, t) {
        var n;
        var r = f.logCreated;
        return "function" == typeof r
          ? ((n = e.filter(function (e) {
              return !1 !== r(e);
            })),
            d("beforeWrite", n),
            t(n))
          : (d("beforeWrite", e), t(e));
      }),
      ((u = this),
      setTimeout(function () {
        var e = u.config;
        var t = e.pvUrl;
        var i = void 0 === t ? "" : t;
        var t = e.spa;
        var e = -1 < ["web-sdk", "mp-sdk", "rn-sdk"].indexOf("web-sdk");
        i &&
          ((e && !t) || !e) &&
          u.sendPipeline(
            [
              function (e, t) {
                var n = u.getOriginFrom();
                var r = null != i && i.includes("?") ? "&" : "?";
                t({
                  url: n ? i + r + "originFrom=" + encodeURIComponent(n) : i,
                  type: SendType.PV,
                });
              },
            ],
            SendType.PV,
          )(null);
      }, 100),
      function (e, t) {
        t(e);
      }),
      createWhitelistStage(this, {
        LogLevel,
        normalizeInfoAll,
        createLogSender,
      }),
      function (e, t) {
        try {
          var n = e.filter(function (e) {
            return [
              LogLevel.ERROR,
              LogLevel.PROMISE_ERROR,
              LogLevel.AJAX_ERROR,
              LogLevel.SCRIPT_ERROR,
              LogLevel.IMAGE_ERROR,
              LogLevel.CSS_ERROR,
              LogLevel.MEDIA_ERROR,
              LogLevel.WEBSOCKET_ERROR,
              LogLevel.BRIDGE_ERROR,
              LogLevel.BLANK_SCREEN,
              LogLevel.RET_ERROR,
              LogLevel.PAGE_NOT_FOUND_ERROR,
              LogLevel.LAZY_LOAD_ERROR,
            ].includes(e.level);
          });
          var r =
            (n.length && p.lifeCycle.emit("errorOccurred", n),
            e.forEach(function (t) {
              ["ext1", "ext2", "ext3"].forEach(function (e) {
                t[e] && "string" == typeof t[e] && (t[e] = t[e].slice(0, 1024));
              });
              ["ext4", "ext5", "ext6", "ext7", "ext8", "ext9", "ext10"].forEach(
                function (e) {
                  t[e] && "string" != typeof t[e] && (t[e] = String(t[e]));
                },
              );
            }),
            JSON.parse(JSON.stringify(e)));
          var i = (p.lifeCycle.emit("beforeReport", r), p.config.beforeReport);
          (e =
            "function" == typeof i
              ? e.filter(function (e) {
                  return !1 !== i(e);
                })
              : e).length && t(e);
        } catch (e) {}
      },
      createLogSender(this),
    ]);
    this.eventPipeline = composePipeline([
      createBatchStage(this, 10),
      ((i = this),
      function (e) {
        i.sendPipeline(
          [
            function (e, t) {
              var n = e.map(function (e) {
                return {
                  name: e.name,
                  originFrom: e.originFrom,
                  ext1: String(e.ext1 || i.config.ext1 || "").slice(0, 1024),
                  ext2: String(e.ext2 || i.config.ext2 || "").slice(0, 1024),
                  ext3: String(e.ext3 || i.config.ext3 || "").slice(0, 1024),
                  ext4: String(e.ext4 || i.config.ext4 || ""),
                  ext5: String(e.ext5 || i.config.ext5 || ""),
                  ext6: String(e.ext6 || i.config.ext6 || ""),
                  ext7: String(e.ext7 || i.config.ext7 || ""),
                  ext8: String(e.ext8 || i.config.ext8 || ""),
                  ext9: String(e.ext9 || i.config.ext9 || ""),
                  ext10: String(e.ext10 || i.config.ext10 || ""),
                };
              });
              t({
                url: i.config.eventUrl,
                method: "post",
                contentType: "application/json",
                data: stringifyJSON({
                  payload: stringifyJSON(n),
                }),
                type: SendType.EVENT,
                log: e,
              });
            },
          ],
          SendType.EVENT,
        )(e);
      }),
    ]);
    this.customTimePipeline = composePipeline([
      createBatchStage(this, 10),
      ((r = this),
      function (e) {
        return r.sendPipeline(
          [
            function (e, t) {
              t({
                url: r.config.customTimeUrl,
                method: "post",
                contentType: "application/json",
                data: stringifyJSON({
                  payload: stringifyJSON({
                    custom: e,
                  }),
                }),
                type: SendType.CUSTOM,
                log: e,
              });
            },
          ],
          SendType.CUSTOM,
        )(e);
      }),
    ]);
    this.timeMap = {};
    this.failRequestCount = 0;
    MonitorCore.instances.push(this);
  }
  deviceDetection.macos = function () {
    return userAgentIncludes("mac");
  };
  deviceDetection.ios = function () {
    return (
      deviceDetection.iphone() ||
      deviceDetection.ipod() ||
      deviceDetection.ipad()
    );
  };
  deviceDetection.iphone = function () {
    return !deviceDetection.windows() && userAgentIncludes("iphone");
  };
  deviceDetection.ipod = function () {
    return userAgentIncludes("ipod");
  };
  deviceDetection.ipad = function () {
    var e = "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints;
    return userAgentIncludes("ipad") || e;
  };
  deviceDetection.android = function () {
    return !deviceDetection.windows() && userAgentIncludes("android");
  };
  deviceDetection.androidPhone = function () {
    return deviceDetection.android() && userAgentIncludes("mobile");
  };
  deviceDetection.androidTablet = function () {
    return deviceDetection.android() && !userAgentIncludes("mobile");
  };
  deviceDetection.blackberry = function () {
    return userAgentIncludes("blackberry") || userAgentIncludes("bb10");
  };
  deviceDetection.blackberryPhone = function () {
    return deviceDetection.blackberry() && !userAgentIncludes("tablet");
  };
  deviceDetection.blackberryTablet = function () {
    return deviceDetection.blackberry() && userAgentIncludes("tablet");
  };
  deviceDetection.windows = function () {
    return userAgentIncludes("windows");
  };
  deviceDetection.windowsPhone = function () {
    return deviceDetection.windows() && userAgentIncludes("phone");
  };
  deviceDetection.windowsTablet = function () {
    return (
      deviceDetection.windows() &&
      userAgentIncludes("touch") &&
      !deviceDetection.windowsPhone()
    );
  };
  deviceDetection.fxos = function () {
    return (
      (userAgentIncludes("(mobile") || userAgentIncludes("(tablet")) &&
      userAgentIncludes(" rv:")
    );
  };
  deviceDetection.fxosPhone = function () {
    return deviceDetection.fxos() && userAgentIncludes("mobile");
  };
  deviceDetection.fxosTablet = function () {
    return deviceDetection.fxos() && userAgentIncludes("tablet");
  };
  deviceDetection.meego = function () {
    return userAgentIncludes("meego");
  };
  deviceDetection.cordova = function () {
    return window.cordova && "file:" === location.protocol;
  };
  deviceDetection.nodeWebkit = function () {
    return "object" == typeof window.process;
  };
  deviceDetection.mobile = function () {
    return (
      deviceDetection.androidPhone() ||
      deviceDetection.iphone() ||
      deviceDetection.ipod() ||
      deviceDetection.windowsPhone() ||
      deviceDetection.blackberryPhone() ||
      deviceDetection.fxosPhone() ||
      deviceDetection.meego()
    );
  };
  deviceDetection.tablet = function () {
    return (
      deviceDetection.ipad() ||
      deviceDetection.androidTablet() ||
      deviceDetection.blackberryTablet() ||
      deviceDetection.windowsTablet() ||
      deviceDetection.fxosTablet()
    );
  };
  deviceDetection.desktop = function () {
    return !deviceDetection.tablet() && !deviceDetection.mobile();
  };
  function getPageOrigin() {
    return {
      host: new URL(location.href).host,
      pathname: location.pathname,
    };
  }
  function formatHeaders(r, e, i) {
    return null != e && e.length && "object" == typeof r
      ? e.reduce(function (e, t) {
          var n = window.Headers && r instanceof Headers ? r.get(t) : r[t];
          return n
            ? e + ("" === e ? "" : "\n\n") + i + " header " + t + ": " + n
            : e;
        }, "")
      : "";
  }
  function formatApiField(e, t) {
    return e && -1 === ["null", "undefined"].indexOf(e) ? t + ": " + e : "";
  }
  function getResourceType(e, t, n) {
    void 0 === t && (t = "");
    var r;
    var i;
    var e =
      "function" ==
      typeof (null == (i = e.api) ? void 0 : i.resourceTypeHandler)
        ? null == (i = e.api)
          ? void 0
          : i.resourceTypeHandler(n)
        : "";
    -1 === resourceTypes.indexOf(e) &&
      ((r = void 0 === t ? "" : t),
      (i = (void 0 === n ? "" : n).split("?")[0]),
      (e =
        assetExtensionPattern.test(i) ||
        assetContentTypes.some(function (e) {
          return -1 !== String(r).indexOf(e);
        })
          ? "static"
          : "fetch"));
    return e;
  }
  function getApiLogLevel(e, t) {
    return e
      ? LogLevel.AJAX_ERROR
      : t
        ? LogLevel.RET_ERROR
        : LogLevel.API_RESPONSE;
  }
  function isSlowApi(e, t, n) {
    var r;
    var i;
    if (!e) return !1;
    if (
      null != (r = null == t ? void 0 : t.api) &&
      r.isSlowApi &&
      "function" ==
        typeof (null == (r = null == t ? void 0 : t.api) ? void 0 : r.isSlowApi)
    )
      try {
        return null == (i = null == t ? void 0 : t.api)
          ? void 0
          : i.isSlowApi(
              n || {
                duration: e,
              },
            );
      } catch (e) {
        console.warn(
          "[Aegis] isSlowApi function happen error:",
          e,
          ", this data will not be reported.",
        );
        return !1;
      }
    return null != (r = null == t ? void 0 : t.api) &&
      r.apiSlowThreshold &&
      "number" ==
        typeof (null == (i = null == t ? void 0 : t.api)
          ? void 0
          : i.apiSlowThreshold)
      ? e >
          (null == (n = null == t ? void 0 : t.api)
            ? void 0
            : n.apiSlowThreshold)
      : 1e3 < e;
  }
  function readResourceTiming(e, t) {
    if (
      null != (e = e.api) &&
      e.usePerformanceTiming &&
      "string" == typeof t.url
    ) {
      e = null == (e = performance.getEntriesByName(t.url)) ? void 0 : e.pop();
      if (e)
        return {
          url: t.url,
          isHttps: isHttps(t.url),
          method: t.method,
          type: t.type,
          status: t.status,
          duration: Number(e.duration.toFixed(2)),
          nextHopProtocol: e.nextHopProtocol || "",
          domainLookup: toPrimitive(e.domainLookupEnd - e.domainLookupStart),
          connectTime: toPrimitive(e.connectEnd - e.connectStart),
        };
    }
    return {
      url: t.url,
      isHttps: isHttps(t.url),
      method: t.method,
      type: t.type,
      status: t.status,
      duration: Number(t.duration.toFixed(2)),
      nextHopProtocol: "",
      domainLookup: primitiveDefaults.number,
      connectTime: primitiveDefaults.number,
    };
  }
  var originalXhrSend;
  var originalXhrOpen;
  var originalSetRequestHeader;
  var originalFetch;
  var NetworkType;
  var PlatformType;
  var NetworkStatus;
  var xhrInstrumentationReady = !(deviceDetection.isIE = function () {
    return "ActiveXObject" in window;
  });
  var xhrHooks = [];
  var relativeUrlPattern = /^\/[^/]/;
  var fetchInstrumentationReady = !1;
  var fetchHooks = [];
  var defaultRetryConfig = {
    maxRetryCount: 10,
    retryInterval: function (e) {
      return 1e3 * (2 << e);
    },
    whenRetryEndStillFail: "discard",
    maxStorageCount: 50,
  };
  var apiSpeedPlugin =
    (new pluginConstructor({
      name: "reportApiSpeed",
    }),
    new pluginConstructor(
      createReportApiSpeedOptions({
        get LogLevel() {
          return LogLevel;
        },
        set LogLevel(value) {
          LogLevel = value;
        },
        get TraceHeaders() {
          return TraceHeaders;
        },
        set TraceHeaders(value) {
          TraceHeaders = value;
        },
        get UNKNOWN() {
          return UNKNOWN;
        },
        set UNKNOWN(value) {
          UNKNOWN = value;
        },
        get assign() {
          return assign;
        },
        set assign(value) {
          assign = value;
        },
        get deviceDetection() {
          return deviceDetection;
        },
        set deviceDetection(value) {
          deviceDetection = value;
        },
        get fetchHooks() {
          return fetchHooks;
        },
        set fetchHooks(value) {
          fetchHooks = value;
        },
        get fetchInstrumentationReady() {
          return fetchInstrumentationReady;
        },
        set fetchInstrumentationReady(value) {
          fetchInstrumentationReady = value;
        },
        get formatApiContent() {
          return formatApiContent;
        },
        set formatApiContent(value) {
          formatApiContent = value;
        },
        get formatApiField() {
          return formatApiField;
        },
        set formatApiField(value) {
          formatApiField = value;
        },
        get formatHeaders() {
          return formatHeaders;
        },
        set formatHeaders(value) {
          formatHeaders = value;
        },
        get getApiLogLevel() {
          return getApiLogLevel;
        },
        set getApiLogLevel(value) {
          getApiLogLevel = value;
        },
        get getPageOrigin() {
          return getPageOrigin;
        },
        set getPageOrigin(value) {
          getPageOrigin = value;
        },
        get getResourceType() {
          return getResourceType;
        },
        set getResourceType(value) {
          getResourceType = value;
        },
        get isIgnoredUrl() {
          return isIgnoredUrl;
        },
        set isIgnoredUrl(value) {
          isIgnoredUrl = value;
        },
        get isSlowApi() {
          return isSlowApi;
        },
        set isSlowApi(value) {
          isSlowApi = value;
        },
        get originalFetch() {
          return originalFetch;
        },
        set originalFetch(value) {
          originalFetch = value;
        },
        get originalSetRequestHeader() {
          return originalSetRequestHeader;
        },
        set originalSetRequestHeader(value) {
          originalSetRequestHeader = value;
        },
        get originalXhrOpen() {
          return originalXhrOpen;
        },
        set originalXhrOpen(value) {
          originalXhrOpen = value;
        },
        get originalXhrSend() {
          return originalXhrSend;
        },
        set originalXhrSend(value) {
          originalXhrSend = value;
        },
        get parseReturnCode() {
          return parseReturnCode;
        },
        set parseReturnCode(value) {
          parseReturnCode = value;
        },
        get readResourceTiming() {
          return readResourceTiming;
        },
        set readResourceTiming(value) {
          readResourceTiming = value;
        },
        get readTraceId() {
          return readTraceId;
        },
        set readTraceId(value) {
          readTraceId = value;
        },
        get relativeUrlPattern() {
          return relativeUrlPattern;
        },
        set relativeUrlPattern(value) {
          relativeUrlPattern = value;
        },
        get returnCodeKeys() {
          return returnCodeKeys;
        },
        set returnCodeKeys(value) {
          returnCodeKeys = value;
        },
        get splitUrlQuery() {
          return splitUrlQuery;
        },
        set splitUrlQuery(value) {
          splitUrlQuery = value;
        },
        get xhrHooks() {
          return xhrHooks;
        },
        set xhrHooks(value) {
          xhrHooks = value;
        },
        get xhrInstrumentationReady() {
          return xhrInstrumentationReady;
        },
        set xhrInstrumentationReady(value) {
          xhrInstrumentationReady = value;
        },
      }),
    ));
  var bridgeState = {};
  var bridgeSpeedPlugin = new pluginConstructor(
    createReportBridgeSpeedOptions({
      get bridgeState() {
        return bridgeState;
      },
      set bridgeState(value) {
        bridgeState = value;
      },
      get parseReturnCode() {
        return parseReturnCode;
      },
      set parseReturnCode(value) {
        parseReturnCode = value;
      },
    }),
  );
  (devicePlugin = NetworkType = NetworkType || {})[
    (devicePlugin.unknown = 100)
  ] = "unknown";
  devicePlugin[(devicePlugin.wifi = 1)] = "wifi";
  devicePlugin[(devicePlugin.net2g = 2)] = "net2g";
  devicePlugin[(devicePlugin.net3g = 3)] = "net3g";
  devicePlugin[(devicePlugin.net4g = 4)] = "net4g";
  devicePlugin[(devicePlugin.net5g = 5)] = "net5g";
  devicePlugin[(devicePlugin.net6g = 6)] = "net6g";
  (devicePlugin = PlatformType = PlatformType || {})[
    (devicePlugin.android = 1)
  ] = "android";
  devicePlugin[(devicePlugin.ios = 2)] = "ios";
  devicePlugin[(devicePlugin.windows = 3)] = "windows";
  devicePlugin[(devicePlugin.macos = 4)] = "macos";
  devicePlugin[(devicePlugin.linux = 5)] = "linux";
  devicePlugin[(devicePlugin.other = 100)] = "other";
  (devicePlugin = NetworkStatus = NetworkStatus || {})[
    (devicePlugin.unknown = 100)
  ] = "unknown";
  devicePlugin[(devicePlugin.normal = 0)] = "normal";
  devicePlugin[(devicePlugin.weak = 1)] = "weak";
  devicePlugin[(devicePlugin.disconnected = 2)] = "disconnected";
  function getLocationHref() {
    return window.location.href;
  }
  function getElementText(e) {
    return (e = ((e) => {
      var t = "";
      var n = e.nodeType;
      if (1 === n || 9 === n || 11 === n) {
        if ("string" == typeof e.textContent) return e.textContent;
        for (var r = e.firstChild; r; r = r.nextSibling)
          t += readTextContent(e);
      } else if (3 === n || 4 === n) return e.nodeValue;
      return t;
    })(e))
      ? e.replace(/^\s+|\s+$/g, "")
      : "";
  }
  function createVitalMetric(e, t) {
    var n = getNavigationEntry();
    var r = "navigate";
    0 <= bfcacheRestoreTime
      ? (r = "back-forward-cache")
      : n &&
        (document.prerendering || 0 < getActivationStart()
          ? (r = "prerender")
          : document.wasDiscarded
            ? (r = "restore")
            : n.type && (r = n.type.replace(/_/g, "-")));
    return {
      name: e,
      value: void 0 === t ? -1 : t,
      rating: "good",
      delta: 0,
      entries: [],
      id: "v4-"
        .concat(Date.now(), "-")
        .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
      navigationType: r,
    };
  }
  function bindVitalReporter(t, n, r, i) {
    var o;
    var a;
    return function (e) {
      0 <= n.value &&
        (e || i) &&
        ((a = n.value - (o || 0)) || void 0 === o) &&
        ((o = n.value),
        (n.delta = a),
        (n.rating =
          (e = n.value) > r[1]
            ? "poor"
            : e > r[0]
              ? "needs-improvement"
              : "good"),
        t(n));
    };
  }
  function afterTwoFrames(e) {
    requestAnimationFrame(function () {
      return requestAnimationFrame(function () {
        return e();
      });
    });
  }
  function onVisibilityHidden(e) {
    document.addEventListener("visibilitychange", function () {
      "hidden" === document.visibilityState && e();
    });
  }
  function once(e) {
    var t = !1;
    return function () {
      t || (e(), (t = !0));
    };
  }
  function getVisibilityWatcher() {
    firstHiddenTime < 0 &&
      ((firstHiddenTime = initialHiddenTime()),
      addVisibilityListeners(),
      onBFCacheRestore(function () {
        setTimeout(function () {
          firstHiddenTime = initialHiddenTime();
          addVisibilityListeners();
        }, 0);
      }));
    return {
      get firstHiddenTime() {
        return firstHiddenTime;
      },
    };
  }
  function whenActivated(e) {
    document.prerendering
      ? addEventListener(
          "prerenderingchange",
          function () {
            return e();
          },
          !0,
        )
      : e();
  }
  function observeFCP(o, a) {
    a = a || {};
    whenActivated(function () {
      var t;
      var n = getVisibilityWatcher();
      var r = createVitalMetric("FCP");
      var i = observePerformance("paint", function (e) {
        e.forEach(function (e) {
          "first-contentful-paint" === e.name &&
            (i.disconnect(), e.startTime < n.firstHiddenTime) &&
            ((r.value = Math.max(e.startTime - getActivationStart(), 0)),
            r.entries.push(e),
            t(!0));
        });
      });
      i &&
        ((t = bindVitalReporter(o, r, fcpThresholds, a.reportAllChanges)),
        onBFCacheRestore(function (e) {
          r = createVitalMetric("FCP");
          t = bindVitalReporter(o, r, fcpThresholds, a.reportAllChanges);
          afterTwoFrames(function () {
            r.value = performance.now() - e.timeStamp;
            t(!0);
          });
        }));
    });
  }
  function getInteractionCount() {
    return interactionCountObserver
      ? estimatedInteractionCount
      : performance.interactionCount || 0;
  }
  function processInteraction(t) {
    var e;
    var n;
    interactionCallbacks.forEach(function (e) {
      return e(t);
    });
    (!t.interactionId && "first-input" !== t.entryType) ||
      ((n = longestInteractions[longestInteractions.length - 1]),
      ((e = interactionsById.get(t.interactionId)) ||
        longestInteractions.length < 10 ||
        t.duration > n.latency) &&
        (e
          ? t.duration > e.latency
            ? ((e.entries = [t]), (e.latency = t.duration))
            : t.duration === e.latency &&
              t.startTime === e.entries[0].startTime &&
              e.entries.push(t)
          : ((n = {
              id: t.interactionId,
              latency: t.duration,
              entries: [t],
            }),
            interactionsById.set(n.id, n),
            longestInteractions.push(n)),
        longestInteractions.sort(function (e, t) {
          return t.latency - e.latency;
        }),
        10 < longestInteractions.length) &&
        longestInteractions.splice(10).forEach(function (e) {
          return interactionsById.delete(e.id);
        }));
  }
  function whenIdleOrHidden(e) {
    var t = self.requestIdleCallback || self.setTimeout;
    var n = -1;
    e = once(e);
    "hidden" === document.visibilityState
      ? e()
      : ((n = t(e)), onVisibilityHidden(e));
    return n;
  }
  function observeINP(o, a) {
    "PerformanceEventTiming" in self &&
      "interactionId" in PerformanceEventTiming.prototype &&
      ((a = a || {}),
      whenActivated(function () {
        var e;
        "interactionCount" in performance ||
          (interactionCountObserver =
            interactionCountObserver ||
            observePerformance("event", updateInteractionCount, {
              type: "event",
              buffered: !0,
              durationThreshold: 0,
            }));
        function t(t) {
          whenIdleOrHidden(function () {
            t.forEach(processInteraction);
            e = Math.min(
              longestInteractions.length - 1,
              Math.floor(
                (getInteractionCount() - previousInteractionCount) / 50,
              ),
            );
            var e = longestInteractions[e];
            e &&
              e.latency !== n.value &&
              ((n.value = e.latency), (n.entries = e.entries), i());
          });
        }
        var n = createVitalMetric("INP");
        var r = observePerformance("event", t, {
          durationThreshold: null != (e = a.durationThreshold) ? e : 40,
        });
        var i = bindVitalReporter(o, n, inpThresholds, a.reportAllChanges);
        r &&
          (r.observe({
            type: "first-input",
            buffered: !0,
          }),
          onVisibilityHidden(function () {
            t(r.takeRecords());
            i(!0);
          }),
          onBFCacheRestore(function () {
            previousInteractionCount = getInteractionCount();
            longestInteractions.length = 0;
            interactionsById.clear();
            n = createVitalMetric("INP");
            i = bindVitalReporter(o, n, inpThresholds, a.reportAllChanges);
          }));
      }));
  }
  function handleFirstInput(e) {
    var t;
    var n;
    var r;
    var i;
    var o;
    var a;
    e.cancelable &&
      ((t =
        (1e12 < e.timeStamp ? new Date() : performance.now()) - e.timeStamp),
      "pointerdown" == e.type
        ? ((n = t),
          (r = e),
          (i = function () {
            recordFirstInput(n, r);
            a();
          }),
          (o = function () {
            a();
          }),
          (a = function () {
            removeEventListener("pointerup", i, passiveCaptureOptions);
            removeEventListener("pointercancel", o, passiveCaptureOptions);
          }),
          addEventListener("pointerup", i, passiveCaptureOptions),
          addEventListener("pointercancel", o, passiveCaptureOptions))
        : recordFirstInput(t, e));
  }
  function onPageExit(s, l) {
    var e;
    (null != (e = null == l ? void 0 : l.events) && e.length
      ? l.events
      : pageExitEvents
    ).forEach(function (e) {
      var t;
      var n;
      var r;
      var i;
      var o;
      var a;
      n = e;
      r = s;
      i = null == l ? void 0 : l.once;
      o = null == (t = null == l ? void 0 : l.delay) ? void 0 : t[e];
      a = function (e) {
        ("visibilitychange" === n && "hidden" !== document.visibilityState) ||
          (o
            ? setTimeout(function () {
                return r(e);
              }, o)
            : r(e),
          i && removeEventListener(n, a, !0));
      };
      addEventListener(n, a, !0);
    });
  }
  function storeVital(e) {
    var t = e.name;
    (e = e.value) <= 0 || ("INP" === t && 6e4 < e) || (vitalMetrics[t] = e);
  }
  function clampTiming(e, t, n, r) {
    void 0 === n && (n = 15e3);
    void 0 === r && (r = 0);
    return (t = void 0 === t ? 0 : t) <= e && e <= n ? e : r;
  }
  function readStorageJSON(e, t) {
    void 0 === t && (t = []);
    try {
      var n = localStorage.getItem(e);
      if (null != n) {
        var r = JSON.parse(n);
        if (Array.isArray(t) && !Array.isArray(r))
          try {
            localStorage.removeItem(e);
          } catch (e) {}
        else {
          if (
            Array.isArray(t) ||
            "object" != typeof t ||
            null === t ||
            ("object" == typeof r && null !== r && !Array.isArray(r))
          )
            return r;
          try {
            localStorage.removeItem(e);
          } catch (e) {}
        }
      }
      return t;
    } catch (n) {
      try {
        localStorage.removeItem(e);
      } catch (e) {}
      return t;
    }
  }
  function writeStorage(e, t) {
    try {
      localStorage.setItem(e, t);
    } catch (e) {}
  }
  var interactionCountObserver;
  var firstInputEvent;
  var firstInputDelay;
  var firstInputTime;
  var firstInputCallbacks;
  var pagePerformanceCache;
  var devicePlugin = new pluginConstructor(
    createDeviceOptions({
      get NetworkStatus() {
        return NetworkStatus;
      },
      set NetworkStatus(value) {
        NetworkStatus = value;
      },
      get NetworkType() {
        return NetworkType;
      },
      set NetworkType(value) {
        NetworkType = value;
      },
      get PlatformType() {
        return PlatformType;
      },
      set PlatformType(value) {
        PlatformType = value;
      },
      get readNetworkType() {
        return readNetworkType;
      },
      set readNetworkType(value) {
        readNetworkType = value;
      },
    }),
  );
  var readNetworkType = function (e) {
    var t = "";
    var n = navigator.userAgent.match(/NetType\/(\w+)/);
    n
      ? (t = n[1])
      : navigator.connection &&
        (t = navigator.connection.effectiveType || navigator.connection.type);
    e(
      ((n = t = t || UNKNOWN),
      0 <= (n = String(n).toLowerCase()).indexOf("4g")
        ? NetworkType.net4g
        : 0 <= n.indexOf("wifi")
          ? NetworkType.wifi
          : 0 <= n.indexOf("5g")
            ? NetworkType.net5g
            : 0 <= n.indexOf("6g")
              ? NetworkType.net6g
              : 0 <= n.indexOf("3g")
                ? NetworkType.net3g
                : 0 <= n.indexOf("2g")
                  ? NetworkType.net2g
                  : NetworkType.unknown),
    );
  };
  var OriginalWebSocket = window.WebSocket;
  var websocketListeners = [];
  var websocketProxyHandler = {
    construct: function (e, t) {
      var r = new e(t[0], t[1]);
      r.originSend = r.send;
      r.addEventListener("error", function (e) {
        var e = (null == e ? void 0 : e.currentTarget) || {};
        var t = e.url;
        var n = e.readyState;
        null != websocketListeners &&
          websocketListeners.forEach(function (e) {
            e = e.onErr;
            null != e &&
              e({
                msg: "无法获知具体错误信息，需在浏览器控制台查看！",
                readyState: n,
                connectUrl: t,
              });
          });
      });
      Object.defineProperty(r, "send", {
        get: function () {
          return function (e) {
            null != (t = r.originSend) && t.call(r, e);
            var t = r.readyState;
            if (t !== WebSocket.OPEN) {
              var n = {
                readyState: t,
                connectUrl: r.url,
              };
              switch (t) {
                case WebSocket.CLOSED:
                  websocketListeners.forEach(function (e) {
                    e = e.sendErr;
                    null != e &&
                      e(
                        assign(
                          {
                            msg: "消息发送失败，连接已关闭！",
                          },
                          n,
                        ),
                      );
                  });
                  break;
                case WebSocket.CONNECTING:
                  websocketListeners.forEach(function (e) {
                    (0, e.sendErr)(
                      assign(
                        {
                          msg: "消息发送失败，正在连接中！",
                        },
                        n,
                      ),
                    );
                  });
                  break;
                case WebSocket.CLOSING:
                  websocketListeners.forEach(function (e) {
                    (0, e.sendErr)(
                      assign(
                        {
                          msg: "消息发送失败，连接正在关闭！",
                        },
                        n,
                      ),
                    );
                  });
              }
            }
          };
        },
      });
      return r;
    },
  };
  var errorPluginAlias = new pluginConstructor({
    name: "onError",
  });
  var errorPlugin = (errorPluginAlias = new pluginConstructor(
    createOnErrorOptions({
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get OriginalWebSocket() {
        return OriginalWebSocket;
      },
      set OriginalWebSocket(value) {
        OriginalWebSocket = value;
      },
      get concatArrays() {
        return concatArrays;
      },
      set concatArrays(value) {
        concatArrays = value;
      },
      get errorPluginAlias() {
        return errorPluginAlias;
      },
      set errorPluginAlias(value) {
        errorPluginAlias = value;
      },
      get ignoredErrorMessages() {
        return ignoredErrorMessages;
      },
      set ignoredErrorMessages(value) {
        ignoredErrorMessages = value;
      },
      get ignoredReportUrls() {
        return ignoredReportUrls;
      },
      set ignoredReportUrls(value) {
        ignoredReportUrls = value;
      },
      get isIgnoredUrl() {
        return isIgnoredUrl;
      },
      set isIgnoredUrl(value) {
        isIgnoredUrl = value;
      },
      get stringifyLog() {
        return stringifyLog;
      },
      set stringifyLog(value) {
        stringifyLog = value;
      },
      get websocketListeners() {
        return websocketListeners;
      },
      set websocketListeners(value) {
        websocketListeners = value;
      },
      get websocketProxyHandler() {
        return websocketProxyHandler;
      },
      set websocketProxyHandler(value) {
        websocketProxyHandler = value;
      },
    }),
  ));
  var getElementPath =
    (new pluginConstructor({
      name: "clickElementLog",
    }),
    function (e) {
      if ("" !== e.id && e.id) return 'id("' + e.id + '")';
      if (e === document.body) return e.tagName;
      if (e instanceof Document) return "document";
      var t = 0;
      if (e.parentNode)
        for (var n = e.parentNode.childNodes, r = 0; r < n.length; r += 1) {
          var i = n[r];
          if (i === e)
            return (
              getElementPath(e.parentNode) +
              "/" +
              e.tagName +
              "[" +
              (t + 1) +
              "]"
            );
          1 === i.nodeType && i.tagName === e.tagName && (t += 1);
        }
      return 0;
    });
  var toLookupMap = function (e) {
    return e instanceof Array
      ? new Map(
          e.map(function (e) {
            return [e, !0];
          }),
        )
      : new Map();
  };
  var splitString = function (e, t) {
    return "string" == typeof e ? e.split(t) : [];
  };
  var readTextContent = function (e) {
    if (3 === e.nodeType || 4 === e.nodeType) return e.nodeValue || "";
    if (1 !== e.nodeType) return "";
    if ("string" == typeof e.textContent) return e.textContent;
    for (var t = "", n = e.firstChild; n; n = n.nextSibling)
      t += readTextContent(n);
    return t;
  };
  var clickPlugin = new pluginConstructor(
    createClickElementLogOptions({
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get getElementPath() {
        return getElementPath;
      },
      set getElementPath(value) {
        getElementPath = value;
      },
      get getElementText() {
        return getElementText;
      },
      set getElementText(value) {
        getElementText = value;
      },
      get getLocationHref() {
        return getLocationHref;
      },
      set getLocationHref(value) {
        getLocationHref = value;
      },
      get splitString() {
        return splitString;
      },
      set splitString(value) {
        splitString = value;
      },
      get toLookupMap() {
        return toLookupMap;
      },
      set toLookupMap(value) {
        toLookupMap = value;
      },
    }),
  );
  var originalConsole =
    (new pluginConstructor({
      name: "consoleLog",
    }),
    {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      trace: console.trace,
    });
  var consolePlugin = new pluginConstructor(
    createConsoleLogOptions({
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get originalConsole() {
        return originalConsole;
      },
      set originalConsole(value) {
        originalConsole = value;
      },
    }),
  );
  var bfcacheRestoreTime = -1;
  var onBFCacheRestore = function (t) {
    addEventListener(
      "pageshow",
      function (e) {
        e.persisted && ((bfcacheRestoreTime = e.timeStamp), t(e));
      },
      !0,
    );
  };
  var getNavigationEntry = function () {
    var e =
      self.performance &&
      performance.getEntriesByType &&
      performance.getEntriesByType("navigation")[0];
    if (e && 0 < e.responseStart && e.responseStart < performance.now())
      return e;
  };
  var getActivationStart = function () {
    var e = getNavigationEntry();
    return (e && e.activationStart) || 0;
  };
  var observePerformance = function (e, t, n) {
    try {
      var r;
      if (PerformanceObserver.supportedEntryTypes.includes(e)) {
        (r = new PerformanceObserver(function (e) {
          Promise.resolve().then(function () {
            t(e.getEntries());
          });
        })).observe(
          Object.assign(
            {
              type: e,
              buffered: !0,
            },
            n || {},
          ),
        );
        return r;
      }
    } catch (e) {}
  };
  var firstHiddenTime = -1;
  var initialHiddenTime = function () {
    return "hidden" !== document.visibilityState || document.prerendering
      ? 1 / 0
      : 0;
  };
  var handleVisibilityChange = function (e) {
    "hidden" === document.visibilityState &&
      -1 < firstHiddenTime &&
      ((firstHiddenTime = "visibilitychange" === e.type ? e.timeStamp : 0),
      removeVisibilityListeners());
  };
  var addVisibilityListeners = function () {
    addEventListener("visibilitychange", handleVisibilityChange, !0);
    addEventListener("prerenderingchange", handleVisibilityChange, !0);
  };
  var removeVisibilityListeners = function () {
    removeEventListener("visibilitychange", handleVisibilityChange, !0);
    removeEventListener("prerenderingchange", handleVisibilityChange, !0);
  };
  var fcpThresholds = [1800, 3e3];
  var clsThresholds = [0.1, 0.25];
  var estimatedInteractionCount = 0;
  var minInteractionId = 1 / 0;
  var maxInteractionId = 0;
  var updateInteractionCount = function (e) {
    e.forEach(function (e) {
      e.interactionId &&
        ((minInteractionId = Math.min(minInteractionId, e.interactionId)),
        (maxInteractionId = Math.max(maxInteractionId, e.interactionId)),
        (estimatedInteractionCount = maxInteractionId
          ? (maxInteractionId - minInteractionId) / 7 + 1
          : 0));
    });
  };
  var longestInteractions = [];
  var interactionsById = new Map();
  var previousInteractionCount = 0;
  var interactionCallbacks = [];
  var inpThresholds = [200, 500];
  var lcpThresholds = [2500, 4e3];
  var reportedLcpIds = {};
  var passiveCaptureOptions = {
    passive: !0,
    capture: !0,
  };
  var firstInputStartTime = new Date();
  var recordFirstInput = function (e, t) {
    firstInputEvent ||
      ((firstInputEvent = t),
      (firstInputDelay = e),
      (firstInputTime = new Date()),
      listenFirstInput(removeEventListener),
      dispatchFirstInput());
  };
  var dispatchFirstInput = function () {
    var t;
    0 <= firstInputDelay &&
      firstInputDelay < firstInputTime - firstInputStartTime &&
      ((t = {
        entryType: "first-input",
        name: firstInputEvent.type,
        target: firstInputEvent.target,
        cancelable: firstInputEvent.cancelable,
        startTime: firstInputEvent.timeStamp,
        processingStart: firstInputEvent.timeStamp + firstInputDelay,
      }),
      firstInputCallbacks.forEach(function (e) {
        e(t);
      }),
      (firstInputCallbacks = []));
  };
  var listenFirstInput = function (t) {
    ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (e) {
      return t(e, handleFirstInput, passiveCaptureOptions);
    });
  };
  var fidThresholds = [100, 300];
  var pageExitEvents = ["visibilitychange", "pagehide", "beforeunload"];
  var TTIObserver =
    ((TimeToInteractiveObserver.prototype.start = function () {
      var t = this;
      var n = new PerformanceObserver(function (e) {
        e = e.getEntriesByName("first-contentful-paint");
        0 < e.length &&
          ((t.fcp = e[0].startTime),
          (t.slientWindowStartTime = t.fcp),
          n.disconnect(),
          setTimeout(
            function () {
              t.checkTTI();
            },
            Math.max(
              t.slienceTimeInterval - (performance.now() - t.fcp) + 20,
              1,
            ),
          ));
      });
      n.observe({
        entryTypes: ["paint"],
      });
      this.longtaskObserver = new PerformanceObserver(function (e) {
        e = e.getEntries();
        t.longTaskEntries = t.longTaskEntries.concat(e);
      });
      this.longtaskObserver.observe({
        entryTypes: ["longtask"],
      });
      this.resourceObserver = new PerformanceObserver(function (e) {
        e = e.getEntries();
        t.resourceEntries = t.resourceEntries.concat(e);
      });
      this.resourceObserver.observe({
        entryTypes: ["resource"],
      });
    }),
    (TimeToInteractiveObserver.prototype.checkTTI = function () {
      var e = this;
      this.hasSlientWindow()
        ? (this.calculateTTI(),
          this.longtaskObserver.disconnect(),
          this.resourceObserver.disconnect())
        : setTimeout(function () {
            e.checkTTI();
          }, this.checkInterval);
    }),
    (TimeToInteractiveObserver.prototype.hasSlientWindow = function () {
      var e;
      var t = performance.now();
      return !(
        t - this.slientWindowStartTime < 5e3 ||
        ((e = this.getLastLongTaskEndTime()) > this.slientWindowStartTime
          ? ((this.slientWindowStartTime = e), (this.resourceEntries = []))
          : this.getRequestCount(this.slientWindowStartTime, t) <= 2
            ? ((this.lastLongtaskEndTime = e), 0)
            : ((t = this.resourceEntries.sort(function (e, t) {
                return e.startTime - t.startTime;
              })),
              (this.slientWindowStartTime =
                t[this.resourceEntries.length - 2].startTime),
              1))
      );
    }),
    (TimeToInteractiveObserver.prototype.getLastLongTaskEndTime = function () {
      var t;
      return 0 === this.longTaskEntries.length
        ? -1
        : ((t = 0),
          this.longTaskEntries.forEach(function (e) {
            e.startTime + e.duration > t && (t = e.startTime + e.duration);
          }),
          t);
    }),
    (TimeToInteractiveObserver.prototype.getRequestCount = function (t, n) {
      var r = 0;
      this.resourceEntries.forEach(function (e) {
        e.startTime >= t && e.startTime + e.duration <= n && (r += 1);
      });
      return r;
    }),
    (TimeToInteractiveObserver.prototype.calculateTTI = function () {
      var e =
        -1 === this.lastLongtaskEndTime
          ? this.slientWindowStartTime
          : this.lastLongtaskEndTime;
      var t =
        performance.timing.domContentLoadedEventEnd -
        performance.timing.navigationStart;
      var e = Math.max(t, e);
      this.onTTICallback(e);
    }),
    TimeToInteractiveObserver);
  var vitalMetrics =
    (new pluginConstructor({
      name: "webVitals",
    }),
    {
      FCP: -1,
      LCP: -1,
      FID: -1,
      CLS: -1,
      INP: -1,
      TTI: -1,
      from: void 0,
    });
  var vitalState = new Map();
  var webVitalsPlugin = new pluginConstructor(
    createWebVitalsOptions({
      get SendType() {
        return SendType;
      },
      set SendType(value) {
        SendType = value;
      },
      get TTIObserver() {
        return TTIObserver;
      },
      set TTIObserver(value) {
        TTIObserver = value;
      },
      get afterTwoFrames() {
        return afterTwoFrames;
      },
      set afterTwoFrames(value) {
        afterTwoFrames = value;
      },
      get assign() {
        return assign;
      },
      set assign(value) {
        assign = value;
      },
      get bindVitalReporter() {
        return bindVitalReporter;
      },
      set bindVitalReporter(value) {
        bindVitalReporter = value;
      },
      get clsThresholds() {
        return clsThresholds;
      },
      set clsThresholds(value) {
        clsThresholds = value;
      },
      get createVitalMetric() {
        return createVitalMetric;
      },
      set createVitalMetric(value) {
        createVitalMetric = value;
      },
      get dispatchFirstInput() {
        return dispatchFirstInput;
      },
      set dispatchFirstInput(value) {
        dispatchFirstInput = value;
      },
      get fidThresholds() {
        return fidThresholds;
      },
      set fidThresholds(value) {
        fidThresholds = value;
      },
      get firstInputCallbacks() {
        return firstInputCallbacks;
      },
      set firstInputCallbacks(value) {
        firstInputCallbacks = value;
      },
      get firstInputDelay() {
        return firstInputDelay;
      },
      set firstInputDelay(value) {
        firstInputDelay = value;
      },
      get firstInputEvent() {
        return firstInputEvent;
      },
      set firstInputEvent(value) {
        firstInputEvent = value;
      },
      get getActivationStart() {
        return getActivationStart;
      },
      set getActivationStart(value) {
        getActivationStart = value;
      },
      get getVisibilityWatcher() {
        return getVisibilityWatcher;
      },
      set getVisibilityWatcher(value) {
        getVisibilityWatcher = value;
      },
      get hasPerformanceTiming() {
        return hasPerformanceTiming;
      },
      set hasPerformanceTiming(value) {
        hasPerformanceTiming = value;
      },
      get lcpThresholds() {
        return lcpThresholds;
      },
      set lcpThresholds(value) {
        lcpThresholds = value;
      },
      get listenFirstInput() {
        return listenFirstInput;
      },
      set listenFirstInput(value) {
        listenFirstInput = value;
      },
      get observeFCP() {
        return observeFCP;
      },
      set observeFCP(value) {
        observeFCP = value;
      },
      get observeINP() {
        return observeINP;
      },
      set observeINP(value) {
        observeINP = value;
      },
      get observePerformance() {
        return observePerformance;
      },
      set observePerformance(value) {
        observePerformance = value;
      },
      get onBFCacheRestore() {
        return onBFCacheRestore;
      },
      set onBFCacheRestore(value) {
        onBFCacheRestore = value;
      },
      get onPageExit() {
        return onPageExit;
      },
      set onPageExit(value) {
        onPageExit = value;
      },
      get onVisibilityHidden() {
        return onVisibilityHidden;
      },
      set onVisibilityHidden(value) {
        onVisibilityHidden = value;
      },
      get once() {
        return once;
      },
      set once(value) {
        once = value;
      },
      get reportedLcpIds() {
        return reportedLcpIds;
      },
      set reportedLcpIds(value) {
        reportedLcpIds = value;
      },
      get storeVital() {
        return storeVital;
      },
      set storeVital(value) {
        storeVital = value;
      },
      get vitalMetrics() {
        return vitalMetrics;
      },
      set vitalMetrics(value) {
        vitalMetrics = value;
      },
      get vitalState() {
        return vitalState;
      },
      set vitalState(value) {
        vitalState = value;
      },
      get whenActivated() {
        return whenActivated;
      },
      set whenActivated(value) {
        whenActivated = value;
      },
      get whenIdleOrHidden() {
        return whenIdleOrHidden;
      },
      set whenIdleOrHidden(value) {
        whenIdleOrHidden = value;
      },
    }),
  );
  var navigationEntryAttempts =
    (new pluginConstructor({
      name: "pagePerformance",
    }),
    3);
  var pagePerformanceState = new Map();
  var pagePerformancePlugin = new pluginConstructor(
    createPagePerformanceOptions({
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get SendType() {
        return SendType;
      },
      set SendType(value) {
        SendType = value;
      },
      get assign() {
        return assign;
      },
      set assign(value) {
        assign = value;
      },
      get clampTiming() {
        return clampTiming;
      },
      set clampTiming(value) {
        clampTiming = value;
      },
      get hasPerformanceTiming() {
        return hasPerformanceTiming;
      },
      set hasPerformanceTiming(value) {
        hasPerformanceTiming = value;
      },
      get navigationEntryAttempts() {
        return navigationEntryAttempts;
      },
      set navigationEntryAttempts(value) {
        navigationEntryAttempts = value;
      },
      get onPageExit() {
        return onPageExit;
      },
      set onPageExit(value) {
        onPageExit = value;
      },
      get pagePerformanceCache() {
        return pagePerformanceCache;
      },
      set pagePerformanceCache(value) {
        pagePerformanceCache = value;
      },
      get pagePerformanceState() {
        return pagePerformanceState;
      },
      set pagePerformanceState(value) {
        pagePerformanceState = value;
      },
      get supportsPerformanceEntry() {
        return supportsPerformanceEntry;
      },
      set supportsPerformanceEntry(value) {
        supportsPerformanceEntry = value;
      },
      get vitalMetrics() {
        return vitalMetrics;
      },
      set vitalMetrics(value) {
        vitalMetrics = value;
      },
    }),
  );
  var spaEvents =
    (new pluginConstructor({
      name: "spa",
    }),
    ["replaceState", "pushState", "popstate", "hashchange"]);
  var spaPlugin = new pluginConstructor(
    createSpaOptions({
      get SendType() {
        return SendType;
      },
      set SendType(value) {
        SendType = value;
      },
      get spaEvents() {
        return spaEvents;
      },
      set spaEvents(value) {
        spaEvents = value;
      },
    }),
  );
  function TimeToInteractiveObserver(e) {
    this.slienceTimeInterval = 5e3;
    this.checkInterval = 100;
    this.fcp = 0;
    this.longTaskEntries = [];
    this.resourceEntries = [];
    this.slientWindowStartTime = performance.now();
    this.onTTICallback = e;
  }
  function gzipOnMainThread(l) {
    return awaiter(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var i;
      var o;
      var a;
      var s;
      return generator(this, function (e) {
        switch (e.label) {
          case 0:
            t = new Blob([l])
              .stream()
              .pipeThrough(new CompressionStream("gzip"));
            t = t.getReader();
            n = [];
            e.label = 1;
          case 1:
            return [4, t.read()];
          case 2:
            if (((r = e.sent()), (i = r.done), (r = r.value), i)) return [3, 4];
            n.push(r);
            e.label = 3;
          case 3:
            return [3, 1];
          case 4:
            if (1 === n.length) return [2, n[0]];
            for (
              i = n.reduce(function (e, t) {
                return e + t.length;
              }, 0),
                o = new Uint8Array(i),
                s = a = 0;
              s < n.length;
              s += 1
            ) {
              o.set(n[s], a);
              a += n[s].length;
            }
            return [2, o];
        }
      });
    });
  }
  var compressionWorker = null;
  var compressionWorkerFailed = !1;
  var compressionTaskCounter = 0;
  var compressionTasks = new Map();
  var sessionStorageKey = "__MONITOR_SESSION_V1__";
  function persistSession(e) {
    try {
      sessionStorage.setItem("__MONITOR_SESSION_V1__", JSON.stringify(e));
    } catch (e) {}
  }
  function getOrCreateSession(e, t) {
    var n;
    return "undefined" == typeof window
      ? {
          sessionId: t(),
          createdAt: Date.now(),
          lastActivity: Date.now(),
          source: e,
          version: 1,
        }
      : null != (n = window[sessionStorageKey]) && n.sessionId
        ? ((n.lastActivity = Date.now()), persistSession(n), n)
        : (n = (() => {
              try {
                var e;
                var t;
                var n = sessionStorage.getItem("__MONITOR_SESSION_V1__");
                return n
                  ? "string" != typeof (e = JSON.parse(n)).sessionId ||
                    "number" != typeof e.createdAt ||
                    "number" != typeof e.lastActivity ||
                    36e5 < (t = Date.now()) - e.createdAt ||
                    9e5 < t - e.lastActivity
                    ? null
                    : ((e.lastActivity = t), e)
                  : null;
              } catch (n) {
                return null;
              }
            })())
          ? (persistSession((window[sessionStorageKey] = n)), n)
          : ((n = {
              sessionId: t(),
              createdAt: Date.now(),
              lastActivity: Date.now(),
              source: e,
              version: 1,
            }),
            persistSession((window[sessionStorageKey] = n)),
            n);
  }
  inheritStatics(
    (DerivedMonitor = CmesMonitor),
    (runtimeAlias = BaseMonitor = runtimeAlias),
  );
  DerivedMonitor.prototype =
    null === runtimeAlias
      ? Object.create(runtimeAlias)
      : ((PrototypeBridge.prototype = runtimeAlias.prototype),
        new PrototypeBridge());
  CmesMonitor.resolveGzipConfig = function (e) {
    var t;
    var n = {
      enable: !0,
      threshold: 1024,
      debug: !1,
      useWorker: !0,
      workerThreshold: 4096,
    };
    return !1 === e
      ? assign(assign({}, n), {
          enable: !1,
        })
      : !0 === e || null == e
        ? n
        : {
            enable: !1 !== e.enable,
            threshold: null != (t = e.threshold) ? t : n.threshold,
            debug: null != (t = e.debug) ? t : n.debug,
            useWorker: null != (t = e.useWorker) ? t : n.useWorker,
            workerThreshold:
              null != (t = e.workerThreshold) ? t : n.workerThreshold,
          };
  };
  CmesMonitor.prototype.addExtBean = function (e, t) {
    t &&
      this.extendBean(
        e,
        encodeURIComponent(
          "string" == typeof t && ["ext1", "ext2", "ext3"].includes(e)
            ? t.slice(0, 1024)
            : t,
        ),
      );
  };
  CmesMonitor.prototype.getBean = function (t) {
    var n = this;
    void 0 === t && (t = []);
    return (
      "" +
      Object.getOwnPropertyNames(this.bean)
        .filter(function (e) {
          return -1 === t.indexOf(e);
        })
        .map(function (e) {
          return "from" === e
            ? "from=" + n.getCurrentPageUrl()
            : e + "=" + n.bean[e];
        })
        .join("&")
    );
  };
  CmesMonitor.prototype.getCurrentPageUrl = function () {
    var e = this.config.pageUrl || location.href;
    var e = (e =
      "function" == typeof this.config.urlHandler
        ? this.config.urlHandler() || location.href
        : e).slice(0, 2048);
    return encodeURIComponent(e);
  };
  CmesMonitor.prototype.getOriginFrom = function () {
    try {
      return (
        "undefined" != typeof window && window.location
          ? window.location.href
          : ""
      ).slice(0, 2048);
    } catch (e) {
      return "";
    }
  };
  CmesMonitor.prototype.reportPageView = function (e) {
    var r;
    var i;
    var o = this.config.pvUrl;
    o &&
      ((r = this.getOriginFrom()),
      (i = "string" == typeof e && e ? e.slice(0, 2048) : ""),
      this.sendPipeline(
        [
          function (e, t) {
            var n = r
              ? appendQuery(o, {
                  originFrom: r,
                })
              : o;
            t({
              url: i
                ? appendQuery(n, {
                    from: i,
                  })
                : n,
              type: SendType.PV,
              beanFilter: i ? ["from"] : void 0,
            });
          },
        ],
        SendType.PV,
      )(null));
  };
  CmesMonitor.prototype.ready = function () {
    function o() {
      var e;
      var n;
      var r;
      var i;
      t.reportRequestQueue.length &&
        ((e = t.reportRequestQueue.splice(0, 1)[0]),
        (n = e.options),
        (r = e.success),
        (i = e.fail),
        t.$request(
          n,
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            try {
              return null == r ? void 0 : r.apply(n, e);
            } finally {
              o();
            }
          },
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            try {
              return null == i ? void 0 : i.apply(n, e);
            } finally {
              o();
            }
          },
        ));
    }
    var t = this;
    o();
    this.isReportReady = !0;
  };
  CmesMonitor.prototype.request = function (u, r, d) {
    var f;
    var h;
    var p = this;
    this.config.reportImmediately || this.isReportReady
      ? this.$request(
          u,
          (f = function (e) {
            var t;
            var n = readStorageJSON("aegis-web-retry-report-requests");
            null != n &&
              n.length &&
              u.extraRetryOptions &&
              (0 <=
                (t = n.findIndex(function (e) {
                  return (
                    e.extraRetryOptions.requestId ===
                    u.extraRetryOptions.requestId
                  );
                })) &&
                (n.splice(t, 1),
                writeStorage(
                  "aegis-web-retry-report-requests",
                  JSON.stringify(n),
                )),
              delete window[u.extraRetryOptions.success],
              delete window[u.extraRetryOptions.fail]);
            null != r && r(e);
          }),
          (h = function (n) {
            if (
              !p.config.reportRetry ||
              u.type === SendType.WHITE_LIST ||
              u.type === SendType.SDK_ERROR
            )
              return null == d ? void 0 : d(n);
            var e =
              "boolean" == typeof p.config.reportRetry
                ? defaultRetryConfig
                : assign(assign({}, defaultRetryConfig), p.config.reportRetry);
            var t = e.maxRetryCount;
            var r = void 0 === t ? defaultRetryConfig.maxRetryCount : t;
            var t = e.retryInterval;
            var t = void 0 === t ? defaultRetryConfig.retryInterval : t;
            var i = e.whenRetryEndStillFail;
            var o = void 0 === i ? defaultRetryConfig.whenRetryEndStillFail : i;
            var i = e.maxStorageCount;
            var a = Math.min(
              100,
              Math.max(
                20,
                void 0 === i ? defaultRetryConfig.maxStorageCount : i,
              ),
            );
            var s =
              (u.extraRetryOptions ||
                (u.extraRetryOptions = {
                  requestId: "",
                  retriedCount: 0,
                  success: "",
                  fail: "",
                }),
              u.extraRetryOptions);
            var l =
              ((s.requestId =
                s.requestId || u.url + "-" + Date.now() + "-" + Math.random()),
              s.requestId);
            var c =
              ((s.retriedCount = s.retriedCount || 0),
              (s.success = s.success || l + "_successCallback"),
              (s.fail = s.fail || l + "_failCallback"),
              readStorageJSON("aegis-web-retry-report-requests"));
            if (
              c.find(function (e) {
                return e.extraRetryOptions.requestId === l;
              })
            ) {
              e = c.findIndex(function (e) {
                return e.extraRetryOptions.requestId === l;
              });
              c[e] = u;
            } else for (c.push(u); c.length > a;) c.shift();
            writeStorage("aegis-web-retry-report-requests", JSON.stringify(c));
            setTimeout(
              function () {
                var e;
                var t;
                s.retriedCount < r
                  ? ((u.extraRetryOptions.retriedCount += 1),
                    p.$request(u, f, h))
                  : (-1 !==
                      (t = (e = readStorageJSON(
                        "aegis-web-retry-report-requests",
                      )).findIndex(function (e) {
                        return (
                          (null == (e = e.extraRetryOptions)
                            ? void 0
                            : e.requestId) === l
                        );
                      })) &&
                      "discard" === o &&
                      (e.splice(t, 1),
                      writeStorage(
                        "aegis-web-retry-report-requests",
                        JSON.stringify(e),
                      )),
                    null != d && d(n),
                    delete window[s.success],
                    delete window[s.fail]);
              },
              "function" == typeof t ? t(u.extraRetryOptions.retriedCount) : t,
            );
            window[s.success] || (window[s.success] = f);
            window[s.fail] || (window[s.fail] = h);
          }),
        )
      : this.reportRequestQueue.push({
          options: u,
          success: r,
          fail: d,
        });
  };
  CmesMonitor.prototype.$request = function (s, e, t) {
    if (!isControlRequestAllowed(s)) return;
    var n;
    var r;
    if (s && "string" == typeof s.url && "" !== s.url && this.bean.id) {
      n = s.url;
      !1 !== s.addBean &&
        (n = ((e, t) => {
          var n;
          var r;
          var i;
          var o = e;
          var a = s.beanFilter || [];
          for (n in t)
            -1 === a.indexOf(n) &&
              ((i = (r = new RegExp("([?&])" + n + "(=([^&]*))?(?=&|$)")).exec(
                o,
              ))
                ? (i[2] && "" !== i[3] && "undefined" !== i[3]) ||
                  (o = o.replace(r, "$1" + n + "=" + t[n]))
                : ((i = -1 < o.indexOf("?") ? "&" : "?"),
                  (o += i + n + "=" + t[n])));
          return o;
        })(
          n,
          assign(assign({}, this.bean), {
            from: this.getCurrentPageUrl(),
          }),
        ));
      s.url = n;
      n = s.method || "get";
      r = this.config.onBeforeRequest;
      return (s = r ? r(s, this) : s)
        ? s.url
          ? void (((null != s && s.sendBeacon) || this.sendNow) &&
            "function" ==
              typeof (null == navigator ? void 0 : navigator.sendBeacon)
              ? navigator.sendBeacon(s.url, s.data)
              : ("string" == typeof s.data &&
                  (s.data = s.data.replace(/eval/gi, "evaI")),
                (r = this.isGzipReportEnabled(
                  this.resolvedGzipConfig.enable,
                )) &&
                CmesMonitor.compressionSupported &&
                "get" !== n.toLowerCase() &&
                "string" == typeof s.data &&
                s.data.length >= this.resolvedGzipConfig.threshold
                  ? this.sendWithGzip(s, n, r, e, t)
                  : this.sendXhr(
                      s,
                      n,
                      s.data,
                      getContentEncoding(r, !1),
                      e,
                      t,
                    )))
          : console.warn(
              "Please handle the parameters reasonably, options.url is necessary",
            )
        : console.warn("Sending request blocked");
    }
  };
  CmesMonitor.prototype.sendWithGzip = function (l, c, u, d, f) {
    return awaiter(this, void 0, void 0, function () {
      var r;
      var i;
      var o;
      var s;
      return generator(this, function (e) {
        switch (e.label) {
          case 0:
            if (
              (e.trys.push([0, 9, , 10]),
              (r = new TextEncoder()),
              (r = r.encode(l.data)),
              (o = this.resolvedGzipConfig),
              (i = o.useWorker),
              (o = o.workerThreshold),
              (s = void 0),
              !(i && r.byteLength >= o))
            )
              return [3, 6];
            e.label = 1;
          case 1:
            e.trys.push([1, 3, , 5]);
            return [
              4,
              ((a = r),
              new Promise(function (t, n) {
                var r;
                var i;
                var e;
                var o = (() => {
                  if (compressionWorkerFailed) return null;
                  if (compressionWorker) return compressionWorker;
                  try {
                    var e = new Blob(
                      [
                        '\nself.onmessage=async function(e){\n  try{\n    var d=e.data,id=d.id,raw=d.data;\n    var s=new Blob([raw]).stream().pipeThrough(new CompressionStream("gzip"));\n    var r=s.getReader(),chunks=[];\n    for(;;){var res=r.read();var p=await res;if(p.done)break;chunks.push(p.value);}\n    var len=0;for(var i=0;i<chunks.length;i++)len+=chunks[i].length;\n    var out=new Uint8Array(len),off=0;\n    for(var i=0;i<chunks.length;i++){out.set(chunks[i],off);off+=chunks[i].length;}\n    self.postMessage({id:id,compressed:out},[out.buffer]);\n  }catch(err){\n    self.postMessage({id:id,error:err.message||"compress error"});\n  }\n};',
                      ],
                      {
                        type: "application/javascript",
                      },
                    );
                    var t = URL.createObjectURL(e);
                    compressionWorker = new Worker(t);
                    URL.revokeObjectURL(t);
                    compressionWorker.onmessage = function (e) {
                      var e = e.data;
                      var t = e.id;
                      var n = e.compressed;
                      var e = e.error;
                      var r = compressionTasks.get(t);
                      r &&
                        (compressionTasks.delete(t),
                        e ? r.reject(new Error(e)) : r.resolve(n));
                    };
                    compressionWorker.onerror = function () {
                      compressionWorkerFailed = !0;
                      compressionTasks.forEach(function (e) {
                        return e.reject(new Error("gzip worker error"));
                      });
                      compressionTasks.clear();
                      compressionWorker &&
                        (compressionWorker.terminate(),
                        (compressionWorker = null));
                      compressionTasks.forEach(function (e) {
                        return e.reject(new Error("worker terminated"));
                      });
                      compressionTasks.clear();
                    };
                    return compressionWorker;
                  } catch (e) {
                    compressionWorkerFailed = !0;
                    return null;
                  }
                })();
                o
                  ? ((r = compressionTaskCounter += 1),
                    (i = setTimeout(function () {
                      var e = compressionTasks.get(r);
                      e &&
                        (compressionTasks.delete(r),
                        e.reject(new Error("gzip worker timeout")));
                    }, 5e3)),
                    compressionTasks.set(r, {
                      resolve: function (e) {
                        clearTimeout(i);
                        t(e);
                      },
                      reject: function (e) {
                        clearTimeout(i);
                        n(e);
                      },
                    }),
                    (e = a.buffer.slice(
                      a.byteOffset,
                      a.byteOffset + a.byteLength,
                    )),
                    o.postMessage(
                      {
                        id: r,
                        data: new Uint8Array(e),
                      },
                      [e],
                    ))
                  : n(new Error("worker unavailable"));
              })),
            ];
          case 2:
            s = e.sent();
            return [3, 5];
          case 3:
            e.sent();
            return [4, gzipOnMainThread(r)];
          case 4:
            s = e.sent();
            return [3, 5];
          case 5:
            return [3, 8];
          case 6:
            return [4, gzipOnMainThread(r)];
          case 7:
            s = e.sent();
            e.label = 8;
          case 8:
            this.resolvedGzipConfig.debug &&
              console.info(
                "[Aegis gzip] before=" +
                  (t = r.byteLength) +
                  "B after=" +
                  (n = s.byteLength) +
                  "B saved=" +
                  (t - n) +
                  "B ratio=" +
                  (0 < t ? ((n / t) * 100).toFixed(1) : "0.0") +
                  "%",
              );
            this.sendXhr(l, c, s, getContentEncoding(u, !0), d, f);
            return [3, 10];
          case 9:
            e.sent();
            this.sendXhr(l, c, l.data, getContentEncoding(u, !1), d, f);
            return [3, 10];
          case 10:
            return [2];
        }
        var t;
        var n;
        var a;
      });
    });
  };
  CmesMonitor.prototype.sendXhr = function (e, t, n, r, i, o) {
    var a = new XMLHttpRequest();
    a.sendByAegis = !0;
    a.addEventListener("readystatechange", function () {
      4 === a.readyState &&
        (400 <= a.status || 0 === a.status
          ? null != o && o(a.response)
          : null != i && i(a.response));
    });
    "get" === t.toLocaleLowerCase()
      ? (a.open("get", appendQuery(e.url, e.data)), a.send())
      : (a.open("post", e.url),
        e.contentType && a.setRequestHeader("Content-Type", e.contentType),
        r && a.setRequestHeader("Content-Encoding", r),
        a.send(n));
  };
  CmesMonitor.prototype.publishPluginsLogs = function () {
    var e = CmesMonitor.installedPlugins.find(function (e) {
      return "reportAssetSpeed" === e.name;
    });
    null != e && e.option.collectNotReportedLog(this);
  };
  CmesMonitor.prototype.uploadLogs = function (e, t) {
    var n;
    void 0 === e && (e = {});
    void 0 === t && (t = {});
    null != (n = this.lifeCycle) && n.emit("uploadLogs", e, t);
  };
  CmesMonitor.prototype.reportWebVitals = function (e) {
    try {
      var t = CmesMonitor.installedPlugins.find(function (e) {
        return "webVitals" === e.name;
      });
      t &&
        this.config.webVitals &&
        this.config.webVitals.manualReport &&
        t.option.publish(this, e);
    } catch (e) {}
  };
  CmesMonitor.sessionID = getOrCreateSession(
    "aegis",
    createSessionId,
  ).sessionId;
  CmesMonitor.compressionSupported = null;
  var BaseMonitor;
  var DerivedMonitor;
  var runtimeAlias = CmesMonitor;
  function CmesMonitor(e) {
    var t;
    var n;
    var r;
    var a;
    var i;
    var o;
    var s = BaseMonitor.call(this, e) || this;
    s.sendNow = !1;
    s.isReportReady = !1;
    s.reportRequestQueue = [];
    s.speedLogPipeline = composePipeline([
      createBatchStage(s),
      ((a = s.config),
      function (e, t) {
        var n;
        var r;
        var i;
        var o = "number" == typeof a.repeat ? a.repeat : 60;
        !a.speedSample || o <= 0
          ? t(e)
          : ((n = (null == a ? void 0 : a.id) || "0"),
            (r = repeatCounts[n] || {}),
            Array.isArray(e)
              ? (i = e.filter(function (e) {
                  var t = !r[e.url] || r[e.url] < o;
                  t
                    ? ((r[e.url] = 1 + ~~r[e.url]), (repeatCounts[n] = r))
                    : repeatResetTimers[n] || scheduleRepeatReset(n);
                  return t;
                })).length && t(i)
              : !r[e.url] || r[e.url] < o
                ? ((r[e.url] = 1 + ~~r[e.url]), (repeatCounts[n] = r), t(e))
                : repeatResetTimers[n] || scheduleRepeatReset(n));
      }),
      ((r = s),
      function (t, n) {
        readNetworkType(function (e) {
          r.extendBean("netType", e);
          n(t);
        });
      }),
      function (e, t) {
        null != (n = s.lifeCycle) && n.emit("beforeReportSpeed", e);
        var n;
        var r = s.config.beforeReportSpeed;
        if (
          (e =
            "function" == typeof r
              ? e.filter(function (e) {
                  return !1 !== r(e);
                })
              : e).length
        )
          return t(e);
      },
      function (e, t) {
        t(
          e.map(function (e) {
            void 0 !== e.payload && delete e.payload;
            return e;
          }),
        );
      },
      function (e) {
        return s.sendPipeline(
          [
            function (e, t) {
              t({
                type: SendType.SPEED,
                url: "" + s.config.speedUrl,
                method: "post",
                contentType: "application/json",
                data: createSpeedPayload(
                  e,
                  assign(assign({}, s.bean), {
                    from: s.getCurrentPageUrl(),
                  }),
                ),
                log: e,
              });
            },
          ],
          SendType.SPEED,
        )(e);
      },
    ]);
    e.asyncPlugin = !0;
    try {
      "undefined" != typeof document &&
        (e.uin =
          e.uin ||
          (null != (t = document.cookie.match(/\buin=\D+(\d*)/)) ? t : [])[1] ||
          (null != (n = document.cookie.match(/\bilive_uin=\D*(\d+)/))
            ? n
            : [])[1] ||
          "");
      s.init(e);
      s.resolvedGzipConfig = CmesMonitor.resolveGzipConfig(s.config.gzip);
      null === CmesMonitor.compressionSupported &&
        (CmesMonitor.compressionSupported = (() => {
          try {
            return "function" == typeof CompressionStream;
          } catch (e) {
            return !1;
          }
        })());
      s.extendBean("sessionId", CmesMonitor.sessionID);
      s.extendBean("from", s.getCurrentPageUrl());
      "undefined" != typeof document &&
        s.extendBean("referer", encodeURIComponent(document.referrer || ""));
      i = function (e, t) {
        "aegis" !== t &&
          e &&
          e !== CmesMonitor.sessionID &&
          ((CmesMonitor.sessionID = e), s.extendBean("sessionId", e));
      };
      var l =
        "undefined" == typeof window
          ? function () {}
          : (window.addEventListener(
              "monitor-session-update",
              (o = function (e) {
                i(e.detail.sessionId, e.detail.source);
              }),
            ),
            function () {
              return window.removeEventListener("monitor-session-update", o);
            });
      var c =
        (s.lifeCycle.on("destroy", l),
        function () {
          function i() {
            var r;
            e.length &&
              ((r = e.splice(0, 1)[0]),
              writeStorage(
                "aegis-web-retry-report-requests",
                JSON.stringify(e),
              ),
              s.$request(
                r,
                function () {
                  for (var e, t = [], n = 0; n < arguments.length; n++)
                    t[n] = arguments[n];
                  try {
                    return null == (e = window[r.extraRetryOptions.success])
                      ? void 0
                      : e.apply(r, t);
                  } finally {
                    i();
                  }
                },
                function () {
                  for (var e, t = [], n = 0; n < arguments.length; n++)
                    t[n] = arguments[n];
                  try {
                    return null == (e = window[r.extraRetryOptions.fail])
                      ? void 0
                      : e.apply(r, t);
                  } finally {
                    i();
                  }
                },
              ));
          }
          var e = readStorageJSON("aegis-web-retry-report-requests");
          i();
        });
      "requestIdleCallback" in window
        ? window.requestIdleCallback(function () {
            return awaiter(s, void 0, void 0, function () {
              return generator(this, function (e) {
                c();
                return [2];
              });
            });
          })
        : setTimeout(c, 5e3);
      for (var u = 1; u <= 10; u++) s.addExtBean("ext" + u, e["ext" + u]);
    } catch (e) {
      console.warn(e);
      console.log(
        "%cThe above error occurred in the process of initializing Aegis, which will affect your normal use of Aegis.\nIt is recommended that you contact us for feedback and thank you for your support.",
        "color: red",
      );
      s.sendSDKError(e);
    }
    return s;
  }
  function PrototypeBridge() {
    this.constructor = DerivedMonitor;
  }
  new pluginConstructor({
    name: "ie",
  });
  new pluginConstructor({
    name: "onClose",
  });
  var pageClosePlugin = new pluginConstructor(
    createOnCloseOptions({
      get onPageExit() {
        return onPageExit;
      },
      set onPageExit(value) {
        onPageExit = value;
      },
    }),
  );
  new pluginConstructor({
    name: "aid",
  });
  var BlankScreenTrigger;
  var blankScreenDefaults = {
    containers: ["body", "html", "#app", "#root"],
    ignoreContainers: [],
    containerMatchers: {
      tagName: ["body", "html"],
      id: ["app", "root"],
      className: [],
    },
    ignoreMatchers: {
      tagName: [],
      id: [],
      className: [],
    },
    detectStartPosition: {
      x: 0,
      y: 0,
    },
    emptyElementsPercent: 70,
    sameElementsPercent: 70,
    debounceDuration: 2e3,
    everySideSampleNumber: 9,
    disableSameElementsCheck: !0,
    ignoreElesWhenDomChange: [],
    reDetectInterval: 2e3,
    samePointDepth: 5,
    customBlankScreenDector: null,
    enableScreenshot: !1,
    needScreenShotMeta: !1,
    screenshotQuality: 0.1,
    screenshotFormat: "image/webp",
    onBlankScreenCapture: null,
    clientScreenshotTimeout: 1e4,
  };
  var visibleMediaTags = ["canvas", "img", "svg", "iframe"];
  var ignoredScreenshotTags =
    (((blankScreenPlugin = BlankScreenTrigger = BlankScreenTrigger || {})[
      (blankScreenPlugin.UNKNOWN = 0)
    ] = "UNKNOWN"),
    (blankScreenPlugin[(blankScreenPlugin.ERROR = 1)] = "ERROR"),
    (blankScreenPlugin[(blankScreenPlugin.DOM_CHANGE = 2)] = "DOM_CHANGE"),
    new Set([
      "SCRIPT",
      "STYLE",
      "NOSCRIPT",
      "TEMPLATE",
      "HEAD",
      "META",
      "LINK",
      "BR",
      "WBR",
    ]));
  var ScreenshotRenderer =
    ((DomScreenshotRenderer.prototype.capture = function () {
      return awaiter(this, void 0, void 0, function () {
        var t;
        var n;
        var r;
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
        return generator(this, function (e) {
          switch (e.label) {
            case 0:
              e.trys.push([0, 7, , 8]);
              t = performance.now();
              this.tasks = [];
              this.nodeCounter = 0;
              this.resourcePool.clear();
              this.maxDepthReached = 0;
              this.depthLimitHitCount = 0;
              u = window.innerWidth;
              g = window.innerHeight;
              this.vw = u;
              this.vh = g;
              l = window.devicePixelRatio || 1;
              r = u * this.options.scale;
              c = g * this.options.scale;
              i = Math.min(
                1,
                this.options.maxWidth / r,
                this.options.maxHeight / c,
              );
              n = r * i;
              r = c * i;
              c = l * this.options.scale;
              this.canvas.width = u * c;
              this.canvas.height = g * c;
              this.ctx.scale(c, c);
              i = n / (u * c);
              this.totalScale = c * i;
              this.ctx.beginPath();
              this.ctx.rect(0, 0, u, g);
              this.ctx.clip();
              this.collectTasks(document.body, 0, [], 0);
              this.tasks.sort(function (e, t) {
                return e.zIndex !== t.zIndex
                  ? e.zIndex - t.zIndex
                  : e.domOrder - t.domOrder;
              });
              o = [];
              this.resourcePool.forEach(function (e) {
                e instanceof Promise && o.push(e);
              });
              return 0 < o.length ? [4, Promise.all(o)] : [3, 2];
            case 1:
              e.sent();
              e.label = 2;
            case 2:
              a = "";
              s = 0;
              e.label = 3;
            case 3:
              return s < this.tasks.length
                ? ((l = this.tasks[s]),
                  (c =
                    0 < l.clipRects.length
                      ? l.clipRects
                          .map(function (e) {
                            return e.left + "," + e.top;
                          })
                          .join("|")
                      : "") !== a &&
                    (a && this.ctx.restore(),
                    c && (this.ctx.save(), this.applyClipRects(l.clipRects)),
                    (a = c)),
                  [4, l.render()])
                : [3, 6];
            case 4:
              e.sent();
              e.label = 5;
            case 5:
              s++;
              return [3, 3];
            case 6:
              if ((a && this.ctx.restore(), (u = this.canvas), i < 0.99)) {
                if (
                  ((d = this.canvas),
                  (f = this.canvas.width),
                  (h = this.canvas.height),
                  3 * n < f)
                )
                  for (
                    ;
                    2 * n < f &&
                    ((f = Math.floor(f / 2)),
                    (h = Math.floor(h / 2)),
                    ((p = document.createElement("canvas")).width = f),
                    (p.height = h),
                    (m = p.getContext("2d")));
                  ) {
                    m.imageSmoothingEnabled = !0;
                    m.imageSmoothingQuality = "medium";
                    m.drawImage(d, 0, 0, f, h);
                    d = p;
                  }
                (g = document.createElement("canvas")).width = n;
                g.height = r;
                (v = g.getContext("2d")) &&
                  ((v.imageSmoothingEnabled = !0),
                  (v.imageSmoothingQuality = "medium"),
                  v.drawImage(d, 0, 0, n, r),
                  (u = g));
              }
              v = "jpg" === this.options.format ? "jpeg" : this.options.format;
              y = u.toDataURL("image/" + v, this.options.quality);
              this.options.debug &&
                ((w =
                  0 < this.depthLimitHitCount
                    ? " ⚠️ 深度限制触发" + this.depthLimitHitCount + "次"
                    : ""),
                console.log(
                  "%c🚀 截图完成 (" +
                    Math.round(performance.now() - t) +
                    "ms) 尺寸:" +
                    u.width +
                    "x" +
                    u.height +
                    " 节点:" +
                    this.nodeCounter +
                    " 任务:" +
                    this.tasks.length +
                    " 最大深度:" +
                    this.maxDepthReached +
                    "/100" +
                    w,
                  "color: #673AB7; font-weight: bold;",
                ));
              this.cleanup();
              return [2, y];
            case 7:
              w = e.sent();
              this.cleanup();
              this.options.debug &&
                console.error("Screenshot capture failed:", w);
              return [2, ""];
            case 8:
              return [2];
          }
        });
      });
    }),
    (DomScreenshotRenderer.prototype.isElementVisible = function (e, t) {
      return 0 < t.length
        ? ((t = t[t.length - 1]),
          !(e.right < t.left || e.left > t.right) &&
            (!(e.bottom < t.top || e.top > t.bottom) ||
              Math.abs(e.width - t.width) < 50))
        : !(e.bottom < 0 || e.top > this.vh || e.right < 0 || e.left > this.vw);
    }),
    (DomScreenshotRenderer.prototype.applyClipRects = function (e) {
      for (var t = 0, n = e; t < n.length; t++) {
        var r = n[t];
        this.ctx.beginPath();
        this.ctx.rect(r.left, r.top, r.width, r.height);
        this.ctx.clip();
      }
    }),
    (DomScreenshotRenderer.prototype.collectTasks = function (n, e, t, r) {
      var i = this;
      if (
        (void 0 === e && (e = 0),
        void 0 === t && (t = []),
        (r = void 0 === r ? 0 : r) > this.maxDepthReached &&
          (this.maxDepthReached = r),
        100 < r)
      )
        this.depthLimitHitCount++;
      else {
        this.nodeCounter++;
        var o = this.nodeCounter;
        if (3 !== n.nodeType) {
          if (n instanceof Element) {
            var a = n.tagName;
            if (!ignoredScreenshotTags.has(a)) {
              var s = getComputedStyle(n);
              if (
                "none" !== s.display &&
                "hidden" !== s.visibility &&
                0 !== parseFloat(s.opacity)
              ) {
                var l = n.getBoundingClientRect();
                var c = s.position;
                var u = "fixed" === c || "sticky" === c;
                var d = e;
                var f = s.zIndex;
                var h =
                  ("auto" !== f && ((f = parseInt(f, 10)), isNaN(f) || (d = f)),
                  u && d < 2e4 && (d += 2e4),
                  2e4 <= e && d < 2e4 && (d += 2e4),
                  (d = d < e ? e : d));
                var f = 2e4 <= e;
                var p = "fixed" === c ? [] : t;
                var d =
                  0 <= l.bottom &&
                  l.top <= this.vh &&
                  0 <= l.right &&
                  l.left <= this.vw;
                if (this.options.viewportOnly) {
                  if (0 === l.width && 0 === l.height && !u && !f) return;
                  if (!(
                    d ||
                    u ||
                    f ||
                    n.parentElement === document.body ||
                    this.isElementVisible(l, p)
                  ))
                    return;
                }
                var m;
                var g;
                var c = s.overflow || s.overflowX || s.overflowY;
                var c =
                  "hidden" === c ||
                  "scroll" === c ||
                  "auto" === c ||
                  "clip" === c;
                var v =
                  (this.checkAndPreload(s),
                  (d || u || f) &&
                    (0 < l.width || 0 < l.height) &&
                    ((m = parseFloat(s.opacity)),
                    this.addTask(h, o, p, function () {
                      return i.drawBox(s, l, u, m);
                    })),
                  ["::before", "::after"].forEach(function (e) {
                    var t = getComputedStyle(n, e);
                    ("none" === t.content &&
                      "none" === t.backgroundImage &&
                      "none" === t.webkitMaskImage) ||
                      (i.checkAndPreload(t),
                      i.addTask(h, o, p, function () {
                        return i.drawPseudoElement(t, l);
                      }));
                  }),
                  n instanceof HTMLImageElement
                    ? (this.preloadImage(n.src),
                      this.addTask(h, o, p, function () {
                        return i.drawImageFromUrl(n.src, l);
                      }))
                    : n instanceof SVGElement
                      ? ((g = this.preloadSVG(n)),
                        this.addTask(h, o, p, function () {
                          return i.drawImageFromUrl(g, l);
                        }))
                      : n instanceof HTMLCanvasElement && n !== this.canvas
                        ? this.addTask(h, o, p, function () {
                            return i.drawCanvas(n, l);
                          })
                        : (n instanceof HTMLInputElement ||
                            n instanceof HTMLTextAreaElement) &&
                          this.addTask(h, o, p, function () {
                            return i.drawInputText(n, s, l);
                          }),
                  c
                    ? concatArrays(p, [
                        {
                          left: l.left,
                          top: l.top,
                          right: l.right,
                          bottom: l.bottom,
                          width: l.width,
                          height: l.height,
                        },
                      ])
                    : p);
                var y = r + 1;
                if (n.shadowRoot)
                  for (
                    var w = 0, b = Array.from(n.shadowRoot.childNodes);
                    w < b.length;
                    w++
                  ) {
                    L = b[w];
                    this.collectTasks(L, h, v, y);
                  }
                else if ("SLOT" === a)
                  for (var E = 0, S = n.assignedNodes(); E < S.length; E++) {
                    var R = S[E];
                    this.collectTasks(R, h, v, y);
                  }
                else
                  for (
                    var T = 0, O = Array.from(n.childNodes);
                    T < O.length;
                    T++
                  ) {
                    L = O[T];
                    this.collectTasks(L, h, v, y);
                  }
              }
            }
          } else if (n.childNodes)
            for (var x = 0, P = Array.from(n.childNodes); x < P.length; x++) {
              var L = P[x];
              this.collectTasks(L, e, t, r + 1);
            }
        } else
          null != (d = n.textContent) &&
            d.trim() &&
            this.addTask(e, o, t, function () {
              return i.drawTextNode(n);
            });
      }
    }),
    (DomScreenshotRenderer.prototype.addTask = function (e, t, n, r) {
      this.tasks.push({
        zIndex: e,
        domOrder: t,
        clipRects: n,
        render: r,
      });
    }),
    (DomScreenshotRenderer.prototype.drawBox = function (e, t, n, r) {
      void 0 === n && (n = !1);
      void 0 === r && (r = 1);
      var i;
      var o = e.backgroundColor;
      var a = e.borderColor;
      var s = e.borderWidth;
      var l = e.borderRadius;
      var c = e.backgroundImage;
      var u = e.boxShadow;
      var d = e.webkitMaskImage || e.maskImage;
      var f = "transparent" !== o && "rgba(0, 0, 0, 0)" !== o;
      var h = 0 < parseFloat(s);
      var p = c && "none" !== c;
      var m = d && "none" !== d;
      var g = u && "none" !== u && !u.includes("inset");
      (f || h || p || m || g || n) &&
        (this.ctx.save(),
        r < 1 && (this.ctx.globalAlpha *= r),
        g &&
          (i =
            u.match(
              /(-?\d+px)\s+(-?\d+px)\s+(\d+px)\s*(\d+px)?\s*(rgba?\(.*?\)|#\w+|\w+)/,
            ) ||
            u.match(
              /(rgba?\(.*?\)|#\w+|\w+)\s+(-?\d+px)\s+(-?\d+px)\s+(\d+px)\s*(\d+px)?/,
            )) &&
          ((r = isNaN(parseFloat(i[1]))),
          (this.ctx.shadowOffsetX = parseFloat(r ? i[2] : i[1])),
          (this.ctx.shadowOffsetY = parseFloat(r ? i[3] : i[2])),
          (this.ctx.shadowBlur = parseFloat(r ? i[4] : i[3])),
          (this.ctx.shadowColor = r ? i[1] : i[5] || "transparent")),
        (g = Math.min(parseFloat(l) || 0, Math.min(t.width, t.height) / 2)),
        this.ctx.beginPath(),
        0 < g
          ? this.roundRectPath(t.left, t.top, t.width, t.height, g)
          : this.ctx.rect(t.left, t.top, t.width, t.height),
        (u = p && c.includes("gradient")),
        f
          ? ((this.ctx.fillStyle = o), this.ctx.fill())
          : (n || u) &&
            ((t.bottom > 0.85 * this.vh && t.height < 0.5 * this.vh) || u) &&
            ((this.ctx.fillStyle = "#ffffff"), this.ctx.fill()),
        m && this.drawMaskImage(d, e, t),
        p &&
          !u &&
          (i = c.match(/url\(["']?(.*?)["']?\)/)) &&
          (r = this.resourcePool.get(i[1])) &&
          r instanceof HTMLImageElement &&
          this.ctx.drawImage(r, t.left, t.top, t.width, t.height),
        h &&
          ((this.ctx.shadowColor = "transparent"),
          (this.ctx.strokeStyle = a),
          (l = parseFloat(s)),
          (g = 1 / this.totalScale),
          (this.ctx.lineWidth = Math.max(l, g)),
          this.ctx.stroke()),
        this.ctx.restore());
    }),
    (DomScreenshotRenderer.prototype.drawMaskImage = function (e, t, n) {
      var r;
      var i;
      var o;
      var e = e.match(/url\(["']?(.*?)["']?\)/);
      e &&
        (e = this.resourcePool.get(e[1])) &&
        e instanceof HTMLImageElement &&
        (((r = document.createElement("canvas")).width = n.width),
        (r.height = n.height),
        (i = r.getContext("2d"))) &&
        ((o =
          "transparent" !== t.backgroundColor &&
          "rgba(0, 0, 0, 0)" !== t.backgroundColor),
        (i.fillStyle = o ? t.backgroundColor : t.color || "#000"),
        i.fillRect(0, 0, n.width, n.height),
        (i.globalCompositeOperation = "destination-in"),
        i.drawImage(e, 0, 0, n.width, n.height),
        this.ctx.drawImage(r, n.left, n.top));
    }),
    (DomScreenshotRenderer.prototype.drawPseudoElement = function (e, t) {
      var n = e.content;
      var r = e.backgroundImage;
      var i = e.opacity;
      var o = e.fontSize;
      var a = e.color;
      var s = e.webkitMaskImage || e.maskImage;
      var i =
        (this.ctx.save(),
        (this.ctx.globalAlpha *= parseFloat(i)),
        s && "none" !== s
          ? this.drawMaskImage(s, e, t)
          : r &&
            "none" !== r &&
            (i = r.match(/url\(["']?(.*?)["']?\)/)) &&
            (s = this.resourcePool.get(i[1])) &&
            s instanceof HTMLImageElement &&
            ((r = parseFloat(o) || 16),
            this.ctx.drawImage(
              s,
              t.left + (t.width - r) / 2,
              t.top + (t.height - r) / 2,
              r,
              r,
            )),
        (n || "").replace(/^["']|["']$/g, ""));
      i &&
        !["none", "normal", "on", "off", "", " "].includes(i.toLowerCase()) &&
        ((this.ctx.font =
          e.fontStyle +
          " " +
          e.fontWeight +
          " " +
          e.fontSize +
          " " +
          e.fontFamily),
        (this.ctx.fillStyle = a),
        (this.ctx.textAlign = "center"),
        (this.ctx.textBaseline = "middle"),
        this.ctx.fillText(i, t.left + t.width / 2, t.top + t.height / 2));
      this.ctx.restore();
    }),
    (DomScreenshotRenderer.prototype.drawInputText = function (e, t, n) {
      if (e instanceof HTMLInputElement) {
        var r = null == (r = e.type) ? void 0 : r.toLowerCase();
        if (
          "checkbox" === r ||
          "radio" === r ||
          "file" === r ||
          "submit" === r ||
          "button" === r ||
          "reset" === r ||
          "image" === r ||
          "hidden" === r ||
          "color" === r ||
          "range" === r
        )
          return;
      }
      var r = e.value;
      var i = r || e.placeholder;
      i &&
        (this.ctx.save(),
        (this.ctx.globalAlpha *= parseFloat(t.opacity)),
        (this.ctx.font =
          t.fontStyle +
          " " +
          t.fontWeight +
          " " +
          t.fontSize +
          " " +
          t.fontFamily),
        (this.ctx.fillStyle = r ? t.color : "rgba(153, 153, 153, 0.7)"),
        (this.ctx.textBaseline = "middle"),
        (this.ctx.textAlign = "center" === t.textAlign ? "center" : "left"),
        (r =
          "center" === this.ctx.textAlign ? n.left + n.width / 2 : n.left + 10),
        (t = n.top + (e instanceof HTMLTextAreaElement ? 18 : n.height / 2)),
        this.ctx.fillText(i, r, t),
        this.ctx.restore());
    }),
    (DomScreenshotRenderer.prototype.drawTextNode = function (e) {
      var t = e.parentElement;
      if (t) {
        var n = e.textContent;
        if (
          n &&
          n.trim() &&
          !(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)
        )
          try {
            var r = document.createRange();
            var i = (r.selectNodeContents(e), r.getClientRects());
            if (0 !== i.length) {
              var o = getComputedStyle(t);
              if (
                (this.ctx.save(),
                (this.ctx.globalAlpha *= parseFloat(o.opacity)),
                (this.ctx.font =
                  o.fontStyle +
                  " " +
                  o.fontWeight +
                  " " +
                  o.fontSize +
                  " " +
                  o.fontFamily),
                (this.ctx.fillStyle = o.color),
                (this.ctx.textBaseline = "top"),
                (this.ctx.textAlign = "left"),
                1 === i.length)
              )
                this.ctx.fillText(n.trim(), i[0].left, i[0].top);
              else
                for (
                  var a = n.replace(/\n\s*/g, " "), s = 0, l = 0;
                  l < i.length;
                  l++
                ) {
                  var c = i[l];
                  if (!(c.width < 1)) {
                    for (var u = s, d = a.length, f = ""; u <= d;) {
                      var h = (u + d) >> 1;
                      var p = a.substring(s, h);
                      this.ctx.measureText(p).width <= c.width + 2
                        ? ((f = p), (u = 1 + h))
                        : (d = h - 1);
                    }
                    if (
                      (f &&
                        (this.ctx.fillText(f, c.left, c.top), (s += f.length)),
                      s >= a.length)
                    )
                      break;
                  }
                }
              this.ctx.restore();
            }
          } catch (e) {}
      }
    }),
    (DomScreenshotRenderer.prototype.drawCanvas = function (e, t) {
      try {
        this.ctx.drawImage(e, t.left, t.top, t.width, t.height);
      } catch (e) {}
    }),
    (DomScreenshotRenderer.prototype.preloadImage = function (i) {
      var e;
      var o = this;
      return !i || this.resourcePool.has(i)
        ? (e = this.resourcePool.get(i)) instanceof Promise
          ? e
          : Promise.resolve(e || null)
        : ((e = new Promise(function (t) {
            function e(e) {
              r || ((r = !0), o.resourcePool.set(i, e), t(e));
            }
            var n = new Image();
            var r = !1;
            o.options.useCORS &&
              !i.startsWith("data:") &&
              (n.crossOrigin = "anonymous");
            n.onload = function () {
              return e(n);
            };
            n.onerror = function () {
              return e(null);
            };
            n.src = i;
            setTimeout(function () {
              return e(null);
            }, 2e3);
          })),
          this.resourcePool.set(i, e),
          e);
    }),
    (DomScreenshotRenderer.prototype.preloadSVG = function (e) {
      try {
        var t = new XMLSerializer().serializeToString(e);
        var n = URL.createObjectURL(
          new Blob([t], {
            type: "image/svg+xml;charset=utf-8",
          }),
        );
        this.blobUrls.add(n);
        this.preloadImage(n);
        return n;
      } catch (e) {
        return "";
      }
    }),
    (DomScreenshotRenderer.prototype.cleanup = function () {
      this.blobUrls.forEach(function (e) {
        try {
          URL.revokeObjectURL(e);
        } catch (e) {}
      });
      this.blobUrls.clear();
      this.resourcePool.clear();
      this.tasks = [];
    }),
    (DomScreenshotRenderer.prototype.drawImageFromUrl = function (e, t) {
      e &&
        (e = this.resourcePool.get(e)) &&
        e instanceof HTMLImageElement &&
        this.ctx.drawImage(e, t.left, t.top, t.width, t.height);
    }),
    (DomScreenshotRenderer.prototype.checkAndPreload = function (e) {
      var t = e.backgroundImage;
      t &&
        "none" !== t &&
        (n = t.match(/url\(["']?(.*?)["']?\)/)) &&
        this.preloadImage(n[1]);
      var n;
      var t = e.webkitMaskImage || e.maskImage;
      t &&
        "none" !== t &&
        (n = t.match(/url\(["']?(.*?)["']?\)/)) &&
        this.preloadImage(n[1]);
    }),
    (DomScreenshotRenderer.prototype.roundRectPath = function (e, t, n, r, i) {
      this.ctx.beginPath();
      this.ctx.moveTo(e + i, t);
      this.ctx.lineTo(e + n - i, t);
      this.ctx.quadraticCurveTo(e + n, t, e + n, t + i);
      this.ctx.lineTo(e + n, t + r - i);
      this.ctx.quadraticCurveTo(e + n, t + r, e + n - i, t + r);
      this.ctx.lineTo(e + i, t + r);
      this.ctx.quadraticCurveTo(e, t + r, e, t + r - i);
      this.ctx.lineTo(e, t + i);
      this.ctx.quadraticCurveTo(e, t, e + i, t);
      this.ctx.closePath();
    }),
    DomScreenshotRenderer);
  var screenshotQualityLevels = {
    THRESHOLDS: {
      TINY: 1e5,
      SMALL: 3e5,
      MEDIUM: 8e5,
      LARGE: 15e5,
      LLARGE: 25e5,
    },
    LEVELS: [
      {
        maxArea: 1e5,
        scale: 1,
        defaultQuality: 0.7,
      },
      {
        maxArea: 3e5,
        scale: 1,
        defaultQuality: 0.6,
      },
      {
        maxArea: 8e5,
        scale: 0.7,
        defaultQuality: 0.6,
      },
      {
        maxArea: 15e5,
        scale: 0.5,
        defaultQuality: 0.65,
      },
      {
        maxArea: 25e5,
        scale: 0.45,
        defaultQuality: 0.65,
      },
      {
        maxArea: 1 / 0,
        scale: 0.45,
        defaultQuality: 0.65,
      },
    ],
  };
  function DomScreenshotRenderer(e) {
    void 0 === e && (e = {});
    this.tasks = [];
    this.nodeCounter = 0;
    this.resourcePool = new Map();
    this.blobUrls = new Set();
    this.vw = 0;
    this.vh = 0;
    this.totalScale = 1;
    this.maxDepthReached = 0;
    this.depthLimitHitCount = 0;
    this.options = {
      useCORS: null == (t = e.useCORS) || t,
      scale: null != (t = e.scale) ? t : 1,
      quality: null != (t = e.quality) ? t : 0.8,
      format: null != (t = e.format) ? t : "webp",
      viewportOnly: null == (t = e.viewportOnly) || t,
      maxWidth: null != (t = e.maxWidth) ? t : 1920,
      maxHeight: null != (t = e.maxHeight) ? t : 1080,
      debug: null != (t = e.debug) && t,
    };
    this.canvas = document.createElement("canvas");
    var t;
    var e = this.canvas.getContext("2d", {
      alpha: !0,
    });
    if (!e) throw new Error("Failed to get 2D canvas context");
    this.ctx = e;
  }
  function getScreenshotQuality(t) {
    return screenshotQualityLevels.LEVELS.find(function (e) {
      return t <= e.maxArea;
    });
  }
  function cloneMatchers(e) {
    return {
      tagName: concatArrays(e.tagName || []),
      id: concatArrays(e.id || []),
      className: concatArrays(e.className || []),
    };
  }
  function normalizeSelectors(e) {
    return Array.isArray(e)
      ? e
          .filter(function (e) {
            return "string" == typeof e;
          })
          .map(function (e) {
            return e.trim();
          })
          .filter(Boolean)
      : [];
  }
  function classifyBlankPoint(e, t, n, r, i) {
    var o;
    var a;
    var s = (e = e.map(function (e) {
      return describeElement(e);
    })).map(function (e) {
      return e.selector;
    });
    return (e = e[0])
      ? ((a = o = !1),
        (a = hasMatchers(r)
          ? ((o = matchesElementRules(e, r)), matchesElementRules(e, i))
          : ((o = matchesSelectorList(e, t)), matchesSelectorList(e, n))),
        {
          isWhitePoint: o && !a,
          selectorPointers: s,
        })
      : {
          isWhitePoint: !1,
          selectorPointers: s,
        };
  }
  function resolveBlankScreenConfig(e) {
    try {
      var t;
      var n;
      var r;
      var i;
      var o;
      var a;
      var s = e.config.blankScreen;
      return !0 === s
        ? assign({}, blankScreenDefaults)
        : ((n = "containerMatchers" in (t = s) || "ignoreMatchers" in t),
          (r = "containers" in t || "ignoreContainers" in t),
          (i = mergeConfig(assign({}, blankScreenDefaults), t)),
          n
            ? (hasMatchers(i.containerMatchers) ||
                (i.containerMatchers = cloneMatchers(
                  blankScreenDefaults.containerMatchers,
                )),
              ("object" == typeof i.ignoreMatchers &&
                null !== i.ignoreMatchers) ||
                (i.ignoreMatchers = cloneMatchers(
                  blankScreenDefaults.ignoreMatchers,
                )),
              (i.containers = []),
              (i.ignoreContainers = []))
            : r &&
              ((o = normalizeSelectors(i.containers)),
              (a = normalizeSelectors(i.ignoreContainers)),
              (i.containers = o.length
                ? o
                : concatArrays(blankScreenDefaults.containers)),
              (i.ignoreContainers = a),
              (i.containerMatchers = {
                tagName: [],
                id: [],
                className: [],
              }),
              (i.ignoreMatchers = {
                tagName: [],
                id: [],
                className: [],
              })),
          i);
    } catch (e) {
      return assign({}, blankScreenDefaults);
    }
  }
  function elementsAtPoint(n, r) {
    function i(e) {
      var t = e[0];
      return t &&
        null !== t.shadowRoot &&
        (t =
          (null == (t = null == t ? void 0 : t.shadowRoot)
            ? void 0
            : t.elementsFromPoint(n, r)) || []).length > e.length
        ? i(t || [])
        : e;
    }
    var e = document.elementsFromPoint(n, r);
    return i(e);
  }
  function resizeScreenshot(i, o, a, s) {
    void 0 === o && (o = "image/webp");
    void 0 === a && (a = 1920);
    void 0 === s && (s = 1080);
    return awaiter(void 0, void 0, void 0, function () {
      var n;
      var r;
      return generator(this, function (e) {
        switch (e.label) {
          case 0:
            e.trys.push([0, 2, , 3]);
            n = Math.min(window.innerWidth, a);
            r = Math.min(window.innerHeight, s);
            n = getScreenshotQuality(n * r);
            r = n.scale;
            n = n.defaultQuality;
            return [
              4,
              new ScreenshotRenderer(
                (t =
                  void 0 ===
                  (t = {
                    scale: r,
                    quality: null != i ? i : n,
                    format:
                      {
                        "image/webp": "webp",
                        "image/jpeg": "jpeg",
                        "image/png": "png",
                      }[o] || "webp",
                    maxWidth: a,
                    maxHeight: s,
                    useCORS: !0,
                    viewportOnly: !0,
                    debug: !1,
                  })
                    ? {}
                    : t),
              ).capture(),
            ];
          case 1:
            return [2, e.sent()];
          case 2:
            return [
              2,
              (r = e.sent()) instanceof Error ? r : new Error(String(r)),
            ];
          case 3:
            return [2];
        }
        var t;
      });
    });
  }
  var describeElement = function (e) {
    var t = e.nodeName.toLowerCase();
    var n = e.id || "";
    var e =
      "string" == typeof (e = e).className
        ? e.className
        : e.getAttribute("class") || "";
    var r = t;
    n && (r += "#" + n);
    e &&
      (r += e
        .split(" ")
        .filter(function (e) {
          return !!e;
        })
        .map(function (e) {
          return "." + e;
        })
        .join(""));
    return {
      tagName: t,
      id: n,
      className: e,
      selector: r,
    };
  };
  var matchesElementRules = function (t, e) {
    var n;
    if (null != (n = null == e ? void 0 : e.tagName) && n.length) {
      var r = t.tagName.toLowerCase();
      if (
        e.tagName.some(function (e) {
          return r === e.toLowerCase().trim();
        })
      )
        return !0;
    }
    if (
      null != (n = null == e ? void 0 : e.id) &&
      n.length &&
      t.id &&
      e.id.some(function (e) {
        return t.id === e.trim();
      })
    )
      return !0;
    if (
      null != (n = null == e ? void 0 : e.className) &&
      n.length &&
      t.className
    ) {
      var i = t.className
        .split(" ")
        .map(function (e) {
          return e.trim();
        })
        .filter(Boolean);
      if (
        e.className.some(function (e) {
          e = e.trim();
          return !!e && i.includes(e);
        })
      )
        return !0;
    }
    return !1;
  };
  var matchesSelectorList = function (t, e) {
    return (
      !(null == e || !e.length) &&
      e.some(function (e) {
        return t.selector.includes(e);
      })
    );
  };
  var hasMatchers = function (e) {
    var t;
    return !(
      !e ||
      !(
        (null != (t = e.tagName) && t.length) ||
        (null != (t = e.id) && t.length) ||
        (null != (t = e.className) && t.length)
      )
    );
  };
  var mergeConfig = function (e) {
    for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
    if (!t.length) return e;
    var r = t.shift();
    if (r)
      for (var i in r) {
        var o = r[i];
        Array.isArray(o)
          ? (e[i] = concatArrays(o))
          : "object" == typeof o &&
              null !== o &&
              Object.prototype.hasOwnProperty.call(e, i) &&
              "object" == typeof e[i] &&
              null !== e[i] &&
              !Array.isArray(e[i])
            ? mergeConfig(e[i], o)
            : (e[i] = o);
      }
    return mergeConfig.apply(void 0, concatArrays([e], t));
  };
  var blankScreenPlugin = new pluginConstructor(
    createBlankScreenOptions({
      get BlankScreenTrigger() {
        return BlankScreenTrigger;
      },
      set BlankScreenTrigger(value) {
        BlankScreenTrigger = value;
      },
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get assign() {
        return assign;
      },
      set assign(value) {
        assign = value;
      },
      get awaiter() {
        return awaiter;
      },
      set awaiter(value) {
        awaiter = value;
      },
      get classifyBlankPoint() {
        return classifyBlankPoint;
      },
      set classifyBlankPoint(value) {
        classifyBlankPoint = value;
      },
      get describeElement() {
        return describeElement;
      },
      set describeElement(value) {
        describeElement = value;
      },
      get elementsAtPoint() {
        return elementsAtPoint;
      },
      set elementsAtPoint(value) {
        elementsAtPoint = value;
      },
      get generator() {
        return generator;
      },
      set generator(value) {
        generator = value;
      },
      get getScreenshotQuality() {
        return getScreenshotQuality;
      },
      set getScreenshotQuality(value) {
        getScreenshotQuality = value;
      },
      get resizeScreenshot() {
        return resizeScreenshot;
      },
      set resizeScreenshot(value) {
        resizeScreenshot = value;
      },
      get resolveBlankScreenConfig() {
        return resolveBlankScreenConfig;
      },
      set resolveBlankScreenConfig(value) {
        resolveBlankScreenConfig = value;
      },
      get screenshotQualityLevels() {
        return screenshotQualityLevels;
      },
      set screenshotQualityLevels(value) {
        screenshotQualityLevels = value;
      },
      get stringifyLog() {
        return stringifyLog;
      },
      set stringifyLog(value) {
        stringifyLog = value;
      },
      get visibleMediaTags() {
        return visibleMediaTags;
      },
      set visibleMediaTags(value) {
        visibleMediaTags = value;
      },
    }),
  );
  var lagMonitorPlugin =
    (new pluginConstructor({
      name: "lagMonitor",
    }),
    new pluginConstructor(
      createLagMonitorOptions({
        get LogLevel() {
          return LogLevel;
        },
        set LogLevel(value) {
          LogLevel = value;
        },
        get concatArrays() {
          return concatArrays;
        },
        set concatArrays(value) {
          concatArrays = value;
        },
      }),
    ));
  function hasMemoryAPI() {
    try {
      return (
        "undefined" != typeof window &&
        window.performance &&
        window.performance.memory &&
        "number" == typeof window.performance.memory.usedJSHeapSize
      );
    } catch (e) {}
  }
  function readMemory() {
    try {
      var e;
      var t;
      var n;
      return hasMemoryAPI()
        ? ((t = (e = window.performance.memory).usedJSHeapSize || 0),
          (n = e.jsHeapSizeLimit || 0),
          {
            usedJSHeapSize: t,
            totalJSHeapSize: e.totalJSHeapSize || 0,
            jsHeapSizeLimit: n,
            usageRatio: 0 < n ? Math.round((t / n) * 1e4) / 100 : 0,
            timestamp: Date.now(),
          })
        : null;
    } catch (e) {
      return null;
    }
  }
  function bytesToMegabytes(e) {
    return Math.round((e / 1048576) * 100) / 100;
  }
  new pluginConstructor({
    name: "memoryMonitor",
  });
  pluginConstructor = new pluginConstructor(
    createMemoryMonitorOptions({
      get LogLevel() {
        return LogLevel;
      },
      set LogLevel(value) {
        LogLevel = value;
      },
      get SendType() {
        return SendType;
      },
      set SendType(value) {
        SendType = value;
      },
      get bytesToMegabytes() {
        return bytesToMegabytes;
      },
      set bytesToMegabytes(value) {
        bytesToMegabytes = value;
      },
      get concatArrays() {
        return concatArrays;
      },
      set concatArrays(value) {
        concatArrays = value;
      },
      get hasMemoryAPI() {
        return hasMemoryAPI;
      },
      set hasMemoryAPI(value) {
        hasMemoryAPI = value;
      },
      get readMemory() {
        return readMemory;
      },
      set readMemory(value) {
        readMemory = value;
      },
    }),
  );
  runtimeAlias.use(errorPlugin);
  runtimeAlias.use(apiSpeedPlugin);
  runtimeAlias.use(assetSpeedPlugin);
  runtimeAlias.use(pagePerformancePlugin);
  runtimeAlias.use(webVitalsPlugin);
  runtimeAlias.use(anonymousIdPlugin);
  runtimeAlias.use(devicePlugin);
  runtimeAlias.use(spaPlugin);
  runtimeAlias.use(pageClosePlugin);
  runtimeAlias.use(clickPlugin);
  runtimeAlias.use(consolePlugin);
  runtimeAlias.use(lagMonitorPlugin);
  runtimeAlias.use(pluginConstructor);
  runtimeAlias.use(bridgeSpeedPlugin);
  runtimeAlias.use(blankScreenPlugin);
  return runtimeAlias;
}
