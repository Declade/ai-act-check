// ai-act-check — bundled GitHub Action. Source: src/; rebuild with `npm run build`.
// Engine: @lucairn/ai-act-classifier@0.4.0 (MIT). Third-party licences: dist/licenses.txt.
import { createRequire as __aiActCreateRequire } from "node:module";
const require = __aiActCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error2) {
            onError(String(error2));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error2 = new Error("Failed to resolve repeated object (this should not happen)");
              error2.source = source;
              throw error2;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning2) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning2);
        else
          console.warn(warning2);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error2) => {
      if (error2.pos[0] === -1)
        return;
      error2.linePos = error2.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error2.linePos[0];
      error2.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error2.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error2.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep: sep2, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep2) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep2 ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep2, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep2 = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep2 + cb;
              sep2 = "";
              break;
            }
            case "newline":
              if (comment)
                sep2 += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep: sep2, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep2 && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep2 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep2, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep2 ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep2)
                for (const st of sep2) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep2, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep2 = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep2 === " ")
            sep2 = "\n";
          else if (!prevMoreIndented && sep2 === "\n")
            sep2 = "\n\n";
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep2 === "\n")
            value += "\n";
          else
            sep2 = "\n";
        } else {
          value += sep2 + content;
          sep2 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error2 = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error2 === -1)
            error2 = offset + i;
        }
      }
      if (error2 !== -1)
        onError(error2, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep2 = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep2 === "\n")
            res += sep2;
          else
            sep2 = "\n";
        } else {
          res += sep2 + lm;
          sep2 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep2 + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error2) {
        const msg = error2 instanceof Error ? error2.message : String(error2);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error2) {
            const message = error2 instanceof Error ? error2.message : String(error2);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning2) => {
          const pos = getErrorPos(source);
          if (warning2)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning2) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning2);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error2 = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error2);
            else
              this.doc.errors.push(error2);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep: sep2, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep2)
        for (const st of sep2)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error2) {
        const token = error2 ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep2;
          if (scalar.end) {
            sep2 = scalar.end;
            sep2.push(this.sourceToken);
            delete scalar.end;
          } else
            sep2 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep2 }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep2 = it.sep;
                  sep2.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep2 }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep2 = fc.end.splice(1, fc.end.length);
            sep2.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep2 }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument2(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument2(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning2) => log.warn(doc.options.logLevel, warning2));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument2;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// node_modules/@lucairn/ai-act-classifier/dist/extract/normalize.js
