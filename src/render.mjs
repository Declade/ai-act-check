// Pure functions: engine result -> risk class, triggered list, summary card, badge.

import { ART5_LETTER, ART50_PATH, CLASS_COLOR, CLASS_TEXT, TOOL_URL, UI } from "./text.mjs";

/** This tool's ordering when several classes fire: Art. 5 > Annex III > Art. 50 > GPAI > none. */
export function riskClass(r) {
  if (r.article_5.prohibited) return "prohibited";
  if (r.annex_iii.high_risk && !r.annex_iii.suppressed_by_article_5) return "high-risk";
  if (r.article_50.applicable) return "transparency";
  if (r.gpai.article_53_applicable || r.gpai.article_55_applicable) return "gpai";
  return "no-trigger";
}

function eurLex(citations, key, lang) {
  const c = citations[key];
  const url = c && (lang === "de" ? c.eur_lex_html_de : c.eur_lex_html_en);
  return url || (lang === "de" ? citations._meta.primary_pdf_de : citations._meta.primary_pdf_en);
}

function annexRef(d, lang) {
  const sub = d.sub_letters.length ? `(${d.sub_letters.join(", ")})` : "";
  return lang === "de"
    ? `Anhang III Nr. ${d.annex_iii_number}${d.sub_letters.length ? ` Buchst. ${d.sub_letters.join(", ")}` : ""}`
    : `Annex III point ${d.annex_iii_number}${sub}`;
}

/**
 * Everything that fired, as display rows. Matched phrases are excerpts of the
 * description in the user's own repository; they appear in the job summary only.
 */
export function findings(r, citations, lang) {
  const rows = [];
  for (const h of r.article_5.hits) {
    rows.push({
      group: "article_5",
      key: `a5:${h.letter}`,
      ref: lang === "de" ? `Art. 5 Abs. 1 Buchst. ${h.letter}` : `Art. 5(1)(${h.letter})`,
      what: ART5_LETTER[lang][h.letter] ?? h.category_key,
      phrases: h.matched_phrases,
      url: eurLex(citations, "article_5", lang),
    });
  }
  if (!r.annex_iii.suppressed_by_article_5) {
    for (const d of r.annex_iii.domains) {
      rows.push({
        group: "annex_iii",
        key: `a3:${d.annex_iii_number}`,
        ref: annexRef(d, lang),
        what: lang === "de" ? d.title_de : d.title_en,
        phrases: d.matched_phrases,
        url: eurLex(citations, "annex_iii", lang),
      });
    }
  }
  for (const [key, on] of Object.entries(r.article_50.triggered_by)) {
    if (!on || !ART50_PATH[key]) continue;
    rows.push({
      group: "article_50",
      key: `a50:${ART50_PATH[key].paragraph}`,
      ref: ART50_PATH[key].ref[lang],
      what: ART50_PATH[key][lang],
      phrases: [],
      url: eurLex(citations, "article_50", lang),
    });
  }
  if (r.gpai.article_53_applicable) {
    rows.push({
      group: "gpai",
      key: "a53",
      ref: "Art. 53",
      what: lang === "de" ? "Pflichten für Anbieter von KI-Modellen mit allgemeinem Verwendungszweck" : "obligations for providers of general-purpose AI models",
      phrases: [],
      url: eurLex(citations, "gpai_articles_53_55", lang),
    });
  }
  if (r.gpai.article_55_applicable) {
    rows.push({
      group: "gpai",
      key: "a55",
      ref: "Art. 55",
      what: lang === "de" ? "KI-Modelle mit allgemeinem Verwendungszweck mit systemischem Risiko" : "general-purpose AI models with systemic risk",
      phrases: [],
      url: eurLex(citations, "gpai_articles_53_55", lang),
    });
  }
  return rows;
}

/** Machine-readable list for the `triggered` output (always English references). */
export function triggered(r, citations) {
  const out = { article_5: [], annex_iii: [], article_50: [], gpai: [] };
  for (const f of findings(r, citations, "en")) out[f.group].push(f.ref);
  out.article_50 = [...new Set(out.article_50)];
  return out;
}

