// Hook PostToolUse: sửa file trong website/<site>/src/ thì chạy node tools/build.js rồi node tools/check.js của site đó.
// Lỗi build (dấu gạch dài, token thiếu, ảnh chưa khai báo...) hay lỗi check (link, anchor, alt) được báo lại ngay cho agent.
// Site không có tools/build.js (AttackK, CongthongtinNeu dùng script khác) thì bỏ qua.
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "..", "..");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let ev;
  try { ev = JSON.parse(input); } catch { process.exit(0); }
  const ti = ev.tool_input || {};
  const file = path.resolve(String(ti.file_path || (ev.tool_response || {}).filePath || ""));
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const m = rel.match(/^website\/([^/]+)\/src\//);
  if (!m) process.exit(0);
  const site = path.join(ROOT, "website", m[1]);
  if (!fs.existsSync(path.join(site, "tools", "build.js"))) process.exit(0);

  const run = (script) => execFileSync(process.execPath, [path.join("tools", script)], { cwd: site, encoding: "utf8", timeout: 60000, stdio: ["ignore", "pipe", "pipe"] });
  try {
    run("build.js");
    if (fs.existsSync(path.join(site, "tools", "check.js"))) run("check.js");
  } catch (e) {
    const out = ((e.stdout || "") + (e.stderr || "")).replace(/\r/g, "").split("\n")
      .filter((l) => l.trim() && !/^\s+at /.test(l) && !/^Node\.js v/.test(l)).slice(-12).join("\n");
    process.stdout.write(JSON.stringify({
      decision: "block",
      reason: `website/${m[1]}: build hoặc check lỗi sau khi sửa ${rel}. Sửa ngay rồi build lại:\n${out}`,
    }));
  }
  process.exit(0);
});
