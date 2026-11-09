// Hook PreToolUse: chặn trước khi chạy những việc phạm luật cứng của repo (CLAUDE.md, mục Bảo mật và "Site có bước build").
//   1. git add -f / --force vào website/   (website/ bị gitignore, chứa token ePod)
//   2. git commit khi phần đã stage có token ePod (epod_...)
//   3. ghi token ePod vào file nằm ngoài website/ (file được git theo dõi)
//   4. sửa HTML build ở gốc site website/<site>/*.html khi site có src/ (phải sửa src/ rồi build)
// Đọc JSON từ stdin, in quyết định "deny" kèm lý do. Không chặn được thì để yên (exit 0, không in gì).
"use strict";
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "..", "..");
const TOKEN = /epod_[A-Za-z0-9]{20,}/;

function deny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
  process.exit(0);
}

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let ev;
  try { ev = JSON.parse(input); } catch { process.exit(0); }
  const tool = ev.tool_name, ti = ev.tool_input || {};

  if (tool === "Bash" || tool === "PowerShell") {
    const cmd = String(ti.command || "");
    // tách theo ; && || | xuống dòng, chỉ xét đoạn BẮT ĐẦU bằng git (chữ "git add" nằm trong chuỗi văn bản không tính)
    const parts = cmd.split(/;|&&|\|\||\||\n/).map((p) => p.trim().replace(/^(sudo|command)\s+/, ""));
    for (const part of parts) {
      if (/^git(\s+-C\s+\S+)?\s+add\b/.test(part) && /(\s-f\b|\s--force\b|\s-[a-zA-Z]*f[a-zA-Z]*\b)/.test(part) && /website[\\/]/.test(part + "/"))
        deny("Chặn: không git add -f thư mục website/ (bị gitignore, chứa token ePod trong .mcp.json). Xem CLAUDE.md, mục Bảo mật.");
    }
    if (parts.some((p) => /^git(\s+-C\s+\S+)?\s+commit\b/.test(p))) {
      let staged = "";
      try { staged = execSync("git diff --cached -U0", { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }); } catch { /* không phải repo: bỏ qua */ }
      const hit = staged.split("\n").find((l) => l.startsWith("+") && TOKEN.test(l));
      if (hit) deny("Chặn commit: phần đã stage có token ePod (epod_...). Gỡ token khỏi file được git theo dõi, để trong website/<site>/.mcp.json hoặc biến EPOD_MCP_TOKEN_<TÊN>.");
    }
    process.exit(0);
  }

  if (tool === "Write" || tool === "Edit" || tool === "MultiEdit" || tool === "NotebookEdit") {
    const file = path.resolve(String(ti.file_path || ti.notebook_path || ""));
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    // ngoài repo (Windows: khác ổ đĩa thì path.relative trả đường dẫn tuyệt đối, không bắt đầu bằng "..")
    if (rel.startsWith("..") || path.isAbsolute(rel) || /^[A-Za-z]:/.test(rel)) process.exit(0);
    const text = [ti.content, ti.new_string, ...(ti.edits || []).map((e) => e.new_string)].filter(Boolean).join("\n");

    if (!rel.startsWith("website/") && TOKEN.test(text))
      deny(`Chặn: ${rel} được git theo dõi, không ghi token ePod vào đây. Token để trong website/<site>/.mcp.json hoặc biến EPOD_MCP_TOKEN_<TÊN>.`);

    // website/<site>/<file>.html ở gốc site, site có src/pages/ và tools/build.js => HTML do build sinh
    const m = rel.match(/^website\/([^/]+)\/([^/]+\.html)$/);
    if (m) {
      const site = path.join(ROOT, "website", m[1]);
      const built = fs.existsSync(path.join(site, "src", "pages")) && fs.existsSync(path.join(site, "tools", "build.js"));
      // CongthongtinNeu: index.html, admin.html viết tay (CLAUDE.md, mục Ngoại lệ)
      const handWritten = m[1] === "CongthongtinNeu" && /^(index|admin)\.html$/.test(m[2]);
      if (built && !handWritten)
        deny(`Chặn: website/${m[1]}/${m[2]} do build sinh ra, sửa sẽ mất ở lần build sau. Sửa src/ (pages, partials, data, templates) rồi chạy node tools/build.js.`);
    }
  }
  process.exit(0);
});
