// All user-facing wording for the job summary card and the badge, EN + DE.
//
// Wording rules (PRD prd-2026-10-17-ai-act-check-share-and-action.md):
//   - never claim conformity in either language, never say "minimal risk";
//   - a result with nothing triggered says "no trigger found" — a keyword engine
//     cannot certify that something is absent;
//   - the badge message is the risk class only;
//   - caveats reuse the wording of the lucairn.eu tool page
//     (src/app/[lang]/tools/ai-act-classifier/page.tsx) and the classifier
//     launch post ("internal consistency … not a measure of real-world accuracy").

export const TOOL_URL = {
  en: "https://lucairn.eu/en/tools/ai-act-classifier",
  de: "https://lucairn.eu/de/tools/ai-act-classifier",
};

export const ENGINE_REPO_URL = "https://github.com/Declade/lucairn-ai-act-classifier";

// Risk classes in the order this tool ranks them (Art. 5 > Annex III > Art. 50 > GPAI > none).
export const CLASSES = ["prohibited", "high-risk", "transparency", "gpai", "no-trigger"];

export const CLASS_TEXT = {
  en: {
    prohibited: { badge: "possible prohibited practice", title: "Article 5 trigger matched (possible prohibited practice)" },
    "high-risk": { badge: "possible high-risk", title: "Annex III area matched (possible high-risk, Article 6)" },
    transparency: { badge: "possible transparency obligation", title: "Possible transparency obligation (Article 50)" },
    gpai: { badge: "GPAI", title: "Possible general-purpose AI model provider obligations (Article 53; Article 55 if systemic risk)" },
    "no-trigger": { badge: "no trigger found", title: "No trigger found" },
  },
  de: {
    prohibited: { badge: "mögliche verbotene Praktik", title: "Artikel-5-Auslöser erkannt (mögliche verbotene Praktik)" },
    "high-risk": { badge: "möglicherweise Hochrisiko", title: "Anhang-III-Bereich erkannt (möglicherweise Hochrisiko, Artikel 6)" },
    transparency: { badge: "mögliche Transparenzpflicht", title: "Mögliche Transparenzpflicht (Artikel 50)" },
    gpai: { badge: "GPAI", title: "Mögliche Anbieterpflichten für KI-Modelle mit allgemeinem Verwendungszweck (Artikel 53; Artikel 55 bei systemischem Risiko)" },
    "no-trigger": { badge: "kein Auslöser gefunden", title: "Kein Auslöser gefunden" },
  },
};

// shields.io named colours. "no trigger found" is grey on purpose, never green.
export const CLASS_COLOR = {
  prohibited: "critical",
  "high-risk": "orange",
  transparency: "yellow",
  gpai: "blue",
  "no-trigger": "lightgrey",
};

// Short descriptions of the Article 5(1) letters (a)–(h).
export const ART5_LETTER = {
  en: {
    a: "subliminal, manipulative or deceptive techniques",
    b: "exploitation of vulnerabilities",
    c: "evaluation or classification of persons based on social behaviour or personal characteristics",
    d: "risk assessment of committing a criminal offence based solely on profiling or personality traits",
    e: "untargeted scraping of facial images",
    f: "inferring emotions in the workplace and education institutions (except for medical or safety reasons)",
    g: "biometric categorisation inferring race, political opinions, trade union membership, religion or beliefs, sex life or sexual orientation",
    h: "real-time remote biometric identification in publicly accessible spaces for law enforcement",
  },
  de: {
    a: "unterschwellige, manipulative oder täuschende Techniken",
    b: "Ausnutzung von Schutzbedürftigkeit",
    c: "soziale Bewertung (Social Scoring)",
    d: "Risikobewertung für das Begehen von Straftaten ausschließlich auf Grundlage von Profiling oder Persönlichkeitsmerkmalen",
    e: "ungezieltes Auslesen von Gesichtsbildern",
    f: "Ableitung von Emotionen am Arbeitsplatz und in Bildungseinrichtungen (außer aus medizinischen oder Sicherheitsgründen)",
    g: "biometrische Kategorisierung zur Ableitung von Rasse, politischen Einstellungen, Gewerkschaftszugehörigkeit, Religion oder Weltanschauung, Sexualleben oder sexueller Ausrichtung",
    h: "biometrische Echtzeit-Fernidentifizierung in öffentlich zugänglichen Räumen zu Strafverfolgungszwecken",
  },
};

