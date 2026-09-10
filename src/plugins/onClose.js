/**
 * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.
 * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.
 * Derived from the supplied bundle; original TypeScript/local symbol names were not available.
 */
export default function createOnCloseOptions(shared) {
  return {
    name: "onClose",
    onNewAegis: function (e) {
      var t = this;
      var n = !1;
      (0, shared.onPageExit)(
        function () {
          n || ((n = !0), t.publishNotReportedLog(e));
        },
        {
          events: ["pagehide", "beforeunload"],
        },
      );
    },
    publishNotReportedLog: function (t) {
      var n = this;
      this.$walk(function (e) {
        e === t &&
          ((e.sendNow = !0),
          e.publishPluginsLogs(),
          n.publishThrottlePipeLogs(e));
      });
    },
    publishThrottlePipeLogs: function (e) {
      null != e && e.speedLogPipeline([]);
      null != e && e.eventPipeline([]);
      null != e && e.customTimePipeline([]);
      null != e && e.normalLogPipeline([]);
    },
  };
}
