/** Default collection base for a self-hosted backend. Explicit hostUrl keeps upstream semantics. */
export const DEFAULT_HOST_URL = '/monitor';

/** The upstream init() derives these paths from hostUrl. Kept here for backend/tooling use. */
export const ENDPOINT_PATHS = Object.freeze({
  url: '/collect',
  offlineUrl: '/offline',
  whiteListUrl: '/collect/whitelist',
  rateLimitUrl: '/rateConfig',
  pvUrl: '/collect/pv',
  eventUrl: '/collect/events',
  speedUrl: '/speed',
  customTimeUrl: '/speed/custom',
  performanceUrl: '/speed/performance',
  performanceUrlForHippy: '/speed/hippyPerformance',
  webVitalsUrl: '/speed/webvitals',
  setDataReportUrl: '/speed/miniProgramData',
  memoryUrl: '/memory',
});
