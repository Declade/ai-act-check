// Attacker-controlled inputs and repository files: badge write containment,
// description read containment, workflow-command injection, Markdown injection,
// and the negation advisory (engine 0.4.0 `negated_hits`, PRD Amendment 1).

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, linkSync, lstatSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run, sample } from "./helpers/run.mjs";

const PROHIBITED_TEXT = "The system performs social scoring of citizens based on their social behaviour.";

// The only workflow commands this action itself prints.
const OWN_COMMAND = /^::(error|warning)::(?!.*FORGED)/;

/** Every stdout/stderr line the runner would parse as a workflow command. */
function commandLines(r) {
  return (r.stdout + "\n" + r.stderr).split(/\r\n|\r|\n/).filter((l) => l.trimStart().startsWith("::"));
}

function assertNoForeignCommands(r) {
  for (const line of commandLines(r)) {
    assert.match(line, OWN_COMMAND, `foreign workflow command reached the log: ${line}`);
    assert.doesNotMatch(line, /%0A|%0D/i, `unescaped line-break sequence inside a command: ${line}`);
  }
  assert.doesNotMatch(r.stdout + r.stderr, /FORGED/, "untrusted text echoed to the log");
}

// ---------------------------------------------------------------- badge write

test("badge-path: absolute path is refused, nothing written", () => {
  const probe = run({ files: { "ai-system.md": "x" }, inputs: { "badge-path": "" } });
  const target = join(probe.outside, "pwn.json");
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": target } });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /::error::Input "badge-path" must be a path relative to the workspace/);
  assert.equal(existsSync(target), false, "badge written outside the workspace");
});

test("badge-path: ../ traversal is refused, nothing written", () => {
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": "../outside/pwn.json" } });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /::error::Input "badge-path" "\.\.\/outside\/pwn\.json" points outside the workspace/);
  assert.equal(existsSync(join(r.outside, "pwn.json")), false);
});

test("badge-path: a symlink at the badge file is refused and its target is untouched", () => {
  const r = run({
    files: { "ai-system.md": PROHIBITED_TEXT },
    setup: ({ ws, outside }) => {
      writeFileSync(join(outside, "runner-file"), "ORIGINAL");
      mkdirSync(join(ws, ".github"));
      symlinkSync(join(outside, "runner-file"), join(ws, ".github", "ai-act-badge.json"));
    },
  });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /::error::Input "badge-path" "\.github\/ai-act-badge\.json" is a symlink/);
  assert.equal(readFileSync(join(r.outside, "runner-file"), "utf8"), "ORIGINAL");
  assert.ok(lstatSync(join(r.ws, ".github", "ai-act-badge.json")).isSymbolicLink(), "symlink itself left in place");
});

test("badge-path: a dangling symlink at the badge file is refused, nothing created", () => {
  const r = run({
    files: { "ai-system.md": PROHIBITED_TEXT },
    setup: ({ ws, outside }) => {
      mkdirSync(join(ws, ".github"));
      symlinkSync(join(outside, "new-file"), join(ws, ".github", "ai-act-badge.json"));
    },
  });
  assert.equal(r.status, 1, r.stdout);
  assert.equal(existsSync(join(r.outside, "new-file")), false);
});

test("badge-path: a symlinked parent directory is refused, nothing written through it", () => {
  const r = run({
    files: { "ai-system.md": PROHIBITED_TEXT },
    setup: ({ ws, outside }) => symlinkSync(outside, join(ws, ".github")),
  });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /::error::Input "badge-path" "\.github\/ai-act-badge\.json": a directory on the way is a symlink/);
  assert.deepEqual(readdirSync(r.outside), []);
});

