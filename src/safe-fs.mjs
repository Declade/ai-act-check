// Workspace-contained file access. Every path that comes from an input or from the
// user's repository is treated as attacker-controlled: the action runs in CI jobs
// where GITHUB_TOKEN and other secrets may be present.
//
// Rules for both reading and writing:
//   - the path must be relative, without control characters, and must resolve inside
//     realpath(GITHUB_WORKSPACE) (no absolute paths, no `..` escape, not the root);
//   - no component may be named `.git`;
//   - no component (parent directories or the file itself) may be a symlink: each one
//     is checked with lstat and the action fails instead of following it;
//   - the target must be a regular file (or, for a write, not exist yet).

import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { SafeError, displayText } from "./log.mjs";

// O_NOFOLLOW / O_NONBLOCK are undefined on Windows; there the lstat checks still apply.
const O_NOFOLLOW = constants.O_NOFOLLOW ?? 0;
const O_NONBLOCK = constants.O_NONBLOCK ?? 0;

export class UnsafePathError extends SafeError {}

const q = (p) => `"${displayText(p)}"`;

function lstatOrNull(p) {
  try {
    return lstatSync(p);
  } catch (e) {
    if (e && e.code === "ENOENT") return null;
    throw e;
  }
}

/** realpath of the workspace (trusted: it comes from the runner, not the repo). */
export function workspaceRoot(cwd) {
  return realpathSync(cwd);
}

/**
 * Check a user-supplied relative path and return its components below the root.
 * `what` names the input in error messages, e.g. 'path' or 'badge-path'.
 */
export function containedParts(root, userPath, what) {
  if (typeof userPath !== "string" || userPath === "") throw new UnsafePathError(`Input "${what}" is empty.`);
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f-\u009f]/.test(userPath)) {
    throw new UnsafePathError(`Input "${what}" contains control characters; use a plain relative path.`);
  }
  if (isAbsolute(userPath) || /^[\\/]/.test(userPath) || /^[A-Za-z]:/.test(userPath)) {
    throw new UnsafePathError(`Input "${what}" must be a path relative to the workspace; got the absolute path ${q(userPath)}.`);
  }
  // Writes only: Windows stream names (".git::$INDEX_ALLOCATION") could reach .git. Reads keep ":" so
  // hostile names still go through the escaping paths (and the .git alias check below covers both).
  if (what === "badge-path" && userPath.includes(":")) {
    throw new UnsafePathError(`Input "${what}" must not contain ":" (Windows stream names are refused).`);
  }
  const abs = resolve(root, userPath);
  const rel = relative(root, abs);
  if (rel === "" || rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
    throw new UnsafePathError(`Input "${what}" ${q(userPath)} points outside the workspace.`);
  }
  const parts = rel.split(sep);
  // Windows also resolves ".git." / ".git " (trailing dots or spaces) and the 8.3 short name "GIT~1" to .git.
  if (parts.some((p) => { const n = p.replace(/[. ]+$/, "").toLowerCase(); return n === ".git" || /^git~\d+$/.test(n); })) {
    throw new UnsafePathError(`Input "${what}" ${q(userPath)} points into a .git directory.`);
  }
  return parts;
}

/** Walk the parent directories of `parts` below `root`; optionally create missing ones. */
function checkParents(root, parts, userPath, what, create) {
  let cur = root;
  for (const part of parts.slice(0, -1)) {
    cur = join(cur, part);
    let st = lstatOrNull(cur);
    if (!st && create) {
      try {
        mkdirSync(cur, { mode: 0o755 });
      } catch (e) {
        if (!e || e.code !== "EEXIST") throw e;
      }
      st = lstatOrNull(cur);
    }
    if (!st) return false;
    if (st.isSymbolicLink()) {
      throw new UnsafePathError(`Input "${what}" ${q(userPath)}: a directory on the way is a symlink; the action does not follow symlinks.`);
    }
    if (!st.isDirectory()) {
      throw new UnsafePathError(`Input "${what}" ${q(userPath)}: a parent on the way is not a directory.`);
    }
  }
  return true;
}

