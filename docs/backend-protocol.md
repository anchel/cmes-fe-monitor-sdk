# 后端协议：Aegis 1.43.60 兼容

协议从提供的 SDK 源文件及隔离环境捕获的请求提取，不依赖腾讯服务。下文假设 `hostUrl='/monitor'`；若设置为其他地址，替换此前缀即可。基址不要带末尾 `/`，也不要带查询参数。

## 1. 端点

| 路径（相对 hostUrl） | 常规传输 | 数据位置 / 用途 |
| --- | --- | --- |
| `/rateConfig` | GET | 查询公共字段；响应分类采样配置。**可选**，需 `enableRateConfig: true` |
| `/collect/whitelist` | GET | 查询公共字段；响应日志白名单、总采样率与 gzip 开关。**可选**，需 `enableWhitelist: true` |
| `/collect` | POST | JSON 列式日志；SDK 自身诊断也会用 GET 查询参数 |
| `/collect/pv` | GET | 查询公共字段、`from`、`originFrom` |
| `/collect/events` | POST | JSON 中 `payload` 为事件数组的 JSON 字符串 |
| `/speed` | POST | JSON 中 `payload` 为分组测速对象的 JSON 字符串 |
| `/speed/custom` | POST | JSON 中 `payload` 为 `{custom:[...]}` 的 JSON 字符串 |
| `/speed/performance` | GET | 页面性能指标在查询参数 |
| `/speed/webvitals` | 通常 Beacon POST；无 Beacon 时 GET | Web Vitals 指标在查询参数 |
| `/memory` | POST | 指标在查询参数；不要依赖 body |

页面退出或显式 `sendBeacon` 会把原本 GET 的上报变为 POST，指标仍在 URL。数据端点建议同时接受 GET/POST，按路径和实际报文解析。控制端点正常使用 GET。

初始化还生成 `/offline`、`/speed/hippyPerformance`、`/speed/miniProgramData` 地址。**此 web 包没有对应的自动发送实现**，不能据此推断其他平台的完整协议。`uploadLogs()` 只发出生命周期事件，内置插件未实现离线日志上传。后端可预留路径；不要把它们误当成已实现的 Web 能力。

## 2. 公共查询参数（bean）

公共字段在传输前追加至 URL，若请求已提供非空字段则保留。`beanFilter` 可排除字段，`addBean:false` 可完全禁用附加。

| 字段 | 含义 |
| --- | --- |
| `id` | 项目标识，构造必填；空 id 时传输层不发送 |
| `uin` | 用户标识；未配置时可能读取 `uin` / `ilive_uin` Cookie |
| `aid` | 匿名标识，可显式设置；自动生成时存入 `localStorage.AEGIS_ID` |
| `version` | 默认 `1.43.60`；可通过配置覆盖 |
| `env` | production/development/gray/pre/daily/local/test/others |
| `from` | 页面 URL；来自 `pageUrl`、`urlHandler()` 或当前页面，截取最多 2048 字符后编码 |
| `originFrom` | 部分上报的实际页面 URL；可存在于查询或日志中，与虚拟 `from` 区分 |
| `sessionId` | 会话标识；与 `__MONITOR_SESSION_V1__` 会话缓存协作 |
| `referer` | `document.referrer`，字段拼写就是 referer |
| `ext1`…`ext10` | 全局扩展字段；部分上报支持单条字段覆盖 |
| `platform`、`netType`、`netStatus`、`vp`、`sr` | device 插件附加的设备、网络、视口和屏幕信息，字段集合依浏览器及配置而变 |
| `sampled` | 成功取得分类限流配置后追加 `1`，不是采样权重 |

标准 URL 查询解析已完成一次百分号解码，不要对所有字段反复 `decodeURIComponent`。`id`/`uin` 在原实现中直接拼接，建议使用不含 `&`、`=`、`#` 的普通标识。记录层保留未知字段，便于扩展。

## 3. 控制响应：可选

