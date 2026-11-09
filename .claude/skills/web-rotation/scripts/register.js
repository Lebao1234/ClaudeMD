#!/usr/bin/env node
/*
 * web-rotation / register: ghi (hoặc cập nhật) một dự án vào data/registry.json.
 *
 *   node register.js --project=<Thu-muc> --type=<loại> --industry=<slug> --archetype=<id> --hero=<pattern>
 *                    [--palette=<id>] [--header=<family>] [--footer=<family>] [--layouts=a,b,c] [--niche=...]
 *                    [--date=YYYY-MM-DD] [--epod[=false]] [--dry-run] [--force]
 *
 * - palette mặc định lấy theo archetype trong catalog.
 * - Dự án đã có (cùng --project) thì cập nhật, không thêm dòng mới.
 * - --force: chấp nhận archetype/hero/layout không có trong catalog (ví dụ archetype mới chưa khai báo).
 */
"use strict";
const fs = require("fs");
const path = require("path");

const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => { const i = a.indexOf("="); return i === -1 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const DATA = path.join(__dirname, "..", "data");
const regFile = opt.registry || path.join(DATA, "registry.json");
const catalog = JSON.parse(fs.readFileSync(opt.catalog || path.join(DATA, "catalog.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(regFile, "utf8"));

const errors = [];
const need = ["project", "type", "industry", "archetype", "hero"];
need.forEach((k) => { if (!opt[k] || opt[k] === true) errors.push(`thiếu --${k}`); });
const ind = catalog.industries[opt.industry];
if (opt.industry && !ind) errors.push(`ngành không có trong catalog: ${opt.industry}`);
if (opt.type && !catalog.site_types.includes(opt.type)) errors.push(`loại site không hợp lệ: ${opt.type}`);
const arch = ind && ind.archetypes.find((a) => a.id === opt.archetype);
if (ind && opt.archetype && !arch && !opt.force) errors.push(`archetype ${opt.archetype} không có trong ${opt.industry} (dùng --force nếu là archetype mới)`);
if (opt.hero && !catalog.hero_patterns.includes(opt.hero) && !opt.force) errors.push(`hero không hợp lệ: ${opt.hero}`);
if (opt.header && !catalog.header_families.includes(opt.header) && !opt.force) errors.push(`header family không hợp lệ: ${opt.header}`);
if (opt.footer && !catalog.footer_families.includes(opt.footer) && !opt.force) errors.push(`footer family không hợp lệ: ${opt.footer}`);
const layouts = opt.layouts && opt.layouts !== true ? String(opt.layouts).split(",").map((s) => s.trim()).filter(Boolean) : [];
const badLayouts = layouts.filter((l) => !catalog.layout_families.includes(l));
if (badLayouts.length && !opt.force) errors.push(`layout family không có trong catalog: ${badLayouts.join(", ")}`);
const palette = opt.palette || (arch && arch.palette_id);
if (!palette) errors.push("thiếu --palette (archetype không có palette_id mặc định)");
const date = opt.date || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push(`--date sai định dạng YYYY-MM-DD: ${date}`);
if (opt.project && !opt.force && !fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "website", opt.project))) {
  console.warn(`Cảnh báo: không thấy thư mục website/${opt.project} (vẫn ghi)`);
}
if (errors.length) { console.error("Không ghi được:\n  - " + errors.join("\n  - ")); process.exit(2); }

const idx = registry.projects.findIndex((p) => p.project === opt.project);
const old = idx === -1 ? {} : registry.projects[idx];
// Cập nhật: trường không truyền thì giữ giá trị cũ
const entry = { project: opt.project, site_type: opt.type, industry: opt.industry };
const niche = opt.niche && opt.niche !== true ? opt.niche : old.niche;
if (niche) entry.niche = niche;
const header = opt.header && opt.header !== true ? opt.header : old.header_family;
if (header) entry.header_family = header;
const footer = opt.footer && opt.footer !== true ? opt.footer : old.footer_family;
if (footer) entry.footer_family = footer;
Object.assign(entry, { archetype: opt.archetype, palette_id: palette, hero_pattern: opt.hero, layout_families: layouts.length ? layouts : old.layout_families || [], date: opt.date ? date : old.date || date, suy_doan: false });
// Đã đưa lên ePod chưa: --epod hoặc --epod=true|false, không truyền thì giữ giá trị cũ
entry.epod = opt.epod === undefined ? old.epod === true : opt.epod === true || opt.epod === "true";

const action = idx === -1 ? "thêm" : "cập nhật";
if (idx === -1) registry.projects.push(entry); else registry.projects[idx] = entry;
registry.projects.sort((a, b) => a.date.localeCompare(b.date));

// Mỗi dự án một dòng cho dễ đọc diff
const body = registry.projects.map((p) => "    " + JSON.stringify(p).replace(/":/g, '": ').replace(/,"/g, ', "')).join(",\n");
const out = `{\n  "_ghi_chu": ${JSON.stringify(registry._ghi_chu)},\n  "projects": [\n${body}\n  ]\n}\n`;

if (opt["dry-run"]) { console.log(`[dry-run] sẽ ${action}:`, JSON.stringify(entry)); process.exit(0); }
fs.writeFileSync(regFile, out, "utf8");
console.log(`Đã ${action} ${opt.project} vào registry (${registry.projects.length} dự án).`);
