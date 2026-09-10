/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createDeviceOptions(shared) {
  return {
    name: "device",
    onNewAegis: function (e) {
      e.extendBean("platform", this.getPlatform());
      e.extendBean("netType", shared.NetworkType.unknown);
      this.getDpi(e);
      this.refreshNetworkTypeToBean(e);
      this.refreshNetworkStatusToBean(e);
    },
    getDpi: function (e) {
      e.extendBean(
        "vp",
        Math.round(window.innerWidth) + " * " + Math.round(window.innerHeight),
      );
      window.screen &&
        e.extendBean(
          "sr",
          Math.round(window.screen.width) +
            " * " +
            Math.round(window.screen.height),
        );
    },
    getPlatform: function () {
      var t = {
        android: /\bAndroid\s*([^;]+)/,
        ios: /\b(iPad|iPhone|iPod)\b.*? OS ([\d_]+)/,
        windows: /\b(Windows NT)/,
        macos: /\b(Mac OS)/,
        linux: /\b(Linux)/i,
      };
      var e = Object.keys(t).find(function (e) {
        return t[e].test(navigator.userAgent);
      });
      return e ? shared.PlatformType[e] : shared.PlatformType.other;
    },
    refreshNetworkTypeToBean: function (t) {
      var n = this;
      var e = t.config;
      e &&
        ("function" == typeof e.getNetworkType
          ? e.getNetworkType
          : shared.readNetworkType)(function (e) {
          shared.NetworkType[e] || (e = shared.NetworkType.unknown);
          t.extendBean("netType", e);
          n.NetworkRefreshTimer = setTimeout(function () {
            n.refreshNetworkTypeToBean(t);
            clearTimeout(n.NetworkRefreshTimer);
          }, 1e4);
        });
    },
    refreshNetworkStatusToBean: function (t) {
      var e;
      var n = this;
      var r = t.config;
      r &&
        null !=
          (e =
            "function" == typeof r.getNetworkStatus ? r.getNetworkStatus : e) &&
        e(function (e) {
          void 0 === shared.NetworkStatus[e] &&
            (e = shared.NetworkStatus.unknown);
          t.extendBean("netStatus", e);
          n.NetworkStatusRefreshTimer = setTimeout(function () {
            n.refreshNetworkStatusToBean(t);
            clearTimeout(n.NetworkStatusRefreshTimer);
          }, 1e4);
        });
    },
  };
}
