// Bundle src/main.mjs + the pinned engine into dist/ so users need no install step.
//
// Layout produced:
//   dist/index.js                  the bundled action (ESM)
//   dist/package.json              {"type":"module"}
//   dist/engine/package.json       the engine's package.json (read by its rules-hash loader)
//   dist/engine/dist/{data,i18n,content}/   the engine's rule data, read at run time
//   dist/engine/LICENSE            the engine's MIT licence
//   dist/licenses.txt              licences of every package inside dist/index.js
//
// The engine loads its JSON rule files relative to `import.meta.url` of each of
// its modules. After bundling every module shares one `import.meta.url`, so the
// plugin below rewrites each engine module's `import.meta.url` to the URL that
// module would have inside dist/engine/, where its data files are copied.
//
// The engine's optional LLM providers (dynamic imports, network) are replaced by
// a stub that throws: this action only runs the deterministic keyword path.

import { build } from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const engineRoot = join(root, "node_modules", "@lucairn", "ai-act-classifier");
const enginePkg = JSON.parse(readFileSync(join(engineRoot, "package.json"), "utf8"));
const ourPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// The engine pin lives in exactly one line: package.json dependencies["@lucairn/ai-act-classifier"].
const pinned = ourPkg.dependencies["@lucairn/ai-act-classifier"];
if (!/^\d+\.\d+\.\d+$/.test(pinned)) throw new Error(`engine pin must be an exact version, got "${pinned}"`);
if (enginePkg.version !== pinned) {
  throw new Error(`installed engine ${enginePkg.version} != pinned ${pinned}; run npm ci`);
}

const toPosix = (p) => p.split(sep).join("/");

const enginePlugin = {
  name: "lucairn-engine",
  setup(b) {
    b.onResolve({ filter: /^virtual:engine-citations$/ }, () => ({ path: join(engineRoot, "dist", "data", "citations.json") }));
    b.onResolve({ filter: /^virtual:engine-package$/ }, () => ({ path: "engine-package", namespace: "engine-meta" }));
    b.onLoad({ filter: /.*/, namespace: "engine-meta" }, () => ({
      contents: JSON.stringify({ name: enginePkg.name, version: enginePkg.version }),
      loader: "json",
    }));

    b.onResolve({ filter: /^\.\/providers\// }, (args) =>
      args.importer.startsWith(engineRoot) ? { path: args.path, namespace: "llm-stub" } : undefined,
    );
    b.onLoad({ filter: /.*/, namespace: "llm-stub" }, () => ({
      // ESM stub: same export names as the engine's provider modules, every
      // function throws. Only reachable when classify() is called with `llm`,
      // which this action never does.
      contents: [
        "const fail = () => { throw new Error(\"LLM mode is not included in the ai-act-check bundle; it runs the deterministic engine only.\"); };",
        "export const extractWithAnthropic = fail;",
        "export const extractWithOpenAI = fail;",
        "export const extractWithGroq = fail;",
        "export const LEXICONS_CACHE = {};",
        "export const PROMPT_CHECKSUM = \"\";",
        "export const DEFAULT_MODEL = \"\";",
      ].join("\n"),
      loader: "js",
    }));

    b.onLoad({ filter: /\.js$/ }, (args) => {
      if (!args.path.startsWith(engineRoot + sep)) return undefined;
      const src = readFileSync(args.path, "utf8");
      if (!src.includes("import.meta.url")) return undefined;
      const rel = "./engine/" + toPosix(relative(engineRoot, args.path));
      return {
        contents: src.replaceAll("import.meta.url", `new URL(${JSON.stringify(rel)}, import.meta.url).href`),
        loader: "js",
        resolveDir: dirname(args.path),
      };
    });
  },
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const result = await build({
  absWorkingDir: root,
  entryPoints: ["src/main.mjs"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  legalComments: "none",
  sourcemap: false,
  minify: false,
  metafile: true,
  logLevel: "warning",
  // CommonJS dependencies bundled into ESM need a real `require` for node built-ins.
  banner: {
    js: [
      "// ai-act-check — bundled GitHub Action. Source: src/; rebuild with `npm run build`.",
      `// Engine: ${enginePkg.name}@${enginePkg.version} (MIT). Third-party licences: dist/licenses.txt.`,
      'import { createRequire as __aiActCreateRequire } from "node:module";',
      "const require = __aiActCreateRequire(import.meta.url);",
    ].join("\n"),
  },
  plugins: [enginePlugin],
});

writeFileSync(join(dist, "package.json"), JSON.stringify({ type: "module" }, null, 2) + "\n");

// Engine run-time files, mirrored under dist/engine/.
const engineOut = join(dist, "engine");
for (const d of ["data", "i18n", "content"]) {
  const from = join(engineRoot, "dist", d);
  // i18n also holds compiled loader code (already in the bundle); copy only its JSON.
  const filter = d === "i18n" ? (src) => !/\.(js|ts|map)$/.test(src) : undefined;
  if (existsSync(from)) cpSync(from, join(engineOut, "dist", d), { recursive: true, filter });
}
writeFileSync(join(engineOut, "package.json"), JSON.stringify(enginePkg, null, 2) + "\n");
cpSync(join(engineRoot, "LICENSE"), join(engineOut, "LICENSE"));

// Licences of every npm package that ended up in the bundle.
const pkgs = new Map();
for (const input of Object.keys(result.metafile.inputs)) {
  const m = toPosix(input).match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//);
  if (!m || pkgs.has(m[1])) continue;
  const dir = join(root, "node_modules", m[1]);
  const pj = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const licFile = ["LICENSE", "LICENSE.md", "LICENSE.txt", "license", "LICENCE"].map((f) => join(dir, f)).find(existsSync);
  pkgs.set(m[1], { version: pj.version, license: pj.license, text: licFile ? readFileSync(licFile, "utf8").trim() : "(no licence file in package)" });
}
const lic = [...pkgs.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, p]) => `${name}@${p.version} — ${p.license}\n\n${p.text}\n`)
  .join("\n" + "-".repeat(72) + "\n\n");
writeFileSync(join(dist, "licenses.txt"), lic);

console.log(`built dist/index.js with ${enginePkg.name}@${enginePkg.version}; bundled packages: ${[...pkgs.keys()].sort().join(", ")}`);
