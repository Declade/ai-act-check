// Logging that cannot be hijacked by untrusted text.
//
// The runner parses every stdout/stderr line that starts with `::` as a workflow
// command (`::error::`, `::add-mask::`, `::stop-commands::` ...). Any text that comes
// from the user's repository or from an input (paths, YAML details, error details)
// goes through displayText() when the message is built, which applies the
// @actions/core escapeData rule (`%` -> %25, CR -> %0D, LF -> %0A) and replaces other
// control characters. A fragment can then never start a new line, so it can never
// start a command of its own. Raw file content is never printed.
//
// info()/warning()/error() add a last guard: any raw line break or control character
// still in the final line is replaced, and a plain line can never begin with `::`.

/** An error whose message was built with displayText() for every untrusted fragment. */
export class SafeError extends Error {}

/** @actions/core escapeData: neutralises line breaks and the escape character. */
export function escapeData(s) {
  return String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

/** Untrusted text for a log line or error message: escaped once, controls replaced. */
export function displayText(s) {
  return escapeData(s).replace(CONTROL, "\uFFFD");
}

/** Final guard for an already-built line: no raw line break / control character survives. */
function oneLine(s) {
  return String(s).replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(CONTROL, "\uFFFD");
}

/** Plain log line (never a workflow command). */
export function info(line) {
  console.log(oneLine(line).replace(/^\s*::/, ": :"));
}

export function warning(message) {
  console.log(`::warning::${oneLine(message)}`);
}

export function error(message) {
  console.log(`::error::${oneLine(message)}`);
}
