/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createOnErrorOptions(shared) {
  return {
    name: "onError",
    onNewAegis: function (e) {
      this.startListen(e);
    },
    getFromParam: function (e) {
      return e.getCurrentPageUrl();
    },
    startListen: function (a) {
      function e(e) {
        var t;
        var n = e && (0, shared.stringifyLog)(e.reason);
        n &&
          s.publishErrorLog(
            {
              msg: "PROMISE_ERROR: " + n,
              errorMsg:
                null ==
                (t =
                  null ==
                  (e =
                    (null == (t = e.reason) ? void 0 : t.message) ||
                    (null == (t = e.reason) ? void 0 : t.errMsg) ||
                    n)
                    ? void 0
                    : e.slice)
                  ? void 0
                  : t.call(e, 0, 150),
              level: shared.LogLevel.PROMISE_ERROR,
              from: s.getFromParam(a),
              originFrom: a.getOriginFrom(),
            },
            a,
          );
      }
      function t(e) {
        var t;
        if (
          (e =
            (null == e ? void 0 : e.target) ||
            (null == e ? void 0 : e.srcElement))
        ) {
          var n = e.src || e.href || "";
          var r = e.tagName;
          var r = (void 0 === r ? "script" : r).toLowerCase();
          var i = ["audio", "video"].includes(r);
          if (!i || (null != e && e.error)) {
            if (!(
              (0, shared.isIgnoredUrl)((t = n), a.config.hostUrl) ||
              -1 < window.location.href.indexOf(t)
            )) {
              var o = {
                msg:
                  r +
                  " load fail: " +
                  n +
                  " " +
                  (i
                    ? "\n\nerror code: " +
                      (null == (t = null == e ? void 0 : e.error)
                        ? void 0
                        : t.code) +
                      ("" !==
                      (null == (i = null == e ? void 0 : e.error)
                        ? void 0
                        : i.message)
                        ? "\nerror msg: " +
                          (null == (t = null == e ? void 0 : e.error)
                            ? void 0
                            : t.message)
                        : "")
                    : ""),
                level: shared.LogLevel.INFO,
                from: s.getFromParam(a),
                originFrom: a.getOriginFrom(),
              };
              if (/\.js$/.test(n)) o.level = shared.LogLevel.SCRIPT_ERROR;
              else if (/\.css$/.test(n)) o.level = shared.LogLevel.CSS_ERROR;
              else
                switch (r) {
                  case "script":
                    o.level = shared.LogLevel.SCRIPT_ERROR;
                    break;
                  case "link":
                    o.level = shared.LogLevel.CSS_ERROR;
                    break;
                  case "img":
                    o.level = shared.LogLevel.IMAGE_ERROR;
                    break;
                  case "audio":
                  case "video":
                    o.level = shared.LogLevel.MEDIA_ERROR;
                    break;
                  default:
                    return;
                }
              s.publishErrorLog(o, a);
            }
          } else
            console.log("may be media load success because error is undefine");
        }
      }
      var n;
      var r;
      var i;
      var o;
      var s = this;
      var l = window.onerror;
      window.onerror = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        var n;
        var r = (0, shared.stringifyLog)(e[0]);
        "string" != typeof (n = r) ||
          !n ||
          shared.ignoredErrorMessages.some(function (e) {
            return -1 < n.indexOf(e);
          }) ||
          shared.ignoredReportUrls.some(function (e) {
            return -1 < n.indexOf(e);
          }) ||
          s.publishErrorLog(
            {
              msg:
                (r || "") +
                " @ (" +
                ((0, shared.stringifyLog)(e[1]) || "") +
                ":" +
                (e[2] || 0) +
                ":" +
                (e[3] || 0) +
                ")\n          \n" +
                (0, shared.stringifyLog)(e[4] || ""),
              level: shared.LogLevel.ERROR,
              from: s.getFromParam(a),
              originFrom: a.getOriginFrom(),
            },
            a,
          );
        null != l && l.call.apply(l, (0, shared.concatArrays)([window], e));
      };
      window.addEventListener("unhandledrejection", e);
      window.document.addEventListener("error", t, !0);
      a.lifeCycle.on("destroy", function () {
        0 === shared.errorPluginAlias.countInstance() &&
          (window.document.removeEventListener("unhandledrejection", e),
          window.document.removeEventListener("error", t, !0));
      });
      a.config.websocketHack &&
        ((n = {
          key: a.config.id + "-" + this.name,
          onErr: function (e) {
            var t;
            null != (t = s.publishWsErrorLog) && t.call(s, e, a);
          },
          sendErr: function (e) {
            var t;
            null != (t = s.publishWsErrorLog) && t.call(s, e, a);
          },
        }),
        (this.hackWebsocketConfig = n),
        (n = this.hackWebsocketConfig),
        window.Proxy) &&
        window.WebSocket &&
        ((r = window.WebSocket),
        window &&
          !r.isHack &&
          ((i = new Proxy(WebSocket, shared.websocketProxyHandler)),
          (r.isHack = !0),
          (window.WebSocket = i)),
        (o = n),
        shared.websocketListeners.find(function (e) {
          return e.key === o.key;
        }) ||
          (o && shared.websocketListeners.push(o)));
    },
    publishErrorLog: function (t, n) {
      this.$walk(function (e) {
        e === n && e.normalLogPipeline(t);
      });
    },
    publishWsErrorLog: function (e, t) {
      var n = e.connectUrl;
      this.publishErrorLog(
        {
          msg:
            "WEBSOCKET_ERROR: \n              connect: " +
            n +
            "\n              readyState: " +
            e.readyState +
            "\n              msg: " +
            e.msg,
          level: shared.LogLevel.WEBSOCKET_ERROR,
          from: this.getFromParam(t),
          originFrom: t.getOriginFrom(),
        },
        t,
      );
    },
    destroy: function () {
      var t;
      var e;
      this.option.publishErrorLog = function () {};
      this.option.hackWebsocketConfig &&
        ((t = this.option.hackWebsocketConfig),
        (window.WebSocket = shared.OriginalWebSocket),
        -1 !==
          (e = shared.websocketListeners.findIndex(function (e) {
            return e.key === t.key;
          }))) &&
        shared.websocketListeners.splice(e, 1);
    },
  };
}
