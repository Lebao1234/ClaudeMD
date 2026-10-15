#!/usr/bin/env node
/*
 * web-rotation / next-combo: đề xuất tổ hợp cho dự án tiếp theo từ registry.
 *
 *   node next-combo.js [--industry=<slug>] [--type=<loại>] [--archetype=<id>] [--hero=<pattern>] [--palette=<id>]
 *                      [--seed=<số>] [--json]
 *
 * Cờ nào có thì khóa; phần còn lại tự xoay theo luật trong ../SKILL.md:
 * - loại site xoay landing-page → corporate-site → ecommerce, bỏ qua loại "ít hợp" với ngành, không lặp loại liền trước
 * - không trùng ngành + archetype trong 4 dự án gần nhất
 * - không trùng hero pattern trong 3 dự án gần nhất
 * - không trùng palette_id trong 5 dự án gần nhất
 * - không chỉ định ngành: 3 ngành ưu tiên chiếm khoảng 60%, 9 ngành còn lại 40%
 */
"use strict";
const fs = require("fs");
const path = require("path");

const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v === undefined ? true : v]; }));
const DATA = path.join(__dirname, "..", "data");
const catalog = JSON.parse(fs.readFileSync(opt.catalog || path.join(DATA, "catalog.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(opt.registry || path.join(DATA, "registry.json"), "utf8"));
const projects = registry.projects.slice().sort((a, b) => a.date.localeCompare(b.date));
const recent = (n) => projects.slice(-n);
const last = projects[projects.length - 1];

const fail = (msg) => { console.error(msg); process.exit(2); };
if (opt.industry && !catalog.industries[opt.industry]) fail(`Ngành không có trong catalog: ${opt.industry}`);
if (opt.type && !catalog.site_types.includes(opt.type)) fail(`Loại site không hợp lệ: ${opt.type} (${catalog.site_types.join(", ")})`);
if (opt.hero && !catalog.hero_patterns.includes(opt.hero)) fail(`Hero pattern không hợp lệ: ${opt.hero} (${catalog.hero_patterns.join(", ")})`);

// Ngẫu nhiên có seed để chạy lại ra cùng kết quả
const seed = Number(opt.seed || Date.now() % 1e9);
let s = seed >>> 0;
const rand = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const notes = [];
const locked = (k) => (opt[k] ? " (khóa)" : "");

/* ---------------------------------------------------------------- 1. ngành */
function pickIndustry() {
  if (opt.industry) return opt.industry;
  const all = Object.keys(catalog.industries);
  const pri = catalog.priority_industries;
  const weights = all.map((i) => {
    let w = pri.includes(i) ? 0.6 / pri.length : 0.4 / (all.length - pri.length);
    if (last && last.industry === i) w *= 0.3; // tránh lặp ngành liền trước
    return w;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < all.length; i++) { r -= weights[i]; if (r <= 0) return all[i]; }
  return all[all.length - 1];
}
const industry = pickIndustry();
const ind = catalog.industries[industry];

/* ---------------------------------------------------------------- 2. loại site */
function pickType() {
  if (opt.type) {
    if (ind.less_fit.includes(opt.type)) notes.push(`Loại ${opt.type} nằm trong "ít hợp" của ${industry}: chỉ dùng vì người dùng chỉ định.`);
    return opt.type;
  }
  const cycle = catalog.site_types;
  const start = last ? (cycle.indexOf(last.site_type) + 1) % cycle.length : 0;
  const order = cycle.slice(start).concat(cycle.slice(0, start));
  const ok = order.find((t) => t !== (last && last.site_type) && !ind.less_fit.includes(t));
  if (ok) return ok;
  notes.push("Không có loại nào vừa hợp ngành vừa khác loại liền trước; chọn loại hợp ngành đầu tiên.");
  return ind.fit[0];
}
const siteType = pickType();

/* ---------------------------------------------------------------- 3. archetype, palette, hero */
const usedArch = new Set(recent(4).filter((p) => p.industry === industry).map((p) => p.archetype));
const usedPalette = new Set(recent(5).map((p) => p.palette_id));
const usedHero = new Set(recent(3).map((p) => p.hero_pattern));
const everArch = projects.filter((p) => p.industry === industry).map((p) => p.archetype);

function evaluate(a) {
  const palette = opt.palette || a.palette_id;
  const heroes = opt.hero ? [opt.hero] : a.heroes.filter((h) => !usedHero.has(h));
  const problems = [];
  if (usedArch.has(a.id)) problems.push(`archetype ${a.id} đã dùng cho ${industry} trong 4 dự án gần nhất`);
  if (usedPalette.has(palette)) problems.push(`palette ${palette} đã dùng trong 5 dự án gần nhất`);
  if (!heroes.length) problems.push(`mọi hero của ${a.id} (${a.heroes.join(", ")}) đều trùng 3 dự án gần nhất`);
  const lastUse = everArch.lastIndexOf(a.id); // -1 = chưa từng dùng → ưu tiên
  return { a, palette, hero: heroes[0] || a.heroes[0], problems, score: problems.length * 100 + (lastUse === -1 ? 0 : 10 + lastUse) + rand() };
}
let chosen;
if (opt.archetype) {
  const a = ind.archetypes.find((x) => x.id === opt.archetype);
  if (!a) fail(`Archetype ${opt.archetype} không có trong ngành ${industry}: ${ind.archetypes.map((x) => x.id).join(", ")}`);
  chosen = evaluate(a);
  if (chosen.problems.length) notes.push(...chosen.problems.map((p) => `${p} (giữ vì người dùng chỉ định)`));
} else {
  chosen = ind.archetypes.map(evaluate).sort((x, y) => x.score - y.score)[0];
  if (chosen.problems.length) notes.push(...chosen.problems.map((p) => `Không tránh được: ${p}`));
}
if (opt.hero && !chosen.a.heroes.includes(opt.hero)) notes.push(`Hero ${opt.hero} không nằm trong danh sách hero của archetype ${chosen.a.id}: kiểm tra lại khi viết DESIGN.md.`);

/* ---------------------------------------------------------------- 4. layout family gợi ý */
const ESSENTIAL = { "landing-page": ["faq", "cta-band"], "corporate-site": ["index-list", "map-contact"], ecommerce: ["catalog", "compare-table"] };
const pool = chosen.a.layouts || catalog.layout_families;
const freq = Object.fromEntries(pool.map((f) => [f, recent(5).filter((p) => (p.layout_families || []).includes(f)).length]));
const layouts = [...new Set(ESSENTIAL[siteType].filter((f) => pool.includes(f)).concat(pool.slice().sort((x, y) => freq[x] - freq[y] || rand() - 0.5)))].slice(0, 6);

/* ---------------------------------------------------------------- in kết quả */
const combo = { site_type: siteType, industry, archetype: chosen.a.id, archetype_name: chosen.a.name, palette_id: chosen.palette, hero_pattern: chosen.hero, layout_families: layouts, seed };
const last3 = recent(3);
if (opt.json) {
  console.log(JSON.stringify({ combo, compared_with: last3, notes }, null, 2));
} else {
  console.log("TỔ HỢP ĐỀ XUẤT");
  console.log(`  Loại site      : ${siteType}${locked("type")}`);
  console.log(`  Ngành          : ${industry}${locked("industry")}`);
  console.log(`  Archetype      : ${chosen.a.name} (${chosen.a.id})${locked("archetype")}`);
  console.log(`  palette_id     : ${chosen.palette}${locked("palette")}`);
  console.log(`  Hero pattern   : ${chosen.hero}${locked("hero")}`);
  console.log(`  Layout family  : ${layouts.join(", ")}`);
  console.log(`  seed           : ${seed} (chạy lại với --seed=${seed} để ra cùng kết quả)`);
  console.log("\nSO VỚI 3 DỰ ÁN GẦN NHẤT");
  for (const p of last3) {
    const diff = [
      p.site_type !== siteType ? "khác loại" : "CÙNG loại",
      p.industry !== industry ? "khác ngành" : (p.archetype !== chosen.a.id ? "cùng ngành, khác archetype" : "CÙNG archetype"),
      p.palette_id !== chosen.palette ? "khác palette" : "CÙNG palette",
      p.hero_pattern !== chosen.hero ? "khác hero" : "CÙNG hero",
    ];
    console.log(`  ${p.date} ${p.project.padEnd(20)} ${p.site_type}/${p.industry}/${p.hero_pattern} → ${diff.join(", ")}`);
  }
  if (notes.length) { console.log("\nLƯU Ý"); notes.forEach((n) => console.log(`  - ${n}`)); }
  console.log(`\nGhi vào registry sau khi build xong:\n  node .agents/skills/web-rotation/scripts/register.js --project=<Thu-muc> --type=${siteType} --industry=${industry} --archetype=${chosen.a.id} --palette=${chosen.palette} --hero=${chosen.hero} --layouts=${layouts.join(",")}`);
}
