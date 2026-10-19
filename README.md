# @cmeslib/fe-monitor-sdk

可自建接收端的前端监控 SDK。以用户提供的 `@tencent/aegis-web-sdk 1.43.60`（MIT）为基准，保留其构造方式、配置项、实例/静态 API、15 个插件和上报报文格式。

**源码已在 `src/` 中，可直接修改和构建；运行时不加载原压缩文件，也不依赖腾讯 npm 包。** 默认上报基址从腾讯域名改为当前站点的 `/monitor`；浏览器提供 `CmesMonitor` 和兼容别名 `Aegis`。

这是一份基于发布产物重建的派生源码。输入没有 source map，无法恢复腾讯未提供的原始 TypeScript、注释和局部变量名。已拆分插件、重命名共享符号，并保留编译后的部分状态机，以减少行为偏差。来源和修改见 [NOTICE](NOTICE)、[重建说明](docs/compatibility.md)。

## 开始使用

在项目根目录运行（开发工具链使用 Node.js 22+）：

```sh
npm ci
npm run build
npm run dev
```

访问 `http://127.0.0.1:8787`，可触发日志、事件、计时、错误和接口请求，并查看接收端解析结果。这个 Node 接收端只用于联调，数据保存在内存中。

### ESM / TypeScript

从 npm 安装：

```sh
npm i @cmeslib/fe-monitor-sdk
```

也可以通过本地目录或 `npm pack` 生成的 tarball 安装到业务项目，再使用：

```ts
import CmesMonitor from "@cmeslib/fe-monitor-sdk";

const monitor = new CmesMonitor({
  id: "your-project-id",
  uin: "your-user-id",
  hostUrl: "https://monitor.your-company.example/monitor",
  reportApiSpeed: true,
  reportAssetSpeed: true,
  spa: true,
  env: "production",
  ext1: "your-app-version",
});

monitor.infoAll("应用启动");
monitor.error({ msg: "订单提交失败", ext2: "order-123" });
monitor.reportEvent({ name: "checkout", ext1: "cart" });
monitor.reportTime("checkout_duration", 128);
monitor.time("render");
// 执行业务操作后：
monitor.timeEnd("render");
monitor.setConfig({ uin: "new-user-id" });
```

兼容旧代码：

```ts
import Aegis from "@cmeslib/fe-monitor-sdk";
// 或 import { Aegis } from '@cmeslib/fe-monitor-sdk';
const aegis = new Aegis({ id: "project", hostUrl: "/monitor" });
```

### Script / CDN

```html
<script src="/assets/cmes-monitor.min.js"></script>
<script>
  const monitor = new CmesMonitor({ id: "project", hostUrl: "/monitor" });
  // window.Aegis === window.CmesMonitor
  monitor.report("hello");
</script>
```

UMD 同时支持 AMD 和 `const CmesMonitor = require('@cmeslib/fe-monitor-sdk')`。这是浏览器 SDK；SSR 项目应在客户端挂载后动态导入，不要在服务端直接执行构造或导入浏览器运行时。

## 后端接入

请从 [后端协议](docs/backend-protocol.md) 开始。另有：

- [真实参考报文](docs/wire-examples.json)：从原 SDK 捕获，包含原始请求和解码结果。
- [OpenAPI](docs/openapi.json)：活动端点和请求结构的机器可读描述。
- [报文解码器](examples/protocol.mjs)：处理列式日志、嵌套 JSON、gzip、Beacon 和内存指标。
- [联调接收端](examples/server.mjs)：可运行的控制配置及接收响应示例。

接入只需实现日志与指标端点。控制端点 `GET /monitor/rateConfig` 和 `GET /monitor/collect/whitelist` 默认不请求（这是与原 SDK 的刻意差异），需要时用 `enableRateConfig: true` / `enableWhitelist: true` 开启。

开启白名单后，普通 `info()` 受到白名单过滤；希望无条件保留的日志使用 `infoAll()` 或 `report()`，它们仍受总采样和限流控制。开启限流配置后，日志会等到配置返回再按分类采样发出。两个开关都可以用 `setConfig()` 在运行时切换。

`hostUrl` 是接口基址，应省略末尾 `/`。构造时单独设置 `url`、`eventUrl` 等会被原初始化逻辑覆盖。需要逐个修改地址时，先构造，再调用 `setConfig({ url: '...' })`；或者使用 `onBeforeRequest`。`setConfig({ hostUrl: '...' })` 本身不会重新派生端点。

