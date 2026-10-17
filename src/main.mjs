// GitHub Action entry point. Bundled to dist/index.js by scripts/build.mjs.

import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { locateDescription, readDescription } from "./description.mjs";
import { CITATIONS, ENGINE_NAME, ENGINE_VERSION, detectLanguage, runEngine } from "./engine.mjs";
import { badge, isPreviousBadge, riskClass, summaryMarkdown, triggered } from "./render.mjs";
import { CLASS_TEXT } from "./text.mjs";
import { SafeError, displayText, error, info, warning } from "./log.mjs";
import { workspaceRoot, writeContained } from "./safe-fs.mjs";

// GitHub passes inputs as INPUT_<NAME> with the name upper-cased; hyphens are kept.
function input(name, fallback) {
  const v = process.env[`INPUT_${name.toUpperCase()}`];
  return v === undefined || v.trim() === "" ? fallback : v.trim();
}

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const delim = `ghadelim_${randomUUID()}`;
  const v = String(value);
  if (v.includes(delim) || /[\r\n]/.test(v)) throw new SafeError(`Output "${name}" contains a line break; refusing to write it.`);
  appendFileSync(file, `${name}<<${delim}\n${v}\n${delim}\n`);
}

function choice(name, value, allowed) {
  if (!allowed.includes(value)) throw new SafeError(`Input "${name}" must be one of ${allowed.join(", ")}; got "${displayText(value)}".`);
  return value;
}

async function main() {
  // The bundled yaml library prints parsed source when these are set; the action never prints file content.
  delete process.env.LOG_TOKENS;
  delete process.env.LOG_STREAM;
  const cwd = process.env.GITHUB_WORKSPACE || process.cwd();
  const root = workspaceRoot(cwd);
  const lang = choice("lang", input("lang", "en").toLowerCase(), ["en", "de"]);
  const failOn = choice("fail-on", input("fail-on", "none").toLowerCase(), ["none", "prohibited", "high-risk"]);
  // An explicitly empty badge-path means "do not write a badge file".
  const badgeRaw = process.env["INPUT_BADGE-PATH"];
  const badgePath = badgeRaw === undefined ? ".github/ai-act-badge.json" : badgeRaw.trim();

  const { rel, abs } = locateDescription(input("path", "ai-system.md"), root);
  const text = readDescription(abs, rel);
  const shownRel = displayText(rel);

  const detected = await detectLanguage(text);
  if (detected !== lang) {
    warning(`${shownRel} looks like "${detected}" text but lang is "${lang}". The engine matches against the ${lang} lexicon only; set lang: ${detected} if the description is in that language.`);
  }

  const r = await runEngine(text, lang);
  const cls = riskClass(r);
  const trig = triggered(r, CITATIONS);
  const engine = { name: ENGINE_NAME, version: ENGINE_VERSION };

  const md = summaryMarkdown({ r, cls, citations: CITATIONS, lang, sourcePath: rel, engine });
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");

  let badgeAbs = "";
  if (badgePath) {
    writeContained(root, badgePath, "badge-path", JSON.stringify(badge(cls, lang), null, 2) + "\n", { mayOverwrite: isPreviousBadge });
    // Reported under the workspace path as given (same file as under its realpath:
    // every component below the root was checked not to be a symlink).
    badgeAbs = resolve(cwd, badgePath);
  }

  setOutput("risk-class", cls);
  setOutput("triggered", JSON.stringify(trig));
  setOutput("badge-path", badgeAbs);
  setOutput("engine-version", ENGINE_VERSION);

  info(`EU AI Act check: ${cls} (${CLASS_TEXT[lang][cls].badge}) from ${shownRel}; engine ${ENGINE_NAME} v${ENGINE_VERSION}`);
  info(`triggered: ${JSON.stringify(trig)}`);
  if (badgeAbs) info(`badge JSON: ${displayText(badgeAbs)}`);

  const fail =
    (failOn === "prohibited" && cls === "prohibited") ||
    (failOn === "high-risk" && (cls === "prohibited" || cls === "high-risk"));
  if (fail) {
    error(`EU AI Act check found "${cls}" and fail-on is "${failOn}".`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  // Our own errors already carry displayText()'d fragments; anything else is escaped here.
  const msg = e && e.message ? e.message : String(e);
  error(e instanceof SafeError ? msg : displayText(msg));
  process.exitCode = 1;
});
