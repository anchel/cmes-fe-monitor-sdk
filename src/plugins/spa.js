/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createSpaOptions(shared) {
  return {
    name: "spa",
    originFireUrl: "",
    onNewAegis: function (t) {
      var n = this;
      history.pushState = this.wr("pushState") || history.pushState;
      history.replaceState = this.wr("replaceState") || history.replaceState;
      this.sendPv = this.sendPv.bind(this);
      t.config.spa && this.sendPv(t);
      shared.spaEvents.forEach(function (e) {
        return window.addEventListener(e, function () {
          return n.sendPv.call(n, t);
        });
      });
    },
    wr: function (n) {
      var r = history[n];
      var e = "__" + n + "__hasWrittenByTamSpa";
      return (
        "function" == typeof r &&
        !history[e] &&
        (Object.defineProperty(history, e, {
          value: !0,
          enumerable: !1,
        }),
        function () {
          var e = r.apply(this, arguments);
          var t = null;
          "function" == typeof Event
            ? (t = new Event(n))
            : (t = document.createEvent("HTMLEvents")).initEvent(n, !1, !0);
          window.dispatchEvent(t);
          return e;
        })
      );
    },
    sendPv: function (i) {
      var n = this;
      setTimeout(function () {
        var t = location.pathname + location.hash + i.config.id;
        n.$walk(function (e) {
          var r;
          e === i &&
            (r = e.config.pvUrl) &&
            t &&
            t !== n.originFireUrl &&
            (e.sendPipeline(
              [
                function (e, t) {
                  var n = null != r && r.includes("?") ? "&" : "?";
                  t({
                    url:
                      r +
                      n +
                      "originFrom=" +
                      encodeURIComponent(i.getOriginFrom()),
                    type: shared.SendType.PV,
                  });
                },
              ],
              shared.SendType.PV,
            )(null),
            (n.originFireUrl = t));
        });
      }, 0);
    },
    destroy: function () {
      this.option.sendPv = function () {};
    },
  };
}
