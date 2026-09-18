# 使用方式与配置

## 构造与静态字段

`new CmesMonitor(config)` 与 `new Aegis(config)` 使用同一构造函数。保留 `use(plugin)`、`unuse(plugin)`、`instances`、`installedPlugins`、`logType`、`environment`、`version`、`sessionID`、`compressionSupported`、`resolveGzipConfig()`。

`version` 和实例 `__version__` 为 `1.43.60`。本发行版另提供 `sdkName`、`sdkVersion`、`referenceVersion`，不改变报文字段。不要依赖 JavaScript `Function.name`、内部局部变量或报错堆栈中的函数名与压缩包相同。

## 日常 API

| API | 行为 |
| --- | --- |
| `info(...args)` | 普通日志，受白名单控制 |
| `infoAll(...args)` | 不受白名单控制，最终以 INFO level 发送 |
| `report(...args)` | REPORT 日志；对象参数可提供自定义 level |
| `error(...args)` | ERROR 日志 |
| `reportEvent(nameOrObject)` | 事件名字符串或 `{name, ext1…ext10, from?, originFrom?}` |
| `reportTime(name, duration)` | 自定义耗时，并产生 SPEED_EVENT 日志 |
| `reportTime({name,duration,...})` / `reportT({...})` | 自定义耗时对象形式 |
| `time(name)` | 以 Date.now() 记录开始时刻 |
| `timeEnd(nameOrObject)` | 结束计时并上报，可附加 ext 字段 |
| `reportPageView(url?)` | 手动 PV |
| `reportWebVitals(metrics?)` | manualReport 模式下触发原 Web Vitals 手动管线 |
| `setConfig(partial)` | 合并配置，更新 bean，特定字段变化触发生命周期 |
| `ready()` | reportImmediately:false 时开始清空等待队列 |
| `destroy(hard=false)` | 移除实例并执行原插件卸载/失效方法逻辑 |
| `uploadLogs(options?, extra?)` | 发出 uploadLogs 事件，内置没有离线上传监听器 |
| `reportPv(value?)` | 原包已弃用：仅可能输出警告，不上报；用 reportPageView |

日志支持 `{msg, ext1…ext10, level, from, originFrom, errorMsg, trace, tag, seq, code}`。普通 `info/error/infoAll` 会固定各自等级；`report` 允许对象覆盖。非字符串 msg 按原有安全序列化处理，支持 Error 和循环引用。不要向要求对象结构的入口传 null。

`from` 是高级字段，原分组管线会直接拼入 URL；手动提供完整 URL 时应使用 `encodeURIComponent(url)`。`reportPageView(url)` 则接受未编码 URL 并自行编码。

## 常用配置

| 配置 | 默认 / 说明 |
| --- | --- |
| `id` | 必填项目标识 |
| `hostUrl` | `/monitor` |
| `uin` / `aid` | 用户 / 匿名标识；aid 默认启用自动生成 |
| `delay` | 1000ms，批量防抖 |
| `repeat` | 60，重复日志/测速限制；设为 0 可关闭 |
| `random` | 1，全局采样比例，0…1 |
| `env` | production |
| `maxLength` | 实际管线默认 10240，单条 msg 最大长度 |
| `pageUrl` / `urlHandler` | 自定义上报页面 URL；后者为返回 URL 的函数 |
| `ext1`…`ext10` | 全局扩展字段 |
| `reportImmediately` | true；false 时需调用 ready |
| `reportRetry` | 默认关闭；可传 true 或重试配置对象 |
| `gzip` | true；可传 `{enable, threshold, debug, useWorker, workerThreshold}` |
| `enableWhitelist` | 默认 false；开启后请求 `/collect/whitelist`，按响应做 info 过滤、总采样率与 gzip 协商 |
| `enableRateConfig` | 默认 false；开启后请求 `/rateConfig`，按响应做分类采样，并在配置就绪前暂存日志 |

插件开关见 README。额外插件选项通过原运行时原样传递；类型声明含开放扩展字段，不能仅凭 TypeScript 接受某个字段就推断它有对应运行时实现。

### 接口采集与链路追踪

```js
const monitor = new CmesMonitor({
  id: 'project',
  hostUrl: '/monitor',
  reportApiSpeed: true,
  api: {
    apiDetail: true,
    reportRequest: true,
    reqHeaders: ['content-type'],
    resHeaders: ['content-type'],
    injectTraceHeader: 'traceparent',
    injectTraceUrls: [/\/api\//],
    // 显式配置后才判断业务返回码；省略时不自动解析 code/ret 等字段。
    retCodeHandler(data) {
      const json = typeof data === 'string' ? JSON.parse(data) : data;
      return { code: json.code, isErr: json.code !== 0 };
    },
  },
});
```

