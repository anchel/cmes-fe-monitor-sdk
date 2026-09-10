# 来源、重建方式与兼容边界

## 基准

- 输入：用户提供的 `aegis.min.js`，保存在 `reference/aegis-1.43.60.min.js`。
- 文件标识：`@tencent/aegis-web-sdk@1.43.60`，2026-08-25 发布头。
- SHA-256：`7f1e3d7344a9a897342473a25fd1ea99b01327a1638615a3ba8d4edc7d37e91e`。
- 原文件声明 MIT；版权保留在 LICENSE/NOTICE、源码及构建头部。

没有获取腾讯内部仓库，也没有声称恢复缺失的原始 TypeScript。对照范围是这一具体 Web 发布文件，不是其他 Aegis 版本或小程序/React Native SDK。

## 转换

1. Babel 解析 UMD 工厂，保留其语句执行顺序与闭包状态。
2. 对 227 个共享绑定进行词法作用域重命名，避免字符串替换误伤字段、字符串或局部变量。
3. 抽出 15 个插件的完整选项/行为模块，通过 getter/setter 保留共享状态的延迟初始化和可写性。
4. 对原先的裸函数调用使用 `(0, shared.fn)(...)` 保持无 receiver 的调用语义，避免把原生 fetch 的 this 错误改为共享对象。
5. 在安全语句边界拆开逗号表达式和多个 var 声明，保留原控制流；编译辅助函数和部分局部短变量仍存在。
6. 将三个默认腾讯 host 字符串替换为 `DEFAULT_HOST_URL='/monitor'`，增加品牌和导出。

`npm run build` 只编译 `src`，不用 `reference`。因此源码可独立继续维护。`npm run reconstruct` 是审计复现工具，会覆盖生成模块；已经修改源码时应先保存修改。

## 刻意改变的内容

| 项目 | 原文件 | 本项目 |
| --- | --- | --- |
| 默认 hostUrl | 腾讯域名 | `/monitor` |
| 浏览器全局 | Aegis | CmesMonitor，兼容 Aegis（同一函数） |
| npm 标识 | @tencent/aegis-web-sdk | @cmeslib/fe-monitor-sdk |
| 包发行信息 | 原文件版本 | sdkName / sdkVersion / referenceVersion |
| 代码组织 | 单个压缩 UMD | ES 模块、15 插件、类型、构建、源码映射 |
| 内部函数名/报错堆栈 | 压缩短名 | 语义名及构建名 |
| 白名单 `/collect/whitelist` | 始终请求 | 默认关闭，`enableWhitelist: true` 开启 |
| 限流配置 `/rateConfig` | 始终请求 | 默认关闭，`enableRateConfig: true` 开启 |

保持报文中的默认 `version='1.43.60'`、`LogType`/`logType`、原配置键、插件名、生命周期事件名、持久化键和 Trace Header 规则。使用相同显式 hostUrl 和相同输入时，以差分请求验证协议一致。

两个控制端点默认关闭，是为了让自建后端可以只实现日志与指标端点就跑起来。开启后，请求时机、响应解析、重试退避、采样与 gzip 协商都与原 SDK 一致；差分测试正是在开启状态下进行对比的。关闭状态下 `isWhiteList` 为 `true`（不过滤）、`rateLimitReady` 为 `true`（不排队），`use_gzip` 协商不参与 gzip 判定，gzip 完全由 `gzip` 配置决定。两个开关都可以用 `setConfig()` 在运行时改变：关闭时会取消未完成的请求与已排期的刷新、放行等待队列、并把 `random` 恢复为本地值。

## 测试

`npm test` 在隔离 JSDOM 中分别运行参考文件、UMD、压缩 UMD，固定时钟和随机源，拦截所有请求。比较 HTTP 方法、地址、查询字段、请求体、钩子顺序、实例状态及日志等级。覆盖手动日志/事件/计时/PV、白名单、分类采样、配置延迟、长度/重复限制、setConfig/ready、JS/Promise/资源错误、点击/Console、Fetch/XHR/Trace、SPA/退出、内存/OOM/卡顿、自定义插件和销毁。

`npm run test:browser` 在真实 Chromium 中运行原文件、UMD、压缩 UMD和 ESM，连接本地接收端，检查 7 类主要数据端点、原生 Fetch/XHR、资源、错误、点击、Console、Worker gzip、主线程 gzip、禁用压缩与页面退出 Beacon；另对原文件和派生源码执行白屏检测及 canvas 截图。

对等场景在开启 `enableWhitelist` / `enableRateConfig` 的前提下与原文件比对，因为原 SDK 的这两个阶段始终开启；`tests/control-options.test.mjs` 单独覆盖默认关闭态、单独开启、`setConfig()` 运行时切换、迟到响应与 `destroy()` 的清理。

类型检查使用真实消费示例；后端解码测试使用原 SDK 实际请求。`docs/wire-examples.json` 由 `node scripts/protocol-fixtures.mjs` 从基准捕获。

这些检查验证已覆盖场景，不等于穷尽所有浏览器、网络、DOM、跨域和插件组合。尤其没有在 Safari/Firefox/IE、真实 H5 原生容器、受限制 WebView、OOM 崩溃及各种页面截图布局上完成全部实机回归。后续业务接入应按实际浏览器继续验证。

## 原有行为与限制

- 本包需要浏览器 window/document，Node/SSR 导入时需放到客户端阶段。
- 构造时 `url` 等端点由 hostUrl 覆盖；setConfig(hostUrl) 不重新派生地址。
- `reportPv()` 已是弃用空操作；`uploadLogs()` 没有内置实际上传监听器；保留跨端路径不意味着实现跨端上报。
- 手动 Web Vitals 第一次触发可能只保存数据/状态，后续触发才发送；本版保留原状态机。
- `destroy()` 保留原插件卸载逻辑；不能据此承诺所有全局监听和定时器都完全恢复到加载前状态，最后一个实例销毁后部分方法会失效。不要假定销毁后可无条件重新安装完整运行时。
- 内存请求可能带 `[object Object]` body；有效字段位于 query。
- memoryMonitor/lagMonitor 中 `sampleRate || 1` 使 0 回退为 1；要关闭应设 `enabled:false`，这是原包行为。
- 默认保留 `AEGIS_ID`、`__MONITOR_SESSION_V1__`、`aegis-web-retry-report-requests` 等存储键。迁移已有部署时，持久化重试可能重放旧目标 URL；检查或清理对应旧队列，避免把迁移前缓存混入新后端。
- 字符串请求在原传输层可能把 `/eval/gi` 替换为 `evaI`；为保留协议行为没有移除。
- SDK 内部诊断仍会带 id=1085。可在自建接收端区分，或在有意改变兼容行为时修改 sendSDKError。

以上限制不是新增功能承诺，也没有悄悄改写成另一套协议。需要修复时，应在 `src` 中明确修改并添加针对性测试，维护自己的版本说明。