两个控制端点默认关闭。只实现日志与指标端点即可让 SDK 正常工作：不发控制请求，日志不被白名单过滤，也不会等待限流配置。原 SDK 始终请求这两个端点，本项目把它们改成显式开启，方便自建后端分阶段落地。

需要白名单或分类采样时，在构造配置里开启对应开关，并实现下面的响应格式：

```js
new CmesMonitor({ id: 'project', hostUrl: '/monitor', enableWhitelist: true, enableRateConfig: true });
```

开启后的请求时机、重试退避和响应语义与原 SDK 一致。

### GET /rateConfig

最小全量接收配置：

```json
{"retcode":0,"configs":[],"ttl":300}
```

按类别采样：

```json
{
  "retcode": 0,
  "configs": [
    {"limit_type":"jsError","sample_rate":100},
    {"limit_type":"log","sample_rate":20},
    {"limit_type":"speed","sample_rate":10}
  ],
  "ttl": 300
}
```

`sample_rate` 是 **0…100 的百分数**。缺少分类表示放行，`0` 丢弃，`100` 全量。`ttl` 单位是秒；正数时定时刷新。支持的分类：

| limit_type | 对应数据 |
| --- | --- |
| `jsError` | level 4、8 |
| `whiteScreen` | level 1032 |
| `assetsException` | level 32、64、128、512 |
| `log` | 其他日志以及 memory 指标 |
| `speed` | 接口、资源、Bridge 测速 |
| `performance` | 页面性能 |
| `webvitals` | Web Vitals |
| `pv` | PV |
| `event` | 自定义事件 |
| `custom` | 自定义耗时 |
| `miniProgramData` | 保留的跨端类别 |

启动后通常延迟 50ms（有 uin）或 500ms 发请求。配置未就绪时，最多暂存 200 个待处理管线项。无效响应/失败会放行首次等待队列，并按 3、30、300 秒重试。后续已有配置时继续应用原状态。普通数据通常由客户端按类别随机丢弃，后端不能仅凭 `sampled=1` 还原原始总量。

### GET /collect/whitelist

```json
{
  "retcode": 0,
  "result": {
    "is_in_white_list": true,
    "rate": 1,
    "use_gzip": 1
  }
}
```

- `is_in_white_list`：使用 JSON 布尔值。决定 `info()`、正常接口响应详情日志是否放行。
- `rate`：**0…1 的比例**，与 `sample_rate` 的单位不同；更新 SDK 的全局 `random`。
- `use_gzip`：`1` 或字符串 `"1"` 允许 gzip，`0` 禁用。缺失/null/空字符串在原实现中也表示允许。
- `retcode` 使用数值 `0`，不要返回字符串 `"0"`。

白名单响应前普通 info 会暂存（最多 200 条），命中后发送，否则清空。`infoAll()` 在上报前转换为 level `2`，不受白名单限制，但仍受全局采样和分类限流。`api.reportRequest:true` 可放行正常接口详情日志。

原实现默认允许 gzip，因此后端尚不支持时，应同时在客户端配置 `gzip:false`，避免在白名单响应前收到压缩数据。

## 4. 日志 POST /collect

`Content-Type: application/json`；请求体是**字段列数组**，不是日志对象数组：

```json
{
  "level": ["4", "2048"],
  "msg": ["订单提交失败", "应用启动"],
  "originFrom": ["https://app.example/home", "https://app.example/home"],
  "ext2": ["order-42", ""],
  "count": 2
}
```

`count` 指行数，按下标把每一列还原成记录。不同记录缺少的可选字段可能填 `""`；列值中的假值可能也被原序列化器转换为 `""`。除 `msg`/`level` 外，还可能有 `errorMsg`、`time`、`trace`、`tag`、`seq`、`code`、`ext1`…`ext10` 等。不要要求每条日志都有客户端时间戳，可在服务端记录接收时间。

单批最多达到 5 条时会提前刷新，否则按 `delay`（默认 1000ms）防抖。默认 `maxLength` 为 10240，普通错误按消息前缀去重，`repeat` 默认 60。不同 `from` 的记录会被拆为独立请求；`from` 移入 URL，不是日志 body 的固定列。

