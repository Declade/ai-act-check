// Locate and read the AI system description from the repository.

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export const DEFAULT_PATH = "ai-system.md";
// Tried in order when `path` is left at its default and ai-system.md is absent.
export const FALLBACK_PATHS = ["ai-act.yml", "ai-act.yaml"];
export const MAX_BYTES = 64 * 1024;

export function locateDescription(pathInput, cwd) {
  const requested = pathInput || DEFAULT_PATH;
  const candidates = requested === DEFAULT_PATH ? [DEFAULT_PATH, ...FALLBACK_PATHS] : [requested];
  for (const c of candidates) {
    const abs = resolve(cwd, c);
    if (existsSync(abs) && statSync(abs).isFile()) return { rel: c, abs };
  }
  const tried = candidates.map((c) => `"${c}"`).join(", ");
  throw new Error(
    `No AI system description found (looked for ${tried}). Add an ai-system.md file, or an ai-act.yml with a "description:" field, or set the "path" input.`,
  );
}

export function readDescription(abs, rel) {
  const size = statSync(abs).size;
  if (size > MAX_BYTES) throw new Error(`${rel} is ${size} bytes; the limit is ${MAX_BYTES} bytes (64 KiB).`);
  const raw = readFileSync(abs, "utf8");
  let text;
  if (/\.ya?ml$/i.test(rel)) {
    let doc;
    try {
      doc = parseYaml(raw);
    } catch (e) {
      throw new Error(`${rel} is not valid YAML: ${e.message.split("\n")[0]}`);
    }
    if (!doc || typeof doc !== "object" || typeof doc.description !== "string") {
      throw new Error(`${rel} needs a top-level "description:" field with text.`);
    }
    text = doc.description;
  } else {
    // Markdown or plain text. HTML comments (template hints) are dropped.
    text = raw.replace(/<!--[\s\S]*?-->/g, "");
  }
  text = text.trim();
  if (!text) throw new Error(`${rel} has no description text.`);
  return text;
}
