// HTML đã build -> section Liquid: mỗi phần tử con của <main> thành một section, chữ / ảnh là setting chỉnh được.
// Không gom mục lặp thành block: block dùng chung HTML của mục đầu, thẻ có data-* riêng (giỏ, lọc) sẽ sai.
// Section giống hệt nhau (cùng HTML mẫu, cùng kiểu setting) giữa các trang dùng chung một file.
"use strict";
const fs = require("fs");
const path = require("path");

function jsdom(siteDir) {
  const ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");
  return require(require.resolve("jsdom", { paths: [siteDir, path.join(ROOT, "website/AttackK-congnghe/node_modules"), path.join(ROOT, "website/CongthongtinNeu/node_modules")] })).JSDOM;
}

// nhóm Style theo hợp đồng section của ePod (thiếu thì upsert bị từ chối)
const STYLE_GROUP = [
  { type: "header", label: "Style" },
  { type: "checkbox", id: "visible", label: "Visible", default: true },
  { type: "color", id: "bg_color", label: "Background color" },
  { type: "color", id: "text_color", label: "Text color" },
  { type: "color", id: "heading_color", label: "Heading color" },
  { type: "text", id: "padding_top", label: "Padding top (CSS)" },
  { type: "text", id: "padding_bottom", label: "Padding bottom (CSS)" },
  { type: "color", id: "border_color", label: "Border color" },
  { type: "range", id: "border_width", label: "Border width", min: 0, max: 8, step: 1, unit: "px", default: 0 },
  { type: "range", id: "border_radius", label: "Border radius", min: 0, max: 48, step: 1, unit: "px", default: 0 },
];

const INLINE = new Set(["A", "STRONG", "EM", "B", "I", "BR", "SPAN", "SMALL", "S", "ABBR", "MARK", "SUP", "SUB", "TIME", "CODE"]);
const KIND = { H1: "Tiêu đề", H2: "Tiêu đề", H3: "Tiêu đề phụ", H4: "Tiêu đề phụ", P: "Đoạn", LI: "Mục", A: "Nút / link", BUTTON: "Nút",
  LABEL: "Nhãn", DT: "Nhãn", DD: "Giá trị", FIGCAPTION: "Chú thích ảnh", LEGEND: "Nhóm", SPAN: "Chữ", STRONG: "Chữ đậm", TH: "Ô tiêu đề", TD: "Ô" };
const short = (s, n = 34) => { s = s.replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const hasText = (el) => el.textContent.trim() !== "";
const isInline = (d) => INLINE.has(d.tagName) && !(d.tagName === "A" && d.className);
const isLeaf = (el) => hasText(el) && Array.from(el.querySelectorAll("*")).every(isInline);
const isIcon = (el) => el.tagName === "I" && /(^| )ph-/.test(el.className);

class Ctx {
  constructor(ref) { this.ref = ref; this.defs = []; this.values = {}; this.n = 0; }
  add(type, label, value) {
    const id = "s" + ++this.n;
    this.defs.push({ type, id, label });
    this.values[id] = value;
    return `{{ ${this.ref}.settings.${id} }}`;
  }
}

function makeConverter({ siteDir, mapHref, mapImg }) {
  const JSDOM = jsdom(siteDir);
  function convert(el, ctx) {
    const doc = el.ownerDocument;
    if (isIcon(el)) return;
    if (el.tagName === "IMG") {
      el.removeAttribute("width");
      el.removeAttribute("height");
      el.setAttribute("src", ctx.add("image_picker", "Ảnh: " + short(el.alt || path.basename(el.getAttribute("src"))), mapImg(el.getAttribute("src"))));
      if (el.getAttribute("alt")) el.setAttribute("alt", ctx.add("text", "Mô tả ảnh", el.getAttribute("alt")));
      return;
    }
    if (el.tagName === "A" && el.hasAttribute("href")) el.setAttribute("href", mapHref(el.getAttribute("href")));
    if (["OPTION", "TEXTAREA", "SELECT", "SCRIPT", "CANVAS"].includes(el.tagName)) return;
    if (isLeaf(el) && el.parentElement) {
      const html = el.innerHTML.trim();
      const plain = !/[<&]/.test(html);
      const val = plain ? el.textContent.replace(/\s+/g, " ").trim() : html.replace(/href="([^"]*)"/g, (m, h) => `href="${mapHref(h)}"`);
      el.innerHTML = "";
      el.append(doc.createTextNode(ctx.add(plain ? "text" : "textarea", (KIND[el.tagName] || "Chữ") + ": " + short(el.textContent || val), val)));
      return;
    }
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 3 && node.textContent.trim()) node.replaceWith(doc.createTextNode(ctx.add("text", "Chữ: " + short(node.textContent), node.textContent.trim())));
      else if (node.nodeType === 1) convert(node, ctx);
    }
  }

  // pages: [{ file, slug, template }]; prefix: tiền tố tên file section (mx-, cp-...)
  function exportAll(pages, outDir, prefix) {
    const secDir = path.join(outDir, "sections");
    fs.mkdirSync(secDir, { recursive: true });
    for (const f of fs.readdirSync(secDir)) fs.unlinkSync(path.join(secDir, f));
    const types = new Map(), plan = [];
    for (const p of pages) {
      const doc = new JSDOM(fs.readFileSync(path.join(siteDir, p.file), "utf8")).window.document;
      if (doc.querySelector("main canvas")) throw new Error(`${p.file}: hợp đồng ePod cấm <canvas> trong section, để theme JS tự tạo (references/loi-epod.md)`);
      const meta = { title: doc.title, description: (doc.querySelector('meta[name="description"]') || {}).content || "" };
      const h1 = doc.querySelector("h1");
      const entry = { ...p, title: h1 ? h1.textContent.replace(/\s+/g, " ").trim() : meta.title, meta, sections: [] };
      Array.from(doc.querySelector("main").children).forEach((el, i) => {
        const ctx = new Ctx("section"), clone = el.cloneNode(true);
        convert(clone, ctx);
        const body = `{%- if section.settings.visible != false -%}\n${clone.outerHTML}\n{%- endif -%}`;
        const key = body + ctx.defs.map((d) => d.id + d.type).join(",");
        if (!types.has(key)) {
          const hd = el.querySelector("h1, h2, .h2, h3");
          types.set(key, { body, ctx, name: short(`${p.slug} - ${hd ? hd.textContent.replace(/\s+/g, " ").trim() : el.className.split(" ")[0] || "Phần"}`, 40), n: types.size + 1 });
        }
        entry.sections.push({ id: "s" + (i + 1), t: types.get(key), settings: ctx.values });
      });
      plan.push(entry);
    }
    for (const t of types.values()) {
      t.handle = prefix + String(t.n).padStart(3, "0");
      const schema = { name: t.name, settings: [...t.ctx.defs.map((d) => ({ ...d, default: t.ctx.values[d.id] })), ...STYLE_GROUP], presets: [{ name: t.name }] };
      fs.writeFileSync(path.join(secDir, t.handle + ".liquid"), t.body + "\n{% schema %}\n" + JSON.stringify(schema, null, 1) + "\n{% endschema %}\n");
    }
    for (const e of plan) for (const s of e.sections) { s.type = s.t.handle; delete s.t; }
    fs.writeFileSync(path.join(outDir, "plan.json"), JSON.stringify(plan, null, 1));
    console.log(`Export: ${types.size} section, ${plan.length} trang -> ${path.relative(process.cwd(), outDir)}`);
    return plan;
  }
  return { exportAll, JSDOM };
}

module.exports = { makeConverter, STYLE_GROUP };