常用 level 是**字符串**：

| 值 | 类型 |
| --- | --- |
| `1` | API_RESPONSE |
| `2` | INFO（包括 infoAll 转换后的日志） |
| `4` | ERROR |
| `8` | PROMISE_ERROR |
| `16` | AJAX_ERROR |
| `32` / `64` / `128` | SCRIPT_ERROR / IMAGE_ERROR / CSS_ERROR |
| `256` / `512` | CONSOLE_ERROR / MEDIA_ERROR |
| `1024` | RET_ERROR |
| `1025` / `1026` | PAGE_LOAD / SLOW_PAGE_LOAD |
| `1027` / `1028` / `1029` | SLOW_NET_REQUEST / ASSERT_REQUEST / SLOW_ASSET_REQUEST |
| `1030` / `1031` | CLICK_EVENT / CONSOLE_LOG |
| `1032` | BLANK_SCREEN（截图 data URL 可在 errorMsg 中） |
| `1033` / `1034` / `1035` | MEMORY_OOM / LAG_MONITOR / NORESPONSE_LOG |
| `2048` | REPORT |
| `4096` / `8192` / `8193` | PV / EVENT / SPEED_EVENT 常量 |
| `16384` / `32768` / `65536` | PAGE_NOT_FOUND_ERROR / WEBSOCKET_ERROR / BRIDGE_ERROR |
| `131072` / `262144` | LAZY_LOAD_ERROR / CRASH_ERROR 常量 |

存在某个常量不意味着本 Web 包自动产生该类别。SDK 内部诊断采用 `GET /collect?id=1085&msg[0]=...&level[0]=2&count=1...`，`from` 放项目 id；保留它是为了匹配原行为。接收端可按这一特征单独归类。

## 5. 自定义事件 /collect/events

```json
{"payload":"[{\"name\":\"checkout\",\"originFrom\":\"https://app.example/cart\",\"ext1\":\"cart\",\"ext2\":\"\",\"ext3\":\"\",\"ext4\":\"\",\"ext5\":\"\",\"ext6\":\"\",\"ext7\":\"\",\"ext8\":\"\",\"ext9\":\"\",\"ext10\":\"\"}]"}
```

解析流程：先解析 body，再 `JSON.parse(body.payload)` 得到事件数组。`name` 为事件名，扩展字段最终转成字符串，前三项截取到 1024 字符；单条未提供时回退到全局配置。达到 10 条提前刷新。

## 6. 测速 /speed

外层仍为 `{"payload":"...JSON 字符串..."}`。内层示意：

```json
{
  "duration": {
    "fetch": [{"url":"https://api.example/orders","method":"POST","type":"fetch","duration":87,"status":200,"ret":"0","isErr":0}],
    "static": [],
    "bridge": []
  },
  "id":"project",
  "uin":"user",
  "version":"1.43.60",
  "from":"https%3A%2F%2Fapp.example%2Fhome"
}
```

`fetch` 同时承载 Fetch 和 XHR。指标单位通常是毫秒，资源还可能含 `isHttps`、`method`、`urlQuery`、`nextHopProtocol`、`domainLookup`、`connectTime`、`transferSize` 等，未知值可能为 `-1`。以 [参考样本](wire-examples.json) 和插件中的 `generateLog()` 为准。JSON 内层 bean 的编码与 URL 查询解析结果不同，不要强制把它们视为同一层的解码值。

业务返回码仅在显式配置函数 `api.retCodeHandler` 时判断。未配置时不解析响应业务码，`ret` 为 `unknown`，不填充业务判定的 `isErr`；处理器未返回布尔 `isErr` 或抛异常时也不填充该标记。旧版从 `ret`、`retcode`、`code`、`errcode` 自动解析的逻辑保留在源码中，但默认不执行；仅配置 `api.ret` 或 `retCodeHandlerAsync` 不会启用判断。Trace Header 支持 `traceparent`、`b3`、`sw8`、`sentry-trace`；相关 Trace 信息也可进入日志 `trace` 字段。