test("badge-path: an existing file that is not a previous badge is not overwritten", () => {
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT, ".github/ai-act-badge.json": "not a badge\n" } });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /already exists and is not a badge file written by this action; refusing to overwrite it/);
  assert.equal(readFileSync(join(r.ws, ".github", "ai-act-badge.json"), "utf8"), "not a badge\n");
  const other = run({ files: { "ai-system.md": PROHIBITED_TEXT, "action.yml": "name: mine\n" }, inputs: { "badge-path": "action.yml" } });
  assert.equal(other.status, 1, other.stdout);
  assert.equal(readFileSync(join(other.ws, "action.yml"), "utf8"), "name: mine\n");
  const json = run({ files: { "ai-system.md": PROHIBITED_TEXT, "pkg.json": '{"schemaVersion":1,"label":"other"}' }, inputs: { "badge-path": "pkg.json" } });
  assert.equal(json.status, 1, json.stdout);
});

test("badge-path: a directory or a .git path is refused", () => {
  const dir = run({ files: { "ai-system.md": PROHIBITED_TEXT, "out/keep": "" }, inputs: { "badge-path": "out" } });
  assert.equal(dir.status, 1, dir.stdout);
  assert.match(dir.stdout, /exists and is not a regular file/);
  const git = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": ".git/hooks/x.json" } });
  assert.equal(git.status, 1, git.stdout);
  assert.equal(existsSync(join(git.ws, ".git")), false);
});

test("badge-path: a previous badge (any class, either language) is replaced atomically", () => {
  const old = JSON.stringify({ schemaVersion: 1, label: "EU-KI-VO", message: "Transparenz", color: "yellow" });
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT, ".github/ai-act-badge.json": old } });
  assert.equal(r.status, 0, r.stdout);
  assert.equal(JSON.parse(r.badge).message, "possible prohibited practice");
  assert.deepEqual(readdirSync(join(r.ws, ".github")), ["ai-act-badge.json"], "no temp file left behind");
});

// ---------------------------------------------------------------- description read

const SECRET = "SECRET-MARKER-7f3a";
const secretText = `${PROHIBITED_TEXT} ${SECRET}`;

function assertRefusedDescription(r, re) {
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, re);
  assert.equal(r.outputs["risk-class"], undefined, "no classification of a refused file");
  assert.doesNotMatch(r.stdout + r.stderr + r.summary, new RegExp(SECRET));
}

test("path: absolute path is refused", () => {
  const probe = run({ files: { "ai-system.md": "x" } });
  writeFileSync(join(probe.outside, "secret.md"), secretText);
  const r = run({ inputs: { path: join(probe.outside, "secret.md") } });
  assertRefusedDescription(r, /::error::Input "path" must be a path relative to the workspace/);
});

test("path: ../ traversal is refused", () => {
  const r = run({ setup: ({ outside }) => writeFileSync(join(outside, "secret.md"), secretText), inputs: { path: "../outside/secret.md" } });
  assertRefusedDescription(r, /::error::Input "path" "\.\.\/outside\/secret\.md" points outside the workspace/);
});

test("path: a symlinked description is refused (also via the default path)", () => {
  const target = process.platform === "linux" ? "/proc/self/environ" : null;
  const setup = ({ ws, outside }) => {
    writeFileSync(join(outside, "secret.md"), secretText);
    symlinkSync(target || join(outside, "secret.md"), join(ws, "ai-system.md"));
  };
  const r = run({ setup, env: { LEAK_ME: SECRET } });
  assertRefusedDescription(r, /::error::"ai-system\.md" is a symlink; the action does not follow symlinks/);
  // A symlinked ai-system.md does not silently fall through to ai-act.yml either.
  const r2 = run({ setup, files: { "ai-act.yml": "description: a chatbot\n" } });
  assertRefusedDescription(r2, /is a symlink/);
  if (process.platform === "linux") {
    // And a symlink to a file outside the workspace, on Linux too.
    const r3 = run({
      setup: ({ ws, outside }) => {
        writeFileSync(join(outside, "secret.md"), secretText);
        symlinkSync(join(outside, "secret.md"), join(ws, "ai-system.md"));
      },
    });
    assertRefusedDescription(r3, /is a symlink/);
  }
});

test("path: a description behind a symlinked directory is refused", () => {
  const r = run({
    setup: ({ ws, outside }) => {
      writeFileSync(join(outside, "secret.md"), secretText);
      symlinkSync(outside, join(ws, "docs"));
    },
    inputs: { path: "docs/secret.md" },
  });
  assertRefusedDescription(r, /a directory on the way is a symlink/);
});

