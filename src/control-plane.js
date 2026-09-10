/** Optional remote controls. Wire formats follow the supplied Aegis 1.43.60 SDK. */
const requestGuards = new WeakMap();

// Key by the existing callback so request copies and ready() queues retain the guard
// without adding fields to public request objects or to the wire protocol.
function guardedRequest(options, isCurrent) {
  requestGuards.set(options.success, isCurrent);
  return options;
}

export function isControlRequestAllowed(options) {
  const guard = options && requestGuards.get(options.success);
  return !guard || guard();
}

export function installRateConfig(sdk, applyRateLimit) {
  let enabled = !!sdk.config.enableRateConfig;
  let generation = 0;
  let stopped = false;
  let startTimer;
  let refreshTimer;
  let failures = 0;

  function releasePending() {
    sdk.rateLimitPool.splice(0).forEach(item =>
      applyRateLimit(sdk, item.logs, item.resolve, item.sendType));
  }

  function clearTimers() {
    clearTimeout(startTimer);
    clearTimeout(refreshTimer);
  }

  function requestConfig() {
    if (stopped || !sdk.config.enableRateConfig || !sdk.config.rateLimitUrl) return;
    const current = generation;
    const isCurrent = () => !stopped && sdk.config.enableRateConfig && generation === current;
    const refresh = seconds => {
      if (!isCurrent()) return;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(requestConfig, seconds * 1000);
    };
    const failed = () => {
      if (!isCurrent()) return;
      if (!sdk.rateLimitSampled) {
        sdk.rateLimitReady = true;
        releasePending();
      }
      refresh([3, 30, 300][Math.min(failures++, 2)]);
    };
    sdk.sendPipeline([(logs, next) => {
      if (!isCurrent()) return;
      next(guardedRequest({
        url: sdk.config.rateLimitUrl,
        type: 'whiteList',
        method: 'get',
        success(response) {
          if (!isCurrent()) return;
          try {
            const {retcode, configs, ttl} = response.data || JSON.parse(response);
            if (retcode !== 0 || !Array.isArray(configs)) return failed();
            const limits = {};
            configs.forEach(item => { limits[item.limit_type] = item.sample_rate; });
            sdk.rateLimitConfigs = limits;
            sdk.rateLimitReady = true;
            sdk.rateLimitSampled = true;
            releasePending();
            if (ttl > 0) refresh(ttl);
          } catch { failed(); }
        },
        fail: failed,
      }, isCurrent));
    }], 'whiteList')(null);
  }

  function schedule() {
    if (stopped || !sdk.config.enableRateConfig) return;
    clearTimeout(startTimer);
    startTimer = setTimeout(requestConfig, sdk.config.uin ? 50 : 500);
  }

  function synchronize() {
    generation++;
    clearTimers();
    failures = 0;
    sdk.rateLimitConfigs = null;
    sdk.rateLimitSampled = false;
    sdk.rateLimitReady = !enabled;
    if (enabled) schedule();
    else releasePending();
  }

  sdk.lifeCycle.on('_controlConfigUpdate', () => {
    const next = !!sdk.config.enableRateConfig;
    if (next === enabled) return;
    enabled = next;
    synchronize();
  });
  sdk.lifeCycle.on('onConfigChange', () => {
    if (!enabled) return;
    generation++;
    clearTimers();
    failures = 0;
    schedule();
  });
  sdk.lifeCycle.on('destroy', () => {
    stopped = true;
    generation++;
    clearTimers();
    sdk.rateLimitPool.length = 0;
  });
  if (enabled) schedule();
  else synchronize();
}

export function createWhitelistStage(sdk, {LogLevel, normalizeInfoAll, createLogSender}) {
  let enabled = !!sdk.config.enableWhitelist;
  let isWhiteList = false;
  let loaded = false;
  let localRandom = sdk.config.random;
  let generation = 0;
  let stopped = false;
  let timer;
  const buffered = [];
  sdk.isWhiteList = !enabled;

  function schedule() {
    clearTimeout(timer);
    if (stopped || !sdk.config.enableWhitelist) return;
    const current = ++generation;
    const isCurrent = () => !stopped && sdk.config.enableWhitelist && generation === current;
    timer = setTimeout(() => {
      if (!isCurrent() || !sdk.config.whiteListUrl) return;
      sdk.sendPipeline([(logs, next) => {
        if (!isCurrent()) return;
        next(guardedRequest({
          url: sdk.config.whiteListUrl,
          type: 'whiteList',
          method: 'get',
          success(response) {
            if (!isCurrent()) return;
            loaded = true;
            try {
              const {retcode, result = {}} = response.data || JSON.parse(response);
              if (retcode === 0) {
                isWhiteList = result.is_in_white_list;
                sdk.isWhiteList = isWhiteList;
                sdk.updateWhitelistGzipState(result.use_gzip);
                if (result.rate >= 0 && result.rate <= 1) {
                  sdk.config.random = result.rate;
                  sdk.isGetSample = false;
                }
              } else sdk.disableWhitelistGzipState();
              if (sdk.isWhiteList && buffered.length) createLogSender(sdk)(buffered.splice(0), () => {});
              else if (!sdk.isWhiteList) buffered.length = 0;
              if (typeof sdk.config.onWhitelist === 'function') sdk.config.onWhitelist(isWhiteList);
            } catch { /* Match upstream handling of an invalid whitelist response. */ }
          },
          fail() { if (isCurrent()) loaded = true; },
        }, isCurrent));
      }], 'whiteList')(null);
    }, sdk.config.uin ? 50 : 500);
  }

  sdk.lifeCycle.on('_controlConfigUpdate', patch => {
    if (Object.prototype.hasOwnProperty.call(patch, 'random')) localRandom = patch.random;
    const next = !!sdk.config.enableWhitelist;
    if (next === enabled) return;
    enabled = next;
    generation++;
    clearTimeout(timer);
    isWhiteList = false;
    loaded = false;
    sdk.isWhiteList = !enabled;
    sdk.resetWhitelistGzipState();
    if (enabled) schedule();
    else {
      sdk.config.random = localRandom;
      sdk.isGetSample = false;
      if (buffered.length) createLogSender(sdk)(buffered.splice(0).map(log => {
        normalizeInfoAll(log);
        return log;
      }), () => {});
    }
  });
  sdk.lifeCycle.on('onConfigChange', schedule);
  sdk.lifeCycle.on('destroy', () => {
    stopped = true;
    generation++;
    clearTimeout(timer);
    buffered.length = 0;
  });

  return (logs, next) => {
    if (!sdk.config.enableWhitelist || isWhiteList || sdk.config.api?.reportRequest) {
      next(logs.concat(buffered.splice(0)).map(log => {
        normalizeInfoAll(log);
        return log;
      }));
    } else {
      const allowed = logs.filter(log => {
        if (log.level !== LogLevel.INFO && log.level !== LogLevel.API_RESPONSE) {
          normalizeInfoAll(log);
          return true;
        }
        if (!loaded && buffered.length < 200) buffered.push(log);
        return false;
      });
      if (allowed.length) next(allowed);
    }
  };
}
