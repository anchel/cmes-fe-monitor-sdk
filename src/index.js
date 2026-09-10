import createRuntime from './runtime.js';

// The constructor is the implementation itself. No binary SDK or external service is loaded.
const CmesMonitor = createRuntime();

// Keep the original version field on the wire; expose our package identity separately.
CmesMonitor.sdkName = 'cmes-monitor-sdk';
CmesMonitor.sdkVersion = '1.0.0';
CmesMonitor.referenceVersion = '1.43.60';

export default CmesMonitor;
export { CmesMonitor, CmesMonitor as Aegis };
export { DEFAULT_HOST_URL, ENDPOINT_PATHS } from './config.js';