test("path: a directory is refused", () => {
  const r = run({ files: { "docs/a.md": "x" }, inputs: { path: "docs" } });
  assertRefusedDescription(r, /::error::"docs" is not a regular file/);
});

test("path: more than 65,536 bytes is refused; exactly 65,536 is read", () => {
  const pad = (n) => PROHIBITED_TEXT + " " + "a".repeat(n - PROHIBITED_TEXT.length - 1);
  const big = run({ files: { "ai-system.md": pad(65_537) } });
  assertRefusedDescription(big, /::error::"ai-system\.md" is larger than 65536 bytes, the limit/);
  const edge = run({ files: { "ai-system.md": pad(65_536) } });
  assert.equal(edge.status, 0, edge.stdout);
  assert.equal(edge.outputs["risk-class"], "prohibited");
});

// ---------------------------------------------------------------- workflow-command injection

test("YAML warnings and errors never echo file content (no forged workflow command)", () => {
  const warn = run({ files: { "ai-act.yml": "::error::FORGED: !unknown x\ndescription: social scoring\n" } });
  assert.equal(warn.status, 0, warn.stdout + warn.stderr);
  assert.equal(warn.outputs["risk-class"], "prohibited");
  assertNoForeignCommands(warn);
  const bad = run({ files: { "ai-act.yml": "description: [unclosed\n::error::FORGED: x\n  - y: : z\n" } });
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /::error::ai-act\.yml is not valid YAML( \(first error on line \d+\))?\.$/m);
  assertNoForeignCommands(bad);
});

test("paths with %0A or a real line break cannot inject a workflow command", () => {
  // Literal "%0A" in a file name, surfaced through the language-mismatch warning.
  const pct = run({ files: { "x%0A::error::FORGED.md": sample("cv-screening.md") }, inputs: { path: "x%0A::error::FORGED.md", lang: "de" } });
  assert.equal(pct.status, 0, pct.stdout);
  assert.match(pct.stdout, /^::warning::x%250A::error::FORGED\.md looks like "en" text/m);
  for (const line of commandLines(pct)) assert.doesNotMatch(line, /%0A/i, line);
  // A real line break in the file name and the input.
  const nl = run({ files: { "x\n::error::FORGED.md": sample("cv-screening.md") }, inputs: { path: "x\n::error::FORGED.md", lang: "de" } });
  assert.equal(nl.status, 1, nl.stdout);
  assert.match(nl.stdout, /::error::Input "path" contains control characters/);
  assertNoForeignCommands(nl);
  // Same for badge-path.
  const b = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": "a\n::error::FORGED.json" } });
  assert.equal(b.status, 1, b.stdout);
  assertNoForeignCommands(b);
});

// ---------------------------------------------------------------- Markdown injection

/** CommonMark code span at the start of `s`: returns {content, rest} or null. */
function leadingCodeSpan(s) {
  const open = s.match(/^`+/);
  if (!open) return null;
  const n = open[0].length;
  let i = n;
  while (i < s.length) {
    const j = s.indexOf("`", i);
    if (j < 0) return null;
    let k = j;
    while (s[k] === "`") k++;
    if (k - j === n) {
      let content = s.slice(n, j);
      if (content.length > 1 && content.startsWith(" ") && content.endsWith(" ") && content.trim() !== "") content = content.slice(1, -1);
      return { content, rest: s.slice(k) };
    }
    i = k;
  }
  return null;
}

test("a crafted path stays inert in the job summary (code span cannot be broken)", () => {
  const name = "x` <img src=x onerror=alert(1)> [y](https:evil.example) ``z |q.md";
  const r = run({ files: { [`docs/${name}`]: PROHIBITED_TEXT }, inputs: { path: `docs/${name}` } });
  assert.equal(r.status, 0, r.stdout);
  const line = r.summary.split("\n").find((l) => l.startsWith("**Risk class:**"));
  const after = line.slice(line.indexOf("**Source:** ") + "**Source:** ".length);
  const span = leadingCodeSpan(after);
  assert.ok(span, `no code span in: ${line}`);
  assert.equal(span.content, `docs/${name}`, `code span broken: ${line}`);
  assert.equal(span.rest, " · **Language:** en");
});

