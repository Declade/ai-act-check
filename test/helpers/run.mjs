// Run the BUILT bundle (dist/index.js) exactly as GitHub runs it: inputs as INPUT_*
// env vars, outputs via $GITHUB_OUTPUT, card via $GITHUB_STEP_SUMMARY.
//
// Every run gets a fresh base directory holding the workspace and a sibling
// "outside" directory, so tests can prove nothing is read from or written to a
// place outside the workspace.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const bundle = join(root, "dist", "index.js");
const noNetwork = join(root, "test", "helpers", "no-network.mjs");

// Every run's result is collected here (the wording test checks all of them).
export const allOutputs = [];

export function parseOutputs(file) {
  const out = {};
  if (!existsSync(file)) return out;
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([^<]+)<<(.+)$/);
    if (!m) continue;
    const buf = [];
    for (i++; i < lines.length && lines[i] !== m[2]; i++) buf.push(lines[i]);
    out[m[1]] = buf.join("\n");
  }
  return out;
}

/**
 * Run the action. `files` = {workspace-relative path: content}; `setup({ws, outside})`
 * runs before the action (create symlinks etc.); `env` adds variables.
 */
export function run({ files = {}, inputs = {}, setup, env: extraEnv = {} } = {}) {
  const base = mkdtempSync(join(tmpdir(), "ai-act-check-"));
  const ws = join(base, "ws");
  const outside = join(base, "outside");
  mkdirSync(ws);
  mkdirSync(outside);
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(ws, rel)), { recursive: true });
    writeFileSync(join(ws, rel), content);
  }
  if (setup) setup({ ws, outside, base });
  const outFile = join(base, "gh-output");
  const sumFile = join(base, "gh-summary");
  const marker = join(base, "network-attempts");
  const env = { PATH: process.env.PATH, GITHUB_WORKSPACE: ws, GITHUB_OUTPUT: outFile, GITHUB_STEP_SUMMARY: sumFile, NO_NETWORK_MARKER: marker, ...extraEnv };
  for (const [k, v] of Object.entries(inputs)) env[`INPUT_${k.toUpperCase()}`] = v;
  const p = spawnSync(process.execPath, ["--import", noNetwork, bundle], { cwd: ws, env, encoding: "utf8" });
  const outputs = parseOutputs(outFile);
  const summary = existsSync(sumFile) ? readFileSync(sumFile, "utf8") : "";
  const badgeFile = outputs["badge-path"];
  const badge = badgeFile && existsSync(badgeFile) ? readFileSync(badgeFile, "utf8") : "";
  const network = existsSync(marker) ? readFileSync(marker, "utf8") : "";
  const r = { base, ws, outside, status: p.status, stdout: p.stdout, stderr: p.stderr, outputs, summary, badge, network };
  allOutputs.push(r);
  return r;
}

export const sample = (name) => readFileSync(join(root, "samples", name), "utf8");