/** Obligations the engine flags for a high-risk result (Art. 10, 12–15, Annex IV). */
export function obligations(r, citations, lang) {
  const rows = [];
  for (const key of ["article_10", "article_12", "article_13", "article_14", "article_15"]) {
    if (r[key] && r[key].applicable) rows.push({ label: citations[key][lang === "de" ? "label_de" : "label_en"], url: eurLex(citations, key, lang) });
  }
  if (r.annex_iv_required) {
    rows.push({
      label: lang === "de" ? "Artikel 11 / Anhang IV (technische Dokumentation)" : "Article 11 / Annex IV (technical documentation)",
      url: eurLex(citations, "annex_iv", lang),
    });
  }
  return rows;
}

const BADGE_LABELS = new Set(["EU AI Act", "EU-KI-VO"]);

/**
 * True when `buf` is a badge file this action wrote earlier (any language, any class),
 * so it may be overwritten. Anything else at the badge path is left alone.
 */
export function isPreviousBadge(buf) {
  let b;
  try {
    b = JSON.parse(Buffer.from(buf).toString("utf8"));
  } catch {
    return false;
  }
  return (
    !!b &&
    typeof b === "object" &&
    !Array.isArray(b) &&
    b.schemaVersion === 1 &&
    BADGE_LABELS.has(b.label) &&
    typeof b.message === "string" &&
    typeof b.color === "string" &&
    Object.keys(b).every((k) => ["schemaVersion", "label", "message", "color"].includes(k))
  );
}

export function badge(cls, lang) {
  return {
    schemaVersion: 1,
    label: lang === "de" ? "EU-KI-VO" : "EU AI Act",
    message: CLASS_TEXT[lang][cls].badge,
    color: CLASS_COLOR[cls],
  };
}

// ---- Markdown output for untrusted text -------------------------------------
// Paths and matched phrases come from the user's repository. They are rendered as
// code spans (never parsed as Markdown, HTML, links or autolinks); other display
// text is escaped. In table cells `|` must be escaped even inside a code span.

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

