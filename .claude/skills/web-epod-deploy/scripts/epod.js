#!/usr/bin/env node
// Đưa một site tĩnh trong website/ lên ePod. Phần riêng của site nằm ở website/<Du-an>/epod.config.js (references/cau-hinh.md).
//
//   node .agents/skills/web-epod-deploy/scripts/epod.js website/<Du-an> images   # ảnh -> media (cache .epod/images.json)
//   node .agents/skills/web-epod-deploy/scripts/epod.js website/<Du-an> export   # sinh .epod/out/ để xem trước, không đẩy
//   node .agents/skills/web-epod-deploy/scripts/epod.js website/<Du-an> push     # ảnh, form, theme, section, trang, menu, SEO
//
// Chạy sau node tools/build.js. Trang chủ, 404 -> template của theme; trang khác -> trang CMS /pages/<slug>.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { createClient } = require("./mcp.js");
const { makeConverter, STYLE_GROUP } = require("./lib/convert.js");

const [, , siteArg, cmd] = process.argv;
if (!siteArg || !["images", "export", "push"].includes(cmd)) { console.log("Dùng: epod.js website/<Du-an> images | export | push"); process.exit(1); }
const SITE = path.resolve(siteArg);
const CFG_FILE = path.join(SITE, "epod.config.js");
if (!fs.existsSync(CFG_FILE)) { console.error(`Thiếu ${CFG_FILE}: chép mẫu trong references/cau-hinh.md`); process.exit(1); }
const cfg = require(CFG_FILE);
const EP = path.join(SITE, ".epod"), OUT = path.join(EP, "out"), IMG_CACHE = path.join(EP, "images.json");
fs.mkdirSync(OUT, { recursive: true });

