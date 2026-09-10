/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createClickElementLogOptions(shared) {
  return {
    name: "clickElementLog",
    listeners: [],
    onNewAegis: function (e) {
      this.startListen(e);
    },
    startListen: function (a) {
      for (
        var e = function (o) {
            t.listeners.push(
              ((e, t, n, r) => {
                function i(e) {
                  var t = document.documentElement;
                  t && n.call(t, e, e.target);
                }
                void 0 === r && (r = !0);
                e.addEventListener(t, i, r);
                return {
                  destroy: function () {
                    e.removeEventListener(t, i, r);
                  },
                };
              })(
                document,
                o,
                function (e, t) {
                  var n;
                  var r;
                  var i;
                  t &&
                    !((e, t) => {
                      n =
                        (0, shared.toLookupMap)(
                          (null == (n = (e = e).ignoreElements)
                            ? void 0
                            : n.ignoreClasses) || [],
                        ) || new Map();
                      for (
                        var n,
                          r = (e = {
                            ignoreIds:
                              (0, shared.toLookupMap)(
                                (null == (e = e.ignoreElements)
                                  ? void 0
                                  : e.ignoreIds) || [],
                              ) || new Map(),
                            ignoreClasses: n,
                          }).ignoreClasses,
                          i = e.ignoreIds,
                          o = !(0 === i.size && 0 === r.size),
                          a = t,
                          s =
                            ((0, shared.splitString)(
                              t.getAttribute("id") || "",
                              " ",
                            ),
                            (0, shared.splitString)(
                              t.getAttribute("class") || "",
                              "",
                            ),
                            0),
                          l = !1;
                        a && o && a.getAttribute;
                      ) {
                        if (l) return !0;
                        if (10 <= s) break;
                        for (
                          var c = (0, shared.splitString)(
                              a.getAttribute("id") || "",
                              " ",
                            ),
                            u = (0, shared.splitString)(
                              a.getAttribute("class") || "",
                              "",
                            ),
                            d = 0,
                            f = c;
                          d < f.length;
                          d++
                        ) {
                          var h = f[d];
                          if (i.has(h)) {
                            l = !0;
                            break;
                          }
                        }
                        for (var p = 0, m = u; p < m.length; p++) {
                          var g = m[p];
                          if (r.has(g)) {
                            l = !0;
                            break;
                          }
                        }
                        s += 1;
                        a = a.parentNode || a.parentElement;
                      }
                      return !1;
                    })(a.config, t) &&
                    ((n = (0, shared.getElementPath)(t)),
                    (r = (0, shared.getElementText)(t)),
                    (i = t.getBoundingClientRect && t.getBoundingClientRect()),
                    (t = {
                      op: o,
                      view_type: (null == t ? void 0 : t.nodeName) || "",
                      view_text: r.slice(0, 127),
                      view_tag: n,
                      page: (0, shared.getLocationHref)(),
                      page_id: (0, shared.getLocationHref)(),
                      view_pos: {
                        p0:
                          (parseInt(String(i.left), 10) || -1) +
                          "," +
                          (parseInt(String(i.top), 10) || -1),
                        p1:
                          (parseInt(String(i.left + window.scrollX), 10) ||
                            -1) +
                          "," +
                          (parseInt(String(i.top + window.scrollY), 10) || -1),
                      },
                    }),
                    a.normalLogPipeline({
                      msg: t,
                      level: shared.LogLevel.CLICK_EVENT,
                      errorMsg: "",
                      originFrom: a.getOriginFrom(),
                    }));
                },
                !0,
              ),
            );
          },
          t = this,
          n = 0,
          r = Object.entries({
            click: 1,
            longpress: 2,
          });
        n < r.length;
        n++
      )
        e(r[n][0]);
    },
    destroy: function () {
      this.listeners.forEach(function (e) {
        return e.destroy();
      });
      this.listeners = [];
    },
  };
}