/**
 * Resolve a description file for reading. Returns the absolute path, or null when it
 * does not exist (so the caller can try a fallback). Throws UnsafePathError when it
 * exists but is a symlink, sits behind a symlinked directory, or is not a regular file.
 */
export function locateForRead(root, userPath, what) {
  const parts = containedParts(root, userPath, what);
  if (!checkParents(root, parts, userPath, what, false)) return null;
  const abs = join(root, ...parts);
  const st = lstatOrNull(abs);
  if (!st) return null;
  if (st.isSymbolicLink()) throw new UnsafePathError(`${q(userPath)} is a symlink; the action does not follow symlinks.`);
  if (!st.isFile()) throw new UnsafePathError(`${q(userPath)} is not a regular file.`);
  return abs;
}

/**
 * Read at most `limit` bytes of a regular file without following a symlink at the
 * last component. The fd is fstat'ed after opening, so a file swapped between the
 * lstat check and the open is still checked. Throws when the file is larger than
 * `limit` bytes.
 */
export function readRegularFile(abs, limit, label) {
  let fd;
  try {
    fd = openSync(abs, constants.O_RDONLY | O_NOFOLLOW | O_NONBLOCK);
  } catch (e) {
    if (e && (e.code === "ELOOP" || e.code === "EMLINK")) throw new UnsafePathError(`${q(label)} is a symlink; the action does not follow symlinks.`);
    throw new UnsafePathError(`${q(label)} could not be opened (${e && e.code ? e.code : "error"}).`);
  }
  try {
    const st = fstatSync(fd);
    if (!st.isFile()) throw new UnsafePathError(`${q(label)} is not a regular file.`);
    if (st.nlink > 1) throw new UnsafePathError(`${q(label)} is a hard link; the action only reads plain files.`);
    const buf = Buffer.alloc(limit + 1);
    let n = 0;
    while (n < buf.length) {
      const got = readSync(fd, buf, n, buf.length - n, null);
      if (got === 0) break;
      n += got;
    }
    if (n > limit) throw new UnsafePathError(`${q(label)} is larger than ${limit} bytes, the limit.`);
    return buf.subarray(0, n);
  } finally {
    closeSync(fd);
  }
}

/**
 * Write `content` to a workspace-relative path atomically (temp file created with
 * O_EXCL in the same directory, then rename). Missing parent directories are created
 * one by one. An existing target must be a regular file for which `mayOverwrite(buf)`
 * returns true; anything else is refused. Returns the absolute path written.
 */
export function writeContained(root, userPath, what, content, { mayOverwrite, maxExisting = 4096 } = {}) {
  const parts = containedParts(root, userPath, what);
  checkParents(root, parts, userPath, what, true);
  const abs = join(root, ...parts);
  const st = lstatOrNull(abs);
  if (st) {
    if (st.isSymbolicLink()) throw new UnsafePathError(`Input "${what}" ${q(userPath)} is a symlink; the action does not follow symlinks.`);
    if (!st.isFile()) throw new UnsafePathError(`Input "${what}" ${q(userPath)} exists and is not a regular file.`);
    let existing;
    try {
      existing = readRegularFile(abs, maxExisting, userPath);
    } catch {
      existing = null;
    }
    if (!existing || !mayOverwrite || !mayOverwrite(existing)) {
      throw new UnsafePathError(`Input "${what}" ${q(userPath)} already exists and is not a badge file written by this action; refusing to overwrite it.`);
    }
  }
  const tmp = join(dirname(abs), `.${basename(abs)}.${randomUUID()}.tmp`);
  const fd = openSync(tmp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | O_NOFOLLOW, 0o644);
  let renamed = false;
  try {
    const data = Buffer.from(content, "utf8");
    let off = 0;
    while (off < data.length) off += writeSync(fd, data, off, data.length - off);
    closeSync(fd);
    renameSync(tmp, abs);
    renamed = true;
  } finally {
    if (!renamed) {
      try {
        closeSync(fd);
      } catch {
        /* already closed */
      }
      try {
        unlinkSync(tmp);
      } catch {
        /* nothing to clean up */
      }
    }
  }
  return abs;
}