// ---------------------------------------------------------------- negation advisory

test("negated text: note under the finding, verdict unchanged (EN)", () => {
  const r = run({ files: { "ai-system.md": "The system does not use social scoring of citizens based on their social behaviour." } });
  assert.equal(r.status, 0, r.stdout);
  assert.equal(r.outputs["risk-class"], "prohibited", "negation never lowers the verdict");
  const lines = r.summary.split("\n");
  const i = lines.findIndex((l) => l.startsWith("| Art. 5(1)(c) |"));
  assert.ok(i >= 0, r.summary);
  assert.equal(lines[i + 1], "| ↳ | Found, but the text appears to deny it — please check: `social scoring` (negation: `not use`) | | |");
  const hr = run({ files: { "ai-system.md": "Our CV tool does NOT rank job applicants." } });
  assert.equal(hr.outputs["risk-class"], "high-risk");
  const hl = hr.summary.split("\n");
  const j = hl.findIndex((l) => l.startsWith("| Annex III point 4"));
  assert.match(hl[j + 1], /^\| ↳ \| Found, but the text appears to deny it — please check: `rank job applicants` \(negation: `not`\)/);
});

test("negated text: note under the finding, verdict unchanged (DE)", () => {
  const r = run({
    files: { "ai-system.md": "Das System nutzt keine soziale Bewertung von Bürgern auf Grundlage ihres sozialen Verhaltens." },
    inputs: { lang: "de" },
  });
  assert.equal(r.status, 0, r.stdout);
  assert.equal(r.outputs["risk-class"], "prohibited");
  const lines = r.summary.split("\n");
  const i = lines.findIndex((l) => l.startsWith("| Art. 5 Abs. 1 Buchst. c |"));
  assert.ok(i >= 0, r.summary);
  assert.match(lines[i + 1], /^\| ↳ \| Gefunden, aber der Text scheint es zu verneinen — bitte prüfen: `soziale bewertung` \(Verneinung: `keine`\)/);
});

test("no negation: no note", () => {
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT } });
  assert.doesNotMatch(r.summary, /appears to deny it/);
});

// ------------------------------------------------- hardening after ToB review

test("badge-path: ':' (drive letters, Windows stream names) is refused", () => {
  const r = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": ".git::$INDEX_ALLOCATION/info/x.json" } });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /::error::Input "badge-path" must not contain ":"/);
});

test("badge-path: Windows aliases of .git (trailing dot/space, GIT~1) are refused", () => {
  for (const p of [".git./x.json", ".git /x.json", "GIT~1/x.json"]) {
    const r = run({ files: { "ai-system.md": PROHIBITED_TEXT }, inputs: { "badge-path": p } });
    assert.equal(r.status, 1, `${p}: ${r.stdout}`);
    assert.match(r.stdout, /points into a \.git directory/, p);
  }
});

test("path: a hard link to a file outside the workspace is refused", () => {
  const r = run({
    files: {},
    setup: ({ ws, outside }) => {
      writeFileSync(join(outside, "secret.txt"), "SECRET-OUTSIDE social scoring");
      linkSync(join(outside, "secret.txt"), join(ws, "ai-system.md"));
    },
  });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /is a hard link/);
  assert.doesNotMatch(r.stdout + r.stderr, /SECRET-OUTSIDE/);
});

test("LOG_TOKENS / LOG_STREAM cannot make the yaml library print file source", () => {
  const r = run({
    files: { "ai-act.yml": "description: 'MARKER-SOURCE-TEXT social scoring'\n" },
    inputs: { path: "ai-act.yml" },
    env: { LOG_TOKENS: "1", LOG_STREAM: "1" },
  });
  assert.doesNotMatch(r.stdout + r.stderr, /MARKER-SOURCE-TEXT/);
});
