// Preloaded with `node --import` in the tests. Any attempt to open a network
// connection or resolve a host name writes a marker file and throws, so a test
// can prove the action ran without touching the network.

import { writeFileSync } from "node:fs";
import net from "node:net";
import tls from "node:tls";
import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import { syncBuiltinESMExports } from "node:module";

const marker = process.env.NO_NETWORK_MARKER;
function blocked(what) {
  return function () {
    if (marker) writeFileSync(marker, `${what}\n`, { flag: "a" });
    throw new Error(`network access blocked in test: ${what}`);
  };
}

net.Socket.prototype.connect = blocked("net.Socket.connect");
net.connect = net.createConnection = blocked("net.connect");
tls.connect = blocked("tls.connect");
dns.lookup = blocked("dns.lookup");
dns.resolve = blocked("dns.resolve");
dns.promises.lookup = blocked("dns.promises.lookup");
dns.promises.resolve = blocked("dns.promises.resolve");
http.request = http.get = blocked("http.request");
https.request = https.get = blocked("https.request");
globalThis.fetch = blocked("fetch");
if (globalThis.WebSocket) globalThis.WebSocket = blocked("WebSocket");

// Propagate the patches to `import { x } from "node:…"` namespaces too.
syncBuiltinESMExports();
