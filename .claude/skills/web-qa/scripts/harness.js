// Khung test hành vi JS của site tĩnh bằng jsdom, không mở trình duyệt.
// Mỗi site viết tools/smoke.js gọi vào đây (xem references/smoke-test.md):
//
//   const { load, ok, done } = require("../../../.agents/skills/web-qa/scripts/harness.js");
//   const w = load(__dirname + "/..", "index.html");        // trang đã build, chạy assets/js/main.js
//   w.document.querySelector("[data-add-cart]").click();
//   ok(w.document.querySelector("[data-mx-cart-count]").textContent === "1", "thêm giỏ");
//   done();
//
// Giả lập: localStorage (dùng chung giữa các lần load như cùng một trình duyệt), matchMedia (không khớp),
// IntersectionObserver (không làm gì), fetch (trả ok), location.replace (không chuyển trang).
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const { JSDOM } = require(require.resolve("jsdom", {
  paths: [process.cwd(), path.join(ROOT, "website/AttackK-congnghe/node_modules"), path.join(ROOT, "website/CongthongtinNeu/node_modules")],
}));

const storage = {};
let pass = 0, fail = 0;

function load(siteDir, page, search = "", opts = {}) {
  const js = fs.readFileSync(path.join(siteDir, opts.script || "assets/js/main.js"), "utf8");
  const html = fs.readFileSync(path.join(siteDir, page), "utf8").replace(/<script src="[^"]*main\.js"[^>]*><\/script>/, "");
  const dom = new JSDOM(html, { url: (opts.origin || "https://site.test/") + page + search, runScripts: "outside-only", pretendToBeVisual: true });
  const w = dom.window;
  Object.defineProperty(w, "localStorage", { value: {
    getItem: (k) => (k in storage ? storage[k] : null), setItem: (k, v) => (storage[k] = String(v)), removeItem: (k) => delete storage[k],
  } });
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.fetch = opts.fetch || (() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: "success" }) }));
  try { w.location.replace = () => {}; } catch { /* jsdom: location chỉ đọc, chuyển trang vốn không chạy */ }
  if (opts.before) opts.before(w);
  w.eval(js);
  return w;
}

// phát sự kiện như người dùng: change, input, submit...
const fire = (w, el, type) => el.dispatchEvent(new w.Event(type, { bubbles: true, cancelable: true }));
const ok = (cond, msg) => { if (cond) pass++; else fail++; console.log((cond ? "PASS " : "FAIL ") + msg); };
const wait = (ms = 50) => new Promise((r) => setTimeout(r, ms));
// main.js thường có setInterval (đồng hồ, băng chữ): thoát hẳn thay vì chờ
function done() { console.log(`\n${pass} đạt, ${fail} lỗi`); process.exit(fail ? 1 : 0); }

module.exports = { load, fire, ok, wait, done, storage };
