#!/usr/bin/env node
/*
 * web-project-scaffold / ensure-mcp: đảm bảo website/<Du-an>/.mcp.json có khóa "epodsystem" đúng chuẩn
 * (frontend-themes/templates/mcp.template.json). Token có hai cách, cả hai đều hợp lệ:
 * - ghi thẳng trong website/<Du-an>/.mcp.json (website/ bị gitignore, không push);
 * - biến môi trường EPOD_MCP_TOKEN_<TÊN_THƯ_MỤC> (chữ hoa, ký tự khác chữ/số thành "_").
 *
 *   node ensure-mcp.js <thư-mục-dự-án> | --all  [--dry-run] [--fix] [--json]
 *
 * - Chưa có file: tạo từ template (dùng biến).    → "tạo mới"
 * - Có file, epodsystem đúng chuẩn (token trong file hoặc biến) → "đã đúng"
 * - Có file, chưa có epodsystem: thêm, giữ server khác → "đã hợp nhất"
 * - Chỉ thiếu token (giữ chỗ {} hoặc rỗng):        → "cần token"
 * - epodsystem khác chuẩn, JSON lỗi:              → "cần xem lại" (không ghi)
 *   --fix: thay epodsystem bằng bản chuẩn, giữ server khác và giữ token đang có trong file.
 * - Cột "Token": "trong file" / "biến" / "chưa có". Không in giá trị token.
 * Thoát mã 1 nếu còn mục "cần xem lại" hoặc "cần token".
 */
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => [a.slice(2), true]));
const target = args.find((a) => !a.startsWith("--"));
const ROOT = path.join(__dirname, "..", "..", "..", "..");
const WEBSITE = path.join(ROOT, "website");
const TEMPLATE = path.join(ROOT, "frontend-themes", "templates", "mcp.template.json");
const TPL = fs.readFileSync(TEMPLATE, "utf8");
/* Tên biến của dự án; template dùng chỗ giữ EPOD_MCP_TOKEN_DU_AN */
const envName = (project) => "EPOD_MCP_TOKEN_" + project.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
const stdFor = (project) => JSON.parse(TPL.replace(/EPOD_MCP_TOKEN_DU_AN/g, envName(project))).mcpServers.epodsystem;

