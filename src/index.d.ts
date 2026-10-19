export type Environment =
  | "production"
  | "development"
  | "gray"
  | "pre"
  | "daily"
  | "local"
  | "test"
  | "others";
export type SendType =
  | "log"
  | "speed"
  | "performance"
  | "offline"
  | "whiteList"
  | "vitals"
  | "pv"
  | "customPV"
  | "event"
  | "custom"
  | "sdkError"
  | "setData"
  | "loadPackage"
  | "memory";
export type UrlMatcher = string | RegExp;
export interface Extensions {
  ext1?: string;
  ext2?: string;
  ext3?: string;
  ext4?: string | number;
  ext5?: string | number;
  ext6?: string | number;
  ext7?: string | number;
  ext8?: string | number;
  ext9?: string | number;
  ext10?: string | number;
}
export interface Log extends Extensions {
  msg: unknown;
  level?: string;
  time?: number;
  from?: string;
  originFrom?: string;
  errorMsg?: string;
  trace?: string;
  tag?: string;
  seq?: string | number;
  code?: string | number;
  [field: string]: unknown;
}
export interface CustomEvent extends Extensions {
  name: string;
  from?: string;
  originFrom?: string;
}
export interface CustomTime extends CustomEvent {
  duration: number;
}
export interface SpeedLog {
  url: string;
  type: "fetch" | "static" | "bridge";
  duration: number;
  status?: number;
  method?: string;
  isHttps?: boolean;
  ret?: string | number;
  isErr?: number;
  from?: string;
  originFrom?: string;
  [field: string]: unknown;
}
export interface RequestOptions {
  url: string;
  method?: string;
  type?: SendType;
  data?: unknown;
  contentType?: string;
  log?: unknown;
  addBean?: boolean;
  beanFilter?: string[];
  sendBeacon?: boolean;
  success?: (...args: unknown[]) => void;
  fail?: (...args: unknown[]) => void;
  [field: string]: unknown;
}
export interface RequestStage {
  logs: unknown;
  logType: SendType;
}
export interface RequestResult {
  isErr: boolean;
  result: unknown[];
  logType?: SendType;
  logs?: unknown;
}
export interface GzipConfig {
  enable?: boolean;
  threshold?: number;
  debug?: boolean;
  useWorker?: boolean;
  workerThreshold?: number;
}
export interface RetryConfig {
  maxRetryCount?: number;
  retryInterval?: number | ((retriedCount: number) => number);
  whenRetryEndStillFail?: "discard" | string;
  maxStorageCount?: number;
}
export interface ApiConfig {
  apiDetail?: boolean;
  reportRequest?: boolean;
  ret?: string[];
  reqHeaders?: string[];
  resHeaders?: string[];
  usePerformanceTiming?: boolean;
  injectTraceHeader?: "traceparent" | "sw8" | "b3" | "sentry-trace";
  injectTraceUrls?: UrlMatcher[];
  injectTraceIgnoreUrls?: UrlMatcher[];
  traceFlag?: boolean | number;
  /** 显式配置后才判断业务返回码；未配置时不自动解析 code/ret 等字段。 */
  retCodeHandler?: (
    response: unknown,
    url?: string,
    ctx?: unknown,
    payload?: unknown,
  ) => { code?: string | number; isErr?: boolean };
  reqParamHandler?: (payload: unknown, url?: string, ctx?: unknown) => unknown;
  resBodyHandler?: (body: unknown, url?: string, ctx?: unknown) => unknown;
  resourceTypeHandler?: (url: string) => "fetch" | "static" | "";
  isSlowApi?: (request: {
    duration: number;
    [field: string]: unknown;
  }) => boolean;
  [option: string]: unknown;
}
export interface ElementMatchers {
  tagName?: string[];
  id?: string[];
  className?: string[];
}
export interface BlankScreenConfig {
  containers?: string[];
  ignoreContainers?: string[];
  containerMatchers?: ElementMatchers;
  ignoreMatchers?: ElementMatchers;
  detectStartPosition?: { x: number; y: number };
  emptyElementsPercent?: number;
  debounceDuration?: number;
  [option: string]: unknown;
}
export interface LagMonitorConfig {
  enabled?: boolean;
  sampleRate?: number;
  threshold?: number;
  noResponseThreshold?: number;
}
export interface MemoryMonitorConfig {
  enabled?: boolean;
  sampleRate?: number;
  monitorPages?: UrlMatcher[];
  enableMemoryReport?: boolean;
  enableOOMReport?: boolean;
  memoryReportInterval?: number;
  oomCheckInterval?: number;
  oomThreshold?: number;
}
export interface MonitorConfig extends Extensions {
  id: string | number;
  uin?: string | number;
  aid?: string | boolean;
  version?: string | number;
  hostUrl?: string;
  env?: Environment;
  pageUrl?: string;
  urlHandler?: () => string;
  delay?: number;
  repeat?: number;
  random?: number;
  maxLength?: number;
  onError?: boolean;
  device?: boolean;
  pagePerformance?: boolean;
  webVitals?: boolean | { manualReport?: boolean; [option: string]: unknown };
  onClose?: boolean;
  spa?: boolean;
  speedSample?: boolean;
  reportApiSpeed?: boolean;
  reportAssetSpeed?: boolean;
  reportBridgeSpeed?: boolean;
  reportLoadPackageSpeed?: boolean;
  clickElementLog?: boolean | Record<string, unknown>;
  consoleLog?: boolean | Record<string, unknown>;
  blankScreen?: boolean | BlankScreenConfig;
  lagMonitor?: LagMonitorConfig;
  memoryMonitor?: MemoryMonitorConfig;
  api?: ApiConfig;
  gzip?: boolean | GzipConfig;
  reportRetry?: boolean | RetryConfig;
  h5Bridge?: Record<string, (...args: any[]) => unknown>;
  h5BridgeFunc?: string[];
  reportImmediately?: boolean;
  slowApiLog?: boolean;
  slowStaticLog?: boolean;
  /** Default false. Enables /collect/whitelist and its log filtering/sampling/gzip negotiation. */
  enableWhitelist?: boolean;
  /** Default false. Enables /rateConfig, remote category sampling and periodic refresh. */
  enableRateConfig?: boolean;
  beforeReport?: (log: Log) => boolean | void;
  beforeReportSpeed?: (log: SpeedLog) => boolean | void;
  logCreated?: (log: Log) => boolean | void;
  beforeRequest?: (stage: RequestStage) => RequestStage | boolean | void;
  modifyRequest?: (options: RequestOptions) => RequestOptions | void;
  onBeforeRequest?: (
    options: RequestOptions,
    instance: CmesMonitor,
  ) => RequestOptions | false | undefined;
  afterRequest?: (result: RequestResult) => boolean | void;
  onWhitelist?: (isWhiteList: boolean) => void;
  url?: string;
  offlineUrl?: string;
  whiteListUrl?: string;
  rateLimitUrl?: string;
  pvUrl?: string;
  eventUrl?: string;
  speedUrl?: string;
  customTimeUrl?: string;
  performanceUrl?: string;
  performanceUrlForHippy?: string;
  webVitalsUrl?: string;
  setDataReportUrl?: string;
  memoryUrl?: string;
  /** Extension options are passed unchanged to the compatible runtime and custom plugins. */
  [option: string]: unknown;
}
export interface Lifecycle {
  on(
    event: string,
    callback: (...args: any[]) => unknown,
    type?: number,
  ): this | undefined;
  one(event: string, callback: (...args: any[]) => unknown): void;
  emit(event: string, ...args: unknown[]): this;
  remove(
    event: string,
    callback?: (...args: any[]) => unknown,
  ): this | null | undefined;
  clear(): void;
}
export interface Plugin {
  aegisPlugin: boolean;
  name: string;
  instances?: CmesMonitor[];
  patch(instance: CmesMonitor): void;
  unpatch(instance: CmesMonitor): void;
  option?: Record<string, any>;
  [field: string]: unknown;
}
export declare class CmesMonitor {
  constructor(config: MonitorConfig);
  static readonly sdkName: "cmes-monitor-sdk";
  static readonly sdkVersion: "1.0.1";
  static readonly referenceVersion: "1.43.60";
  static version: string;
  static logType: Record<string, string>;
  static environment: Record<Environment, Environment>;
  static instances: CmesMonitor[];
  static installedPlugins: Plugin[];
  static sessionID: string;
  static compressionSupported: boolean | null;
  static use(plugin: Plugin): void;
  static unuse(plugin: Plugin): void;
  static resolveGzipConfig(config?: boolean | GzipConfig): Required<GzipConfig>;
  readonly __version__: string;
  readonly LogType: Record<string, string>;
  config: MonitorConfig;
  bean: Record<string, any>;
  lifeCycle: Lifecycle;
  isWhiteList: boolean;
  sendNow: boolean;
  isReportReady: boolean;
  info(...messages: unknown[]): void;
  infoAll(...messages: unknown[]): void;
  report(...messages: unknown[]): void;
  error(...messages: unknown[]): void;
  reportEvent(event: string | CustomEvent): void;
  reportTime(name: string, duration: number): void;
  reportTime(event: CustomTime): void;
  reportT(event: CustomTime): void;
  time(name: string): void;
  timeEnd(name: string | CustomEvent): void;
  getTimeEventDuration(name: string): number | undefined;
  submitCustomTime(
    name: string,
    duration: number,
    ext1?: string,
    ext2?: string,
    ext3?: string,
    ext4?: string | number,
    ext5?: string | number,
    ext6?: string | number,
    ext7?: string | number,
    ext8?: string | number,
    ext9?: string | number,
    ext10?: string | number,
    from?: string,
  ): void;
  reportPageView(from?: string): void;
  /** Retained upstream deprecated no-op. */
  reportPv(event?: unknown): void;
  reportWebVitals(metrics?: Record<string, number | string>): void;
  setConfig(config: Partial<MonitorConfig>): MonitorConfig;
  init(config: MonitorConfig): void;
  extendBean(key: string, value: unknown): void;
  addExtBean(key: string, value: unknown): void;
  getBean(excludedKeys?: string[]): string;
  getCurrentPageUrl(): string;
  getOriginFrom(): string;
  validateRange(value: number): number;
  ready(): void;
  destroy(hard?: boolean): void;
  uploadLogs(
    options?: Record<string, unknown>,
    extra?: Record<string, unknown>,
  ): void;
  publishPluginsLogs(): void;
  normalLogPipeline(logs: Log | Log[]): void;
  eventPipeline(events: CustomEvent | CustomEvent[]): void;
  customTimePipeline(events: CustomTime | CustomTime[]): void;
  speedLogPipeline(logs: SpeedLog | SpeedLog[]): void;
  send(
    options: RequestOptions,
    success?: (...args: unknown[]) => void,
    fail?: (...args: unknown[]) => void,
  ): void;
  request(
    options: RequestOptions,
    success?: (...args: unknown[]) => void,
    fail?: (...args: unknown[]) => void,
  ): void;
  $request(
    options: RequestOptions,
    success?: (...args: unknown[]) => void,
    fail?: (...args: unknown[]) => void,
  ): void;
  sendPipeline(
    stages: Array<(value: any, next: (value: any) => void) => void>,
    type?: SendType,
  ): (value: any, next?: (value: any) => void) => void;
  sendSDKError(error: unknown): void;
  resetWhitelistGzipState(): void;
  updateWhitelistGzipState(value: unknown): void;
  disableWhitelistGzipState(): void;
  isGzipReportEnabled(enabled: boolean): boolean;
  sendXhr(
    options: RequestOptions,
    method: string,
    data: unknown,
    encoding: string | null,
    success?: (...args: unknown[]) => void,
    fail?: (...args: unknown[]) => void,
  ): void;
  sendWithGzip(
    options: RequestOptions,
    method: string,
    enabled: boolean,
    success?: (...args: unknown[]) => void,
    fail?: (...args: unknown[]) => void,
  ): Promise<void>;
}
export { CmesMonitor as Aegis };
export default CmesMonitor;
export { DEFAULT_HOST_URL, ENDPOINT_PATHS } from "./config.js";
type MonitorConstructor = typeof CmesMonitor;
declare global {
  var CmesMonitor: MonitorConstructor;
  var Aegis: MonitorConstructor;
  interface Window {
    CmesMonitor: MonitorConstructor;
    Aegis: MonitorConstructor;
  }
}