function normalize(text) {
  if (typeof text !== "string") {
    throw new TypeError("normalize(): input must be a string.");
  }
  return text.normalize("NFKC").toLocaleLowerCase("en-US").replace(PUNCT_TO_STRIP, " ").replace(WHITESPACE, " ").trim();
}
function tokenize(normalizedText) {
  if (normalizedText.length === 0)
    return [];
  return normalizedText.split(" ").filter((t) => t.length > 0);
}
var PUNCT_TO_STRIP, WHITESPACE;
var init_normalize = __esm({
  "node_modules/@lucairn/ai-act-classifier/dist/extract/normalize.js"() {
    PUNCT_TO_STRIP = /[.,;:!?"'`()[\]{}<>‘’‚‛“”„‟«»]/g;
    WHITESPACE = /\s+/g;
  }
});

// node_modules/@lucairn/ai-act-classifier/dist/extract/lang.js
var lang_exports = {};
__export(lang_exports, {
  detectLang: () => detectLang
});
function detectLang(normalizedText) {
  const tokens = tokenize(normalizedText);
  let enHits = 0;
  let deHits = 0;
  for (const t of tokens) {
    if (EN_SELECTORS.has(t))
      enHits++;
    if (DE_SELECTORS.has(t))
      deHits++;
  }
  const lang = deHits > enHits ? "de" : "en";
  const winner = Math.max(enHits, deHits);
  const loser = Math.min(enHits, deHits);
  const confident = winner >= 2 && winner >= loser * 2;
  return { lang, enHits, deHits, confident };
}
var EN_SELECTORS, DE_SELECTORS;
var init_lang = __esm({
  "node_modules/@lucairn/ai-act-classifier/dist/extract/lang.js"() {
    init_normalize();
    EN_SELECTORS = /* @__PURE__ */ new Set([
      "the",
      "and",
      "for",
      "with",
      "that",
      "this",
      "are",
      "is",
      "be",
      "as",
      "by",
      "from",
      "has",
      "have",
      "was",
      "were",
      "an",
      "they",
      "their",
      "which",
      "used",
      "use",
      "system",
      "systems",
      "applications",
      "risk",
      "high-risk"
    ]);
    DE_SELECTORS = /* @__PURE__ */ new Set([
      "der",
      "die",
      "das",
      "den",
      "dem",
      "und",
      "f\xFCr",
      "mit",
      "eine",
      "einer",
      "einen",
      "einem",
      "sind",
      "ist",
      "sein",
      "werden",
      "wird",
      "wurde",
      "durch",
      "auf",
      "bei",
      "oder",
      "auch",
      "kann",
      "k\xF6nnen",
      "sollte",
      "sollten",
      "m\xFCssen",
      "soll",
      "system",
      "systeme",
      "anwendungen",
      "risiko",
      "hochrisiko",
      "k\xFCnstliche",
      "intelligenz",
      "ki-system",
      "ki-systeme"
    ]);
  }
});

// llm-stub:./providers/anthropic.js
var anthropic_exports = {};
__export(anthropic_exports, {
  DEFAULT_MODEL: () => DEFAULT_MODEL,
  LEXICONS_CACHE: () => LEXICONS_CACHE,
  PROMPT_CHECKSUM: () => PROMPT_CHECKSUM,
  extractWithAnthropic: () => extractWithAnthropic,
  extractWithGroq: () => extractWithGroq,
  extractWithOpenAI: () => extractWithOpenAI
});
var fail, extractWithAnthropic, extractWithOpenAI, extractWithGroq, LEXICONS_CACHE, PROMPT_CHECKSUM, DEFAULT_MODEL;
var init_anthropic = __esm({
  "llm-stub:./providers/anthropic.js"() {
    fail = () => {
      throw new Error("LLM mode is not included in the ai-act-check bundle; it runs the deterministic engine only.");
    };
    extractWithAnthropic = fail;
    extractWithOpenAI = fail;
    extractWithGroq = fail;
    LEXICONS_CACHE = {};
    PROMPT_CHECKSUM = "";
    DEFAULT_MODEL = "";
  }
});

// llm-stub:./providers/openai.js
var openai_exports = {};
__export(openai_exports, {
  DEFAULT_MODEL: () => DEFAULT_MODEL2,
  LEXICONS_CACHE: () => LEXICONS_CACHE2,
  PROMPT_CHECKSUM: () => PROMPT_CHECKSUM2,
  extractWithAnthropic: () => extractWithAnthropic2,
  extractWithGroq: () => extractWithGroq2,
  extractWithOpenAI: () => extractWithOpenAI2
});
var fail2, extractWithAnthropic2, extractWithOpenAI2, extractWithGroq2, LEXICONS_CACHE2, PROMPT_CHECKSUM2, DEFAULT_MODEL2;
var init_openai = __esm({
  "llm-stub:./providers/openai.js"() {
    fail2 = () => {
      throw new Error("LLM mode is not included in the ai-act-check bundle; it runs the deterministic engine only.");
    };
    extractWithAnthropic2 = fail2;
    extractWithOpenAI2 = fail2;
    extractWithGroq2 = fail2;
    LEXICONS_CACHE2 = {};
    PROMPT_CHECKSUM2 = "";
    DEFAULT_MODEL2 = "";
  }
});

// llm-stub:./providers/groq.js
var groq_exports = {};
__export(groq_exports, {
  DEFAULT_MODEL: () => DEFAULT_MODEL3,
  LEXICONS_CACHE: () => LEXICONS_CACHE3,
  PROMPT_CHECKSUM: () => PROMPT_CHECKSUM3,
  extractWithAnthropic: () => extractWithAnthropic3,
  extractWithGroq: () => extractWithGroq3,
  extractWithOpenAI: () => extractWithOpenAI3
});
var fail3, extractWithAnthropic3, extractWithOpenAI3, extractWithGroq3, LEXICONS_CACHE3, PROMPT_CHECKSUM3, DEFAULT_MODEL3;
var init_groq = __esm({
  "llm-stub:./providers/groq.js"() {
    fail3 = () => {
      throw new Error("LLM mode is not included in the ai-act-check bundle; it runs the deterministic engine only.");
    };
    extractWithAnthropic3 = fail3;
    extractWithOpenAI3 = fail3;
    extractWithGroq3 = fail3;
    LEXICONS_CACHE3 = {};
    PROMPT_CHECKSUM3 = "";
    DEFAULT_MODEL3 = "";
  }
});

// llm-stub:./providers/_shared.js
var shared_exports = {};
__export(shared_exports, {
  DEFAULT_MODEL: () => DEFAULT_MODEL4,
  LEXICONS_CACHE: () => LEXICONS_CACHE4,
  PROMPT_CHECKSUM: () => PROMPT_CHECKSUM4,
  extractWithAnthropic: () => extractWithAnthropic4,
  extractWithGroq: () => extractWithGroq4,
  extractWithOpenAI: () => extractWithOpenAI4
});
var fail4, extractWithAnthropic4, extractWithOpenAI4, extractWithGroq4, LEXICONS_CACHE4, PROMPT_CHECKSUM4, DEFAULT_MODEL4;
var init_shared = __esm({
  "llm-stub:./providers/_shared.js"() {
    fail4 = () => {
      throw new Error("LLM mode is not included in the ai-act-check bundle; it runs the deterministic engine only.");
    };
    extractWithAnthropic4 = fail4;
    extractWithOpenAI4 = fail4;
    extractWithGroq4 = fail4;
    LEXICONS_CACHE4 = {};
    PROMPT_CHECKSUM4 = "";
    DEFAULT_MODEL4 = "";
  }
});

// src/main.mjs
import { appendFileSync } from "node:fs";
import { resolve as resolve2 } from "node:path";
import { randomUUID as randomUUID2 } from "node:crypto";

// src/description.mjs
var import_yaml = __toESM(require_dist(), 1);

// src/log.mjs
var SafeError = class extends Error {
};
function escapeData(s) {
  return String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
var CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;
function displayText(s) {
  return escapeData(s).replace(CONTROL, "\uFFFD");
}
function oneLine(s) {
  return String(s).replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(CONTROL, "\uFFFD");
}
function info(line) {
  console.log(oneLine(line).replace(/^\s*::/, ": :"));
}
function warning(message) {
  console.log(`::warning::${oneLine(message)}`);
}
function error(message) {
  console.log(`::error::${oneLine(message)}`);
}

// src/safe-fs.mjs
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
  writeSync
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
var O_NOFOLLOW = constants.O_NOFOLLOW ?? 0;
var O_NONBLOCK = constants.O_NONBLOCK ?? 0;
var UnsafePathError = class extends SafeError {
};
var q = (p) => `"${displayText(p)}"`;
function lstatOrNull(p) {
  try {
    return lstatSync(p);
  } catch (e) {
    if (e && e.code === "ENOENT") return null;
    throw e;
  }
}
function workspaceRoot(cwd) {
  return realpathSync(cwd);
}
function containedParts(root, userPath, what) {
  if (typeof userPath !== "string" || userPath === "") throw new UnsafePathError(`Input "${what}" is empty.`);
  if (/[\u0000-\u001f\u007f-\u009f]/.test(userPath)) {
    throw new UnsafePathError(`Input "${what}" contains control characters; use a plain relative path.`);
  }
  if (isAbsolute(userPath) || /^[\\/]/.test(userPath) || /^[A-Za-z]:/.test(userPath)) {
    throw new UnsafePathError(`Input "${what}" must be a path relative to the workspace; got the absolute path ${q(userPath)}.`);
  }
  if (what === "badge-path" && userPath.includes(":")) {
    throw new UnsafePathError(`Input "${what}" must not contain ":" (Windows stream names are refused).`);
  }
  const abs = resolve(root, userPath);
  const rel = relative(root, abs);
  if (rel === "" || rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
    throw new UnsafePathError(`Input "${what}" ${q(userPath)} points outside the workspace.`);
  }
  const parts = rel.split(sep);
  if (parts.some((p) => {
    const n = p.replace(/[. ]+$/, "").toLowerCase();
    return n === ".git" || /^git~\d+$/.test(n);
  })) {
    throw new UnsafePathError(`Input "${what}" ${q(userPath)} points into a .git directory.`);
  }
  return parts;
}
function checkParents(root, parts, userPath, what, create) {
  let cur = root;
  for (const part of parts.slice(0, -1)) {
    cur = join(cur, part);
    let st = lstatOrNull(cur);
    if (!st && create) {
      try {
        mkdirSync(cur, { mode: 493 });
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
function locateForRead(root, userPath, what) {
  const parts = containedParts(root, userPath, what);
  if (!checkParents(root, parts, userPath, what, false)) return null;
  const abs = join(root, ...parts);
  const st = lstatOrNull(abs);
  if (!st) return null;
  if (st.isSymbolicLink()) throw new UnsafePathError(`${q(userPath)} is a symlink; the action does not follow symlinks.`);
  if (!st.isFile()) throw new UnsafePathError(`${q(userPath)} is not a regular file.`);
  return abs;
}
function readRegularFile(abs, limit, label) {
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
function writeContained(root, userPath, what, content, { mayOverwrite, maxExisting = 4096 } = {}) {
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
  const fd = openSync(tmp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | O_NOFOLLOW, 420);
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
      }
      try {
        unlinkSync(tmp);
      } catch {
      }
    }
  }
  return abs;
}

// src/description.mjs
var DEFAULT_PATH = "ai-system.md";
var FALLBACK_PATHS = ["ai-act.yml", "ai-act.yaml"];
var MAX_BYTES = 64 * 1024;
function locateDescription(pathInput, root) {
  const requested = pathInput || DEFAULT_PATH;
  const candidates = requested === DEFAULT_PATH ? [DEFAULT_PATH, ...FALLBACK_PATHS] : [requested];
  for (const c of candidates) {
    const abs = locateForRead(root, c, "path");
    if (abs) return { rel: c, abs };
  }
  const tried = candidates.map((c) => `"${displayText(c)}"`).join(", ");
  throw new SafeError(
    `No AI system description found (looked for ${tried}). Add an ai-system.md file, or an ai-act.yml with a "description:" field, or set the "path" input.`
  );
}
function readDescription(abs, rel) {
  const shown = displayText(rel);
  const raw = readRegularFile(abs, MAX_BYTES, rel).toString("utf8");
  let text;
  if (/\.ya?ml$/i.test(rel)) {
    const doc = (0, import_yaml.parseDocument)(raw, { prettyErrors: false, logLevel: "silent" });
    if (doc.errors.length) {
      const pos = doc.errors[0].linePos && doc.errors[0].linePos[0];
      const where = pos && Number.isInteger(pos.line) ? ` (first error on line ${pos.line})` : "";
      throw new SafeError(`${shown} is not valid YAML${where}.`);
    }
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
    text = raw.replace(/<!--[\s\S]*?-->/g, "");
  }
  text = text.trim();
  if (!text) throw new SafeError(`${shown} has no description text.`);
  return text;
}

// node_modules/@lucairn/ai-act-classifier/dist/extract/keyword.js
init_normalize();
init_lang();
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname as dirname2, join as join2 } from "node:path";

// node_modules/@lucairn/ai-act-classifier/dist/extract/negation.js
init_normalize();
var compiledCache = /* @__PURE__ */ new WeakMap();
function compile(lex) {
  const cached = compiledCache.get(lex);
  if (cached !== void 0)
    return cached;
  const c = {
    clauseWords: new Set(lex.clause_words),
    cues: new Set(lex.cues),
    nominal: new Set(lex.nominal_cues),
    listCues: new Set(lex.list_cues),
    ntStems: new Set(lex.contraction_stems),
    paired: new Map(Object.entries(lex.paired_cues)),
    voidAfter: new Set(lex.void_after),
    det: new Set(lex.determiners),
    mod: new Set(lex.modifiers),
    verbs: new Set(lex.governed_verbs),
    inf: lex.infinitive_marker,
    maxGap: lex.max_gap,
    breakers: new Set(lex.breakers),
    openers: new Set(lex.subclause_openers),
    preps: new Set(lex.prepositions),
    without: lex.without,
    joiners: new Set(lex.list_joiners),
    pronouns: new Set(lex.clause_pronouns),
    closers: new Set(lex.closers),
    cancel: new Set(lex.cancel_after),
    trailAux: new Set(lex.trailing_aux),
    trailFill: new Set(lex.trailing_fillers),
    trailNeg: new Set(lex.trailing_negators),
    trailBe: new Set(lex.trailing_be),
    trailPred: new Set(lex.trailing_predicates),
    trailPost: new Set(lex.trailing_post),
    bareVerbs: new Set(lex.bare_verbs),
    bareParticles: new Set(lex.bare_particles)
  };
  compiledCache.set(lex, c);
  return c;
}
var STRING_LISTS = [
  "clause_words",
  "cues",
  "nominal_cues",
  "list_cues",
  "contraction_stems",
  "void_after",
  "determiners",
  "modifiers",
  "governed_verbs",
  "breakers",
  "subclause_openers",
  "prepositions",
  "list_joiners",
  "clause_pronouns",
  "closers",
  "cancel_after",
  "trailing_aux",
  "trailing_fillers",
  "trailing_negators",
  "trailing_be",
  "trailing_predicates",
  "trailing_post",
  "bare_verbs",
  "bare_particles"
];
function isNegationLexicon(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const v = value;
  const strList = (k) => Array.isArray(v[k]) && v[k].every((x) => typeof x === "string");
  return STRING_LISTS.every(strList) && typeof v.without === "string" && typeof v.infinitive_marker === "string" && typeof v.max_gap === "number" && Number.isInteger(v.max_gap) && v.max_gap >= 0 && v.paired_cues !== null && typeof v.paired_cues === "object" && !Array.isArray(v.paired_cues) && Object.values(v.paired_cues).every((x) => typeof x === "string");
}
var SPLIT = /[.!?;:\n\r,()[\]{}<>«»]/;
var BREAK_TOKEN = /^[^\p{L}\p{N}]+$|[–—/\\•·|]/u;
function tokenizeWithBreaks(text, c) {
  const reference = tokenize(normalize(text));
  const tokens = [];
  const breakBefore = [];
  const commaOnly = [];
  const hardBefore = [];
  const nfkc = text.normalize("NFKC");
  let piece = "";
  let pendingSep = "";
  const flush = () => {
    const toks = tokenize(normalize(piece));
    toks.forEach((tok, k) => {
      tokens.push(tok);
      const sep2 = k === 0 ? pendingSep : "";
      breakBefore.push(sep2.length > 0);
      commaOnly.push(sep2.length > 0 && /^[,\s]+$/.test(sep2));
      hardBefore.push(/[.!?;:\n\r]/.test(sep2));
    });
    if (toks.length > 0)
      pendingSep = "";
    piece = "";
  };
  for (const ch of nfkc) {
    if (SPLIT.test(ch)) {
      flush();
      pendingSep += ch;
    } else {
      piece += ch;
    }
  }
  flush();
  const aligned = reference.length === tokens.length && reference.every((t, i) => t === tokens[i]);
  if (!aligned)
    return null;
  if (breakBefore.length > 0) {
    breakBefore[0] = false;
    commaOnly[0] = false;
    hardBefore[0] = false;
  }
  const isBreak = tokens.map((t) => BREAK_TOKEN.test(t));
  const clause = [];
  let id = 0;
  tokens.forEach((t, i) => {
    if (i > 0 && (breakBefore[i] || isBreak[i] || isBreak[i - 1] || c.clauseWords.has(t)))
      id++;
    clause.push(id);
  });
  return { tokens, breakBefore, commaOnly, hardBefore, isBreak, clause };
}
function joined(t, i) {
  return i > 0 && !t.breakBefore[i] && !t.isBreak[i] && !t.isBreak[i - 1];
}
function cueEndingAt(t, c, i) {
  const tok = t.tokens[i];
  let cue = null;
  if (tok === "t" && i > 0 && c.ntStems.has(t.tokens[i - 1]) && joined(t, i)) {
    cue = { start: i - 1, last: i, nominal: false, list: false, text: `${t.tokens[i - 1]}'t` };
  } else if (c.cues.has(tok)) {
    cue = { start: i, last: i, nominal: c.nominal.has(tok), list: c.listCues.has(tok), text: tok };
  } else {
    const partner = c.paired.get(tok);
    if (partner !== void 0) {
      for (let k = i - 1; k >= 0 && t.clause[k] === t.clause[i]; k--) {
        if (t.tokens[k] === partner) {
          cue = { start: i, last: i, nominal: c.nominal.has(tok), list: c.listCues.has(tok), text: tok };
          break;
        }
      }
    }
  }
  if (cue === null)
    return null;
  const next = t.tokens[i + 1];
  if (next !== void 0 && joined(t, i + 1) && c.voidAfter.has(next))
    return null;
  return cue;
}
function cuesBefore(t, c, before) {
  let n = 0;
  let k = before - 1;
  let ci = t.clause[before];
  for (; ; ) {
    let clauseStart = k + 1;
    for (; k >= 0 && t.clause[k] === ci; k--) {
      clauseStart = k;
      const cue = cueEndingAt(t, c, k);
      if (cue !== null) {
        if (!cue.list)
          n++;
        k = cue.start;
        clauseStart = k;
        continue;
      }
      if (t.tokens[k] === c.without)
        n++;
    }
    if (k < 0 || !t.commaOnly[clauseStart])
      return n;
    const first = t.tokens[clauseStart];
    const second = t.tokens[clauseStart + 1];
    const opens = c.openers.has(first) || c.preps.has(first) && second !== void 0 && c.openers.has(second);
    if (!opens)
      return n;
    ci = t.clause[k];
  }
}
function withoutLater(t, c, from, clauseOf) {
  const ci = t.clause[clauseOf];
  for (let k = from; k < t.tokens.length && t.clause[k] === ci; k++) {
    if (t.tokens[k] === c.without)
      return true;
  }
  return false;
}
function forwardCue(t, c, s) {
  const gap = [];
  let j = s - 1;
  let cue = null;
  let withoutAt = -1;
  while (j >= 0) {
    if (!joined(t, j + 1))
      return null;
    const tok = t.tokens[j];
    if (tok === c.without) {
      withoutAt = j;
      break;
    }
    cue = cueEndingAt(t, c, j);
    if (cue !== null)
      break;
    if (gap.length >= c.maxGap)
      return null;
    if (c.breakers.has(tok))
      return null;
    if (!(c.det.has(tok) || c.mod.has(tok) || c.verbs.has(tok) || c.inf !== "" && tok === c.inf))
      return null;
    gap.unshift(tok);
    j--;
  }
  const detOrMod = (x) => c.det.has(x) || c.mod.has(x);
  if (withoutAt >= 0) {
    if (!gap.every(detOrMod))
      return null;
    if (cuesBefore(t, c, withoutAt) % 2 === 1)
      return null;
    return { cue: [c.without, ...gap].join(" "), clauseOf: withoutAt };
  }
  if (cue === null)
    return null;
  let p = 0;
  if (!cue.nominal) {
    if (c.inf !== "" && gap[p] === c.inf)
      p++;
    if (p < gap.length && c.verbs.has(gap[p]))
      p++;
  }
  for (; p < gap.length; p++)
    if (!detOrMod(gap[p]))
      return null;
  const others = cuesBefore(t, c, cue.start);
  const count = cue.list ? Math.max(others, 1) : others + 1;
  if (count % 2 === 0)
    return null;
  return { cue: [cue.text, ...gap].join(" "), clauseOf: cue.start };
}
function clauseEndsAt(t, c, j) {
  if (j >= t.tokens.length)
    return true;
  return t.breakBefore[j] === true || t.isBreak[j] === true || c.clauseWords.has(t.tokens[j]);
}
function cancelledAt(t, c, j) {
  let k = j;
  while (k < t.tokens.length && t.isBreak[k])
    k++;
  return k < t.tokens.length && c.cancel.has(t.tokens[k]);
}
function trailingCue(t, c, s, e) {
  const n = t.tokens.length;
  const tok = (j2) => j2 < n && joined(t, j2) ? t.tokens[j2] : void 0;
  const finish = (j2, from) => {
    if (!clauseEndsAt(t, c, j2))
      return null;
    if (cancelledAt(t, c, j2))
      return null;
    if ((cuesBefore(t, c, s) + 1) % 2 === 0)
      return null;
    return t.tokens.slice(from, j2).join(" ");
  };
  let j = e;
  let gap = 0;
  while (gap < c.maxGap) {
    const x = tok(j);
    if (x === void 0 || !(c.trailAux.has(x) || c.trailFill.has(x)))
      break;
    j++;
    gap++;
  }
  let negOk = false;
  const x0 = tok(j);
  if (x0 !== void 0) {
    if (c.trailNeg.has(x0)) {
      j += 1;
      negOk = true;
    } else if (c.cues.has(x0) && c.trailAux.has(x0.replace(/not$/, ""))) {
      j += 1;
      negOk = true;
    } else if (c.ntStems.has(x0) && tok(j + 1) === "t") {
      j += 2;
      negOk = true;
    }
  }
  if (negOk) {
    let k = j;
    for (let b = 0; b < 2; b++) {
      const y = tok(k);
      if (y !== void 0 && c.trailBe.has(y))
        k++;
    }
    const pred = tok(k);
    if (pred !== void 0 && c.trailPred.has(pred)) {
      k++;
      for (let b = 0; b < 2; b++) {
        const y = tok(k);
        if (y !== void 0 && c.trailPost.has(y))
          k++;
      }
      const r = finish(k, e);
      if (r !== null)
        return r;
    }
  }
  if (c.bareVerbs.size > 0) {
    let b = s - 1;
    let g = 0;
    while (b >= 0 && joined(t, b + 1) && g <= c.maxGap) {
      const w = t.tokens[b];
      if (c.det.has(w) || c.mod.has(w)) {
        b--;
        g++;
        continue;
      }
      break;
    }
    const verb = b >= 0 && joined(t, b + 1) ? t.tokens[b] : void 0;
    const neg = tok(e);
    if (verb !== void 0 && c.bareVerbs.has(verb) && neg !== void 0 && c.trailNeg.has(neg)) {
      let k = e + 1;
      const part = tok(k);
      if (part !== void 0 && c.bareParticles.has(part))
        k++;
      const r = finish(k, e);
      if (r !== null)
        return r;
    }
  }
  return null;
}
function negatedClauseAt(t, c, k) {
  const n = t.tokens.length;
  for (let j = k, skipped = 0; j < n && skipped <= 3; j++) {
    if (j > k && !joined(t, j))
      return false;
    if (t.isBreak[j])
      return false;
    const cue = cueEndingAt(t, c, j);
    if (cue !== null)
      return true;
    if (j + 1 < n && t.tokens[j + 1] === "t" && c.ntStems.has(t.tokens[j]))
      continue;
    const w = t.tokens[j];
    if (!(c.trailAux.has(w) || c.pronouns.has(w) || c.verbs.has(w) || c.bareVerbs.has(w) || c.det.has(w)))
      return false;
    skipped++;
  }
  return false;
}
function joinerAt(t, c, j) {
  if (j >= t.tokens.length)
    return -1;
  const comma = t.breakBefore[j] === true && t.commaOnly[j] === true;
  if (t.breakBefore[j] && !comma)
    return -1;
  if (t.isBreak[j])
    return -1;
  const w = t.tokens[j];
  if (c.joiners.has(w))
    return j + 1;
  return comma ? j : -1;
}
function closedList(t, c, longestAt, s, e) {
  const n = t.tokens.length;
  const members = [{ start: s, end: e }];
  let pos = e;
  for (let guard = 0; guard < 32; guard++) {
    let p = pos;
    if (p < n && joined(t, p) && c.closers.has(t.tokens[p]))
      p++;
    if (p >= n || t.hardBefore[p] === true)
      return members;
    const after = joinerAt(t, c, p);
    if (after < 0)
      return null;
    if (p === pos) {
      let m = after;
      while (m < n && m < after + 2 && joined(t, m) && c.det.has(t.tokens[m]))
        m++;
      const e2 = longestAt.get(m);
      if (e2 !== void 0 && (m === after || joined(t, m))) {
        members.push({ start: m, end: e2 });
        pos = e2;
        continue;
      }
    }
    return negatedClauseAt(t, c, after) ? members : null;
  }
  return null;
}
function findNegated(text, lex, occs) {
  const off = { active: false, negated: /* @__PURE__ */ new Map() };
  if (lex === void 0)
    return off;
  const c = compile(lex);
  const t = tokenizeWithBreaks(text, c);
  if (t === null)
    return off;
  const longestAt = /* @__PURE__ */ new Map();
  for (const o of occs) {
    const cur = longestAt.get(o.start);
    if (cur === void 0 || o.end > cur)
      longestAt.set(o.start, o.end);
  }
  const spans = [];
  const starts = [...longestAt.keys()].sort((a, b) => a - b);
  for (const s of starts) {
    const e = longestAt.get(s);
    const fwd = forwardCue(t, c, s);
    if (fwd !== null && !withoutLater(t, c, s, fwd.clauseOf)) {
      const members = closedList(t, c, longestAt, s, e) ?? [{ start: s, end: e }];
      for (const m of members)
        spans.push({ start: m.start, end: m.end, cue: fwd.cue });
      continue;
    }
    const trail = trailingCue(t, c, s, e);
    if (trail !== null)
      spans.push({ start: s, end: e, cue: trail });
  }
  const negated = /* @__PURE__ */ new Map();
  occs.forEach((o, idx) => {
    for (const sp of spans) {
      if (o.start >= sp.start && o.start < sp.end) {
        negated.set(idx, sp.cue);
        return;
      }
    }
  });
  return { active: true, negated };
}

// node_modules/@lucairn/ai-act-classifier/dist/extract/keyword.js
var RESERVED_KEYS = /* @__PURE__ */ new Set(["language", "version"]);
function discoverGroups(lexicon) {
  return Object.keys(lexicon).filter((k) => !RESERVED_KEYS.has(k) && !k.startsWith("_"));
}
var __filename = fileURLToPath(new URL("./engine/dist/extract/keyword.js", import.meta.url).href);
var __dirname = dirname2(__filename);
var DATA_DIR = join2(__dirname, "..", "data");
function loadLexicon(lang) {
  const path = join2(DATA_DIR, `patterns.${lang}.json`);
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw);
  if (parsed.language !== lang) {
    throw new Error(`loadLexicon(): patterns.${lang}.json claims language="${parsed.language}", expected "${lang}".`);
  }
  return parsed;
}
var LEXICONS = {
  en: loadLexicon("en"),
  de: loadLexicon("de")
};
function extractFeatures(text, opts = {}) {
  if (typeof text !== "string") {
    throw new TypeError("extractFeatures(): input text must be a string.");
  }
  const normalized = normalize(text);
  const detection = detectLang(normalized);
  const lang = opts.lang ?? detection.lang;
  const lexicon = LEXICONS[lang];
  const minN = opts.minN ?? 1;
  const maxN = opts.maxN ?? 6;
  const tokens = tokenize(normalized);
  if (minN < 1)
    throw new RangeError("extractFeatures(): minN must be >= 1.");
  if (maxN < minN)
    throw new RangeError("extractFeatures(): maxN must be >= minN.");
  const occurrences = /* @__PURE__ */ new Map();
  const addOccurrence = (phrase, start, end) => {
    const list = occurrences.get(phrase);
    if (list === void 0)
      occurrences.set(phrase, [{ start, end }]);
    else
      list.push({ start, end });
  };
  for (let n = minN; n <= maxN && n <= tokens.length; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      addOccurrence(tokens.slice(i, i + n).join(" "), i, i + n);
    }
  }
  tokens.forEach((token, i) => {
    if (token.includes("-")) {
      for (const part of token.split("-")) {
        if (part.length > 0)
          addOccurrence(part, i, i + 1);
      }
    }
  });
  const groups = discoverGroups(lexicon);
  const matches = [];
  for (const group of groups) {
    const raw = lexicon[group];
    if (raw === void 0 || raw === null || typeof raw !== "object")
      continue;
    const categories = raw;
    for (const [categoryKey, category] of Object.entries(categories)) {
      for (const entry of category.entries) {
        const occs = occurrences.get(normalize(entry.phrase));
        if (occs !== void 0)
          matches.push({ group, categoryKey, category, entry, occs });
      }
    }
  }
  const hits = [];
  const byCategory = {};
  for (const group of groups)
    byCategory[group] = {};
  for (const m of matches) {
    hits.push({ group: m.group, category: m.categoryKey, phrase: m.entry.phrase, source: m.entry.source ?? m.category.source });
    const groupBucket = byCategory[m.group];
    if (groupBucket !== void 0) {
      const bucket = groupBucket[m.categoryKey];
      if (bucket === void 0)
        groupBucket[m.categoryKey] = [m.entry.phrase];
      else
        bucket.push(m.entry.phrase);
    }
  }
  const rawNegation = lexicon._negation;
  const negationLex = isNegationLexicon(rawNegation) ? rawNegation : void 0;
  const flat = [];
  const owner = [];
  matches.forEach((m, mi) => {
    for (const o of m.occs) {
      flat.push(o);
      owner.push(mi);
    }
  });
  const negation = findNegated(text, negationLex, flat);
  const plain = matches.map(() => false);
  const cueOf = matches.map(() => void 0);
  flat.forEach((_o, idx) => {
    const mi = owner[idx];
    const cue = negation.negated.get(idx);
    if (cue === void 0)
      plain[mi] = true;
    else if (cueOf[mi] === void 0)
      cueOf[mi] = cue;
  });
  const negatedHits = [];
  matches.forEach((m, mi) => {
    const cue = cueOf[mi];
    if (plain[mi] || cue === void 0)
      return;
    negatedHits.push({ group: m.group, category: m.categoryKey, phrase: m.entry.phrase, source: m.entry.source ?? m.category.source, cue });
  });
  return {
    input: text,
    lang,
    langConfident: detection.confident,
    lexiconVersion: lexicon.version,
    hits,
    byCategory,
    negatedHits
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/extract/cache.js
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join as join3 } from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
function cacheKey(params) {
  const canonical = JSON.stringify({
    provider: params.provider,
    model: params.model,
    lexiconVersion: params.lexiconVersion,
    promptChecksum: params.promptChecksum,
    lang: params.lang,
    inputNormalized: params.inputNormalized
  });
  const h = createHash("sha256");
  h.update(canonical, "utf8");
  return h.digest("hex");
}
function resolveCacheLlmDir(opts = {}) {
  if (typeof opts.cacheDir === "string" && opts.cacheDir.length > 0) {
    return join3(opts.cacheDir, "llm");
  }
  const xdg = process.env["XDG_CACHE_HOME"];
  const root = typeof xdg === "string" && xdg.length > 0 ? xdg : join3(homedir(), ".cache");
  return join3(root, "lucairn-ai-act-classifier", "llm");
}
function entryPathFor(key, opts) {
  return join3(resolveCacheLlmDir(opts), `${key}.json`);
}
async function cacheRead(key, opts = {}) {
  const path = entryPathFor(key, opts);
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch (err) {
    void err;
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}
async function cacheWrite(key, value, opts = {}) {
  const dir = resolveCacheLlmDir(opts);
  await mkdir(dir, { recursive: true, mode: 448 });
  const finalPath = join3(dir, `${key}.json`);
  const tmpPath = join3(dir, `${key}.${randomBytes(6).toString("hex")}.tmp`);
  const body = JSON.stringify(value);
  await writeFile(tmpPath, body, { mode: 384, encoding: "utf8" });
  await rename(tmpPath, finalPath);
}

// node_modules/@lucairn/ai-act-classifier/dist/extract/llm.js
init_anthropic();
init_openai();
init_groq();
var PROVIDER_DISPATCH = {
  anthropic: async () => {
    const mod = await Promise.resolve().then(() => (init_anthropic(), anthropic_exports));
    return mod.extractWithAnthropic;
  },
  openai: async () => {
    const mod = await Promise.resolve().then(() => (init_openai(), openai_exports));
    return mod.extractWithOpenAI;
  },
  groq: async () => {
    const mod = await Promise.resolve().then(() => (init_groq(), groq_exports));
    return mod.extractWithGroq;
  }
};
async function extractFeaturesLLM(text, opts) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new TypeError("extractFeaturesLLM(): input text must be a non-empty string.");
  }
  if (typeof opts !== "object" || opts === null || typeof opts.provider !== "string") {
    throw new TypeError("extractFeaturesLLM(): opts.provider is required.");
  }
  const importer = PROVIDER_DISPATCH[opts.provider];
  if (importer === void 0) {
    throw new Error(`LLM_UNKNOWN_PROVIDER: unknown LLM provider "${opts.provider}". Supported: anthropic, openai, groq.`);
  }
  const cacheDisabled = opts.cache?.disabled === true;
  const { LEXICONS_CACHE: LEXICONS_CACHE5, PROMPT_CHECKSUM: PROMPT_CHECKSUM5 } = await Promise.resolve().then(() => (init_shared(), shared_exports));
  const { detectLang: detectLang2 } = await Promise.resolve().then(() => (init_lang(), lang_exports));
  const detection = detectLang2(text);
  const lang = opts.lang ?? detection.lang;
  const lexiconVersion = LEXICONS_CACHE5[lang].version;
  const model = opts.model ?? getDefaultModel(opts.provider);
  const inputNormalized = normalizeInputForCacheKey(text);
  const key = cacheKey({
    provider: opts.provider,
    model,
    lexiconVersion,
    promptChecksum: PROMPT_CHECKSUM5,
    lang,
    inputNormalized
  });
  if (!cacheDisabled) {
    const cacheReadOpts = opts.cache?.cacheDir !== void 0 ? { cacheDir: opts.cache.cacheDir } : {};
    const cached = await cacheRead(key, cacheReadOpts);
    if (cached !== null)
      return cached;
  }
  const extractFn = await importer();
  const result = await extractFn(text, opts);
  if (!cacheDisabled) {
    const cacheWriteOpts = opts.cache?.cacheDir !== void 0 ? { cacheDir: opts.cache.cacheDir } : {};
    try {
      await cacheWrite(key, result, cacheWriteOpts);
    } catch {
    }
  }
  return result;
}
function getDefaultModel(provider) {
  switch (provider) {
    case "anthropic":
      return DEFAULT_MODEL;
    case "openai":
      return DEFAULT_MODEL2;
    case "groq":
      return DEFAULT_MODEL3;
    default:
      return "unknown";
  }
}
function normalizeInputForCacheKey(text) {
  return text.trim().replace(/\s+/g, " ");
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-5.js
var EUR_LEX_SOURCE = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var LETTER_TABLE = [
  {
    letter: "a",
    category_key: "a_subliminal_manipulative",
    summary_en: "Subliminal, purposefully manipulative, or deceptive techniques materially distorting behaviour. (Art 5(1)(a))",
    summary_de: "Unterschwellige, absichtlich manipulative oder t\xE4uschende Techniken zur wesentlichen Verhaltensbeeinflussung. (Art. 5 Abs. 1 Buchst. a)"
  },
  {
    letter: "b",
    category_key: "b_exploit_vulnerabilities",
    summary_en: "Exploitation of vulnerabilities due to age, disability, or specific social/economic situation. (Art 5(1)(b))",
    summary_de: "Ausnutzung von Schw\xE4chen aufgrund von Alter, Behinderung oder besonderer sozialer/wirtschaftlicher Situation. (Art. 5 Abs. 1 Buchst. b)"
  },
  {
    letter: "c",
    category_key: "c_social_scoring",
    summary_en: "Social scoring \u2014 evaluating or classifying natural persons over time based on social behaviour or personality characteristics. (Art 5(1)(c))",
    summary_de: "Sozialbewertung \u2014 Bewertung oder Klassifizierung nat\xFCrlicher Personen \xFCber einen Zeitraum aufgrund sozialen Verhaltens oder Pers\xF6nlichkeitsmerkmalen. (Art. 5 Abs. 1 Buchst. c)"
  },
  {
    letter: "d",
    category_key: "d_predictive_policing",
    summary_en: "Risk assessment to predict criminal offences based SOLELY on profiling or personality traits. (Art 5(1)(d))",
    summary_de: "Risikobewertung zur Vorhersage von Straftaten ALLEIN auf der Grundlage von Profiling oder Pers\xF6nlichkeitsmerkmalen. (Art. 5 Abs. 1 Buchst. d)"
  },
  {
    letter: "e",
    category_key: "e_facial_scraping",
    summary_en: "Untargeted scraping of facial images from the internet or CCTV to build facial-recognition databases. (Art 5(1)(e))",
    summary_de: "Ungezieltes Scraping von Gesichtsbildern aus dem Internet oder von CCTV-Aufnahmen zum Aufbau von Gesichtserkennungsdatenbanken. (Art. 5 Abs. 1 Buchst. e)"
  },
  {
    letter: "f",
    category_key: "f_emotion_in_workplace_education",
    summary_en: "Inferring emotions in workplace or educational institutions (with narrow medical/safety exceptions). (Art 5(1)(f))",
    summary_de: "Schlussfolgerungen auf Emotionen am Arbeitsplatz oder in Bildungseinrichtungen (mit engen medizinischen/Sicherheits-Ausnahmen). (Art. 5 Abs. 1 Buchst. f)"
  },
  {
    letter: "g",
    category_key: "g_biometric_categorisation_sensitive",
    summary_en: "Biometric categorisation to infer race, political opinion, trade-union membership, religious or philosophical beliefs, sex life, or sexual orientation. (Art 5(1)(g))",
    summary_de: "Biometrische Kategorisierung zur Ableitung von Rasse, politischer Meinung, Gewerkschaftszugeh\xF6rigkeit, religi\xF6sen oder weltanschaulichen \xDCberzeugungen, Sexualleben oder sexueller Orientierung. (Art. 5 Abs. 1 Buchst. g)"
  },
  {
    letter: "h",
    category_key: "h_realtime_remote_biometric_le",
    summary_en: "Real-time remote biometric identification in publicly accessible spaces for law-enforcement, prohibited unless strictly necessary for one of three statutory carve-outs: (i) targeted search for specific victims of abduction, trafficking in human beings, or sexual exploitation, or for missing persons; (ii) prevention of a specific, substantial and imminent threat to life or physical safety, or genuine and present or genuine and foreseeable threat of a terrorist attack; (iii) localisation or identification of a person suspected of having committed a serious criminal offence per Annex II. (Art 5(1)(h))",
    summary_de: "Biometrische Echtzeit-Fernidentifizierung in \xF6ffentlich zug\xE4nglichen R\xE4umen zu Strafverfolgungszwecken, verboten au\xDFer wenn unbedingt erforderlich f\xFCr eine von drei gesetzlichen Ausnahmen: (i) gezielte Suche nach bestimmten Opfern von Entf\xFChrung, Menschenhandel oder sexueller Ausbeutung sowie nach vermissten Personen; (ii) Abwehr einer konkreten, erheblichen und unmittelbaren Gefahr f\xFCr Leib oder Leben oder einer tats\xE4chlichen und gegenw\xE4rtigen oder tats\xE4chlichen und vorhersehbaren Gefahr eines Terroranschlags; (iii) Lokalisierung oder Identifizierung einer Person, die einer schweren Straftat im Sinne von Anhang II verd\xE4chtigt wird. (Art. 5 Abs. 1 Buchst. h)"
  }
];
var CATEGORY_TO_LETTER = new Map(LETTER_TABLE.map((row) => [row.category_key, row]));
var PREDICTIVE_POLICING_DISAMBIGUATORS_EN = [
  "solely on profiling",
  "solely on the profiling",
  "solely on the basis of profiling",
  "based solely on profiling",
  "personality only",
  "personality traits only",
  "solely based on profiling",
  "based solely on the profiling",
  "only on the profiling"
];
var PREDICTIVE_POLICING_DISAMBIGUATORS_DE = [
  "ausschlie\xDFlich profiling",
  "ausschlie\xDFlich auf profiling",
  "allein auf profiling",
  "allein auf der grundlage des profilings",
  "pers\xF6nlichkeit ausschlie\xDFlich",
  "pers\xF6nlichkeitsmerkmale ausschlie\xDFlich",
  "ausschlie\xDFlich auf pers\xF6nlichkeit",
  "allein auf pers\xF6nlichkeit",
  "nur auf profiling",
  "nur auf der grundlage von profiling",
  "allein auf grundlage von profiling",
  "allein auf grundlage des profilings",
  "nur auf der grundlage des profilings",
  "lediglich auf profiling",
  "lediglich auf der grundlage von profiling"
];
var EMOTION_F_CARVE_OUT_PHRASES_EN = [
  "medical",
  "medical reason",
  "medical reasons",
  "safety reason",
  "safety reasons",
  "patient",
  "patients",
  "diagnose",
  "diagnosis",
  "clinical",
  "therapeutic",
  "for medical purposes",
  "for safety purposes"
];
var EMOTION_F_CARVE_OUT_PHRASES_DE = [
  "medizinisch",
  "medizinische gr\xFCnde",
  "medizinischen gr\xFCnden",
  "sicherheitsgr\xFCnde",
  "sicherheitsgr\xFCnden",
  "patientenversorgung",
  "patient",
  "patientin",
  "diagnose",
  "klinisch",
  "therapeutisch"
];
function hasPredictivePolicingDisambiguator(input2) {
  const lower = input2.toLowerCase();
  for (const phrase of PREDICTIVE_POLICING_DISAMBIGUATORS_EN) {
    if (lower.includes(phrase))
      return true;
  }
  for (const phrase of PREDICTIVE_POLICING_DISAMBIGUATORS_DE) {
    if (lower.includes(phrase))
      return true;
  }
  return false;
}
function hasEmotionFCarveOut(input2) {
  const lower = input2.toLowerCase();
  for (const phrase of EMOTION_F_CARVE_OUT_PHRASES_EN) {
    if (lower.includes(phrase))
      return true;
  }
  for (const phrase of EMOTION_F_CARVE_OUT_PHRASES_DE) {
    if (lower.includes(phrase))
      return true;
  }
  return false;
}
function classifyArticle5(features) {
  if (features === null || typeof features !== "object") {
    throw new TypeError("classifyArticle5(): features must be an ExtractedFeatures object.");
  }
  const reasoning = [];
  const hits = [];
  const byCategoryArt5 = features.byCategory.article_5_prohibited;
  if (byCategoryArt5 === void 0 || Object.keys(byCategoryArt5).length === 0) {
    reasoning.push("No Article 5 prohibited-practice phrases matched in the input. No prohibition triggered.");
    return { prohibited: false, hits: [], reasoning };
  }
  const categoryKeys = Object.keys(byCategoryArt5).sort();
  for (const categoryKey of categoryKeys) {
    const matched = byCategoryArt5[categoryKey] ?? [];
    if (matched.length === 0)
      continue;
    const meta = CATEGORY_TO_LETTER.get(categoryKey);
    if (meta === void 0) {
      reasoning.push(`Lexicon hit on unknown Article 5 category "${categoryKey}" \u2014 skipped (rule module needs update to recognize this key).`);
      continue;
    }
    if (meta.letter === "d") {
      if (!hasPredictivePolicingDisambiguator(features.input)) {
        reasoning.push(`Lexicon hit on "${categoryKey}" (predictive policing) but the input does NOT contain a "solely on profiling" / "ausschlie\xDFlich Profiling" disambiguator. Per Art 5(1)(d), the prohibition only applies to risk assessment based SOLELY on profiling or personality traits. Downgrading: this will surface as Annex III.6 high-risk via classifyAnnexIII(), not as an Art 5 prohibition.`);
        continue;
      }
      reasoning.push(`Lexicon hit on "${categoryKey}" with disambiguating phrase present in the input ("solely on profiling" / equivalent). Art 5(1)(d) prohibition fires.`);
    } else if (meta.letter === "f") {
      if (hasEmotionFCarveOut(features.input)) {
        reasoning.push(`Lexicon hit on "${categoryKey}" (workplace/education emotion recognition) BUT the input mentions medical/safety context (e.g. "medical", "patient", "safety reason", "medizinisch", "Patient"). Per Art 5(1)(f), the prohibition has a narrow carve-out for AI systems put in place for medical or safety reasons. Downgrading: this will surface as Annex III.1(c) high-risk + Article 50(3) transparency, not as an Art 5 prohibition.`);
        continue;
      }
      reasoning.push(`Lexicon hit on "${categoryKey}" (workplace/education emotion recognition) with no medical/safety carve-out phrase in the input. Art 5(1)(f) prohibition fires. Matched phrases: ${matched.map((p) => `"${p}"`).join(", ")}.`);
    } else {
      reasoning.push(`Lexicon hit on "${categoryKey}" \u2192 Art 5(1)(${meta.letter}) prohibition fires. Matched phrases: ${matched.map((p) => `"${p}"`).join(", ")}.`);
    }
    hits.push({
      letter: meta.letter,
      category_key: categoryKey,
      matched_phrases: [...matched],
      summary_en: meta.summary_en,
      summary_de: meta.summary_de,
      source: EUR_LEX_SOURCE
    });
  }
  hits.sort((a, b) => a.letter.localeCompare(b.letter));
  return {
    prohibited: hits.length > 0,
    hits,
    reasoning
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-6-annex-iii.js
import { readFileSync as readFileSync2 } from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { dirname as dirname3, join as join4 } from "node:path";
var __filename2 = fileURLToPath2(new URL("./engine/dist/rules/article-6-annex-iii.js", import.meta.url).href);
var __dirname2 = dirname3(__filename2);
var DATA_DIR2 = join4(__dirname2, "..", "data");
function loadAnnexIII() {
  const path = join4(DATA_DIR2, "annex-iii.json");
  const raw = readFileSync2(path, "utf8");
  return JSON.parse(raw);
}
var ANNEX_III = loadAnnexIII();
function buildIndex(data) {
  const index = /* @__PURE__ */ new Map();
  for (const domain of data.domains) {
    for (const lexKey of domain.lexicon_categories) {
      if (index.has(lexKey)) {
        throw new Error(`annex-iii.json: lexicon_category "${lexKey}" mapped to multiple domains (data integrity error).`);
      }
      index.set(lexKey, domain);
    }
  }
  return index;
}
var LEXICON_INDEX = buildIndex(ANNEX_III);
var NON_LIFE_HEALTH_INSURANCE_PHRASES_EN = [
  "motor insurance",
  "auto insurance",
  "car insurance",
  "vehicle insurance",
  "property insurance",
  "casualty insurance",
  "p&c insurance",
  "p & c insurance",
  "property and casualty",
  "travel insurance",
  "pet insurance",
  "home insurance",
  "homeowners insurance",
  "renters insurance"
];
var NON_LIFE_HEALTH_INSURANCE_PHRASES_DE = [
  "kfz-versicherung",
  "kfz versicherung",
  "autoversicherung",
  "fahrzeugversicherung",
  "sachversicherung",
  "schadenversicherung",
  "reiseversicherung",
  "tierversicherung",
  "hausratversicherung",
  "geb\xE4udeversicherung",
  "wohngeb\xE4udeversicherung",
  "haftpflichtversicherung"
];
var LIFE_HEALTH_INSURANCE_PHRASES_EN = [
  "life insurance",
  "health insurance",
  "medical insurance",
  "private health"
];
var LIFE_HEALTH_INSURANCE_PHRASES_DE = [
  "lebensversicherung",
  "krankenversicherung",
  "private krankenversicherung",
  "gesundheitsversicherung"
];
var INSURANCE_PRICING_PHRASES = [
  "insurance pricing",
  "insurance risk assessment",
  "versicherungstarifierung",
  "versicherungsrisiko"
];
var REAL_WORLD_CONDITIONS_PHRASES_EN = [
  "real-world conditions",
  "real world conditions",
  "real-world pilot",
  "real world pilot",
  "real-world testing",
  "real world testing",
  "real-world deployment",
  "real world deployment"
];
var REAL_WORLD_CONDITIONS_PHRASES_DE = [
  "realbedingungen",
  "realen bedingungen",
  "unter realbedingungen",
  "pilot unter realbedingungen",
  "realer einsatz",
  "realbetrieb"
];
function inputContainsAny(input2, phrases) {
  const lower = input2.toLowerCase();
  for (const phrase of phrases) {
    if (lower.includes(phrase))
      return true;
  }
  return false;
}
function narrowSubLetters(domain, matchedPhrases, rawInput) {
  const lowerInput = rawInput.toLowerCase();
  const matchedLower = matchedPhrases.map((p) => p.toLowerCase());
  if (domain.annex_iii_number === 5) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => ["benefit eligibility", "sozialleistung"].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => ["credit scoring", "creditworthiness", "bonit\xE4tspr\xFCfung", "kreditw\xFCrdigkeit", "scoring"].includes(p))) {
      hits.add("b");
    }
    const hasInsurancePricing = matchedLower.some((p) => INSURANCE_PRICING_PHRASES.includes(p));
    if (hasInsurancePricing) {
      const isLifeHealth = inputContainsAny(rawInput, LIFE_HEALTH_INSURANCE_PHRASES_EN) || inputContainsAny(rawInput, LIFE_HEALTH_INSURANCE_PHRASES_DE);
      if (isLifeHealth)
        hits.add("c");
    }
    if (matchedLower.some((p) => ["emergency dispatch", "triage", "notrufdisposition"].includes(p))) {
      hits.add("d");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 1) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => ["remote biometric identification", "facial recognition", "fingerprint identification", "biometrische fernidentifizierung", "gesichtserkennung", "fingerabdruckerkennung"].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => ["biometric categorisation", "biometric categorization", "biometrische kategorisierung"].includes(p))) {
      hits.add("b");
    }
    if (matchedLower.some((p) => ["emotion recognition", "emotionserkennung"].includes(p))) {
      hits.add("c");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 4) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => [
      "cv screening",
      "cv screenings",
      "resume screening",
      "resume screenings",
      "candidate ranking",
      "applicant tracking",
      "hiring decision",
      "hiring decisions",
      "lebenslauf-screening",
      "bewerberauswahl",
      "bewerber-ranking",
      "personalauswahl",
      "einstellungsentscheidung",
      "einstellungsentscheidungen",
      "rank job applicants",
      "ranks job applicants",
      "rank applicants",
      "ranks applicants",
      "rank candidates",
      "ranks candidates",
      "rank job candidates",
      "ranks job candidates",
      "shortlist candidates",
      "shortlists candidates",
      "shortlist applicants",
      "shortlists applicants",
      "shortlisting candidates",
      "shortlisting applicants",
      "candidate shortlist",
      "candidate shortlisting",
      "applicant shortlist",
      "applicant shortlisting",
      "recruitment",
      "recruiting candidates",
      "recruiting applicants",
      "recruit candidates",
      "recruits candidates",
      "applicant selection",
      "candidate selection",
      "selection of candidates",
      "screen cvs",
      "screens cvs",
      "screen resumes",
      "screens resumes",
      "screen applicants",
      "screens applicants",
      "screen candidates",
      "screens candidates",
      "evaluate applicants",
      "evaluates applicants",
      "evaluate candidates",
      "evaluates candidates",
      "evaluate cvs",
      "evaluate resumes",
      "evaluate job applicants",
      "automated hiring",
      "automated recruitment",
      "job applicants by cv",
      "applicants by cv",
      "bewerber sortieren",
      "kandidaten sortieren",
      "bewerber bewerten",
      "bewerber screening",
      "bewerbungsscreening",
      "lebenslauf screening",
      "lebenslaufscreening",
      "bewerbungen bewerten",
      "bewerbungen sortieren",
      "stellenbewerber",
      "kandidaten ausw\xE4hlen",
      "kandidaten ranken",
      "kandidaten bewerten",
      "vorstellungsgespr\xE4che auswerten",
      "rekrutierung",
      "rekrutieren",
      "stellenbesetzung",
      "einstellungsverfahren",
      "auswahl von bewerbern",
      "kandidaten f\xFCr eine stelle zu sortieren",
      "kandidaten f\xFCr eine stelle sortieren",
      "bewertet bewerbungen",
      "evaluate job applications",
      "evaluate job applications and cvs",
      "evaluates job applications",
      "evaluating job applications",
      "select candidates for employment",
      "selects candidates for employment",
      "selecting candidates for employment",
      "candidates for employment",
      "job applications and cvs",
      "vorauswahl von bewerbenden",
      "bewerbenden bewerten",
      "bewerbende bewerten",
      "bewerbenden ausw\xE4hlen",
      "bewerbende ausw\xE4hlen",
      "anwerbung von nat\xFCrlichen personen",
      "recruiting-system",
      "personal-recruiting",
      "personalrecruiting"
    ].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => [
      "performance evaluation",
      "performance evaluations",
      "worker monitoring",
      "leistungsbewertung",
      "leistungsbewertungen",
      "mitarbeiter\xFCberwachung"
    ].includes(p))) {
      hits.add("b");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 6) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => [
      "victim-risk assessment",
      "risk of becoming victim",
      "assess the risk of victim",
      "opfer-risiko-bewertung",
      "risikobewertung opfer",
      "risiko opfer einer straftat",
      "bewertung opfer straftat"
    ].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => ["polygraph", "lie detector", "l\xFCgendetektor"].includes(p))) {
      hits.add("b");
    }
    if (matchedLower.some((p) => ["evidence reliability", "beweismittelzuverl\xE4ssigkeit"].includes(p))) {
      hits.add("c");
    }
    if (matchedLower.some((p) => ["recidivism risk", "r\xFCckfallrisiko"].includes(p))) {
      hits.add("d");
    }
    if (matchedLower.some((p) => ["crime profiling", "kriminalprofiling", "predictive policing", "vorhersagende polizeiarbeit"].includes(p))) {
      void lowerInput;
      hits.add("d");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 2) {
    return ["a"];
  }
  if (domain.annex_iii_number === 3) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => [
      "admission",
      "student admission",
      "student admissions",
      "admission decision",
      "admission decisions",
      "sch\xFCleraufnahme",
      "studienzulassung",
      "determine access to educational institutions",
      "access to educational institutions",
      "determine access to education",
      "access to education",
      "admission to educational institutions",
      "university admission",
      "university admissions",
      "school admission",
      "school admissions",
      "evaluate student admission",
      "student admission decision",
      "zugang zu bildungseinrichtungen bestimmen",
      "zugang zu bildungseinrichtungen",
      "zulassung zu hochschulen",
      "zulassungsentscheidung universit\xE4t"
    ].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => [
      "outcome evaluation",
      "automated grading",
      "exam scoring",
      "learning outcome assessment",
      "learning assessment",
      "lernbewertung",
      "automatisierte benotung",
      "pr\xFCfungsbewertung",
      "automated essay scoring",
      "predict student performance",
      "bewertung von sch\xFClern",
      "automatische notenvergabe"
    ].includes(p))) {
      hits.add("b");
    }
    if (matchedLower.some((p) => [
      "education level determination",
      "bildungsniveau bestimmen",
      "bildungszuweisung",
      "bewertung des bildungsniveaus",
      "bewertung angemessenes bildungsniveau"
    ].includes(p))) {
      hits.add("c");
    }
    if (matchedLower.some((p) => [
      "exam monitoring",
      "proctoring",
      "cheating detection",
      "pr\xFCfungs\xFCberwachung",
      "betrugserkennung pr\xFCfung",
      "exam proctoring",
      "online exam monitoring",
      "online-pr\xFCfung \xFCberwachen"
    ].includes(p))) {
      hits.add("d");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 7) {
    const hits = /* @__PURE__ */ new Set();
    const isBorderContext = inputContainsAny(rawInput, [
      "border control",
      "border surveillance",
      "migration",
      "asylum",
      "visa",
      "residence permit",
      "grenzkontrolle",
      "grenz\xFCberwachung",
      "asyl",
      "visum",
      "aufenthaltstitel"
    ]);
    if (isBorderContext && inputContainsAny(rawInput, ["polygraph", "l\xFCgendetektor", "lie detector"])) {
      hits.add("a");
    }
    if (matchedLower.some((p) => [
      "migration risk",
      "irregular migration risk",
      "migrationsrisiko",
      "sicherheitsrisiko grenze",
      "risiko der irregul\xE4ren einwanderung",
      "irregul\xE4re einwanderung"
    ].includes(p))) {
      hits.add("b");
    }
    if (matchedLower.some((p) => ["asylum application", "visa application", "residence permit", "residence permit application", "asylantrag", "visumantrag", "aufenthaltstitel"].includes(p))) {
      hits.add("c");
    }
    if (matchedLower.some((p) => ["border control", "border surveillance", "grenzkontrolle", "grenz\xFCberwachung"].includes(p))) {
      hits.add("d");
    }
    return [...hits].sort();
  }
  if (domain.annex_iii_number === 8) {
    const hits = /* @__PURE__ */ new Set();
    if (matchedLower.some((p) => ["judicial decision", "judicial assistance", "judicial research", "legal interpretation", "fact research", "gerichtliche entscheidung", "richterliche unterst\xFCtzung", "rechtsauslegung"].includes(p))) {
      hits.add("a");
    }
    if (matchedLower.some((p) => ["election influence", "election influencing", "voter targeting", "wahlbeeinflussung", "w\xE4hlerzielgruppe"].includes(p))) {
      hits.add("b");
    }
    return [...hits].sort();
  }
  return [];
}
function classifyAnnexIII(features, article5Result) {
  if (features === null || typeof features !== "object") {
    throw new TypeError("classifyAnnexIII(): features must be an ExtractedFeatures object.");
  }
  if (article5Result === null || typeof article5Result !== "object") {
    throw new TypeError("classifyAnnexIII(): article5Result must be an Article5Result object (call classifyArticle5() first).");
  }
  const reasoning = [];
  const domains = [];
  const byCategoryAnnexIII = features.byCategory.annex_iii;
  if (byCategoryAnnexIII === void 0 || Object.keys(byCategoryAnnexIII).length === 0) {
    reasoning.push("No Annex III domain phrases matched in the input. No high-risk classification triggered.");
    return {
      high_risk: false,
      domains: [],
      reasoning,
      suppressed_by_article_5: article5Result.prohibited
    };
  }
  const categoryKeys = Object.keys(byCategoryAnnexIII).sort();
  for (const categoryKey of categoryKeys) {
    const matched = byCategoryAnnexIII[categoryKey] ?? [];
    if (matched.length === 0)
      continue;
    const domain = LEXICON_INDEX.get(categoryKey);
    if (domain === void 0) {
      reasoning.push(`Lexicon hit on unknown Annex III category "${categoryKey}" \u2014 skipped (annex-iii.json data needs update to map this key).`);
      continue;
    }
    if (domain.annex_iii_number === 5) {
      const matchedLower = matched.map((p) => p.toLowerCase());
      const hasInsurancePricing = matchedLower.some((p) => INSURANCE_PRICING_PHRASES.includes(p));
      if (hasInsurancePricing) {
        const hasNonLifeHealth = inputContainsAny(features.input, NON_LIFE_HEALTH_INSURANCE_PHRASES_EN) || inputContainsAny(features.input, NON_LIFE_HEALTH_INSURANCE_PHRASES_DE);
        const hasLifeHealth = inputContainsAny(features.input, LIFE_HEALTH_INSURANCE_PHRASES_EN) || inputContainsAny(features.input, LIFE_HEALTH_INSURANCE_PHRASES_DE);
        if (hasNonLifeHealth && !hasLifeHealth) {
          const remaining = matched.filter((p) => !INSURANCE_PRICING_PHRASES.includes(p.toLowerCase()));
          if (remaining.length === 0) {
            reasoning.push(`Annex III.5 lexicon hit on insurance-pricing phrases only, but the input clearly references property/casualty/motor insurance. Annex III.5(c) is scoped to LIFE and HEALTH insurance per EUR-Lex paragraph 5(c). Not claiming Annex III.5 high-risk for this input.`);
            continue;
          }
          const subLetters2 = narrowSubLetters(domain, remaining, features.input);
          domains.push({
            annex_iii_number: domain.annex_iii_number,
            key: domain.key,
            sub_letters: subLetters2,
            matched_phrases: remaining,
            title_en: domain.title_en,
            title_de: domain.title_de,
            source: domain.source
          });
          reasoning.push(`Annex III.5 lexicon hit included insurance-pricing phrases, but P&C/motor insurance context detected \u2014 dropped insurance-pricing match. Remaining 5_essential_services phrases (${remaining.map((p) => `"${p}"`).join(", ")}) still trigger Annex III.5.`);
          continue;
        }
      }
    }
    const subLetters = narrowSubLetters(domain, matched, features.input);
    domains.push({
      annex_iii_number: domain.annex_iii_number,
      key: domain.key,
      sub_letters: subLetters,
      matched_phrases: [...matched],
      title_en: domain.title_en,
      title_de: domain.title_de,
      source: domain.source
    });
    const subLettersStr = subLetters.length > 0 ? ` (sub-letters: ${subLetters.join(", ")})` : "";
    reasoning.push(`Annex III.${domain.annex_iii_number} (${domain.key})${subLettersStr} fires from lexicon category "${categoryKey}". Matched phrases: ${matched.map((p) => `"${p}"`).join(", ")}.`);
  }
  domains.sort((a, b) => a.annex_iii_number - b.annex_iii_number);
  const scopeQualifiers = features.byCategory.scope_qualifiers ?? {};
  if (scopeQualifiers["internal_use"] !== void 0 && scopeQualifiers["internal_use"].length > 0) {
    reasoning.push(`User input mentioned internal-use phrasing ("${scopeQualifiers["internal_use"].join('", "')}") \u2014 this is NOT a regulatory exemption. Internal use does not exempt a system from Annex III high-risk classification or Article 5 prohibitions if otherwise triggered.`);
  }
  if (scopeQualifiers["research_only"] !== void 0 && scopeQualifiers["research_only"].length > 0) {
    const hasRealWorld = inputContainsAny(features.input, REAL_WORLD_CONDITIONS_PHRASES_EN) || inputContainsAny(features.input, REAL_WORLD_CONDITIONS_PHRASES_DE);
    if (hasRealWorld) {
      reasoning.push(`User input mentioned research/testing phrasing ("${scopeQualifiers["research_only"].join('", "')}") AND real-world conditions language. Per Art 2(8), the research/testing carve-out does NOT apply when AI systems are tested under real-world conditions. High-risk obligations remain applicable.`);
    } else {
      reasoning.push(`User input mentioned research/testing phrasing ("${scopeQualifiers["research_only"].join('", "')}") and no real-world conditions language. Art 2(8) carve-out may apply \u2014 pre-market R&D activity is outside the AI Act's substantive obligations until placement on the market or putting into service.`);
    }
  }
  if (article5Result.prohibited) {
    const letters = article5Result.hits.map((h) => `(${h.letter})`).join(", ");
    reasoning.push(`Article 5 prohibition fired (${letters}). Article 5 is an absolute prohibition that supersedes Article 6 high-risk obligations: a prohibited system cannot be placed on the market or put into service regardless of whether it ALSO meets a high-risk Annex III description. Annex III hits are retained for transparency but the operative classification is "prohibited".`);
    return {
      high_risk: false,
      domains,
      reasoning,
      suppressed_by_article_5: true
    };
  }
  return {
    high_risk: domains.length > 0,
    domains,
    reasoning,
    suppressed_by_article_5: false
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-10.js
var EUR_LEX_SOURCE2 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var SUMMARY_EN = "High-risk AI systems which make use of techniques involving the training of AI models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5 whenever such data sets are used. (Art 10(1))";
var SUMMARY_DE = "Hochrisiko-KI-Systeme, in denen Techniken eingesetzt werden, bei denen KI-Modelle mit Daten trainiert werden, m\xFCssen mit Trainings-, Validierungs- und Testdatens\xE4tzen entwickelt werden, die den in den Abs\xE4tzen 2 bis 5 genannten Qualit\xE4tskriterien entsprechen, wenn solche Datens\xE4tze verwendet werden. (Art. 10 Abs. 1)";
function classifyArticle10(annex, article5) {
  if (annex === null || typeof annex !== "object" || !Array.isArray(annex.domains)) {
    throw new TypeError("classifyArticle10(): annex must be an AnnexIIIResult object with a domains array (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object") {
    throw new TypeError("classifyArticle10(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  const article5Triggered = annex.suppressed_by_article_5;
  const annexDomains = annex.domains.map((d) => d.annex_iii_number);
  const sortedDomains = [...annexDomains].sort((a, b) => a - b);
  const applicable = annex.high_risk && !article5Triggered;
  return {
    applicable,
    triggered_by: {
      article_5: article5Triggered,
      annex_iii_domains: applicable ? sortedDomains : []
    },
    summary_en: SUMMARY_EN,
    summary_de: SUMMARY_DE,
    source: EUR_LEX_SOURCE2
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-12.js
var EUR_LEX_SOURCE3 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var SUMMARY_EN2 = "High-risk AI systems shall technically allow for the automatic recording of events (logs) over the lifetime of the system. (Art 12(1))";
var SUMMARY_DE2 = "Die Technik der Hochrisiko-KI-Systeme muss die automatische Aufzeichnung von Ereignissen (im Folgenden \u201EProtokollierung\u201C) w\xE4hrend des Lebenszyklus des Systems erm\xF6glichen. (Art. 12 Abs. 1)";
function classifyArticle12(annex, article5) {
  if (annex === null || typeof annex !== "object" || !Array.isArray(annex.domains)) {
    throw new TypeError("classifyArticle12(): annex must be an AnnexIIIResult object with a domains array (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object" || Array.isArray(article5)) {
    throw new TypeError("classifyArticle12(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  const article5Triggered = annex.suppressed_by_article_5;
  const annexDomains = annex.domains.map((d) => d.annex_iii_number);
  const sortedDomains = [...annexDomains].sort((a, b) => a - b);
  const applicable = annex.high_risk && !article5Triggered;
  return {
    applicable,
    triggered_by: {
      article_5: article5Triggered,
      annex_iii_domains: applicable ? sortedDomains : []
    },
    summary_en: SUMMARY_EN2,
    summary_de: SUMMARY_DE2,
    source: EUR_LEX_SOURCE3
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-13.js
var EUR_LEX_SOURCE4 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var SUMMARY_EN3 = "High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret a system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured with a view to achieving compliance with the relevant obligations of the provider and deployer set out in Section 3. (Art 13(1))";
var SUMMARY_DE3 = "Hochrisiko-KI-Systeme werden so konzipiert und entwickelt, dass ihr Betrieb hinreichend transparent ist, damit die Betreiber die Ausgaben eines Systems angemessen interpretieren und verwenden k\xF6nnen. Die Transparenz wird auf eine geeignete Art und in einem angemessenen Ma\xDF gew\xE4hrleistet, damit die Anbieter und Betreiber ihre in Abschnitt 3 festgelegten einschl\xE4gigen Pflichten erf\xFCllen k\xF6nnen. (Art. 13 Abs. 1)";
function classifyArticle13(annex, article5) {
  if (annex === null || typeof annex !== "object" || !Array.isArray(annex.domains)) {
    throw new TypeError("classifyArticle13(): annex must be an AnnexIIIResult object with a domains array (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object") {
    throw new TypeError("classifyArticle13(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  const article5Triggered = annex.suppressed_by_article_5;
  const annexDomains = annex.domains.map((d) => d.annex_iii_number);
  const sortedDomains = [...annexDomains].sort((a, b) => a - b);
  const applicable = annex.high_risk && !article5Triggered;
  return {
    applicable,
    triggered_by: {
      article_5: article5Triggered,
      annex_iii_domains: applicable ? sortedDomains : []
    },
    summary_en: SUMMARY_EN3,
    summary_de: SUMMARY_DE3,
    source: EUR_LEX_SOURCE4
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-14.js
var EUR_LEX_SOURCE5 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var SUMMARY_EN4 = "High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use. (Art 14(1))";
var SUMMARY_DE4 = "Hochrisiko-KI-Systeme werden so konzipiert und entwickelt, dass sie w\xE4hrend der Dauer ihrer Verwendung \u2014 auch mit geeigneten Instrumenten einer Mensch-Maschine-Schnittstelle \u2014 von nat\xFCrlichen Personen wirksam beaufsichtigt werden k\xF6nnen. (Art. 14 Abs. 1)";
function classifyArticle14(annex, article5) {
  if (annex === null || typeof annex !== "object" || !Array.isArray(annex.domains)) {
    throw new TypeError("classifyArticle14(): annex must be an AnnexIIIResult object with a domains array (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object") {
    throw new TypeError("classifyArticle14(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  const article5Triggered = annex.suppressed_by_article_5;
  const annexDomains = annex.domains.map((d) => d.annex_iii_number);
  const sortedDomains = [...annexDomains].sort((a, b) => a - b);
  const applicable = annex.high_risk && !article5Triggered;
  return {
    applicable,
    triggered_by: {
      article_5: article5Triggered,
      annex_iii_domains: applicable ? sortedDomains : []
    },
    summary_en: SUMMARY_EN4,
    summary_de: SUMMARY_DE4,
    source: EUR_LEX_SOURCE5
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-15.js
var EUR_LEX_SOURCE6 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var SUMMARY_EN5 = "High-risk AI systems shall be designed and developed in such a way that they achieve an appropriate level of accuracy, robustness, and cybersecurity, and that they perform consistently in those respects throughout their lifecycle. (Art 15(1))";
var SUMMARY_DE5 = "Hochrisiko-KI-Systeme werden so konzipiert und entwickelt, dass sie ein angemessenes Ma\xDF an Genauigkeit, Robustheit und Cybersicherheit erreichen und in dieser Hinsicht w\xE4hrend ihres gesamten Lebenszyklus best\xE4ndig funktionieren. (Art. 15 Abs. 1)";
function classifyArticle15(annex, article5) {
  if (annex === null || typeof annex !== "object" || !Array.isArray(annex.domains)) {
    throw new TypeError("classifyArticle15(): annex must be an AnnexIIIResult object with a domains array (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object") {
    throw new TypeError("classifyArticle15(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  const article5Triggered = annex.suppressed_by_article_5;
  const annexDomains = annex.domains.map((d) => d.annex_iii_number);
  const sortedDomains = [...annexDomains].sort((a, b) => a - b);
  const applicable = annex.high_risk && !article5Triggered;
  return {
    applicable,
    triggered_by: {
      article_5: article5Triggered,
      annex_iii_domains: applicable ? sortedDomains : []
    },
    summary_en: SUMMARY_EN5,
    summary_de: SUMMARY_DE5,
    source: EUR_LEX_SOURCE6
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-50.js
var EUR_LEX_SOURCE7 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var CHAPEAU_EN = {
  paragraph_1_interaction: "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect, taking into account the circumstances and the context of use. This obligation shall not apply to AI systems authorised by law to detect, prevent, investigate or prosecute criminal offences, subject to appropriate safeguards for the rights and freedoms of third parties, unless those systems are available for the public to report a criminal offence. (Art 50(1))",
  paragraph_2_synthetic_content: "Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure that the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated. Providers shall ensure their technical solutions are effective, interoperable, robust and reliable as far as this is technically feasible, taking into account the specificities and limitations of various types of content, the costs of implementation and the generally acknowledged state of the art, as may be reflected in relevant technical standards. This obligation shall not apply to the extent the AI systems perform an assistive function for standard editing or do not substantially alter the input data provided by the deployer or the semantics thereof, or where authorised by law to detect, prevent, investigate or prosecute criminal offences. (Art 50(2))",
  paragraph_3_emotion_or_biometric_categorisation: "Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system, and shall process the personal data in accordance with Regulations (EU) 2016/679 and (EU) 2018/1725 and Directive (EU) 2016/680, as applicable. This obligation shall not apply to AI systems used for biometric categorisation and emotion recognition, which are permitted by law to detect, prevent or investigate criminal offences, subject to appropriate safeguards for the rights and freedoms of third parties, and in accordance with Union law. (Art 50(3))",
  paragraph_4_deepfake: "Deployers of an AI system that generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated. This obligation shall not apply where the use is authorised by law to detect, prevent, investigate or prosecute criminal offence. Where the content forms part of an evidently artistic, creative, satirical, fictional or analogous work or programme, the transparency obligations set out in this paragraph are limited to disclosure of the existence of such generated or manipulated content in an appropriate manner that does not hamper the display or enjoyment of the work. (Art 50(4) sub-paragraph 1)",
  paragraph_4_public_interest_text: "Deployers of an AI system that generates or manipulates text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated. This obligation shall not apply where the use is authorised by law to detect, prevent, investigate or prosecute criminal offences or where the AI-generated content has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility for the publication of the content. (Art 50(4) sub-paragraph 2)",
  "5": "The information referred to in paragraphs 1 to 4 shall be provided to the natural persons concerned in a clear and distinguishable manner at the latest at the time of the first interaction or exposure. The information shall conform to the applicable accessibility requirements. (Art 50(5))"
};
var CHAPEAU_DE = {
  paragraph_1_interaction: "Die Anbieter stellen sicher, dass KI-Systeme, die f\xFCr die direkte Interaktion mit nat\xFCrlichen Personen bestimmt sind, so konzipiert und entwickelt werden, dass die betreffenden nat\xFCrlichen Personen informiert werden, dass sie mit einem KI-System interagieren, es sei denn, dies ist aus Sicht einer angemessen informierten, aufmerksamen und verst\xE4ndigen nat\xFCrlichen Person aufgrund der Umst\xE4nde und des Kontexts der Nutzung offensichtlich. Diese Pflicht gilt nicht f\xFCr gesetzlich zur Aufdeckung, Verh\xFCtung, Ermittlung oder Verfolgung von Straftaten zugelassene KI-Systeme, wenn geeignete Schutzvorkehrungen f\xFCr die Rechte und Freiheiten Dritter bestehen, es sei denn, diese Systeme stehen der \xD6ffentlichkeit zur Anzeige einer Straftat zur Verf\xFCgung. (Art. 50 Abs. 1)",
  paragraph_2_synthetic_content: "Anbieter von KI-Systemen, einschlie\xDFlich KI-Systemen mit allgemeinem Verwendungszweck, die synthetische Audio-, Bild-, Video- oder Textinhalte erzeugen, stellen sicher, dass die Ausgaben des KI-Systems in einem maschinenlesbaren Format gekennzeichnet und als k\xFCnstlich erzeugt oder manipuliert erkennbar sind. Die Anbieter sorgen daf\xFCr, dass \u2014 soweit technisch m\xF6glich \u2014 ihre technischen L\xF6sungen wirksam, interoperabel, belastbar und zuverl\xE4ssig sind und ber\xFCcksichtigen dabei die Besonderheiten und Beschr\xE4nkungen der verschiedenen Arten von Inhalten, die Umsetzungskosten und den allgemein anerkannten Stand der Technik, wie er in den einschl\xE4gigen technischen Normen zum Ausdruck kommen kann. Diese Pflicht gilt nicht, soweit die KI-Systeme eine unterst\xFCtzende Funktion f\xFCr die Standardbearbeitung ausf\xFChren oder die vom Betreiber bereitgestellten Eingabedaten oder deren Semantik nicht wesentlich ver\xE4ndern oder wenn sie zur Aufdeckung, Verh\xFCtung, Ermittlung oder Verfolgung von Straftaten gesetzlich zugelassen sind. (Art. 50 Abs. 2)",
  paragraph_3_emotion_or_biometric_categorisation: "Die Betreiber eines Emotionserkennungssystems oder eines Systems zur biometrischen Kategorisierung informieren die davon betroffenen nat\xFCrlichen Personen \xFCber den Betrieb des Systems und verarbeiten personenbezogene Daten gem\xE4\xDF den Verordnungen (EU) 2016/679 und (EU) 2018/1725 und der Richtlinie (EU) 2016/680. Diese Pflicht gilt nicht f\xFCr gesetzlich zur Aufdeckung, Verh\xFCtung oder Ermittlung von Straftaten zugelassene KI-Systeme, die zur biometrischen Kategorisierung und Emotionserkennung im Einklang mit dem Unionsrecht verwendet werden, sofern geeignete Schutzvorkehrungen f\xFCr die Rechte und Freiheiten Dritter bestehen. (Art. 50 Abs. 3)",
  paragraph_4_deepfake: "Betreiber eines KI-Systems, das Bild-, Ton- oder Videoinhalte erzeugt oder manipuliert, die ein Deepfake sind, m\xFCssen offenlegen, dass die Inhalte k\xFCnstlich erzeugt oder manipuliert wurden. Diese Pflicht gilt nicht, wenn die Verwendung zur Aufdeckung, Verh\xFCtung, Ermittlung oder Verfolgung von Straftaten gesetzlich zugelassen ist. Ist der Inhalt Teil eines offensichtlich k\xFCnstlerischen, kreativen, satirischen, fiktionalen oder analogen Werks oder Programms, so beschr\xE4nken sich die in diesem Absatz festgelegten Transparenzpflichten darauf, das Vorhandensein solcher erzeugten oder manipulierten Inhalte in geeigneter Weise offenzulegen, die die Darstellung oder den Genuss des Werks nicht beeintr\xE4chtigt. (Art. 50 Abs. 4 Unterabsatz 1)",
  paragraph_4_public_interest_text: "Betreiber eines KI-Systems, das Text erzeugt oder manipuliert, der ver\xF6ffentlicht wird, um die \xD6ffentlichkeit \xFCber Angelegenheiten von \xF6ffentlichem Interesse zu informieren, m\xFCssen offenlegen, dass der Text k\xFCnstlich erzeugt oder manipuliert wurde. Diese Pflicht gilt nicht, wenn die Verwendung zur Aufdeckung, Verh\xFCtung, Ermittlung oder Verfolgung von Straftaten gesetzlich zugelassen ist oder wenn die durch KI erzeugten Inhalte einem Verfahren der menschlichen \xDCberpr\xFCfung oder redaktionellen Kontrolle unterzogen wurden und wenn eine nat\xFCrliche oder juristische Person die redaktionelle Verantwortung f\xFCr die Ver\xF6ffentlichung der Inhalte tr\xE4gt. (Art. 50 Abs. 4 Unterabsatz 2)",
  "5": "Die in den Abs\xE4tzen 1 bis 4 genannten Informationen werden den betreffenden nat\xFCrlichen Personen sp\xE4testens zum Zeitpunkt der ersten Interaktion oder Aussetzung in klarer und eindeutiger Weise bereitgestellt. Die Informationen m\xFCssen den geltenden Barrierefreiheitsanforderungen entsprechen. (Art. 50 Abs. 5)"
};
var LEXICON_GROUP = "article_50_gpai";
var CATEGORY_TO_PARAGRAPH = {
  "1_interaction_disclosure": "paragraph_1_interaction",
  "2_synthetic_content_marking": "paragraph_2_synthetic_content",
  "3_emotion_categorisation_disclosure": "paragraph_3_emotion_or_biometric_categorisation",
  "4_deepfake_labeling": "paragraph_4_deepfake",
  "5_public_interest_text": "paragraph_4_public_interest_text"
};
function classifyArticle50(features, article5, annex = null) {
  if (features === null || typeof features !== "object" || Array.isArray(features) || typeof features.input !== "string" || features.byCategory === null || typeof features.byCategory !== "object" || Array.isArray(features.byCategory)) {
    throw new TypeError("classifyArticle50(): features must be an ExtractedFeatures object with input:string and byCategory:object (call extractFeatures() first).");
  }
  if (article5 === null || typeof article5 !== "object" || Array.isArray(article5)) {
    throw new TypeError("classifyArticle50(): article5 must be an Article5Result object (call classifyArticle5() first).");
  }
  if (annex !== null) {
    if (typeof annex !== "object" || !Array.isArray(annex.domains)) {
      throw new TypeError("classifyArticle50(): annex must be an AnnexIIIResult object with a domains array or null (call classifyAnnexIII() first, or pass null to disable the fallback).");
    }
  }
  void article5;
  const lex = features.byCategory[LEXICON_GROUP] ?? {};
  const triggers = {
    paragraph_1_interaction: false,
    paragraph_2_synthetic_content: false,
    paragraph_3_emotion_or_biometric_categorisation: false,
    paragraph_4_deepfake: false,
    paragraph_4_public_interest_text: false
  };
  for (const [cat, paragraphKey] of Object.entries(CATEGORY_TO_PARAGRAPH)) {
    const matched = lex[cat];
    if (Array.isArray(matched) && matched.length > 0) {
      triggers[paragraphKey] = true;
    }
  }
  if (annex !== null && !triggers.paragraph_3_emotion_or_biometric_categorisation) {
    for (const domain of annex.domains) {
      if (domain.annex_iii_number !== 1)
        continue;
      if (Array.isArray(domain.sub_letters) && (domain.sub_letters.includes("b") || domain.sub_letters.includes("c"))) {
        triggers.paragraph_3_emotion_or_biometric_categorisation = true;
        break;
      }
    }
  }
  const applicable = triggers.paragraph_1_interaction || triggers.paragraph_2_synthetic_content || triggers.paragraph_3_emotion_or_biometric_categorisation || triggers.paragraph_4_deepfake || triggers.paragraph_4_public_interest_text;
  const PARAGRAPH_ORDER = [
    "paragraph_1_interaction",
    "paragraph_2_synthetic_content",
    "paragraph_3_emotion_or_biometric_categorisation",
    "paragraph_4_deepfake",
    "paragraph_4_public_interest_text"
  ];
  const firedEN = [];
  const firedDE = [];
  for (const key of PARAGRAPH_ORDER) {
    if (triggers[key]) {
      firedEN.push(CHAPEAU_EN[key]);
      firedDE.push(CHAPEAU_DE[key]);
    }
  }
  let summary_en;
  let summary_de;
  if (applicable) {
    firedEN.push(CHAPEAU_EN["5"]);
    firedDE.push(CHAPEAU_DE["5"]);
    summary_en = firedEN.join(" ");
    summary_de = firedDE.join(" ");
  } else {
    summary_en = CHAPEAU_EN.paragraph_1_interaction;
    summary_de = CHAPEAU_DE.paragraph_1_interaction;
  }
  return {
    applicable,
    triggered_by: triggers,
    summary_en,
    summary_de,
    source: EUR_LEX_SOURCE7
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-4.js
var EUR_LEX_SOURCE8 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var CHAPEAU_EN2 = "Providers and deployers of AI systems shall take measures to ensure, to their best extent, a sufficient level of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their technical knowledge, experience, education and training and the context the AI systems are to be used in, and considering the persons or groups of persons on whom the AI systems are to be used. (Art 4)";
var CHAPEAU_DE2 = "Die Anbieter und Betreiber von KI-Systemen ergreifen Ma\xDFnahmen, um nach besten Kr\xE4ften sicherzustellen, dass ihr Personal und andere Personen, die in ihrem Auftrag mit dem Betrieb und der Nutzung von KI-Systemen befasst sind, \xFCber ein ausreichendes Ma\xDF an KI-Kompetenz verf\xFCgen, wobei ihre technischen Kenntnisse, ihre Erfahrung, ihre Ausbildung und Schulung und der Kontext, in dem die KI-Systeme eingesetzt werden sollen, sowie die Personen oder Personengruppen, bei denen die KI-Systeme eingesetzt werden sollen, zu ber\xFCcksichtigen sind. (Art. 4)";
var LEXICON_GROUP2 = "article_4_ai_literacy";
var LEXICON_SUBCATEGORY = "provider_or_deployer_with_staff";
function classifyArticle4(features) {
  if (features === null || typeof features !== "object" || Array.isArray(features) || typeof features.input !== "string" || features.byCategory === null || typeof features.byCategory !== "object" || Array.isArray(features.byCategory)) {
    throw new TypeError("classifyArticle4(): features must be an ExtractedFeatures object with input:string and byCategory:object (call extractFeatures() first).");
  }
  const lex = features.byCategory[LEXICON_GROUP2] ?? {};
  const matched = lex[LEXICON_SUBCATEGORY];
  const triggered2 = Array.isArray(matched) && matched.length > 0;
  const triggers = {
    provider_or_deployer_with_staff: triggered2
  };
  return {
    applicable: triggered2,
    triggered_by: triggers,
    summary_en: CHAPEAU_EN2,
    summary_de: CHAPEAU_DE2,
    source: EUR_LEX_SOURCE8
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/article-53-gpai.js
var EUR_LEX_SOURCE9 = "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689";
var CHAPEAU_53_EN = "Providers of general-purpose AI models shall: (Art 53(1))";
var CHAPEAU_55_EN = "In addition to the obligations listed in Articles 53 and 54, providers of general-purpose AI models with systemic risk shall: (Art 55(1))";
var CHAPEAU_53_DE = "Anbieter von KI-Modellen mit allgemeinem Verwendungszweck (Art. 53 Abs. 1)";
var CHAPEAU_55_DE = "Zus\xE4tzlich zu den in den Artikeln 53 und 54 aufgef\xFChrten Pflichten m\xFCssen Anbieter von KI-Modellen mit allgemeinem Verwendungszweck mit systemischem Risiko: (Art. 55 Abs. 1)";
var LEXICON_GROUP3 = "gpai_models";
var CATEGORY_TO_TRIGGER = {
  named_foundation_models: "named_foundation_model",
  generic_foundation_model_phrasing: "generic_foundation_model_phrasing",
  systemic_risk_markers: "systemic_risk_markers"
};
function classifyGPAI(features) {
  if (features === null || typeof features !== "object" || Array.isArray(features) || typeof features.input !== "string" || features.byCategory === null || typeof features.byCategory !== "object" || Array.isArray(features.byCategory)) {
    throw new TypeError("classifyGPAI(): features must be an ExtractedFeatures object with input:string and byCategory:object (call extractFeatures() first).");
  }
  const lex = features.byCategory[LEXICON_GROUP3] ?? {};
  const triggers = {
    named_foundation_model: false,
    generic_foundation_model_phrasing: false,
    systemic_risk_markers: false
  };
  for (const [cat, triggerKey] of Object.entries(CATEGORY_TO_TRIGGER)) {
    const matched = lex[cat];
    if (Array.isArray(matched) && matched.length > 0) {
      triggers[triggerKey] = true;
    }
  }
  const article_53_applicable = triggers.named_foundation_model || triggers.generic_foundation_model_phrasing;
  const article_55_applicable = article_53_applicable && triggers.systemic_risk_markers;
  let summary_en = CHAPEAU_53_EN;
  let summary_de = CHAPEAU_53_DE;
  if (article_55_applicable) {
    summary_en = `${CHAPEAU_53_EN} ${CHAPEAU_55_EN}`;
    summary_de = `${CHAPEAU_53_DE} ${CHAPEAU_55_DE}`;
  }
  return {
    article_53_applicable,
    article_55_applicable,
    triggered_by: triggers,
    summary_en,
    summary_de,
    source: EUR_LEX_SOURCE9
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/rules/three-category.js
import { readFileSync as readFileSync3 } from "node:fs";
import { fileURLToPath as fileURLToPath3 } from "node:url";
import { dirname as dirname4, join as join5 } from "node:path";
var __filename3 = fileURLToPath3(new URL("./engine/dist/rules/three-category.js", import.meta.url).href);
var __dirname3 = dirname4(__filename3);
var DATA_DIR3 = join5(__dirname3, "..", "data");
var GEN_FILE_LABEL = "src/data/three-category.gen.json";
var SOURCE_FILE_LABEL = "lucairn-website/compliance/checklist-content.ts";
function loadGenJson() {
  const path = join5(DATA_DIR3, "three-category.gen.json");
  const raw = readFileSync3(path, "utf8");
  return JSON.parse(raw);
}
var GEN = loadGenJson();
function aggregateCategory(catKey, applicabilityPairs) {
  const cat = GEN.categories[catKey];
  const requiredArticles = [...cat.required_articles].sort((a, b) => a - b);
  const applicableNums = applicabilityPairs.filter(([, applicable2]) => applicable2).map(([n]) => n);
  const triggered2 = requiredArticles.filter((n) => applicableNums.includes(n));
  const triggeredSorted = [...triggered2].sort((a, b) => a - b);
  const applicable = requiredArticles.length === triggeredSorted.length;
  return {
    key: catKey,
    applicable,
    triggered_articles: triggeredSorted,
    required_articles: requiredArticles,
    title_en: cat.title_en,
    title_de: cat.title_de,
    items: cat.items.map((it) => ({
      number: it.number,
      text_en: it.text_en,
      text_de: it.text_de
    }))
  };
}
function classifyThreeCategory(annex, article5, article10, article12, article14, article15) {
  if (annex === null || typeof annex !== "object" || Array.isArray(annex) || !Array.isArray(annex.domains) || typeof annex.suppressed_by_article_5 !== "boolean") {
    throw new TypeError("classifyThreeCategory(): annex must be an AnnexIIIResult object with a domains array and suppressed_by_article_5 boolean (call classifyAnnexIII() first).");
  }
  if (article5 === null || typeof article5 !== "object" || Array.isArray(article5) || typeof article5.prohibited !== "boolean") {
    throw new TypeError("classifyThreeCategory(): article5 must be an Article5Result object with a prohibited boolean (call classifyArticle5() first).");
  }
  const articleArgs = [
    ["article10", article10],
    ["article12", article12],
    ["article14", article14],
    ["article15", article15]
  ];
  for (const [name, value] of articleArgs) {
    if (value === null || typeof value !== "object" || Array.isArray(value) || typeof value.applicable !== "boolean") {
      throw new TypeError(`classifyThreeCategory(): ${name} must be a result object with an applicable boolean (call the corresponding classify*() first).`);
    }
  }
  if (article5.prohibited !== annex.suppressed_by_article_5) {
    throw new Error("classifyThreeCategory(): inconsistent upstream state (article5.prohibited !== annex.suppressed_by_article_5). Re-run classifyAnnexIII(features, article5) to refresh.");
  }
  const cat1 = aggregateCategory("1", [
    [10, article10.applicable],
    [15, article15.applicable]
  ]);
  const cat2 = aggregateCategory("2", [
    [12, article12.applicable],
    [14, article14.applicable]
  ]);
  const cat3 = aggregateCategory("3", [
    [10, article10.applicable],
    [12, article12.applicable],
    [14, article14.applicable],
    [15, article15.applicable]
  ]);
  const applicable_categories = ["1", "2", "3"].filter((k) => {
    if (k === "1")
      return cat1.applicable;
    if (k === "2")
      return cat2.applicable;
    return cat3.applicable;
  });
  return {
    categories: {
      "1": cat1,
      "2": cat2,
      "3": cat3
    },
    applicable_categories,
    disclaimer_en: GEN.disclaimer_en,
    disclaimer_de: GEN.disclaimer_de,
    source: {
      generated_file: GEN_FILE_LABEL,
      source_file: SOURCE_FILE_LABEL,
      version: GEN.version
    }
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/util/rules-hash.js
import { readFileSync as readFileSync4 } from "node:fs";
import { createHash as createHash2 } from "node:crypto";
import { fileURLToPath as fileURLToPath4 } from "node:url";
import { dirname as dirname5, join as join6 } from "node:path";
var __filename4 = fileURLToPath4(new URL("./engine/dist/util/rules-hash.js", import.meta.url).href);
var __dirname4 = dirname5(__filename4);
var DATA_DIR4 = join6(__dirname4, "..", "data");
var RULES_HASH_FILES = [
  "annex-iii.json",
  "patterns.de.json",
  "patterns.en.json",
  "three-category.gen.json"
];
function computeRulesHash() {
  const hasher = createHash2("sha256");
  const sorted = [...RULES_HASH_FILES].sort();
  for (const filename of sorted) {
    const bytes = readFileSync4(join6(DATA_DIR4, filename));
    hasher.update(filename);
    hasher.update("\0");
    hasher.update(bytes);
    hasher.update("\0");
  }
  const full = hasher.digest("hex");
  return { full, short: full.slice(0, 8) };
}
function loadRulesVersion() {
  const pkgPath = join6(__dirname4, "..", "..", "package.json");
  const pkg = JSON.parse(readFileSync4(pkgPath, "utf8"));
  return `v${pkg.version}`;
}
var { full: RULES_HASH_FULL, short: RULES_HASH_SHORT } = computeRulesHash();
var RULES_VERSION = loadRulesVersion();
var RULES_HASH = RULES_HASH_SHORT;
var RULES_HASH_FULL_HEX = RULES_HASH_FULL;

// node_modules/@lucairn/ai-act-classifier/dist/util/negated-hits.js
var ART50_PARAGRAPH = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 4
};
function negatedHitRef(group, category, locale = "en") {
  const de = locale === "de";
  const lead = category.split("_")[0] ?? "";
  switch (group) {
    case "article_5_prohibited":
      return /^[a-h]$/.test(lead) ? de ? `Art. 5 Abs. 1 Buchst. ${lead}` : `Art 5(1)(${lead})` : de ? "Art. 5" : "Art 5";
    case "annex_iii":
      return /^[1-8]$/.test(lead) ? de ? `Anhang III Nr. ${lead}` : `Annex III.${lead}` : de ? "Anhang III" : "Annex III";
    case "article_50_gpai": {
      const p = ART50_PARAGRAPH[lead];
      if (p === void 0)
        return de ? "Art. 50" : "Art 50";
      return de ? `Art. 50 Abs. ${p}` : `Art 50(${p})`;
    }
    case "article_4_ai_literacy":
      return de ? "Art. 4" : "Art 4";
    case "gpai_models":
      return category === "systemic_risk_markers" ? de ? "Art. 55" : "Art 55" : de ? "Art. 53" : "Art 53";
    case "scope_qualifiers":
      return de ? "Anwendungsbereich" : "scope qualifier";
    default:
      return `${group}/${category}`;
  }
}
function toNegatedHitResults(hits) {
  if (hits === void 0)
    return [];
  return hits.map((h) => ({
    phrase: h.phrase,
    ref: negatedHitRef(h.group, h.category, "en"),
    cue: h.cue,
    group: h.group,
    category: h.category,
    source: h.source
  }));
}

// node_modules/@lucairn/ai-act-classifier/dist/classify.js
function computeConfidence(features) {
  const baseline = 0.4;
  const perHit = 0.04;
  const langBonus = features.langConfident ? 0.08 : 0;
  const raw = baseline + perHit * features.hits.length + langBonus;
  const clamped = Math.min(0.99, Math.max(0.2, raw));
  return Number(clamped.toFixed(2));
}
async function classify(text, opts = {}) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new TypeError("classify(): input text must be a non-empty string.");
  }
  if (opts.rulesVersion !== void 0 && opts.rulesVersion !== RULES_VERSION) {
    throw new Error(`classify(): rules_version mismatch \u2014 requested "${opts.rulesVersion}", current "${RULES_VERSION}".`);
  }
  const features = opts.llm !== void 0 ? await extractFeaturesLLM(text, {
    provider: opts.llm,
    ...opts.lang !== void 0 ? { lang: opts.lang } : {},
    ...opts.cache !== void 0 ? { cache: opts.cache } : {}
  }) : extractFeatures(text, opts.lang !== void 0 ? { lang: opts.lang } : {});
  const article_5 = classifyArticle5(features);
  const annex_iii = classifyAnnexIII(features, article_5);
  const article_10 = classifyArticle10(annex_iii, article_5);
  const article_12 = classifyArticle12(annex_iii, article_5);
  const article_13 = classifyArticle13(annex_iii, article_5);
  const article_14 = classifyArticle14(annex_iii, article_5);
  const article_15 = classifyArticle15(annex_iii, article_5);
  const article_50 = classifyArticle50(features, article_5, annex_iii);
  const article_4 = classifyArticle4(features);
  const gpai = classifyGPAI(features);
  const three_category = opts.threeCategory === false ? null : classifyThreeCategory(annex_iii, article_5, article_10, article_12, article_14, article_15);
  const annex_iv_required = annex_iii.high_risk && !annex_iii.suppressed_by_article_5;
  const confidence = computeConfidence(features);
  const mode = opts.llm !== void 0 ? `llm-${opts.llm}` : "deterministic";
  return {
    input_text: text,
    detected_lang: features.lang,
    lang_confident: features.langConfident,
    rules_version: RULES_VERSION,
    rules_hash: RULES_HASH,
    rules_hash_full: RULES_HASH_FULL_HEX,
    mode,
    confidence,
    features,
    article_5,
    annex_iii,
    article_10,
    article_12,
    article_13,
    article_14,
    article_15,
    article_50,
    article_4,
    gpai,
    three_category,
    annex_iv_required,
    negated_hits: toNegatedHitResults(features.negatedHits)
  };
}

// node_modules/@lucairn/ai-act-classifier/dist/format/explain.js
import { fileURLToPath as fileURLToPath7 } from "node:url";
import { dirname as dirname8, join as join9 } from "node:path";

// node_modules/@lucairn/ai-act-classifier/dist/util/citations.js
import { readFileSync as readFileSync5 } from "node:fs";
import { fileURLToPath as fileURLToPath5 } from "node:url";
import { dirname as dirname6, join as join7 } from "node:path";
var __filename5 = fileURLToPath5(new URL("./engine/dist/util/citations.js", import.meta.url).href);
var __dirname5 = dirname6(__filename5);
var DATA_DIR5 = join7(__dirname5, "..", "data");
function loadCitations() {
  const path = join7(DATA_DIR5, "citations.json");
  const raw = readFileSync5(path, "utf8");
  return JSON.parse(raw);
}
var CITATIONS = loadCitations();

// node_modules/@lucairn/ai-act-classifier/dist/i18n/load.js
import { readFileSync as readFileSync6 } from "node:fs";
import { fileURLToPath as fileURLToPath6 } from "node:url";
import { dirname as dirname7, join as join8 } from "node:path";
var __filename6 = fileURLToPath6(new URL("./engine/dist/i18n/load.js", import.meta.url).href);
var __dirname6 = dirname7(__filename6);
var I18N_DIR = __dirname6;
function loadLocale(lang) {
  const path = join8(I18N_DIR, `${lang}.json`);
  const raw = readFileSync6(path, "utf8");
  const parsed = JSON.parse(raw);
  if (parsed.language !== lang) {
    throw new Error(`i18n/load: ${lang}.json claims language="${parsed.language}", expected "${lang}".`);
  }
  return parsed;
}
var LOCALES = {
  en: loadLocale("en"),
  de: loadLocale("de")
};

// node_modules/@lucairn/ai-act-classifier/dist/format/explain.js
var __filename7 = fileURLToPath7(new URL("./engine/dist/format/explain.js", import.meta.url).href);
var __dirname7 = dirname8(__filename7);
var EXCERPT_DIR = join9(__dirname7, "..", "content", "blog-excerpts");

// node_modules/@lucairn/ai-act-classifier/dist/data/citations.json
var citations_default = {
  _meta: {
    version: "v0.1.0",
    primary_source: "EUR-Lex Regulation (EU) 2024/1689",
    primary_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    primary_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    commentary_publisher: "Lucairn UG (haftungsbeschr\xE4nkt), N\xFCrnberg (HRB 46107 Amtsgericht N\xFCrnberg)",
    _provenance_notice: "regulation_text_mirror_* URLs point at the Future of Life Institute regulation-text mirror (artificialintelligenceact.eu) \u2014 Tier-3 third-party mirror per the citation tier scheme (Tier-1 = EUR-Lex + EU AI Office Service Desk at ai-act-service-desk.ec.europa.eu; Tier-2 = BSI + BfDI + Bitkom WG; Tier-3 = FLI mirror + ai-act-law.eu/de). All 9 per-article DE URLs verified live 2026-05-15. Lucairn commentary URLs source: lucairn.eu blog corpus (commentary, not regulator-authoritative). EUR-Lex HTML omits per-article anchors because EUR-Lex page-version anchors are inconsistent across page versions."
  },
  article_5: {
    label_en: "Article 5 \u2014 Prohibited AI practices",
    label_de: "Artikel 5 \u2014 Verbotene Praktiken im KI-Bereich",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/5/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/5/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  annex_iii: {
    label_en: "Article 6 + Annex III \u2014 High-risk AI systems",
    label_de: "Artikel 6 + Anhang III \u2014 Hochrisiko-KI-Systeme",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/6/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/6/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_10: {
    label_en: "Article 10 \u2014 Data and data governance",
    label_de: "Artikel 10 \u2014 Daten und Daten-Governance",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/10/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/10/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_12: {
    label_en: "Article 12 \u2014 Record-keeping",
    label_de: "Artikel 12 \u2014 Aufzeichnungspflichten",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/12/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/12/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_13: {
    label_en: "Article 13 \u2014 Transparency and provision of information to deployers",
    label_de: "Artikel 13 \u2014 Transparenz und Bereitstellung von Informationen f\xFCr die Betreiber",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/13/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/13/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_14: {
    label_en: "Article 14 \u2014 Human oversight",
    label_de: "Artikel 14 \u2014 Menschliche Aufsicht",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/14/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/14/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_15: {
    label_en: "Article 15 \u2014 Accuracy, robustness and cybersecurity",
    label_de: "Artikel 15 \u2014 Genauigkeit, Robustheit und Cybersicherheit",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/15/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/15/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_50: {
    label_en: "Article 50 \u2014 Transparency obligations for providers and deployers of certain AI systems",
    label_de: "Artikel 50 \u2014 Transparenzpflichten f\xFCr Anbieter und Betreiber bestimmter KI-Systeme",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/50/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/50/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  article_4: {
    label_en: "Article 4 \u2014 AI literacy",
    label_de: "Artikel 4 \u2014 KI-Kompetenz",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/4/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/4/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  gpai_articles_53_55: {
    label_en: "Articles 53 + 55 \u2014 General-purpose AI obligations + systemic risk",
    label_de: "Artikel 53 + 55 \u2014 Pflichten f\xFCr KI mit allgemeinem Verwendungszweck + systemische Risiken",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/article/53/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/article/53/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  },
  annex_iv: {
    label_en: "Annex IV \u2014 Technical documentation",
    label_de: "Anhang IV \u2014 Technische Dokumentation",
    eur_lex_html_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_html_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202401689",
    eur_lex_pdf_en: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689",
    eur_lex_pdf_de: "https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=OJ:L_202401689",
    regulation_text_mirror_en: "https://artificialintelligenceact.eu/annex/4/",
    regulation_text_mirror_de: "https://artificialintelligenceact.eu/de/annex/4/",
    lucairn_commentary_en: "https://lucairn.eu/en/blog/eu-ai-act-architecture-2026",
    lucairn_commentary_de: "https://lucairn.eu/de/blog/eu-ai-act-architecture-2026"
  }
};

// engine-meta:engine-package
var engine_package_default = { name: "@lucairn/ai-act-classifier", version: "0.4.0" };

// src/engine.mjs
var ENGINE_NAME = engine_package_default.name;
var ENGINE_VERSION = engine_package_default.version;
var CITATIONS2 = citations_default;
async function runEngine(text, lang) {
  return classify(text, { lang, threeCategory: false });
}
async function detectLanguage(text) {
  const r = await classify(text, { threeCategory: false });
  return r.detected_lang;
}

// src/text.mjs
var TOOL_URL = {
  en: "https://lucairn.eu/en/tools/ai-act-classifier",
  de: "https://lucairn.eu/de/tools/ai-act-classifier"
};
var CLASS_TEXT = {
  en: {
    prohibited: { badge: "possible prohibited practice", title: "Article 5 trigger matched (possible prohibited practice)" },
    "high-risk": { badge: "possible high-risk", title: "Annex III area matched (possible high-risk, Article 6)" },
    transparency: { badge: "possible transparency obligation", title: "Possible transparency obligation (Article 50)" },
    gpai: { badge: "GPAI", title: "Possible general-purpose AI model provider obligations (Article 53; Article 55 if systemic risk)" },
    "no-trigger": { badge: "no trigger found", title: "No trigger found" }
  },
  de: {
    prohibited: { badge: "m\xF6gliche verbotene Praktik", title: "Artikel-5-Ausl\xF6ser erkannt (m\xF6gliche verbotene Praktik)" },
    "high-risk": { badge: "m\xF6glicherweise Hochrisiko", title: "Anhang-III-Bereich erkannt (m\xF6glicherweise Hochrisiko, Artikel 6)" },
    transparency: { badge: "m\xF6gliche Transparenzpflicht", title: "M\xF6gliche Transparenzpflicht (Artikel 50)" },
    gpai: { badge: "GPAI", title: "M\xF6gliche Anbieterpflichten f\xFCr KI-Modelle mit allgemeinem Verwendungszweck (Artikel 53; Artikel 55 bei systemischem Risiko)" },
    "no-trigger": { badge: "kein Ausl\xF6ser gefunden", title: "Kein Ausl\xF6ser gefunden" }
  }
};
var CLASS_COLOR = {
  prohibited: "critical",
  "high-risk": "orange",
  transparency: "yellow",
  gpai: "blue",
  "no-trigger": "lightgrey"
};
var ART5_LETTER = {
  en: {
    a: "subliminal, manipulative or deceptive techniques",
    b: "exploitation of vulnerabilities",
    c: "evaluation or classification of persons based on social behaviour or personal characteristics",
    d: "risk assessment of committing a criminal offence based solely on profiling or personality traits",
    e: "untargeted scraping of facial images",
    f: "inferring emotions in the workplace and education institutions (except for medical or safety reasons)",
    g: "biometric categorisation inferring race, political opinions, trade union membership, religion or beliefs, sex life or sexual orientation",
    h: "real-time remote biometric identification in publicly accessible spaces for law enforcement"
  },
  de: {
    a: "unterschwellige, manipulative oder t\xE4uschende Techniken",
    b: "Ausnutzung von Schutzbed\xFCrftigkeit",
    c: "soziale Bewertung (Social Scoring)",
    d: "Risikobewertung f\xFCr das Begehen von Straftaten ausschlie\xDFlich auf Grundlage von Profiling oder Pers\xF6nlichkeitsmerkmalen",
    e: "ungezieltes Auslesen von Gesichtsbildern",
    f: "Ableitung von Emotionen am Arbeitsplatz und in Bildungseinrichtungen (au\xDFer aus medizinischen oder Sicherheitsgr\xFCnden)",
    g: "biometrische Kategorisierung zur Ableitung von Rasse, politischen Einstellungen, Gewerkschaftszugeh\xF6rigkeit, Religion oder Weltanschauung, Sexualleben oder sexueller Ausrichtung",
    h: "biometrische Echtzeit-Fernidentifizierung in \xF6ffentlich zug\xE4nglichen R\xE4umen zu Strafverfolgungszwecken"
  }
};
var ART50_PATH = {
  paragraph_1_interaction: {
    paragraph: 1,
    ref: { en: "Art. 50(1)", de: "Art. 50 Abs. 1" },
    en: "AI system interacting directly with natural persons",
    de: "KI-System, das direkt mit nat\xFCrlichen Personen interagiert"
  },
  paragraph_2_synthetic_content: {
    paragraph: 2,
    ref: { en: "Art. 50(2)", de: "Art. 50 Abs. 2" },
    en: "synthetic audio, image, video or text content",
    de: "synthetische Audio-, Bild-, Video- oder Textinhalte"
  },
  paragraph_3_emotion_or_biometric_categorisation: {
    paragraph: 3,
    ref: { en: "Art. 50(3)", de: "Art. 50 Abs. 3" },
    en: "emotion recognition or biometric categorisation system",
    de: "Emotionserkennungssystem oder System zur biometrischen Kategorisierung"
  },
  paragraph_4_deepfake: {
    paragraph: 4,
    ref: { en: "Art. 50(4)", de: "Art. 50 Abs. 4" },
    en: "deep fake",
    de: "Deepfake"
  },
  paragraph_4_public_interest_text: {
    paragraph: 4,
    ref: { en: "Art. 50(4)", de: "Art. 50 Abs. 4" },
    en: "text published to inform the public on matters of public interest",
    de: "Text, der ver\xF6ffentlicht wird, um die \xD6ffentlichkeit \xFCber Angelegenheiten von \xF6ffentlichem Interesse zu informieren"
  }
};
var UI = {
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
    noTrigger: "No trigger found: the description matched no Article 5, Annex III, Article 50 or Article 53 / 55 phrase in the engine's lexicon. This is not a statement that no obligation applies.",
    obligations: "Obligations the engine lists for this possible high-risk result",
    caveats: "Read this before you rely on it",
    disclaimer: "Informational tool \u2014 not legal advice. Use as a starting point; verify with your DPO and qualified counsel before acting on any classification.",
    engineNote: "Deterministic keyword rules engine: it matches your wording against a curated lexicon. A description that avoids the lexicon's vocabulary can miss a trigger, and negated or unusual wording can be misread. The 98.8% on 71 test cases measures consistency with the curated lexicon, not real-world accuracy.",
    notFinal: "A keyword match is not a final classification: Article 6(3) and Article 5 exceptions are not assessed.",
    localNote: "The classification itself makes no network requests and reads no tokens. Its results, the file path and the matched phrases appear in the job summary and logs, which GitHub stores as usual.",
    negNote: "Found, but the text appears to deny it \u2014 please check",
    negCue: "negation",
    links: "EUR-Lex links open the full Regulation (EU) 2024/1689; the article is named next to each link.",
    share: "Share this result",
    shareText: "run the same check in the browser on lucairn.eu",
    engine: "Engine",
    rules: "rules"
  },
  de: {
    heading: "EU-KI-Verordnung: Einordnung",
    result: "Risikoklasse",
    source: "Quelle",
    language: "Sprache",
    fired: "Was ausgel\xF6st hat",
    colRef: "Fundstelle",
    colWhat: "Worum es geht",
    colPhrases: "Gefundene Begriffe",
    colSource: "Quelle",
    noTrigger: "Kein Ausl\xF6ser gefunden: Die Beschreibung enthielt keinen Begriff aus dem Lexikon der Engine zu Artikel 5, Anhang III, Artikel 50 oder Artikel 53 / 55. Das ist keine Aussage, dass keine Pflicht gilt.",
    obligations: "Pflichten, die die Engine f\xFCr dieses m\xF6gliche Hochrisiko-Ergebnis auflistet",
    caveats: "Bitte vor der Verwendung lesen",
    disclaimer: "Informationswerkzeug \u2014 keine Rechtsberatung. Als Ausgangspunkt verwenden; vor jeder compliance-relevanten Entscheidung mit Ihrer DSB und qualifizierter juristischer Beratung verifizieren.",
    engineNote: "Deterministische Schl\xFCsselwort-Regel-Engine: Sie gleicht Ihre Formulierung mit einem kuratierten Lexikon ab. Eine Beschreibung, die das Vokabular des Lexikons vermeidet, kann einen Ausl\xF6ser verfehlen, und verneinte oder ungew\xF6hnliche Formulierungen k\xF6nnen falsch gelesen werden. Die 98,8 % auf 71 Testf\xE4llen messen die Konsistenz mit dem kuratierten Lexikon, nicht die Genauigkeit in der realen Welt.",
    notFinal: "Ein Stichwort-Treffer ist keine abschlie\xDFende Einstufung: Ausnahmen nach Artikel 6 Absatz 3 und Artikel 5 werden nicht gepr\xFCft.",
    localNote: "Die Einordnung selbst stellt keine Netzwerkanfragen und liest keine Tokens. Ergebnis, Dateipfad und gefundene Phrasen erscheinen in der Job-Zusammenfassung und im Log, die GitHub wie \xFCblich speichert.",
    negNote: "Gefunden, aber der Text scheint es zu verneinen \u2014 bitte pr\xFCfen",
    negCue: "Verneinung",
    links: "EUR-Lex-Links \xF6ffnen die gesamte Verordnung (EU) 2024/1689; der Artikel steht jeweils daneben.",
    share: "Ergebnis teilen",
    shareText: "dieselbe Pr\xFCfung im Browser auf lucairn.eu ausf\xFChren",
    engine: "Engine",
    rules: "Regeln"
  }
};

// src/render.mjs
function riskClass(r) {
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
  return lang === "de" ? `Anhang III Nr. ${d.annex_iii_number}${d.sub_letters.length ? ` Buchst. ${d.sub_letters.join(", ")}` : ""}` : `Annex III point ${d.annex_iii_number}${sub}`;
}
function findings(r, citations, lang) {
  const rows = [];
  for (const h of r.article_5.hits) {
    rows.push({
      group: "article_5",
      key: `a5:${h.letter}`,
      ref: lang === "de" ? `Art. 5 Abs. 1 Buchst. ${h.letter}` : `Art. 5(1)(${h.letter})`,
      what: ART5_LETTER[lang][h.letter] ?? h.category_key,
      phrases: h.matched_phrases,
      url: eurLex(citations, "article_5", lang)
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
        url: eurLex(citations, "annex_iii", lang)
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
      url: eurLex(citations, "article_50", lang)
    });
  }
  if (r.gpai.article_53_applicable) {
    rows.push({
      group: "gpai",
      key: "a53",
      ref: "Art. 53",
      what: lang === "de" ? "Pflichten f\xFCr Anbieter von KI-Modellen mit allgemeinem Verwendungszweck" : "obligations for providers of general-purpose AI models",
      phrases: [],
      url: eurLex(citations, "gpai_articles_53_55", lang)
    });
  }
  if (r.gpai.article_55_applicable) {
    rows.push({
      group: "gpai",
      key: "a55",
      ref: "Art. 55",
      what: lang === "de" ? "KI-Modelle mit allgemeinem Verwendungszweck mit systemischem Risiko" : "general-purpose AI models with systemic risk",
      phrases: [],
      url: eurLex(citations, "gpai_articles_53_55", lang)
    });
  }
  return rows;
}
function triggered(r, citations) {
  const out = { article_5: [], annex_iii: [], article_50: [], gpai: [] };
  for (const f of findings(r, citations, "en")) out[f.group].push(f.ref);
  out.article_50 = [...new Set(out.article_50)];
  return out;
}
function obligations(r, citations, lang) {
  const rows = [];
  for (const key of ["article_10", "article_12", "article_13", "article_14", "article_15"]) {
    if (r[key] && r[key].applicable) rows.push({ label: citations[key][lang === "de" ? "label_de" : "label_en"], url: eurLex(citations, key, lang) });
  }
  if (r.annex_iv_required) {
    rows.push({
      label: lang === "de" ? "Artikel 11 / Anhang IV (technische Dokumentation)" : "Article 11 / Annex IV (technical documentation)",
      url: eurLex(citations, "annex_iv", lang)
    });
  }
  return rows;
}
var BADGE_LABELS = /* @__PURE__ */ new Set(["EU AI Act", "EU-KI-VO"]);
function isPreviousBadge(buf) {
  let b;
  try {
    b = JSON.parse(Buffer.from(buf).toString("utf8"));
  } catch {
    return false;
  }
  return !!b && typeof b === "object" && !Array.isArray(b) && b.schemaVersion === 1 && BADGE_LABELS.has(b.label) && typeof b.message === "string" && typeof b.color === "string" && Object.keys(b).every((k) => ["schemaVersion", "label", "message", "color"].includes(k));
}
function badge(cls, lang) {
  return {
    schemaVersion: 1,
    label: lang === "de" ? "EU-KI-VO" : "EU AI Act",
    message: CLASS_TEXT[lang][cls].badge,
    color: CLASS_COLOR[cls]
  };
}
var CONTROL2 = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;
function codeSpan(value, { table = false } = {}) {
  let v = String(value).replace(/\r\n|\r|\n/g, " ").replace(CONTROL2, "\uFFFD");
  if (table) {
    v = v.replace(/\|/g, "\\|");
  }
  if (v === "") v = " ";
  const longest = Math.max(0, ...(v.match(/`+/g) || []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  const pad = /^[` ]|[` ]$/.test(v) ? " " : "";
  return `${fence}${pad}${v}${pad}${fence}`;
}
function mdText(value) {
  return String(value).replace(/\r\n|\r|\n/g, " ").replace(CONTROL2, "\uFFFD").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[\\`*_[\]|~]/g, (c) => `\\${c}`);
}
var ART50_PARAGRAPH2 = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 4 };
function negatedKey(h) {
  const lead = String(h.category || "").split("_")[0];
  switch (h.group) {
    case "article_5_prohibited":
      return /^[a-h]$/.test(lead) ? `a5:${lead}` : "a5";
    case "annex_iii":
      return /^[1-8]$/.test(lead) ? `a3:${lead}` : "a3";
    case "article_50_gpai":
      return ART50_PARAGRAPH2[lead] ? `a50:${ART50_PARAGRAPH2[lead]}` : "a50";
    case "gpai_models":
      return h.category === "systemic_risk_markers" ? "a55" : "a53";
    default:
      return `other:${h.group}`;
  }
}
function negatedRef(h, lang) {
  const de = lang === "de";
  const lead = String(h.category || "").split("_")[0];
  switch (h.group) {
    case "article_5_prohibited":
      return /^[a-h]$/.test(lead) ? de ? `Art. 5 Abs. 1 Buchst. ${lead}` : `Art. 5(1)(${lead})` : "Art. 5";
    case "annex_iii":
      return /^[1-8]$/.test(lead) ? de ? `Anhang III Nr. ${lead}` : `Annex III point ${lead}` : de ? "Anhang III" : "Annex III";
    case "article_50_gpai":
      return ART50_PARAGRAPH2[lead] ? de ? `Art. 50 Abs. ${ART50_PARAGRAPH2[lead]}` : `Art. 50(${ART50_PARAGRAPH2[lead]})` : "Art. 50";
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
var cell = (s) => mdText(s);
function summaryMarkdown({ r, cls, citations, lang, sourcePath, engine }) {
  const t = UI[lang];
  const c = CLASS_TEXT[lang][cls];
  const rows = findings(r, citations, lang);
  const L = [];
  L.push(`## ${t.heading}: ${c.title}`, "");
  L.push(`**${t.result}:** ${codeSpan(c.badge)} \xB7 **${t.source}:** ${codeSpan(sourcePath)} \xB7 **${t.language}:** ${mdText(r.detected_lang)}`, "");
  const pending = [...r.negated_hits || []];
  const takeNotes = (key) => {
    const mine = pending.filter((h) => negatedKey(h) === key);
    for (const h of mine) pending.splice(pending.indexOf(h), 1);
    return mine;
  };
  if (rows.length) {
    L.push(`### ${t.fired}`, "", `| ${t.colRef} | ${t.colWhat} | ${t.colPhrases} | ${t.colSource} |`, "|---|---|---|---|");
    for (const f of rows) {
      const phrases = f.phrases.length ? f.phrases.map((p) => codeSpan(p, { table: true })).join(", ") : "\u2014";
      L.push(`| ${f.ref} | ${cell(f.what)} | ${phrases} | [EUR-Lex](${f.url}) |`);
      for (const h of takeNotes(f.key)) L.push(`| \u21B3 | ${negationLine(h, t, true)} | | |`);
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
  L.push(`**[${t.share}](${TOOL_URL[lang]})** \u2014 ${t.shareText}.`, "");
  L.push(`<sub>${t.engine}: ${engine.name} v${engine.version} \xB7 ${t.rules} ${r.rules_version} (${r.rules_hash})</sub>`, "");
  return L.join("\n");
}

// src/main.mjs
function input(name, fallback) {
  const v = process.env[`INPUT_${name.toUpperCase()}`];
  return v === void 0 || v.trim() === "" ? fallback : v.trim();
}
function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const delim = `ghadelim_${randomUUID2()}`;
  const v = String(value);
  if (v.includes(delim) || /[\r\n]/.test(v)) throw new SafeError(`Output "${name}" contains a line break; refusing to write it.`);
  appendFileSync(file, `${name}<<${delim}
${v}
${delim}
`);
}
function choice(name, value, allowed) {
  if (!allowed.includes(value)) throw new SafeError(`Input "${name}" must be one of ${allowed.join(", ")}; got "${displayText(value)}".`);
  return value;
}
async function main() {
  delete process.env.LOG_TOKENS;
  delete process.env.LOG_STREAM;
  const cwd = process.env.GITHUB_WORKSPACE || process.cwd();
  const root = workspaceRoot(cwd);
  const lang = choice("lang", input("lang", "en").toLowerCase(), ["en", "de"]);
  const failOn = choice("fail-on", input("fail-on", "none").toLowerCase(), ["none", "prohibited", "high-risk"]);
  const badgeRaw = process.env["INPUT_BADGE-PATH"];
  const badgePath = badgeRaw === void 0 ? ".github/ai-act-badge.json" : badgeRaw.trim();
  const { rel, abs } = locateDescription(input("path", "ai-system.md"), root);
  const text = readDescription(abs, rel);
  const shownRel = displayText(rel);
  const detected = await detectLanguage(text);
  if (detected !== lang) {
    warning(`${shownRel} looks like "${detected}" text but lang is "${lang}". The engine matches against the ${lang} lexicon only; set lang: ${detected} if the description is in that language.`);
  }
  const r = await runEngine(text, lang);
  const cls = riskClass(r);
  const trig = triggered(r, CITATIONS2);
  const engine = { name: ENGINE_NAME, version: ENGINE_VERSION };
  const md = summaryMarkdown({ r, cls, citations: CITATIONS2, lang, sourcePath: rel, engine });
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
  let badgeAbs = "";
  if (badgePath) {
    writeContained(root, badgePath, "badge-path", JSON.stringify(badge(cls, lang), null, 2) + "\n", { mayOverwrite: isPreviousBadge });
    badgeAbs = resolve2(cwd, badgePath);
  }
  setOutput("risk-class", cls);
  setOutput("triggered", JSON.stringify(trig));
  setOutput("badge-path", badgeAbs);
  setOutput("engine-version", ENGINE_VERSION);
  info(`EU AI Act check: ${cls} (${CLASS_TEXT[lang][cls].badge}) from ${shownRel}; engine ${ENGINE_NAME} v${ENGINE_VERSION}`);
  info(`triggered: ${JSON.stringify(trig)}`);
  if (badgeAbs) info(`badge JSON: ${displayText(badgeAbs)}`);
  const fail5 = failOn === "prohibited" && cls === "prohibited" || failOn === "high-risk" && (cls === "prohibited" || cls === "high-risk");
  if (fail5) {
    error(`EU AI Act check found "${cls}" and fail-on is "${failOn}".`);
    process.exitCode = 1;
  }
}
main().catch((e) => {
  const msg = e && e.message ? e.message : String(e);
  error(e instanceof SafeError ? msg : displayText(msg));
  process.exitCode = 1;
});