if (!opt.all && !target) {
  console.error("Cách dùng: node ensure-mcp.js <thư-mục-dự-án> | --all  [--dry-run] [--fix] [--json]");
  process.exit(2);
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/* Token thật ghi trong file: "Bearer crmk_..." hoặc "Bearer {crmk_...}" */
const hasToken = (ep) => /^Bearer\s+(?!\$\{)\{?[^{}\s]{8,}\}?$/.test((ep && ep.headers && ep.headers.Authorization) || "");
/* Bản chuẩn nhưng giữ token đang có trong file */
const withToken = (STD, cur) => (hasToken(cur) ? { ...STD, headers: { ...STD.headers, Authorization: cur.headers.Authorization } } : STD);
const NO_TOKEN = "Authorization chưa có token";
function diffKeys(cur, STD) {
  const d = [];
  if (!cur || typeof cur !== "object") return ["không phải object"];
  for (const k of new Set(Object.keys(STD).concat(Object.keys(cur)))) {
    if (k === "headers") {
      const h = cur.headers || {};
      for (const hk of new Set(Object.keys(STD.headers).concat(Object.keys(h)))) {
        if (h[hk] !== STD.headers[hk]) d.push(hk === "Authorization" ? NO_TOKEN : `headers.${hk} khác`);
      }
    } else if (!same(cur[k], STD[k])) d.push(k in STD ? (k in cur ? `${k} khác` : `thiếu ${k}`) : `thừa ${k}`);
  }
  return d;
}

function processProject(dir) {
  const name = path.basename(dir);
  const file = path.join(dir, ".mcp.json");
  const STD = stdFor(name);
  const r = { project: name, env: envName(name), action: "", token: "chưa có", detail: "", wrote: false };
  const write = (obj) => { if (!opt["dry-run"]) { fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8"); r.wrote = true; } };

  if (!fs.existsSync(file)) {
    r.action = "tạo mới"; r.token = "biến"; r.detail = `dán token vào file hoặc đặt biến ${r.env}`;
    write({ mcpServers: { epodsystem: STD } });
    return r;
  }
  let obj;
  try { obj = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) {
    r.action = "cần xem lại"; r.detail = `JSON lỗi: ${e.message}`; return r;
  }
  if (!obj.mcpServers || typeof obj.mcpServers !== "object") {
    r.action = "cần xem lại"; r.detail = "không có mcpServers"; return r;
  }
  const others = Object.keys(obj.mcpServers).filter((k) => k !== "epodsystem");
  const keep = others.length ? ` (giữ: ${others.join(", ")})` : "";
  const cur = obj.mcpServers.epodsystem;
  const want = withToken(STD, cur);
  if (cur !== undefined) r.token = hasToken(cur) ? "trong file" : same(cur, STD) ? "biến" : "chưa có";
  if (cur === undefined) {
    r.action = "đã hợp nhất"; r.token = "biến"; r.detail = "thêm epodsystem" + keep;
    obj.mcpServers.epodsystem = STD; write(obj);
  } else if (same(cur, want)) {
    r.action = "đã đúng"; r.detail = keep.trim();
  } else if (diffKeys(cur, want).every((d) => d === NO_TOKEN)) {
    r.action = "cần token"; r.detail = `dán token vào file hoặc đặt biến ${r.env}${keep}`;
  } else if (opt.fix) {
    r.action = "đã hợp nhất"; r.detail = `thay epodsystem về chuẩn, giữ token: ${diffKeys(cur, want).join("; ")}${keep}`;
    obj.mcpServers.epodsystem = want; write(obj);
  } else {
    r.action = "cần xem lại"; r.detail = `${diffKeys(cur, want).join("; ")}${keep} → chạy --fix sau khi duyệt`;
  }
  return r;
}

const dirs = opt.all
  ? fs.readdirSync(WEBSITE).filter((d) => !/^[._]/.test(d) && fs.statSync(path.join(WEBSITE, d)).isDirectory()).map((d) => path.join(WEBSITE, d))
  : [path.resolve(target)];
for (const d of dirs) if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) { console.error(`Không thấy thư mục: ${d}`); process.exit(2); }

const results = dirs.map(processProject);
const bad = results.filter((r) => r.action === "cần xem lại" || r.action === "cần token");

if (opt.json) {
  console.log(JSON.stringify({ dry_run: !!opt["dry-run"], fix: !!opt.fix, results }, null, 2));
} else {
  const w = Math.max(8, ...results.map((r) => r.project.length));
  const we = Math.max(4, ...results.map((r) => r.env.length));
  console.log(`${opt["dry-run"] ? "[dry-run: không ghi file] " : ""}Chuẩn: ${path.relative(ROOT, TEMPLATE).replace(/\\/g, "/")}\n`);
  console.log(`${"Dự án".padEnd(w)}  ${"Biến".padEnd(we)}  ${"Hành động".padEnd(12)}  ${"Token".padEnd(10)}  Chi tiết`);
  for (const r of results) {
    console.log(`${r.project.padEnd(w)}  ${r.env.padEnd(we)}  ${r.action.padEnd(12)}  ${r.token.padEnd(10)}  ${r.detail}`);
  }
  const n = (a) => results.filter((r) => r.action === a).length;
  console.log(`\n${results.length} dự án · tạo mới ${n("tạo mới")} · đã đúng ${n("đã đúng")} · đã hợp nhất ${n("đã hợp nhất")} · cần token ${n("cần token")} · cần xem lại ${n("cần xem lại")}`);
}
process.exit(bad.length ? 1 : 0);
