// Tests run the BUILT bundle (dist/index.js) exactly as GitHub runs it:
// inputs as INPUT_* env vars, outputs via $GITHUB_OUTPUT, card via $GITHUB_STEP_SUMMARY.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CLASS_TEXT } from "../src/text.mjs";
import { allOutputs, bundle, root, run, sample } from "./helpers/run.mjs";

const expected = JSON.parse(readFileSync(join(root, "samples", "expected.json"), "utf8"));

for (const [name, cls] of Object.entries(expected)) {
  test(`sample ${name} -> ${cls}`, () => {
    const r = run({ files: { "ai-system.md": sample(name) } });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.equal(r.outputs["risk-class"], cls);
    const trig = JSON.parse(r.outputs.triggered);
    assert.deepEqual(Object.keys(trig).sort(), ["annex_iii", "article_5", "article_50", "gpai"]);
    assert.equal(r.network, "", "no network access");
    assert.match(r.summary, /not legal advice/);
    assert.match(r.summary, /98\.8% on 71 test cases measures consistency with the curated lexicon, not real-world accuracy/);
    assert.match(r.summary, /\[Run the check in your browser\]\(https:\/\/lucairn\.eu\/en\/tools\/ai-act-classifier\)/);
    assert.match(r.summary, /@lucairn\/ai-act-classifier v\d+\.\d+\.\d+/);
    const badge = JSON.parse(r.badge);
    assert.equal(badge.schemaVersion, 1);
    assert.equal(r.outputs["badge-path"], join(r.ws, ".github", "ai-act-badge.json"));
  });
}

test("cv screening card cites Annex III point 4 and lists the high-risk obligations", () => {
  const r = run({ files: { "ai-system.md": sample("cv-screening.md") } });
  assert.deepEqual(JSON.parse(r.outputs.triggered).annex_iii, ["Annex III point 4(a)"]);
  assert.match(r.summary, /Annex III point 4\(a\)/);
  for (const a of ["Article 10", "Article 12", "Article 13", "Article 14", "Article 15", "Article 11 / Annex IV"]) assert.ok(r.summary.includes(a), a);
  assert.match(r.summary, /Annex III area matched \(possible high-risk, Article 6\)/);
  assert.match(r.summary, /A keyword match is not a final classification: Article 6\(3\) and Article 5 exceptions are not assessed\./);
  assert.match(r.summary, /eur-lex\.europa\.eu/);
  assert.equal(JSON.parse(r.badge).message, "possible high-risk");
});

test("support chatbot card names the Art. 50(1) path", () => {
  const r = run({ files: { "ai-system.md": sample("support-chatbot.md") } });
  assert.deepEqual(JSON.parse(r.outputs.triggered).article_50, ["Art. 50(1)"]);
  assert.match(r.summary, /Art\. 50\(1\)/);
  assert.doesNotMatch(r.summary, /GPAI\/deployer/);
});

test("no-trigger result says 'no trigger found' and the badge is grey", () => {
  const r = run({ files: { "ai-system.md": sample("code-assistant.md") } });
  const badge = JSON.parse(r.badge);
  assert.equal(badge.message, "no trigger found");
  assert.equal(badge.color, "lightgrey");
  assert.match(r.summary, /No trigger found/);
});

test("badge message is the risk class only", () => {
  const texts = {
    prohibited: "The system performs social scoring of citizens based on their social behaviour.",
    gpai: "We are the provider of a general-purpose AI model, a foundation model trained with large compute, offered to downstream developers.",
  };
  for (const [cls, text] of Object.entries(texts)) {
    const r = run({ files: { "ai-system.md": text } });
    assert.equal(r.outputs["risk-class"], cls);
    const badge = JSON.parse(r.badge);
    assert.deepEqual(Object.keys(badge).sort(), ["color", "label", "message", "schemaVersion"]);
    assert.equal(badge.message, { prohibited: "possible prohibited practice", gpai: "possible GPAI obligations" }[cls]);
  }
});

