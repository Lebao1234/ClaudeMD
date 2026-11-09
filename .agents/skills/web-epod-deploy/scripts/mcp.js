// Client MCP-over-HTTP tối giản cho ePod (https://mcp.epodsystem.com/mcp), dùng chung cho mọi site trong website/.
// Token: biến EPOD_MCP_TOKEN_<TÊN_THƯ_MỤC> nếu có, không thì đọc Authorization trong website/<site>/.mcp.json.
//   node .agents/skills/web-epod-deploy/scripts/mcp.js website/<Du-an>                # liệt kê tool
//   node .agents/skills/web-epod-deploy/scripts/mcp.js website/<Du-an> get_context '{}'
"use strict";
const https = require("https");
const fs = require("fs");
const path = require("path");

const URL_ = "https://mcp.epodsystem.com/mcp";

function tokenOf(siteDir) {
  const env = "EPOD_MCP_TOKEN_" + path.basename(path.resolve(siteDir)).toUpperCase().replace(/[^A-Z0-9]/g, "_");
  if (process.env[env]) return process.env[env];
  const file = path.join(siteDir, ".mcp.json");
  if (!fs.existsSync(file)) throw new Error(`Thiếu ${file} và biến ${env} (skill web-project-scaffold: ensure-mcp.js)`);
  const auth = (((JSON.parse(fs.readFileSync(file, "utf8")).mcpServers || {}).epodsystem || {}).headers || {}).Authorization || "";
  const t = auth.replace(/^Bearer\s+/, "").replace(/^\{/, "").replace(/\}$/, "");
  if (!t || /TOKEN|<|\.\.\./i.test(t)) throw new Error(`Token ePod trong ${file} còn để giữ chỗ: dán token thật hoặc đặt biến ${env}`);
  return t;
}

function createClient(siteDir) {
  const TOKEN = tokenOf(siteDir);
  let session = null, id = 0;
  function post(body) {
    return new Promise((res, rej) => {
      const u = new URL(URL_), data = JSON.stringify(body);
      const headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream", Authorization: "Bearer " + TOKEN, "Content-Length": Buffer.byteLength(data) };
      if (session) headers["mcp-session-id"] = session;
      const req = https.request({ hostname: u.hostname, path: u.pathname, method: "POST", headers }, (r) => {
        if (r.headers["mcp-session-id"]) session = r.headers["mcp-session-id"];
        let s = "";
        r.on("data", (c) => (s += c));
        r.on("end", () => {
          // trả lời dạng SSE: lấy sự kiện "data:" đầu tiên đọc được JSON
          const events = []; let buf = [];
          s.split("\n").forEach((l) => {
            const t = l.replace(/\r$/, "");
            if (t.startsWith("data:")) buf.push(t.slice(t[5] === " " ? 6 : 5));
            else if (t === "" && buf.length) { events.push(buf.join("\n")); buf = []; }
          });
          if (buf.length) events.push(buf.join("\n"));
          for (const e of events) { try { return res(JSON.parse(e)); } catch { /* sự kiện khác */ } }
          res(s ? { raw: s } : {});
        });
      });
      req.on("error", rej);
      req.end(data);
    });
  }
  async function init() {
    await post({ jsonrpc: "2.0", id: ++id, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "web-epod-deploy", version: "1" } } });
    await post({ jsonrpc: "2.0", method: "notifications/initialized" });
  }
  async function listTools() {
    const r = await post({ jsonrpc: "2.0", id: ++id, method: "tools/list", params: {} });
    return (r.result && r.result.tools) || [];
  }
  async function call(name, args) {
    const r = await post({ jsonrpc: "2.0", id: ++id, method: "tools/call", params: { name, arguments: args || {} } });
    if (r.error) return { ERROR: r.error.message || r.error };
    const txt = ((r.result && r.result.content) || []).map((x) => x.text || "").join("\n");
    try { return JSON.parse(txt); } catch { /* có thể có chữ quanh JSON */ }
    const s = txt.indexOf("{");
    if (s >= 0 && txt.trimStart()[0] === "{") {
      let depth = 0, inStr = false, esc = false;
      for (let i = s; i < txt.length; i++) {
        const c = txt[i];
        if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; }
        else if (c === '"') inStr = true;
        else if (c === "{") depth++;
        else if (c === "}" && --depth === 0) { try { return JSON.parse(txt.slice(s, i + 1)); } catch { break; } }
      }
    }
    return txt;
  }
  const callRaw = (name, args) => post({ jsonrpc: "2.0", id: ++id, method: "tools/call", params: { name, arguments: args || {} } });
  return { init, call, callRaw, listTools };
}

module.exports = { createClient, tokenOf };

if (require.main === module) {
  (async () => {
    const [, , siteDir, tool, json] = process.argv;
    if (!siteDir) { console.log("Dùng: mcp.js website/<Du-an> [tool] [json]"); process.exit(1); }
    const m = createClient(siteDir);
    await m.init();
    if (!tool) (await m.listTools()).forEach((t) => console.log(`- ${t.name}: ${(t.description || "").slice(0, 90)}`));
    else console.log(JSON.stringify(await m.call(tool, json ? JSON.parse(json) : {}), null, 2));
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
