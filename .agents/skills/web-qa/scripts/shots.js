#!/usr/bin/env node
// Chụp màn hình site bằng Chrome headless: desktop 1440px và mobile 390px.
// Chrome headless trên Windows không thu cửa sổ dưới ~500px, nên bản mobile chụp qua trang bọc có <iframe> rộng 390px.
//
//   node .agents/skills/web-qa/scripts/shots.js website/<Du-an> [--pages=index.html,gio-hang.html] [--height=4000] [--out=<thư mục>]
//   node .agents/skills/web-qa/scripts/shots.js https://<store>.epodsystem.com [--pages=/,/pages/cua-hang]
//
// Ảnh dài được cắt thành đoạn 1600px (cần Python + Pillow; không có thì giữ ảnh nguyên) để xem bằng Read không bị thu nhỏ quá.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
if (!target) { console.log("Dùng: shots.js <website/Du-an | https://...> [--pages=a.html,b.html] [--height=4000] [--out=dir]"); process.exit(1); }

const CHROME = process.env.CHROME || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => fs.existsSync(p));
if (!CHROME) { console.error("Không thấy Chrome/Edge. Đặt biến CHROME=<đường dẫn>."); process.exit(1); }

const remote = /^https?:\/\//.test(target);
const base = remote ? target.replace(/\/$/, "") : "file:///" + path.resolve(target).split(path.sep).join("/");
// Git Bash đổi tham số "/pages/x" thành "C:/.../Git/pages/x" (MSYS path conversion): gỡ phần bị chèn
const pages = opt("pages", remote ? "/" : "index.html").split(",").map((p) => p.replace(/^[A-Za-z]:[\\/](?:.*?[\\/])?Git[\\/]?/, "/"));
const height = Number(opt("height", 4000));
const name = remote ? new URL(target).hostname.split(".")[0] : path.basename(path.resolve(target));
const out = path.resolve(opt("out", path.join(os.tmpdir(), "web-qa", name)));
fs.mkdirSync(out, { recursive: true });

const chrome = (url, w, h, file) => spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
  `--window-size=${w},${h}`, "--virtual-time-budget=8000", `--screenshot=${file}`, url], { stdio: "ignore", timeout: 120000 });

const shots = [];
for (const pg of pages) {
  const url = remote ? base + (pg.startsWith("/") ? pg : "/" + pg) : base + "/" + pg;
  const slug = (pg.replace(/^\/|\.html$/g, "").replace(/[\/?=&]+/g, "_") || "index");
  const desk = path.join(out, `${slug}-1440.png`);
  chrome(url, 1440, height, desk);
  const wrap = path.join(out, `_${slug}-390.html`);
  fs.writeFileSync(wrap, `<!doctype html><body style="margin:0;background:#888"><iframe src="${url}" style="width:390px;height:${height}px;border:0;display:block"></iframe></body>`);
  const mob = path.join(out, `${slug}-390.png`);
  chrome("file:///" + wrap.split(path.sep).join("/"), 400, height, mob);
  fs.unlinkSync(wrap);
  shots.push(desk, mob);
}

// cắt ảnh dài; bản mobile cắt bỏ phần nền xám bên phải iframe
const py = `
import sys
from PIL import Image
for f in sys.argv[1:]:
    im = Image.open(f)
    if f.endswith('-390.png'): im = im.crop((0, 0, 390, im.size[1]))
    step = 1600
    for i, y in enumerate(range(0, im.size[1], step)):
        im.crop((0, y, im.size[0], min(im.size[1], y + step))).save(f[:-4] + '-p%d.png' % (i + 1))
`;
const r = spawnSync(process.platform === "win32" ? "python" : "python3", ["-c", py, ...shots], { encoding: "utf8" });
const sliced = r.status === 0;
console.log(`Ảnh ở ${out}${sliced ? " (đã cắt đoạn -p1, -p2...)" : " (chưa cắt đoạn: thiếu Python/Pillow)"}`);
for (const s of shots) console.log("  " + s);