// ---------- trang, link, ảnh
const FILES = fs.readdirSync(SITE).filter((f) => f.endsWith(".html")).sort();
const PAGES = FILES.filter((f) => !(cfg.skipPages || []).includes(f)).map((file) => ({ file, slug: file.replace(/\.html$/, ""), template: file === "index.html" ? "index" : file === "404.html" ? "404" : null }));
const urlOf = (slug) => (slug === "index" ? "/" : slug === "404" ? "/404" : "/pages/" + slug);
function mapHref(href) {
  if (!href || /^(https?:|tel:|mailto:|#|\/)/.test(href)) return href;
  const [rest, hash] = href.split("#"), [file, query] = rest.split("?");
  if (!FILES.includes(file)) throw new Error("Link không rõ đích: " + href);
  return urlOf(file.replace(/\.html$/, "")) + (query ? "?" + query : "") + (hash ? "#" + hash : "");
}
let images = fs.existsSync(IMG_CACHE) ? JSON.parse(fs.readFileSync(IMG_CACHE, "utf8")) : {};
function mapImg(src) {
  const k = src.replace(/^assets\/img\//, "");
  if (!images[k]) throw new Error("Ảnh chưa tải lên: " + k + " (chạy lệnh images)");
  return images[k];
}

let mcp;
async function call(name, args) {
  const r = await mcp.call(name, args);
  const s = typeof r === "string" ? r : JSON.stringify(r);
  if ((r && r.ERROR) || /^"?(graphql error|error|invalid|validation)/i.test(s) || /rejected/i.test(s)) throw new Error(`${name} lỗi: ${s.slice(0, 1500)}`);
  return r;
}

// ---------- ảnh: SVG bị ePod chặn (stored XSS) -> vẽ lại thành webp bằng Chrome ở .epod/raster/
function rasterize(svgs) {
  const RASTER = path.join(EP, "raster");
  fs.mkdirSync(RASTER, { recursive: true });
  const todo = svgs.filter((f) => !fs.existsSync(path.join(RASTER, path.basename(f, ".svg") + ".webp")) || fs.statSync(f).mtimeMs > fs.statSync(path.join(RASTER, path.basename(f, ".svg") + ".webp")).mtimeMs);
  if (!todo.length) return;
  const CHROME = process.env.CHROME || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
  if (!CHROME) throw new Error("Cần Chrome/Edge để đổi SVG sang webp (đặt biến CHROME)");
  const pngs = [];
  for (const f of todo) {
    const size = cfg.rasterSize || 600, html = path.join(os.tmpdir(), "epod-raster.html"), png = path.join(RASTER, path.basename(f, ".svg") + ".png");
    fs.writeFileSync(html, `<html><body style="margin:0"><img src="file:///${f.split(path.sep).join("/")}" width=${size} height=${size} style="display:block"></body></html>`);
    spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", `--window-size=${size},${size}`, `--screenshot=${png}`, "file:///" + html.split(path.sep).join("/")], { stdio: "ignore", timeout: 60000 });
    pngs.push(png);
  }
  const py = "import sys\nfrom PIL import Image\nimport os\nfor f in sys.argv[1:]:\n    Image.open(f).convert('RGB').save(f[:-4]+'.webp','WEBP',quality=86,method=6); os.remove(f)";
  const r = spawnSync(process.platform === "win32" ? "python" : "python3", ["-c", py, ...pngs], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("Đổi PNG sang webp cần Python + Pillow: " + (r.stderr || "").slice(0, 300));
  console.log(`  vẽ lại ${todo.length} SVG thành webp`);
}
async function pushImages() {
  const dir = path.join(SITE, "assets/img");
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]));
  const all = walk(dir).filter((f) => /\.(webp|jpe?g|png|svg)$/i.test(f) && !/favicon/i.test(path.basename(f)));
  rasterize(all.filter((f) => /\.svg$/i.test(f)));
  for (const file of all) {
    const key = path.relative(dir, file).split(path.sep).join("/");
    if (images[key]) continue;
    const src = /\.svg$/i.test(file) ? path.join(EP, "raster", path.basename(file, ".svg") + ".webp") : file;
    const mime = /\.webp$/i.test(src) ? "image/webp" : /\.png$/i.test(src) ? "image/png" : "image/jpeg";
    const r = await call("upload_image", { url: `data:${mime};base64,` + fs.readFileSync(src).toString("base64"), folder: cfg.folder });
    images[key] = r.uploadStoreMedia.url;
    fs.writeFileSync(IMG_CACHE, JSON.stringify(images, null, 1));
    console.log("  ảnh", key);
  }
  console.log(`Ảnh: ${Object.keys(images).length} file trên media.`);
}

// ---------- form: kiểu nội dung is_form (hộp thư riêng, không có trang công khai)
async function ensureForms() {
  const forms = Object.values(cfg.forms || {});
  if (!forms.length) return;
  const have = ((await call("list_content_types", {})).contentTypes || []).map((t) => t.code);
  for (const f of forms) {
    if (have.includes(f.code)) continue;
    const fields = f.fields.map(([code, label, type], i) => `{ code: "${code}", label: "${label}", type: "${type || "text"}", required: false, position: ${i + 1} }`).join(", ");
    const notify = f.notifyEmail ? `, notify_email: "${f.notifyEmail}"` : "";
    await call("graphql_mutation", { query: `mutation { createContentType(input: { code: "${f.code}", label: "${f.label}", singular: "${f.singular || f.label}", is_form: true, submit_status: "submitted"${notify}, fields: [${fields}] }) { id code } }` });
    console.log("Form:", f.code);
  }
}

// ---------- CSS, JS của site -> theme assets
function themeCss() {
  // :root:root để biến của site thắng biến cùng tên trong <style id="theme-settings-vars"> nạp sau
  const css = fs.readFileSync(path.join(SITE, "assets/css/style.css"), "utf8").replace(":root {", ":root:root {");
  return (cfg.cssImports || []).map((u) => `@import url("${u}");`).join("\n") + "\n" + css + "\n/* ePod */\nmain { display: block; }\n" + (cfg.cssExtra || "");
}
const BASE_CSS = path.join(EP, "theme-base.css");
async function baseThemeCss() {
  if (!fs.existsSync(BASE_CSS)) {
    const r = await call("get_theme_file", { path: "assets/theme.css", include_inherited: true });
    if (r.themeFile.source && r.themeFile.source !== "parent") throw new Error("theme.css đã bị ghi đè, cần bản gốc ở .epod/theme-base.css");
    fs.writeFileSync(BASE_CSS, r.themeFile.content);
  }
  return fs.readFileSync(BASE_CSS, "utf8");
}
// theme.css gốc dùng lớp chung (.btn, .section, .logo...) trùng site: bỏ selector đụng lớp của site
function filterCss(css) {
  const classes = new Set(["is-on", "is-in", "is-open", "is-hidden", "is-empty", "reveal", "js", ...(cfg.extraClasses || [])]);
  for (const f of FILES) for (const m of fs.readFileSync(path.join(SITE, f), "utf8").matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => classes.add(c));
  const hit = (sel) => (sel.match(/\.[a-zA-Z][\w-]*/g) || []).some((c) => classes.has(c.slice(1)));
  let dropped = 0;
  const walk = (src) => {
    let res = "", pos = 0;
    while (pos < src.length) {
      const open = src.indexOf("{", pos);
      if (open < 0) { res += src.slice(pos); break; }
      let depth = 1, j = open + 1;
      while (j < src.length && depth) { if (src[j] === "{") depth++; else if (src[j] === "}") depth--; j++; }
      const head = src.slice(pos, open), body = src.slice(open + 1, j - 1);
      if (/^\s*@(media|supports|container|layer)/.test(head)) res += head + "{" + walk(body) + "}";
      else if (/^\s*@/.test(head)) res += head + "{" + body + "}";
      else { const kept = head.split(",").filter((s) => !hit(s)); if (kept.length) res += kept.join(",") + "{" + body + "}"; else { res += head.match(/^\s*/)[0]; dropped++; } }
      pos = j;
    }
    return res;
  };
  const out = walk(css);
  console.log(`theme.css: bỏ ${dropped} luật trùng lớp với site`);
  return out;
}
function themeJs() {
  let js = fs.readFileSync(path.join(SITE, "assets/js/main.js"), "utf8").replace(/\r\n/g, "\n");
  for (const [from, to] of cfg.jsReplace || []) {
    if (!js.includes(from)) throw new Error("main.js đã đổi, cập nhật jsReplace trong epod.config.js: " + from.slice(0, 80));
    js = js.replace(from, to);
  }
  const prefix = cfg.jsPrefix ? cfg.jsPrefix({ images, urlOf }) + "\n" : "";
  return prefix + js;
}

// ---------- header, footer: cắt từ trang chủ đã build; menu chính lấy từ linklists (hợp đồng header của ePod)
function chrome(JSDOM, names) {
  const c = cfg.chrome || {};
  const doc = new JSDOM(fs.readFileSync(path.join(SITE, "index.html"), "utf8")).window.document;
  const pick = (sels) => sels.map((s) => { const el = doc.querySelector(s); if (!el) throw new Error(`index.html không có ${s} (chrome trong epod.config.js)`); return el; });
  const head = pick(c.header || ["header"]), foot = pick(c.footer || ["footer"]);
  [...head, ...foot].forEach((el) => el.querySelectorAll("[href]").forEach((a) => a.setAttribute("href", mapHref(a.getAttribute("href")))));
  if (c.search) { const f = doc.querySelector(c.search.form); if (f) f.setAttribute("action", urlOf(c.search.page)); }
  const nav = doc.querySelector(c.nav || "nav ul");
  if (!nav) throw new Error("Không thấy danh sách menu (chrome.nav trong epod.config.js)");
  nav.innerHTML = "@@NAV@@";
  const loop = `{%- for link in linklists[section.settings.menu | default: 'main-menu'].links -%}
          <li><a href="{{ link.url }}"{% if link.url == request.path %} aria-current="page"{% endif %}>{{ link.title }}</a></li>
          {%- endfor -%}`;
  const schema = (name, extra) => `\n{% schema %}\n${JSON.stringify({ name, settings: [...extra, ...STYLE_GROUP] }, null, 1)}\n{% endschema %}\n`;
  return {
    header: (c.skipLink === false ? "" : `<a class="skip-link" href="#main">Bỏ qua điều hướng</a>\n`) + head.map((e) => e.outerHTML).join("\n").replace("@@NAV@@", loop) +
      `\n<script src="/assets/${cfg.folder}.js" defer></script>` + schema(`Header ${cfg.name || cfg.folder}`, [{ type: "menu", id: "menu", label: "Menu", default: "main-menu" }]),
    footer: foot.map((e) => e.outerHTML).join("\n") + schema(`Footer ${cfg.name || cfg.folder}`, []),
  };
}
// theme của store gọi section 'header'/'footer' (theme bán hàng) hay 'web-header'/'web-footer': đọc layout để biết
async function chromeNames() {
  const r = await call("get_theme_file", { path: "layout/theme.liquid", include_inherited: true });
  const c = r.themeFile.content;
  const has = (n) => new RegExp(`section ['"]${n}['"]`).test(c);
  return { header: has("web-header") ? "web-header" : "header", footer: has("web-footer") ? "web-footer" : "footer", announcement: has("announcement-bar") };
}

async function pushMenus(pageIds) {
  const items = cfg.menu || [];
  const old = ((await call("list_menus", {})).storeMenus || []).find((x) => x.handle === "main-menu");
  if (old) await call("delete_menu", { id: String(old.id) });
  const r = await call("create_menu", { name: "Menu chính", handle: "main-menu", location: "header" });
  const menuId = String((r.createMenu || r.menu || r).id);
  let pos = 0;
  for (const [label, to] of items) {
    const item = { menu_id: menuId, label, position: pos++ };
    if (pageIds[to]) Object.assign(item, { link_type: "page", page_id: String(pageIds[to]) });
    else Object.assign(item, { link_type: /:\/\//.test(to) ? "external" : "custom", url: /^(\/|https?:)/.test(to) ? to : urlOf(to) });
    await call("create_menu_item", item);
  }
  console.log(`Menu main-menu: ${items.length} mục`);
}

(async () => {
  const conv = makeConverter({ siteDir: SITE, mapHref, mapImg });
  if (cmd === "export") { conv.exportAll(PAGES, OUT, cfg.prefix || "s-"); return; }
  mcp = createClient(SITE);
  await mcp.init();
  await pushImages();
  if (cmd === "images") return;
  const plan = conv.exportAll(PAGES, OUT, cfg.prefix || "s-");
  const ctx = await call("get_context", {});
  console.log(`Store ${ctx.store_name} (${ctx.store_slug}), theme ${ctx.theme_id}`);

  await ensureForms();
  if (cfg.globalSettings) await call("set_global_settings", { settings: cfg.globalSettings });
  await call("upsert_theme_file", { path: "assets/theme.css", content: filterCss(await baseThemeCss()) });
  await call("upsert_theme_file", { path: "assets/theme-skin.css", content: themeCss() });
  await call("upsert_theme_file", { path: `assets/${cfg.folder}.js`, content: themeJs() });
  const names = await chromeNames(), ch = chrome(conv.JSDOM, names);
  await call("upsert_theme_file", { path: `sections/${names.header}.liquid`, content: ch.header });
  await call("upsert_theme_file", { path: `sections/${names.footer}.liquid`, content: ch.footer });
  if (names.announcement && cfg.hideAnnouncement !== false)
    await call("upsert_theme_file", { path: "sections/announcement-bar.liquid", content: `{%- comment -%}tắt: dải trên cùng nằm trong header của site{%- endcomment -%}\n{% schema %}\n${JSON.stringify({ name: "Thanh thông báo (tắt)", settings: STYLE_GROUP }, null, 1)}\n{% endschema %}\n` });
  console.log(`Theme: CSS, JS, ${names.header}, ${names.footer}`);

  const secDir = path.join(OUT, "sections"), files = fs.readdirSync(secDir);
  for (const f of files) await call("upsert_theme_file", { path: "sections/" + f, content: fs.readFileSync(path.join(secDir, f), "utf8") });
  console.log(`Theme: ${files.length} section`);

  const pages = (await call("list_pages", {})).storePages || [], pageIds = {};
  for (const p of plan.filter((x) => !x.template)) {
    let pg = pages.find((x) => x.slug === p.slug);
    if (!pg) { const r = await call("create_page", { title: p.title, slug: p.slug }); pg = (r.page && r.page.createPage) || r.createPage || r.page || r; }
    const doc = { sections: {}, order: [] };
    for (const s of p.sections) { doc.sections[s.id] = { type: s.type, settings: s.settings }; doc.order.push(s.id); }
    await call("update_page", { id: String(pg.id), title: p.title, sections: doc, meta_title: p.meta.title, meta_description: p.meta.description });
    await call("publish_page", { id: String(pg.id) });
    pageIds[p.slug] = pg.id;
  }
  console.log(`Trang CMS: ${Object.keys(pageIds).length}`);
  for (const p of plan.filter((x) => x.template)) {
    const tpl = { sections: {}, order: [] };
    for (const s of p.sections) { tpl.sections[s.id] = { type: s.type, settings: s.settings }; tpl.order.push(s.id); }
    await call("upsert_theme_file", { path: `templates/${p.template}.json`, content: JSON.stringify(tpl, null, 1) });
    console.log(`Template ${p.template}.json (${p.sections.length} section)`);
  }
  await pushMenus(pageIds);
  const home = plan.find((x) => x.template === "index");
  await call("update_store_branding", { meta_title: home.meta.title, meta_description: home.meta.description, ...(cfg.ogImage ? { og_image_url: mapImg(cfg.ogImage) } : {}) });
  await call("clear_storefront_cache", {});
  console.log(`Xong: https://${ctx.store_slug}.epodsystem.com`);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
