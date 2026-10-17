// Locate and read the AI system description from the repository.
//
// The file is attacker-controlled input (it lives in the user's repo, possibly in a
// pull request from a fork): see safe-fs.mjs for the containment rules. YAML errors
// and warnings are never printed with source excerpts.

import { parseDocument } from "yaml";
import { SafeError, displayText } from "./log.mjs";
import { locateForRead, readRegularFile } from "./safe-fs.mjs";

export const DEFAULT_PATH = "ai-system.md";
// Tried in order when `path` is left at its default and ai-system.md is absent.
export const FALLBACK_PATHS = ["ai-act.yml", "ai-act.yaml"];
export const MAX_BYTES = 64 * 1024; // 65,536; one more byte is read to detect larger files.

/** `root` is realpath(GITHUB_WORKSPACE). Returns {rel, abs}. */
export function locateDescription(pathInput, root) {
  const requested = pathInput || DEFAULT_PATH;
  const candidates = requested === DEFAULT_PATH ? [DEFAULT_PATH, ...FALLBACK_PATHS] : [requested];
  for (const c of candidates) {
    const abs = locateForRead(root, c, "path");
    if (abs) return { rel: c, abs };
  }
  const tried = candidates.map((c) => `"${displayText(c)}"`).join(", ");
  throw new SafeError(
    `No AI system description found (looked for ${tried}). Add an ai-system.md file, or an ai-act.yml with a "description:" field, or set the "path" input.`,
  );
}

export function readDescription(abs, rel) {
  const shown = displayText(rel);
  const raw = readRegularFile(abs, MAX_BYTES, rel).toString("utf8");
  let text;
  if (/\.ya?ml$/i.test(rel)) {
    const doc = parseDocument(raw, { prettyErrors: false, logLevel: "silent" });
    if (doc.errors.length) {
      const pos = doc.errors[0].linePos && doc.errors[0].linePos[0];
      const where = pos && Number.isInteger(pos.line) ? ` (first error on line ${pos.line})` : "";
      throw new SafeError(`${shown} is not valid YAML${where}.`);
    }
    // doc.warnings (e.g. unknown tags) are deliberately not printed: their text quotes the file.
    let value;
    try {
      value = doc.toJS({ maxAliasCount: 100 });
    } catch {
      throw new SafeError(`${shown} could not be read as YAML (too many aliases or an unsupported construct).`);
    }
    if (!value || typeof value !== "object" || typeof value.description !== "string") {
      throw new SafeError(`${shown} needs a top-level "description:" field with text.`);
    }
    text = value.description;
  } else {
    // Markdown or plain text. HTML comments (template hints) are dropped.
    text = raw.replace(/<!--[\s\S]*?-->/g, "");
  }
  text = text.trim();
  if (!text) throw new SafeError(`${shown} has no description text.`);
  return text;
}
