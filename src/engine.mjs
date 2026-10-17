// Thin adapter around the bundled @lucairn/ai-act-classifier engine.
//
// The engine's citation table (dist/data/citations.json) and its package.json
// are not in the package "exports" map. scripts/build.mjs resolves the two
// virtual imports below to those files inside the pinned npm package and
// inlines them into dist/index.js (MIT-licensed data, shipped in the npm
// tarball). Nothing is fetched at run time.

import { classify } from "@lucairn/ai-act-classifier";
import citations from "virtual:engine-citations";
import enginePackage from "virtual:engine-package";

export const ENGINE_NAME = enginePackage.name;
export const ENGINE_VERSION = enginePackage.version;
export const CITATIONS = citations;

/**
 * Run the deterministic keyword engine. Never sets `llm`, so the engine stays
 * on its zero-network path (the LLM providers are not even in the bundle).
 */
export async function runEngine(text, lang) {
  return classify(text, { lang, threeCategory: false });
}

/** Engine's own language guess (no override), used only for a warning. */
export async function detectLanguage(text) {
  const r = await classify(text, { threeCategory: false });
  return r.detected_lang;
}