// Article 50 paragraphs, keyed by the engine's Article50TriggeredBy fields.
export const ART50_PATH = {
  paragraph_1_interaction: {
    paragraph: 1,
    ref: { en: "Art. 50(1)", de: "Art. 50 Abs. 1" },
    en: "AI system interacting directly with natural persons",
    de: "KI-System, das direkt mit natürlichen Personen interagiert",
  },
  paragraph_2_synthetic_content: {
    paragraph: 2,
    ref: { en: "Art. 50(2)", de: "Art. 50 Abs. 2" },
    en: "synthetic audio, image, video or text content",
    de: "synthetische Audio-, Bild-, Video- oder Textinhalte",
  },
  paragraph_3_emotion_or_biometric_categorisation: {
    paragraph: 3,
    ref: { en: "Art. 50(3)", de: "Art. 50 Abs. 3" },
    en: "emotion recognition or biometric categorisation system",
    de: "Emotionserkennungssystem oder System zur biometrischen Kategorisierung",
  },
  paragraph_4_deepfake: {
    paragraph: 4,
    ref: { en: "Art. 50(4)", de: "Art. 50 Abs. 4" },
    en: "deep fake",
    de: "Deepfake",
  },
  paragraph_4_public_interest_text: {
    paragraph: 4,
    ref: { en: "Art. 50(4)", de: "Art. 50 Abs. 4" },
    en: "text published to inform the public on matters of public interest",
    de: "Text, der veröffentlicht wird, um die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse zu informieren",
  },
};

export const UI = {
  en: {
    heading: "EU AI Act check",
    result: "Risk class",
    source: "Source",
    language: "Language",
    fired: "What triggered it",
    colRef: "Reference",
    colWhat: "What it covers",
    colPhrases: "Matched phrases",
    colSource: "Source",
    noTrigger:
      "No trigger found: the description matched no Article 5, Annex III, Article 50 or Article 53 / 55 phrase in the engine's lexicon. This is not a statement that no obligation applies.",
    obligations: "Obligations the engine lists for this possible high-risk result",
    caveats: "Read this before you rely on it",
    disclaimer:
      "Informational tool — not legal advice. Use as a starting point; verify with your DPO and qualified counsel before acting on any classification.",
    engineNote:
      "Deterministic keyword rules engine: it matches your wording against a curated lexicon. A description that avoids the lexicon's vocabulary can miss a trigger, and negated or unusual wording can be misread. The 98.8% on 71 test cases measures consistency with the curated lexicon, not real-world accuracy.",
    notFinal: "A keyword match is not a final classification: Article 6(3) and Article 5 exceptions are not assessed.",
    localNote:
      "The classification itself makes no network requests and reads no tokens. Its results, the file path and the matched phrases appear in the job summary and logs, which GitHub stores as usual.",
    negNote: "Found, but the text appears to deny it — please check",
    negCue: "negation",
    links: "EUR-Lex links open the full Regulation (EU) 2024/1689; the article is named next to each link.",
    share: "Share this result",
    shareText: "run the same check in the browser on lucairn.eu",
    engine: "Engine",
    rules: "rules",
  },
  de: {
    heading: "EU-KI-Verordnung: Einordnung",
    result: "Risikoklasse",
    source: "Quelle",
    language: "Sprache",
    fired: "Was ausgelöst hat",
    colRef: "Fundstelle",
    colWhat: "Worum es geht",
    colPhrases: "Gefundene Begriffe",
    colSource: "Quelle",
    noTrigger:
      "Kein Auslöser gefunden: Die Beschreibung enthielt keinen Begriff aus dem Lexikon der Engine zu Artikel 5, Anhang III, Artikel 50 oder Artikel 53 / 55. Das ist keine Aussage, dass keine Pflicht gilt.",
    obligations: "Pflichten, die die Engine für dieses mögliche Hochrisiko-Ergebnis auflistet",
    caveats: "Bitte vor der Verwendung lesen",
    disclaimer:
      "Informationswerkzeug — keine Rechtsberatung. Als Ausgangspunkt verwenden; vor jeder compliance-relevanten Entscheidung mit Ihrer DSB und qualifizierter juristischer Beratung verifizieren.",
    engineNote:
      "Deterministische Schlüsselwort-Regel-Engine: Sie gleicht Ihre Formulierung mit einem kuratierten Lexikon ab. Eine Beschreibung, die das Vokabular des Lexikons vermeidet, kann einen Auslöser verfehlen, und verneinte oder ungewöhnliche Formulierungen können falsch gelesen werden. Die 98,8 % auf 71 Testfällen messen die Konsistenz mit dem kuratierten Lexikon, nicht die Genauigkeit in der realen Welt.",
    notFinal: "Ein Stichwort-Treffer ist keine abschließende Einstufung: Ausnahmen nach Artikel 6 Absatz 3 und Artikel 5 werden nicht geprüft.",
    localNote:
      "Die Einordnung selbst stellt keine Netzwerkanfragen und liest keine Tokens. Ergebnis, Dateipfad und gefundene Phrasen erscheinen in der Job-Zusammenfassung und im Log, die GitHub wie üblich speichert.",
    negNote: "Gefunden, aber der Text scheint es zu verneinen — bitte prüfen",
    negCue: "Verneinung",
    links: "EUR-Lex-Links öffnen die gesamte Verordnung (EU) 2024/1689; der Artikel steht jeweils daneben.",
    share: "Ergebnis teilen",
    shareText: "dieselbe Prüfung im Browser auf lucairn.eu ausführen",
    engine: "Engine",
    rules: "Regeln",
  },
};