保留 `ret`、`reqParamHandler`、`resBodyHandler`、`resourceTypeHandler`、`isSlowApi`、`usePerformanceTiming`、`injectTraceIgnoreUrls`、`traceFlag` 等配置。`api.isSlowApi` 接收请求/耗时对象。采集器跳过 SDK 自身地址及上游内置忽略地址清单。

### 内存、卡顿、白屏

```js
const monitor = new CmesMonitor({
  id: 'project',
  hostUrl: '/monitor',
  memoryMonitor: {
    enabled: true,
    memoryReportInterval: 60000,
    oomCheckInterval: 10000,
    oomThreshold: 200, // MB
  },
  lagMonitor: { enabled: true, threshold: 2000, noResponseThreshold: 5000 },
  blankScreen: {
    containers: ['body', 'html', '#app', '#root'],
    debounceDuration: 2000,
    reDetectInterval: 2000,
    enableScreenshot: false,
  },
});
```

内存依赖 `performance.memory`，卡顿依赖 `PerformanceObserver` 的 `long-animation-frame`。白屏截图默认关闭；支持 `containerMatchers`、`ignoreMatchers`、`ignoreContainers`、`detectStartPosition`、`emptyElementsPercent`、`sameElementsPercent`、`everySideSampleNumber`、`disableSameElementsCheck`、`samePointDepth`、`needScreenShotMeta` 等。更多配置可在 `src/runtime.js` 的 `blankScreenDefaults` 和 `src/plugins/blankScreen.js` 查看，拼写保留原样。

### Bridge 测速

```js
new CmesMonitor({
  id: 'project',
  reportBridgeSpeed: true,
  h5Bridge: window.yourBridge,
  h5BridgeFunc: ['call'],
});
```

此包按 `bridgeFunction(service, method, params, callback)` 包装回调，并生成 `type:'bridge'` 测速记录。

## 钩子和生命周期

```js
new CmesMonitor({
  id: 'project',
  logCreated(log) { return log.msg !== 'ignore'; },
  beforeReport(log) { return log.level !== '2'; },
  beforeReportSpeed(speed) { return !speed.url.includes('/health'); },
  beforeRequest({ logs, logType }) { return { logs, logType }; },
  modifyRequest(request) { return request; },
  onBeforeRequest(request, instance) { return request; },
  afterRequest({ isErr, logs, logType, result }) { /* 完成回调 */ },
  onWhitelist(isWhiteList) { /* 白名单响应 */ },
});
```

`logCreated/beforeReport/beforeReportSpeed` 返回 false 过滤记录，`beforeRequest` 返回 false 过滤管线项。`onBeforeRequest` 必须返回请求对象，返回 false/undefined 会阻止请求。`modifyRequest` 可返回含 url 的对象。`afterRequest` 不会收到 Beacon 的完成通知。

实例的 `lifeCycle` 保留 `on/one/emit/remove/clear`，主要事件包括 `onConfigChange`、`onInited`、`beforeWrite`、`beforeReport`、`beforeReportSpeed`、`beforeRequest`、`modifyRequest`、`afterRequest`、`errorOccurred`、`destroy`、`uploadLogs`。

高级入口 `extendBean/addExtBean/getBean/getCurrentPageUrl/getOriginFrom`、`normalLogPipeline/eventPipeline/customTimePipeline/speedLogPipeline`、`send/sendPipeline/request/$request`、`sendXhr/sendWithGzip`、`submitCustomTime`、`publishPluginsLogs`、`sendSDKError` 也保留，详见类型声明和源码。它们沿用原来的副作用与参数语义。

## 自定义插件

```js
const plugin = {
  name: 'customPlugin',
  aegisPlugin: true,
  patch(instance) { /* 注册采集逻辑 */ },
  unpatch(instance) { /* 清理采集逻辑 */ },
};
CmesMonitor.use(plugin);
const monitor = new CmesMonitor({ id: 'project' });
// monitor.destroy() 时调用 unpatch。
```

`use()` 只注册插件，既有实例不会自动补装；`unuse()` 只移除注册，不自动 unpatch 已装实例。这与参考文件一致。