test("ai-act.yml fallback with a German block description and lang: de", () => {
  const yml = [
    "name: BewerberRadar",
    "description: |",
    "  BewerberRadar ist ein KI-System für die Personalauswahl. Es sortiert Bewerbungen",
    "  vor, erstellt eine Rangliste der Bewerber und empfiehlt, wen die Personalabteilung",
    "  zum Vorstellungsgespräch einladen soll.",
    "",
  ].join("\n");
  const r = run({ files: { "ai-act.yml": yml }, inputs: { lang: "de" } });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.outputs["risk-class"], "high-risk");
  assert.match(r.summary, /Anhang III Nr\. 4/);
  assert.match(r.summary, /keine Rechtsberatung/);
  assert.match(r.summary, /https:\/\/lucairn\.eu\/de\/tools\/ai-act-classifier/);
  assert.equal(JSON.parse(r.badge).message, "möglicherweise Hochrisiko");
  assert.match(r.summary, /EU-KI-Verordnung: Einordnung/);
  assert.match(r.summary, /Ein Stichwort-Treffer ist keine abschließende Einstufung/);
});

test("explicit path input and custom badge-path", () => {
  const r = run({ files: { "docs/system.md": sample("support-chatbot.md") }, inputs: { path: "docs/system.md", "badge-path": "out/badge.json" } });
  assert.equal(r.outputs["risk-class"], "transparency");
  assert.equal(r.outputs["badge-path"], join(r.ws, "out", "badge.json"));
});

test("empty badge-path writes no badge file", () => {
  const r = run({ files: { "ai-system.md": sample("support-chatbot.md") }, inputs: { "badge-path": "" } });
  assert.equal(r.status, 0);
  assert.equal(r.outputs["badge-path"], "");
  assert.equal(existsSync(join(r.ws, ".github", "ai-act-badge.json")), false);
});

test("fail-on", () => {
  const cv = { "ai-system.md": sample("cv-screening.md") };
  assert.equal(run({ files: cv, inputs: { "fail-on": "none" } }).status, 0);
  assert.equal(run({ files: cv, inputs: { "fail-on": "prohibited" } }).status, 0);
  const hr = run({ files: cv, inputs: { "fail-on": "high-risk" } });
  assert.equal(hr.status, 1);
  assert.match(hr.stdout, /::error::EU AI Act check found "high-risk"/);
  assert.equal(hr.outputs["risk-class"], "high-risk", "outputs are still written when failing");
  const chat = { "ai-system.md": sample("support-chatbot.md") };
  assert.equal(run({ files: chat, inputs: { "fail-on": "high-risk" } }).status, 0);
});

test("bad inputs fail with a clear error", () => {
  const lang = run({ files: { "ai-system.md": "x" }, inputs: { lang: "fr" } });
  assert.equal(lang.status, 1);
  assert.match(lang.stdout, /::error::Input "lang" must be one of en, de/);
  const failOn = run({ files: { "ai-system.md": "x" }, inputs: { "fail-on": "transparency" } });
  assert.equal(failOn.status, 1);
  const missing = run({});
  assert.equal(missing.status, 1);
  assert.match(missing.stdout, /No AI system description found/);
  const noDesc = run({ files: { "ai-act.yml": "name: x\n" } });
  assert.equal(noDesc.status, 1);
  assert.match(noDesc.stdout, /needs a top-level "description:" field/);
});

test("language mismatch produces a warning", () => {
  const r = run({ files: { "ai-system.md": sample("cv-screening.md") }, inputs: { lang: "de" } });
  assert.match(r.stdout, /::warning::.*looks like "en" text but lang is "de"/);
});

test("bundle contains no network code", () => {
  const src = readFileSync(bundle, "utf8");
  for (const needle of ["node:http", "node:https", "node:net", "node:tls", "node:dns", "fetch(", "XMLHttpRequest", "WebSocket", "import(", "@anthropic-ai/sdk\")", "\"openai\")"]) {
    assert.equal(src.includes(needle), false, `dist/index.js contains ${needle}`);
  }
});