/** Inline code span that cannot be broken out of. `table` = value sits in a table cell. */
export function codeSpan(value, { table = false } = {}) {
  let v = String(value).replace(/\r\n|\r|\n/g, " ").replace(CONTROL, "\uFFFD");
  if (table) {
    // GFM (cmark-gfm, as GitHub renders job summaries) splits cells on `|` unless it is
    // written `\|`, also inside code spans, and turns `\|` back into `|`. Other
    // backslashes are left as they are (checked against GitHub's renderer).
    v = v.replace(/\|/g, "\\|");
  }
  if (v === "") v = " ";
  const longest = Math.max(0, ...(v.match(/`+/g) || []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  // A space on both sides lets the value start or end with a backtick or a space.
  const pad = /^[` ]|[` ]$/.test(v) ? " " : "";
  return `${fence}${pad}${v}${pad}${fence}`;
}

/**
 * Display text that is not a path or phrase (engine titles, references): one line,
 * HTML-escaped, inline Markdown punctuation backslash-escaped (also `|` for table
 * cells). Text taken from the user's repository always goes through codeSpan().
 */
export function mdText(value) {
  return String(value)
    .replace(/\r\n|\r|\n/g, " ")
    .replace(CONTROL, "\uFFFD")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_[\]|~]/g, (c) => `\\${c}`);
}

// ---- Negation notes (engine 0.4.0 `negated_hits`, PRD Amendment 1: advisory only) ----

const ART50_PARAGRAPH = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 4 };

/** Key of the finding row a negated hit belongs to (same keys as findings()). */
function negatedKey(h) {
  const lead = String(h.category || "").split("_")[0];
  switch (h.group) {
    case "article_5_prohibited":
      return /^[a-h]$/.test(lead) ? `a5:${lead}` : "a5";
    case "annex_iii":
      return /^[1-8]$/.test(lead) ? `a3:${lead}` : "a3";
    case "article_50_gpai":
      return ART50_PARAGRAPH[lead] ? `a50:${ART50_PARAGRAPH[lead]}` : "a50";
    case "gpai_models":
      return h.category === "systemic_risk_markers" ? "a55" : "a53";
    default:
      return `other:${h.group}`;
  }
}

/** Reference shown for a note that has no matching finding row. */
function negatedRef(h, lang) {
  const de = lang === "de";
  const lead = String(h.category || "").split("_")[0];
  switch (h.group) {
    case "article_5_prohibited":
      return /^[a-h]$/.test(lead) ? (de ? `Art. 5 Abs. 1 Buchst. ${lead}` : `Art. 5(1)(${lead})`) : "Art. 5";
    case "annex_iii":
      return /^[1-8]$/.test(lead) ? (de ? `Anhang III Nr. ${lead}` : `Annex III point ${lead}`) : de ? "Anhang III" : "Annex III";
    case "article_50_gpai":
      return ART50_PARAGRAPH[lead] ? (de ? `Art. 50 Abs. ${ART50_PARAGRAPH[lead]}` : `Art. 50(${ART50_PARAGRAPH[lead]})`) : "Art. 50";
    case "article_4_ai_literacy":
      return "Art. 4";
    case "gpai_models":
      return h.category === "systemic_risk_markers" ? "Art. 55" : "Art. 53";
    case "scope_qualifiers":
      return de ? "Anwendungsbereich" : "scope qualifier";
    default:
      return de ? "sonstige" : "other";
  }
}

function negationLine(h, t, table) {
  return `${t.negNote}: ${codeSpan(h.phrase, { table })} (${t.negCue}: ${codeSpan(h.cue, { table })})`;
}

const cell = (s) => mdText(s);

export function summaryMarkdown({ r, cls, citations, lang, sourcePath, engine }) {
  const t = UI[lang];
  const c = CLASS_TEXT[lang][cls];
  const rows = findings(r, citations, lang);
  const L = [];
  L.push(`## ${t.heading}: ${c.title}`, "");
  L.push(`**${t.result}:** ${codeSpan(c.badge)} · **${t.source}:** ${codeSpan(sourcePath)} · **${t.language}:** ${mdText(r.detected_lang)}`, "");
  // Negated hits never change the verdict; each note goes under the finding it belongs to.
  const pending = [...(r.negated_hits || [])];
  const takeNotes = (key) => {
    const mine = pending.filter((h) => negatedKey(h) === key);
    for (const h of mine) pending.splice(pending.indexOf(h), 1);
    return mine;
  };
  if (rows.length) {
    L.push(`### ${t.fired}`, "", `| ${t.colRef} | ${t.colWhat} | ${t.colPhrases} | ${t.colSource} |`, "|---|---|---|---|");
    for (const f of rows) {
      const phrases = f.phrases.length ? f.phrases.map((p) => codeSpan(p, { table: true })).join(", ") : "—";
      L.push(`| ${f.ref} | ${cell(f.what)} | ${phrases} | [EUR-Lex](${f.url}) |`);
      for (const h of takeNotes(f.key)) L.push(`| ↳ | ${negationLine(h, t, true)} | | |`);
    }
    L.push("");
  } else {
    L.push(`> ${t.noTrigger}`, "");
  }
  if (pending.length) {
    for (const h of pending) L.push(`- ${cell(negatedRef(h, lang))}: ${negationLine(h, t, false)}`);
    L.push("");
  }
  if (cls === "high-risk") {
    const obl = obligations(r, citations, lang);
    if (obl.length) {
      L.push(`### ${t.obligations}`, "");
      for (const o of obl) L.push(`- ${o.label} ([EUR-Lex](${o.url}))`);
      L.push("");
    }
  }
  L.push(`### ${t.caveats}`, "");
  L.push(`- ${t.disclaimer}`);
  L.push(`- ${t.notFinal}`);
  L.push(`- ${t.engineNote}`);
  L.push(`- ${t.localNote}`);
  L.push(`- ${t.links}`);
  L.push("");
  L.push(`**[${t.share}](${TOOL_URL[lang]})** — ${t.shareText}.`, "");
  L.push(`<sub>${t.engine}: ${engine.name} v${engine.version} · ${t.rules} ${r.rules_version} (${r.rules_hash})</sub>`, "");
  return L.join("\n");
}
