import { build } from "esbuild";
import fs from "node:fs/promises";

await fs.mkdir("dist", { recursive: true });
const banner =
  "/*! cmes-monitor-sdk v1.0.1 | Derived from @tencent/aegis-web-sdk 1.43.60 | Copyright (c) 2026 TencentCloud Real User Monitoring | MIT (see LICENSE/NOTICE) */";
const base = {
  entryPoints: ["src/index.js"],
  bundle: true,
  target: ["es2018"],
  legalComments: "inline",
  sourcemap: true,
  sourcesContent: true,
};
await build({
  ...base,
  format: "esm",
  outfile: "dist/cmes-monitor.esm.js",
  banner: { js: banner },
});
// UMD preserves direct CommonJS require(), AMD, and script-tag construction.
const umdPrefix = `${banner}\n(function(root,factory){if(typeof exports==='object'&&typeof module!=='undefined'){module.exports=factory();}else if(typeof define==='function'&&define.amd){define(factory);}else{var sdk=factory();root.CmesMonitor=sdk;root.Aegis=sdk;}})(typeof globalThis!=='undefined'?globalThis:typeof self!=='undefined'?self:this,function(){`;
const umdSuffix = "return __CmesExports.default;});";
for (const minify of [false, true]) {
  await build({
    ...base,
    format: "iife",
    globalName: "__CmesExports",
    minify,
    outfile: `dist/cmes-monitor${minify ? ".min" : ""}.js`,
    banner: { js: umdPrefix },
    footer: { js: umdSuffix },
  });
}
await fs.copyFile("dist/cmes-monitor.js", "dist/cmes-monitor.cjs");
await fs.copyFile("dist/cmes-monitor.js.map", "dist/cmes-monitor.cjs.map");
await fs.writeFile(
  "dist/cmes-monitor.cjs",
  (await fs.readFile("dist/cmes-monitor.cjs", "utf8")).replace(
    "sourceMappingURL=cmes-monitor.js.map",
    "sourceMappingURL=cmes-monitor.cjs.map",
  ),
);
await fs.copyFile("src/index.d.ts", "dist/index.d.ts");
await fs.copyFile("src/index.d.cts", "dist/index.d.cts");
await fs.copyFile("src/config.d.ts", "dist/config.d.ts");
console.log("Built ESM, CommonJS, UMD and minified UMD with source maps.");
