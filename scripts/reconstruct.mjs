/** Reproduce the editable derivative from the supplied MIT bundle. Never run as part of build. */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';
import { format } from 'prettier';
import { applyControlOptions } from './apply-control-options.mjs';

const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;
const input = await fs.readFile('reference/aegis-1.43.60.min.js', 'utf8');
const expected = '7f1e3d7344a9a897342473a25fd1ea99b01327a1638615a3ba8d4edc7d37e91e';
if (crypto.createHash('sha256').update(input).digest('hex') !== expected) throw new Error('Reference SHA-256 mismatch');
const ast = parse(input);
let factory;
traverse(ast, { FunctionExpression(path) {
  if (path.node.body.body.length > 100) { factory = path; path.stop(); }
}});
if (!factory) throw new Error('SDK factory not found');

// Rename bindings through lexical scope, never string-replace arbitrary program text.
const names = {
  I:'weakSetCounter', A:'WeakSetImplementation', M:'WeakSetPolyfill', N:'inheritStatics',
  oe:'assign', ae:'awaiter', se:'generator', C:'concatArrays', le:'LogLevel', m:'SendType', u:'Environment',
  _:'timestampQueryPattern', F:'ignoredReportUrls', H:'ignoredErrorMessages', U:'optionalLogFields', D:'resourceTypes', R:'UNKNOWN',
  q:'appendQuery', j:'primitiveDefaults', W:'Lifecycle', B:'serializeLogColumns', z:'EventEmitter',
  G:'toPrimitive', V:'splitUrlQuery', J:'sanitizeUrl', X:'isHttps', $:'parseReturnCode', K:'formatApiContent',
  Q:'createSpeedPayload', Y:'isIgnoredUrl', Z:'applyRateLimit', ee:'createBatchStage', te:'normalizeLogs',
  ne:'createPageGroupingStage', re:'createBeforeRequestStage', ie:'createModifyRequestStage', ue:'createAfterRequestStage',
  de:'assetContentTypes', fe:'assetExtensionPattern', he:'returnCodeKeys', pe:'createCircularReplacer', ce:'stringifyLog',
  g:'stringifyJSON', me:'stringifyLimited', ge:'stringifyProperty', ve:'stringifyValue', ye:'dataUrlPattern',
  we:'sendTypeLimitNames', be:'errorLevelLimitNames', Ee:'getLimitName', Se:'samplePercentage', Re:'deduplicateResources',
  Te:'normalizeInfoAll', v:'repeatResetTimers', Oe:'repeatCounts', xe:'scheduleRepeatReset', Pe:'stripLogContext',
  Le:'createLogSender', Ce:'traceIdGenerators', ke:'traceIdBuffer', Ie:'createHexIdGenerator', Ae:'createSessionId',
  Me:'createAnonymousId', Ne:'encodeBase64', _e:'decodeBase64', Fe:'readTraceId', He:'composePipeline',
  Ue:'disableMethods', s:'base64Alphabet', De:'base64Pattern', qe:'TraceHeaders', je:'traceDecoders', We:'noop',
  e:'TraceHeaderGenerator', Be:'getContentEncoding', ze:'hasPerformanceTiming', Ge:'supportsPerformanceEntry',
  t:'userAgentIncludes', n:'runtimeAlias', r:'pluginConstructor', Ve:'anonymousIdPlugin', Je:'assetPluginAlias',
  Xe:'assetSpeedPlugin', $e:'userAgent', o:'deviceDetection', i:'MonitorPlugin', y:'MonitorCore',
  Ke:'getPageOrigin', Qe:'formatHeaders', Ye:'formatApiField', Ze:'getResourceType', et:'getApiLogLevel',
  tt:'isSlowApi', nt:'readResourceTiming', rt:'originalXhrSend', it:'originalXhrOpen', ot:'originalSetRequestHeader',
  at:'originalFetch', a:'NetworkType', st:'PlatformType', lt:'NetworkStatus', ct:'xhrInstrumentationReady',
  l:'xhrHooks', ut:'relativeUrlPattern', dt:'fetchInstrumentationReady', p:'fetchHooks',
  ft:'defaultRetryConfig', ht:'apiSpeedPlugin', pt:'bridgeState', mt:'bridgeSpeedPlugin', gt:'getLocationHref',
  vt:'getElementText', c:'clampTiming', f:'createVitalMetric', h:'bindVitalReporter', yt:'afterTwoFrames', wt:'onVisibilityHidden',
  bt:'once', Et:'getVisibilityWatcher', St:'whenActivated', Rt:'observeFCP', Tt:'getInteractionCount', Ot:'processInteraction',
  xt:'whenIdleOrHidden', Pt:'observeINP', Lt:'handleFirstInput', Ct:'onPageExit', kt:'storeVital', It:'readStorageJSON',
  At:'writeStorage', Mt:'interactionCountObserver', w:'firstInputEvent', Nt:'firstInputDelay', _t:'firstInputTime',
  Ft:'firstInputCallbacks', d:'pagePerformanceCache', b:'devicePlugin', Ht:'readNetworkType', Ut:'OriginalWebSocket',
  E:'websocketListeners', Dt:'websocketProxyHandler', qt:'errorPluginAlias', jt:'errorPlugin', Wt:'getElementPath',
  Bt:'toLookupMap', zt:'splitString', Gt:'readTextContent', Vt:'clickPlugin', Jt:'originalConsole', Xt:'consolePlugin',
  $t:'bfcacheRestoreTime', Kt:'onBFCacheRestore', Qt:'getNavigationEntry', Yt:'getActivationStart', Zt:'observePerformance',
  en:'firstHiddenTime', tn:'initialHiddenTime', nn:'handleVisibilityChange', rn:'addVisibilityListeners', on:'removeVisibilityListeners',
  an:'fcpThresholds', sn:'clsThresholds', ln:'estimatedInteractionCount', cn:'minInteractionId', un:'maxInteractionId',
  dn:'updateInteractionCount', S:'longestInteractions', fn:'interactionsById', hn:'previousInteractionCount', pn:'interactionCallbacks',
  mn:'inpThresholds', gn:'lcpThresholds', vn:'reportedLcpIds', yn:'passiveCaptureOptions', wn:'firstInputStartTime',
  bn:'recordFirstInput', En:'dispatchFirstInput', Sn:'listenFirstInput', Rn:'fidThresholds', Tn:'pageExitEvents',
  On:'TTIObserver', T:'vitalMetrics', xn:'vitalState', Pn:'webVitalsPlugin', Ln:'navigationEntryAttempts',
  Cn:'pagePerformanceState', kn:'pagePerformancePlugin', In:'spaEvents', An:'spaPlugin', O:'TimeToInteractiveObserver',
  Mn:'gzipOnMainThread', x:'compressionWorker', Nn:'compressionWorkerFailed', _n:'compressionTaskCounter', P:'compressionTasks',
  Fn:'sessionStorageKey', Hn:'persistSession', Un:'getOrCreateSession', Dn:'BaseMonitor', qn:'DerivedMonitor',
  L:'CmesMonitor', jn:'PrototypeBridge', Wn:'pageClosePlugin', Bn:'BlankScreenTrigger', zn:'blankScreenDefaults',
  Gn:'visibleMediaTags', Vn:'ignoredScreenshotTags', Jn:'ScreenshotRenderer', Xn:'screenshotQualityLevels',
  k:'DomScreenshotRenderer', $n:'getScreenshotQuality', Kn:'cloneMatchers', Qn:'normalizeSelectors',
  Yn:'classifyBlankPoint', Zn:'resolveBlankScreenConfig', er:'elementsAtPoint', tr:'resizeScreenshot',
  nr:'describeElement', rr:'matchesElementRules', ir:'matchesSelectorList', or:'hasMatchers', ar:'mergeConfig',
  sr:'blankScreenPlugin', lr:'lagMonitorPlugin', cr:'hasMemoryAPI', ur:'readMemory', dr:'bytesToMegabytes',
};
for (const [original, descriptive] of Object.entries(names)) {
  if (!factory.scope.hasOwnBinding(original)) throw new Error(`Missing binding ${original}`);
  factory.scope.rename(original, descriptive);
}
let replacedHosts = 0;
factory.traverse({ StringLiteral(path) {
  if (path.node.value === 'https://rumt-zh.com') {
    path.replaceWith(t.identifier('DEFAULT_HOST_URL')); replacedHosts++;
  }
}});
if (replacedHosts !== 3) throw new Error(`Unexpected default hosts: ${replacedHosts}`);

