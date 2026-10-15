#!/usr/bin/env node
/*
 * web-anti-ai-lint: quét HTML đã build của một dự án trong website/ tìm dấu vết "AI làm".
 *
 *   node lint.js <thư-mục-dự-án> [--industry=<slug>] [--json]
 *
 * Bắt: emoji làm icon, cụm sáo rỗng (references/cum-sao-rong/*.md), lorem/placeholder, href="#",
 * ảnh thiếu alt, thiếu lang, heading nhảy cấp / số h1, title và meta mất dấu, nhiều bộ icon,
 * cụm cam kết quá mức theo ngành, chữ "số liệu mẫu". Liệt kê [CẦN DỮ LIỆU THẬT] còn lại.
 * Bỏ qua một dòng: thêm <!-- lint-ok: lý do --> trên dòng đó.
 * Không phụ thuộc thư viện ngoài. Thoát mã 1 nếu còn LỖI.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
const opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v === undefined ? true : v]; }));
const INDUSTRIES = ["nha-xay-dung", "y-te-lam-dep", "an-uong", "ban-le-thuong-mai", "du-lich-luu-tru", "bat-dong-san", "giao-duc", "dich-vu-chuyen-nghiep", "cong-nghe-phan-mem", "van-tai-cong-nghiep", "nong-nghiep-thuc-pham", "doi-song"];

if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error("Cách dùng: node lint.js <thư-mục-dự-án> [--industry=<slug>] [--json]");
  process.exit(2);
}
if (opt.industry && !INDUSTRIES.includes(opt.industry)) {
  console.error(`--industry không hợp lệ: ${opt.industry}. Chọn một trong: ${INDUSTRIES.join(", ")}`);
  process.exit(2);
}

/* ---------------------------------------------------------------- nạp cụm cấm từ bảng markdown */
function loadPhrases() {
  const dir = path.join(__dirname, "..", "references", "cum-sao-rong");
  const list = [];
  const lines = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).flatMap((f) => fs.readFileSync(path.join(dir, f), "utf8").split(/\r?\n/));
  for (const line of lines) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*(cấm|hạn chế)\s*\|\s*([^|]*?)\s*\|/);
    if (m) list.push({ phrase: m[1].toLowerCase().normalize("NFC"), level: m[2] === "cấm" ? "LỖI" : "CẢNH BÁO", hint: m[3] });
  }
  return list;
}
const PHRASES = loadPhrases();

const INDUSTRY_RULES = {
  "y-te-lam-dep": { err: ["khỏi hoàn toàn", "100%", "cam kết hiệu quả", "vĩnh viễn", "không đau", "an toàn tuyệt đối", "trị dứt điểm", "dứt điểm", "tận gốc"], warn: [] },
  "bat-dong-san": { err: ["pháp lý đầy đủ", "sổ hồng trao tay", "cam kết lợi nhuận", "cam kết cho thuê", "lợi nhuận đảm bảo"], warn: [] },
  "nong-nghiep-thuc-pham": { err: ["chữa bệnh", "sạch 100%", "không hóa chất"], warn: ["vietgap", "globalgap", "ocop", "haccp", "hữu cơ", "organic"] },
  "giao-duc": { err: ["cam kết đầu ra", "đảm bảo đầu ra", "100% đỗ", "đỗ 100%"], warn: [] },
};
const ALL_INDUSTRY_WARN = ["iso 9001", "iso 22000", "giải thưởng", "chứng nhận", "top 1"];
const VI_DIACRITIC = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const EMOJI = /\p{Extended_Pictographic}/gu;
const EMOJI_OK = new Set(["©", "®", "™", "↗", "→", "←", "↑", "↓", "↔", "✓", "✕", "×"]);

/* ---------------------------------------------------------------- tiện ích */
function walk(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    if (["src", "assets", "tools", "node_modules", ".git", ".claude", ".firecrawl"].includes(f)) continue;
    const p = path.join(d, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (f.endsWith(".html")) out.push(p);
  }
  return out;
}
// Thay nội dung bằng khoảng trắng nhưng giữ \n để số dòng không lệch
const blank = (s) => s.replace(/[^\n]/g, " ");
const lineAt = (text, idx) => text.slice(0, idx).split("\n").length;

