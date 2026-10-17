// GitHub Action entry point. Bundled to dist/index.js by scripts/build.mjs.

import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { locateDescription, readDescription } from "./description.mjs";
import { CITATIONS, ENGINE_NAME, ENGINE_VERSION, detectLanguage, runEngine } from "./engine.mjs";
import { badge, riskClass, summaryMarkdown, triggered } from "./render.mjs";
import { CLASS_TEXT } from "./text.mjs";

// GitHub passes inputs as INPUT_<NAME> with the name upper-cased; hyphens are kept.
function input(name, fallback) {
  const v = process.env[`INPUT_${name.toUpperCase()}`];
  return v === undefined || v.trim() === "" ? fallback : v.trim();
}

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const delim = `ghadelim_${randomUUID()}`;
  appendFileSync(file, `${name}<<${delim}\n${value}\n${delim}\n`);
}

function choice(name, value, allowed) {
  if (!allowed.includes(value)) throw new Error(`Input "${name}" must be one of ${allowed.join(", ")}; got "${value}".`);
  return value;
}

async function main() {
  const cwd = process.env.GITHUB_WORKSPACE || process.cwd();
  const lang = choice("lang", input("lang", "en").toLowerCase(), ["en", "de"]);
  const failOn = choice("fail-on", input("fail-on", "none").toLowerCase(), ["none", "prohibited", "high-risk"]);
  // An explicitly empty badge-path means "do not write a badge file".
  const badgeRaw = process.env["INPUT_BADGE-PATH"];
  const badgePath = badgeRaw === undefined ? ".github/ai-act-badge.json" : badgeRaw.trim();

  const { rel, abs } = locateDescription(input("path", "ai-system.md"), cwd);
  const text = readDescription(abs, rel);

  const detected = await detectLanguage(text);
  if (detected !== lang) {
    console.log(`::warning::${rel} looks like "${detected}" text but lang is "${lang}". The engine matches against the ${lang} lexicon only; set lang: ${detected} if the description is in that language.`);
  }

  const r = await runEngine(text, lang);
  const cls = riskClass(r);
  const trig = triggered(r, CITATIONS);
  const engine = { name: ENGINE_NAME, version: ENGINE_VERSION };

  const md = summaryMarkdown({ r, cls, citations: CITATIONS, lang, sourcePath: rel, engine });
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");

  let badgeAbs = "";
  if (badgePath) {
    badgeAbs = resolve(cwd, badgePath);
    mkdirSync(dirname(badgeAbs), { recursive: true });
    writeFileSync(badgeAbs, JSON.stringify(badge(cls, lang), null, 2) + "\n");
  }

  setOutput("risk-class", cls);
  setOutput("triggered", JSON.stringify(trig));
  setOutput("badge-path", badgeAbs);
  setOutput("engine-version", ENGINE_VERSION);

  console.log(`EU AI Act check: ${cls} (${CLASS_TEXT[lang][cls].badge}) from ${rel}; engine ${ENGINE_NAME} v${ENGINE_VERSION}`);
  console.log(`triggered: ${JSON.stringify(trig)}`);
  if (badgeAbs) console.log(`badge JSON: ${badgeAbs}`);

  const fail =
    (failOn === "prohibited" && cls === "prohibited") ||
    (failOn === "high-risk" && (cls === "prohibited" || cls === "high-risk"));
  if (fail) {
    console.log(`::error::EU AI Act check found "${cls}" and fail-on is "${failOn}".`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.log(`::error::${e && e.message ? e.message : String(e)}`);
  process.exitCode = 1;
});