## 7. 自定义耗时 /speed/custom

```json
{"payload":"{\"custom\":[{\"name\":\"checkout_duration\",\"duration\":123,\"ext1\":\"cart\",\"ext2\":\"\",\"ext3\":\"\"}]}"}
```

同样解析两层 JSON，读取 `payload.custom`。`duration` 单位毫秒，范围 0…2147483646。支持 ext1…ext10，后七项可能被省略。`reportTime(name, duration)` 还产生一条 level `8193` 日志，对象重载和 `timeEnd()` 不一定产生这条额外日志。

## 8. PV、页面性能、Web Vitals、内存

- `/collect/pv`：`from` 为虚拟/当前页面，`originFrom` 为实际页面；其余为公共字段。初始 PV 自动产生，SPA 模式还跟随路由变化，`reportPageView(url)` 可手动发送。
- `/speed/performance`：查询字段包括 `dnsLookup`、`tcp`、`ssl`、`ttfb`、`contentDownload`、`domParse`、`resourceDownload`、`firstScreenTiming`，可附加 `engineInit`、`bundleLoad`。部分值经过裁剪，不能把默认/裁剪值理解成真实耗时。
- `/speed/webvitals`：查询字段 `FCP`、`LCP`、`FID`、`CLS`、`INP`、`TTI`；CLS 无量纲，其余通常为毫秒；尚未采到时可能为 `-1`。可携带手动追加的指标。上报通常使用 `navigator.sendBeacon`。
- `/memory`：查询字段 `memoryUsed`、`memoryAllocated`（字节）、`memoryUsage`（百分数），以及公共字段。上游的 `createPageGroupingStage` 对该类型生成 `{}`，原生 XHR 可能把 body 转成 `[object Object]`，从 URL 读取即可。OOM 报警独立走 `/collect`，level `1033`。

## 9. HTTP、gzip、Beacon、重试

1. 根据 `Content-Encoding` 解压：可能缺失、`identity` 或 `gzip`；gzip 是标准 gzip 字节流。客户端默认阈值 1024（字符串长度初筛），4096 字节及以上可使用 Worker，失败回退主线程，压缩失败再回退明文。
2. 再依据端点解析 JSON。XHR 通常带 `application/json`，Beacon 字符串可能是 `text/plain;charset=UTF-8`，不要只凭 Content-Type 拒绝有效报文。
3. Beacon 分支不会主动执行 gzip 压缩，也没有完成回调；不能依赖它保证送达。原实现不检查 `sendBeacon()` 的 false 返回值后回退。
4. 解压前后的请求大小应分别限制。示例接收端接受 2MiB 原始 body、16MiB 解压结果；生产阈值由你按业务确定。
5. 普通接收端返回 HTTP 200 和 `{"retcode":0}` 即可；日志成功主要按 HTTP 状态判断，白名单和限流才解析业务响应。避免返回 `403 forbidden` 字样，这会触发原 SDK 自毁逻辑。
6. 跨域接收端处理 OPTIONS，允许 GET/POST 及 `Content-Type`、`Content-Encoding`。向业务接口注入 Trace Header 时，业务接口的 CORS 还需要允许相应追踪头。
7. `reportRetry:true` 启用失败请求持久化重试，默认最多 10 次、指数间隔、缓存 50 条（配置裁剪为 20…100）。排除控制请求和 SDK 自身错误。存储键为 `aegis-web-retry-report-requests`，旧缓存保留原目标 URL。重试可能重复送达；生产接收端按业务需求做幂等或去重。
8. 所有接口的时间、采样和网络行为都受浏览器调度与配置影响，不应依赖到达顺序。严格请求格式参考 [wire-examples.json](wire-examples.json)。

## 10. 可运行接收流程

运行 `npm run dev` 即可查看 [server.mjs](../examples/server.mjs) 与 [protocol.mjs](../examples/protocol.mjs) 的完整实现。它只解码、缓存并返回响应，不含账号鉴权、数据库、检索或报表系统。这些由你的后端按同一协议实现。