## 保留的功能

| 插件                | 能力                                               | 默认启用 |
| ------------------- | -------------------------------------------------- | -------- |
| `onError`           | JS、Promise、资源、媒体、WebSocket 错误            | 是       |
| `reportApiSpeed`    | Fetch/XHR 耗时、业务返回码、请求详情、Trace Header | 否       |
| `reportAssetSpeed`  | 资源 Performance Timing                            | 否       |
| `pagePerformance`   | DNS/TCP/SSL/TTFB/下载/DOM/首屏                     | 是       |
| `webVitals`         | FCP/LCP/FID/CLS/INP/TTI                            | 是       |
| `aid`               | 匿名标识                                           | 是       |
| `device`            | 平台、屏幕、网络信息                               | 是       |
| `spa`               | History/Hash 路由 PV                               | 否       |
| `onClose`           | 页面退出时批量刷新与 Beacon                        | 是       |
| `clickElementLog`   | 点击元素日志                                       | 否       |
| `consoleLog`        | Console 日志采集                                   | 否       |
| `reportBridgeSpeed` | `h5Bridge` 方法测速                                | 否       |
| `blankScreen`       | 白屏检测、可选 DOM/canvas 截图                     | 否       |
| `lagMonitor`        | Long Animation Frame 卡顿/无响应检测               | 否       |
| `memoryMonitor`     | JS Heap 指标、OOM 阈值日志                         | 否       |

配置 `memoryMonitor: { enabled: true }`、`lagMonitor: { enabled: true }` 才启用这两个插件。具体浏览器须支持对应 Performance API。完整方法和配置类型见 [类型定义](src/index.d.ts)，主要使用方式见 [API 说明](docs/api.md)。

## 源码目录

```text
src/index.js                包入口、品牌信息和 Aegis 别名
src/config.js               默认地址与后端路径清单
src/runtime.js              生命周期、管线、采样、传输、会话和共享算法
src/plugins/*.js            15 个独立、可编辑插件模块
src/index.d.ts              TypeScript API 声明
scripts/build.mjs           从 src 构建；不读取 reference
scripts/reconstruct.mjs     从参考包重新生成运行时/插件（仅用于审计复现）
reference/aegis-1.43.60.min.js  未修改的兼容性测试基准
tests/                     差分、协议、类型和真实浏览器测试
docs/                      API、协议、报文、兼容边界
examples/                  前端示例和最小接收端
```

日常开发修改 `src/` 后运行 `npm run build`。**`npm run reconstruct` 会覆盖 `src/runtime.js`、`src/plugins/` 中的重建文件；不要用它构建日常修改。** 可复现重建信息见 [reconstruction.json](docs/reconstruction.json)。

## 构建、验证与打包

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:browser
npm pack
```

构建产物：

| 文件                       | 用途                          |
| -------------------------- | ----------------------------- |
| `dist/cmes-monitor.esm.js` | ESM，命名导出与默认导出       |
| `dist/cmes-monitor.cjs`    | CommonJS，直接导出构造函数    |
| `dist/cmes-monitor.js`     | 可读 UMD，Script/AMD/CommonJS |
| `dist/cmes-monitor.min.js` | 压缩 UMD                      |
| `dist/*.map`               | 包含重建源码的 source map     |
| `dist/index.d.ts`          | 类型提示                      |

兼容测试使用相同输入运行原 SDK、可读构建和压缩构建，对比请求方法、地址、查询参数、请求体、日志等级、钩子和实例状态。真实 Chromium 验证浏览器原生接口；覆盖详情和边界见 [兼容说明](docs/compatibility.md)。保留原 `version`/`__version__` 的 `1.43.60`，新增 `sdkName='cmes-monitor-sdk'`、`sdkVersion='1.0.1'` 标识自己的发行版本。

MIT 许可。分发衍生源码或构建产物时一并保留 [LICENSE](LICENSE) 和 [NOTICE](NOTICE)。

## 发布

推送 `v` 前缀的 tag 会触发 GitHub Actions：校验 tag 与 `package.json` 版本一致，跑完类型检查、单元测试和 Chromium 测试后构建，再发布到 npm 并创建 GitHub Release。

```sh
npm version 1.0.1
git push --follow-tags
```

仓库需要配置 `NPM_TOKEN` secret（npm automation token）。