const imports = [t.importDeclaration([t.importSpecifier(t.identifier('DEFAULT_HOST_URL'), t.identifier('DEFAULT_HOST_URL'))], t.stringLiteral('./config.js'))];
const extracted = [];
await fs.mkdir('src/plugins', {recursive:true});
const license = '/**\n * cmes-monitor-sdk — editable derivative of @tencent/aegis-web-sdk 1.43.60.\n * Copyright (c) 2026 TencentCloud Real User Monitoring. MIT; see LICENSE and NOTICE.\n * Derived from the supplied bundle; original TypeScript/local symbol names were not available.\n */\n';
async function writeJS(path, node) {
  await fs.writeFile(path, await format(license + generate(node, {comments:true}).code, {parser:'babel'}));
}

factory.traverse({ NewExpression(path) {
  if (!t.isIdentifier(path.node.callee, {name:'pluginConstructor'})) return;
  const option = path.get('arguments.0');
  if (!option?.isObjectExpression() || option.node.properties.length < 2) return;
  const nameProperty = option.node.properties.find(p => t.isObjectProperty(p) && t.isIdentifier(p.key, {name:'name'}));
  if (!nameProperty || !t.isStringLiteral(nameProperty.value)) return;
  const name = nameProperty.value.value;
  const factoryName = `create${name[0].toUpperCase()}${name.slice(1)}Options`;
  const dependencies = new Set();
  // Accessors retain the original shared mutable bindings and initialization order.
  option.traverse({ Identifier(ref) {
    const binding = ref.scope.getBinding(ref.node.name);
    if (!binding || binding.scope !== factory.scope) return;
    const isWrite = ref.parentPath.isAssignmentExpression() && ref.key === 'left'
      || ref.parentPath.isUpdateExpression() && ref.key === 'argument';
    if (!ref.isReferencedIdentifier() && !isWrite) return;
    const name = ref.node.name;
    dependencies.add(name);
    const member = t.memberExpression(t.identifier('shared'), t.identifier(name));
    // A lexical call f() must remain unbound: shared.f() would change its receiver.
    // Native fetch and some browser APIs reject that changed receiver.
    const directCall = (ref.parentPath.isCallExpression() || ref.parentPath.isOptionalCallExpression()) && ref.key === 'callee';
    ref.replaceWith(directCall ? t.sequenceExpression([t.numericLiteral(0), member]) : member);
    ref.skip();
  }});
  const module = t.program([t.exportDefaultDeclaration(t.functionDeclaration(t.identifier(factoryName), [t.identifier('shared')], t.blockStatement([t.returnStatement(option.node)])))]);
  extracted.push({name, dependencies:[...dependencies].sort(), module});
  imports.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier(factoryName))], t.stringLiteral(`./plugins/${name}.js`)));
  const accessors = [...dependencies].sort().flatMap(name => [
    t.objectMethod('get', t.identifier(name), [], t.blockStatement([t.returnStatement(t.identifier(name))])),
    t.objectMethod('set', t.identifier(name), [t.identifier('value')], t.blockStatement([t.expressionStatement(t.assignmentExpression('=', t.identifier(name), t.identifier('value')))])),
  ]);
  option.replaceWith(t.callExpression(t.identifier(factoryName), [t.objectExpression(accessors)]));
  path.skip();
}});
if (extracted.length !== 15) throw new Error(`Expected 15 plugins, got ${extracted.length}`);
for (const {name, module} of extracted) await writeJS(`src/plugins/${name}.js`, module);

