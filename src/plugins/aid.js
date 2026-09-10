/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createAidOptions(shared) {
  return {
    name: "aid",
    aid: "",
    init: function (e) {
      try {
        var t = (!0 !== e && e) || window.localStorage.getItem("AEGIS_ID");
        t ||
          ((t = (0, shared.createAnonymousId)()),
          window.localStorage.setItem("AEGIS_ID", t));
        this.aid = t;
      } catch (e) {}
    },
    onNewAegis: function (e) {
      e.bean.aid = this.aid;
      e.config.aid = this.aid;
    },
  };
}