test("no class title or badge states a class or obligation without 'possible' / 'möglich'", () => {
  const strong = /high-risk|prohibited|hochrisiko|verboten|transparen|obligation|pflicht|gpai/i;
  const hedge = /possible|möglich/i;
  for (const lang of ["en", "de"]) {
    for (const [cls, t] of Object.entries(CLASS_TEXT[lang])) {
      for (const text of [t.title, t.badge]) {
        if (strong.test(text)) assert.match(text, hedge, `${lang}/${cls}: "${text}"`);
      }
    }
  }
  // Exact hedged wording of the Article 50 / GPAI titles and the Article 50 badge.
  assert.equal(CLASS_TEXT.en.transparency.title, "Possible transparency obligation (Article 50)");
  assert.equal(CLASS_TEXT.de.transparency.title, "Mögliche Transparenzpflicht (Artikel 50)");
  assert.equal(CLASS_TEXT.en.gpai.title, "Possible general-purpose AI model provider obligations (Article 53; Article 55 if systemic risk)");
  assert.equal(
    CLASS_TEXT.de.gpai.title,
    "Mögliche Anbieterpflichten für KI-Modelle mit allgemeinem Verwendungszweck (Artikel 53; Artikel 55 bei systemischem Risiko)",
  );
  assert.equal(CLASS_TEXT.en.transparency.badge, "possible transparency obligation");
  assert.equal(CLASS_TEXT.de.transparency.badge, "mögliche Transparenzpflicht");
  assert.equal(CLASS_TEXT.en.gpai.badge, "possible GPAI obligations");
  assert.equal(CLASS_TEXT.de.gpai.badge, "mögliche GPAI-Pflichten");
  // And in real output: card headings and the class line carry the hedge (EN + DE,
  // high-risk, transparency and GPAI cards).
  const gpaiText = "We are the provider of a general-purpose AI model, a foundation model trained with large compute, offered to downstream developers.";
  for (const [file, lang] of [["cv-screening.md", "en"], ["support-chatbot.md", "en"], ["support-chatbot.md", "de"], [null, "en"], [null, "de"]]) {
    const r = run({ files: { "ai-system.md": file ? sample(file) : gpaiText }, inputs: { lang } });
    const lines = r.summary.split("\n").filter((l) => /^#+ |\*\*(Risk class|Risikoklasse)/.test(l));
    assert.ok(lines.length >= 2, r.summary);
    for (const line of lines) {
      if (strong.test(line)) assert.match(line, hedge, line);
    }
  }
});

test("removed unsourced 'grounded against' sentence stays out", () => {
  const r = run({ files: { "ai-system.md": sample("support-chatbot.md") } });
  assert.doesNotMatch(r.summary, /grounded against|geerdet/);
});

// Keep this last: it checks every output produced by the tests above.
test("no output claims conformity or minimal risk (EN + DE)", () => {
  assert.ok(allOutputs.length >= 15, `expected many runs, got ${allOutputs.length}`);
  const banned = /compliant|konform|minimal risk|minimales risiko|minimal-risk/i;
  for (const r of allOutputs) {
    for (const [what, text] of [["summary", r.summary], ["badge", r.badge], ["outputs", JSON.stringify(r.outputs)], ["log", r.stdout + r.stderr]]) {
      const m = text.match(banned);
      assert.equal(m, null, `banned word "${m && m[0]}" in ${what}`);
    }
  }
});

test("Annex III point 2 never prints a sub-letter (EN + DE)", () => {
  const texts = {
    en: "The AI system controls safety components in the management of the electricity grid.",
    de: "Das KI-System dient als Sicherheitskomponente bei der Steuerung der Stromversorgung und des Stromnetzes.",
  };
  for (const [lang, re, bad] of [["en", /Annex III point 2(?![\d(])/, /Annex III point 2\(/], ["de", /Anhang III Nr\. 2(?![\d])/, /Anhang III Nr\. 2 Buchst/]]) {
    const r = run({ files: { "ai-system.md": texts[lang] }, inputs: { lang } });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.summary, re);
    assert.doesNotMatch(r.summary, bad);
    assert.deepEqual(JSON.parse(r.outputs.triggered).annex_iii, ["Annex III point 2"]);
  }
});