function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, blank)
    .replace(/<[^>]*>/g, blank)
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}
// Chữ trong thuộc tính người dùng thấy/máy đọc: alt, title, aria-label, placeholder, meta content
function attrTexts(html) {
  const res = [];
  const re = /\b(alt|title|aria-label|placeholder|content)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[1].toLowerCase() === "content") {
      const tagStart = html.lastIndexOf("<", m.index);
      const tag = html.slice(tagStart, m.index);
      if (!/name="description"|property="og:(title|description)"/.test(html.slice(tagStart, html.indexOf(">", m.index)))) continue;
      void tag;
    }
    res.push({ text: m[2], idx: m.index + m[0].indexOf('"') + 1 });
  }
  return res;
}

/* ---------------------------------------------------------------- quét một file */
function lintFile(file) {
  const html = fs.readFileSync(file, "utf8");
  const lines = html.split("\n");
  const issues = [];
  const add = (level, idx, rule, msg) => {
    const ln = lineAt(html, idx);
    if (/lint-ok/.test(lines[ln - 1] || "")) return;
    issues.push({ file, line: ln, level, rule, msg });
  };

  const text = visibleText(html);
  const sources = [{ text: text.toLowerCase().normalize("NFC"), base: 0 }].concat(attrTexts(html).map((a) => ({ text: a.text.toLowerCase().normalize("NFC"), base: a.idx })));

  // Cụm cấm: ưu tiên cụm dài, không báo cụm ngắn nằm trong cụm dài đã khớp
  for (const src of sources) {
    const taken = [];
    const sorted = PHRASES.slice().sort((a, b) => b.phrase.length - a.phrase.length);
    for (const p of sorted) {
      let i = src.text.indexOf(p.phrase);
      while (i !== -1) {
        const end = i + p.phrase.length;
        const before = src.text[i - 1] || " ";
        const after = src.text[end] || " ";
        const boundary = !/[\p{L}\p{N}]/u.test(before) && !/[\p{L}\p{N}]/u.test(after);
        if (boundary && !taken.some(([a, b]) => i < b && end > a)) {
          taken.push([i, end]);
          add(p.level, src.base + i, "sáo-rỗng", `"${p.phrase}" → ${p.hint}`);
        }
        i = src.text.indexOf(p.phrase, end);
      }
    }
  }

  // Cam kết quá mức theo ngành
  const ind = opt.industry && INDUSTRY_RULES[opt.industry];
  const scan = (words, level, rule) => {
    for (const src of sources) for (const w of words) {
      let i = src.text.indexOf(w);
      while (i !== -1) { add(level, src.base + i, rule, `"${w}" (${opt.industry || "mọi ngành"}): cần dữ liệu xác nhận hoặc bỏ`); i = src.text.indexOf(w, i + w.length); }
    }
  };
  if (ind) { scan(ind.err, "LỖI", "cam-kết-quá-mức"); scan(ind.warn, "CẢNH BÁO", "chứng-nhận-cần-nguồn"); }
  scan(ALL_INDUSTRY_WARN, "CẢNH BÁO", "cần-nguồn");

  // Emoji trong chữ hiển thị
  let m;
  while ((m = EMOJI.exec(text))) if (!EMOJI_OK.has(m[0])) add("LỖI", m.index, "emoji", `emoji "${m[0]}" làm icon/trang trí`);

  // Lorem / placeholder
  const ph = /lorem|ipsum|\bTODO\b|placeholder text|xxx+|\[(?:tên|name|link|url|số điện thoại)[^\]]*\]/gi;
  while ((m = ph.exec(text))) add("LỖI", m.index, "placeholder", `chữ giữ chỗ còn sót: "${m[0]}"`);

  // [CẦN DỮ LIỆU THẬT]
  const need = /\[CẦN DỮ LIỆU THẬT[^\]]*\]/g;
  while ((m = need.exec(text))) add("THÔNG TIN", m.index, "cần-dữ-liệu", m[0]);

  // Dấu gạch dài
  const dash = /[–—]/g;
  while ((m = dash.exec(text))) add("LỖI", m.index, "gạch-dài", "dùng '-' thay cho – hoặc —");

  // href rỗng / #
  const href = /href\s*=\s*"(#?)"/gi;
  while ((m = href.exec(html))) add("LỖI", m.index, "href-rỗng", `href="${m[1]}" không dẫn đi đâu`);

  // Ảnh thiếu alt
  const img = /<img\b[^>]*>/gi;
  while ((m = img.exec(html))) if (!/\balt\s*=/.test(m[0])) add("LỖI", m.index, "alt", "ảnh thiếu thuộc tính alt");

  // lang
  const htmlTag = html.match(/<html\b[^>]*>/i);
  if (!htmlTag) add("LỖI", 0, "lang", "không có thẻ <html>");
  else if (!/\blang\s*=\s*"[a-z]{2}/i.test(htmlTag[0])) add("LỖI", htmlTag.index, "lang", "thiếu lang trên <html>");
  else if (!/[\\/](en|ja|ko|zh|fr|de)[\\/]/.test(file) && !/lang\s*=\s*"vi/i.test(htmlTag[0])) add("CẢNH BÁO", htmlTag.index, "lang", 'trang tiếng Việt nên có lang="vi"');

  // Heading
  const hs = [];
  const hre = /<h([1-6])\b/gi;
  while ((m = hre.exec(html))) hs.push({ lv: Number(m[1]), idx: m.index });
  const h1 = hs.filter((h) => h.lv === 1).length;
  if (h1 !== 1) add("LỖI", hs[0] ? hs[0].idx : 0, "h1", `trang có ${h1} thẻ h1 (cần đúng 1)`);
  for (let i = 1; i < hs.length; i++) if (hs[i].lv > hs[i - 1].lv + 1) add("LỖI", hs[i].idx, "heading", `nhảy cấp h${hs[i - 1].lv} → h${hs[i].lv}`);

  // Title và meta description mất dấu
  const isVi = !/[\\/](en|ja|ko|zh|fr|de)[\\/]/.test(file);
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!title) add("LỖI", 0, "title", "thiếu <title>");
  else if (isVi && title[1].trim().split(/\s+/).length > 2 && !VI_DIACRITIC.test(title[1])) add("LỖI", title.index, "dấu", `<title> không có dấu tiếng Việt: "${title[1].trim()}"`);
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!desc) add("CẢNH BÁO", 0, "meta", "thiếu meta description");
  else if (isVi && !VI_DIACRITIC.test(desc[1])) add("LỖI", desc.index, "dấu", "meta description không có dấu tiếng Việt");

  // Nhiều bộ icon
  const sets = ["phosphor-icons", "lucide", "tabler", "font-awesome", "fontawesome", "material-symbols", "material-icons", "bootstrap-icons", "remixicon", "boxicons"].filter((s) => html.toLowerCase().includes(s));
  if (sets.length > 1) add("CẢNH BÁO", 0, "icon", `nạp ${sets.length} bộ icon: ${sets.join(", ")} (chỉ dùng một)`);

  return issues;
}

/* ---------------------------------------------------------------- chạy */
const files = walk(path.resolve(dir));
const all = files.flatMap(lintFile);
const rel = (f) => path.relative(process.cwd(), f).replace(/\\/g, "/");
const count = (lv) => all.filter((i) => i.level === lv).length;

if (opt.json) {
  console.log(JSON.stringify({ files: files.length, errors: count("LỖI"), warnings: count("CẢNH BÁO"), issues: all.map((i) => ({ ...i, file: rel(i.file) })) }, null, 2));
} else {
  const order = { "LỖI": 0, "CẢNH BÁO": 1, "THÔNG TIN": 2 };
  all.sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file) || a.line - b.line);
  for (const i of all) console.log(`${rel(i.file)}:${i.line}  ${i.level.padEnd(9)} [${i.rule}] ${i.msg}`);
  console.log(`\n${files.length} file HTML · ${count("LỖI")} lỗi · ${count("CẢNH BÁO")} cảnh báo · ${count("THÔNG TIN")} mục cần dữ liệu thật` + (opt.industry ? ` · ngành: ${opt.industry}` : ""));
}
process.exit(count("LỖI") ? 1 : 0);