// Split comma statements and var declarations at statement boundaries only. Evaluation order stays identical.
function readableStatements(file) {
  traverse(file, {
    ExpressionStatement(path) {
      if (t.isSequenceExpression(path.node.expression)) path.replaceWithMultiple(path.node.expression.expressions.map(e => t.expressionStatement(e)));
    },
    VariableDeclaration(path) {
      if (path.node.declarations.length > 1 && (path.parentPath.isProgram() || path.parentPath.isBlockStatement()))
        path.replaceWithMultiple(path.node.declarations.map(d => t.variableDeclaration(path.node.kind, [d])));
    },
    ReturnStatement(path) {
      if (!t.isSequenceExpression(path.node.argument)) return;
      const parts = path.node.argument.expressions;
      path.replaceWithMultiple([...parts.slice(0,-1).map(e => t.expressionStatement(e)), t.returnStatement(parts.at(-1))]);
    },
  });
}
const runtime = t.file(t.program([...imports, t.exportDefaultDeclaration(t.functionDeclaration(t.identifier('createRuntime'), [], factory.node.body))]));
readableStatements(runtime);
await writeJS('src/runtime.js', runtime);
await fs.writeFile('src/runtime.js', await format(applyControlOptions(await fs.readFile('src/runtime.js', 'utf8')), {parser:'babel'}));
for (const {name,module} of extracted) {
  const file=t.file(module); readableStatements(file); await writeJS(`src/plugins/${name}.js`,file);
}
await fs.writeFile('docs/reconstruction.json', JSON.stringify({reference:'@tencent/aegis-web-sdk@1.43.60',sha256:expected,hostLiteralReplacements:replacedHosts,bindings:names,plugins:extracted.map(({name,dependencies})=>({name,dependencies}))},null,2)+'\n');
console.log(`Reconstructed runtime and ${extracted.length} plugin modules; renamed ${Object.keys(names).length} bindings.`);
