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
      ref: ART50_PATH[key].ref[lang],
      what: ART50_PATH[key][lang],
      phrases: [],
      url: eurLex(citations, "article_50", lang),
    });
  }
  if (r.gpai.article_53_applicable) {
    rows.push({
      group: "gpai",
      ref: "Art. 53",
      what: lang === "de" ? "Pflichten für Anbieter von KI-Modellen mit allgemeinem Verwendungszweck" : "obligations for providers of general-purpose AI models",
      phrases: [],
      url: eurLex(citations, "gpai_articles_53_55", lang),
    });
  }
  if (r.gpai.article_55_applicable) {
    rows.push({
      group: "gpai",
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

export function badge(cls, lang) {
  return {
    schemaVersion: 1,
    label: lang === "de" ? "EU-KI-VO" : "EU AI Act",
    message: CLASS_TEXT[lang][cls].badge,
    color: CLASS_COLOR[cls],
  };
}

const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

export function summaryMarkdown({ r, cls, citations, lang, sourcePath, engine }) {
  const t = UI[lang];
  const c = CLASS_TEXT[lang][cls];
  const rows = findings(r, citations, lang);
  const L = [];
  L.push(`## ${t.heading}: ${c.title}`, "");
  L.push(`**${t.result}:** \`${c.badge}\` · **${t.source}:** \`${cell(sourcePath)}\` · **${t.language}:** ${r.detected_lang}`, "");
  if (rows.length) {
    L.push(`### ${t.fired}`, "", `| ${t.colRef} | ${t.colWhat} | ${t.colPhrases} | ${t.colSource} |`, "|---|---|---|---|");
    for (const f of rows) {
      const phrases = f.phrases.length ? f.phrases.map((p) => `"${cell(p)}"`).join(", ") : "—";
      L.push(`| ${f.ref} | ${cell(f.what)} | ${phrases} | [EUR-Lex](${f.url}) |`);
    }
    L.push("");
  } else {
    L.push(`> ${t.noTrigger}`, "");
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
