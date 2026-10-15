---
name: web-rotation
description: Chọn tổ hợp (loại site, ngành, archetype, palette_id, hero pattern, layout family) cho dự án web mới trong website/ để các dự án không giống nhau, và ghi dự án đã làm vào registry. Dùng ở bước 2 và bước 9 của quy trình trong frontend-themes/CLAUDE.md, hoặc khi người dùng hỏi "dự án tới làm loại gì", "các site đang giống nhau", "xoay vòng".
---

# web-rotation

## Chạy

```bash
# Đề xuất tổ hợp (cờ nào có thì khóa, phần còn lại tự xoay)
node .agents/skills/web-rotation/scripts/next-combo.js [--industry=<slug>] [--type=<loại>] [--archetype=<id>] [--hero=<pattern>] [--palette=<id>] [--seed=<số>] [--json]

# Ghi dự án sau khi build xong (cập nhật nếu đã có)
node .agents/skills/web-rotation/scripts/register.js --project=<Thu-muc> --type=<loại> --industry=<slug> --archetype=<id> --hero=<pattern> [--palette=<id>] [--layouts=a,b,c] [--niche=...] [--date=YYYY-MM-DD] [--dry-run] [--force]
```

## Luật xoay

1. **Lệnh trực tiếp của người dùng luôn thắng.** Cờ khóa được giữ; vi phạm luật dưới đây chỉ in thành lưu ý.
2. **Loại site** xoay vòng landing-page → corporate-site → ecommerce, bắt đầu sau loại của dự án gần nhất.
   - Bỏ qua loại nằm trong "Ít hợp" của ngành (`frontend-themes/industries/<slug>.md` mục 5).
   - Không dùng cùng loại site 2 lần liên tiếp.
3. **Archetype**: không trùng ngành + archetype trong 4 dự án gần nhất. Ưu tiên archetype chưa từng dùng trong ngành đó.
4. **Hero pattern**: không trùng trong 3 dự án gần nhất.
5. **palette_id**: không trùng trong 5 dự án gần nhất. Hai archetype cùng ngành không dùng chung họ màu.
6. **Ngành** (khi không chỉ định): giao-duc, dich-vu-chuyen-nghiep, cong-nghe-phan-mem chiếm khoảng 60%; 9 ngành còn lại chia 40%.
   Ngành của dự án liền trước bị giảm trọng số.
7. **doi-song**: chưa có ngách thì hỏi người dùng trước khi dùng tổ hợp.
8. Kết quả có seed: ghi seed vào DESIGN.md để chạy lại ra cùng tổ hợp.

## Dữ liệu

| File | Nội dung |
| --- | --- |
| `data/registry.json` | Lịch sử dự án: project, site_type, industry, niche, archetype, palette_id, hero_pattern, layout_families, date, suy_doan |
| `data/catalog.json` | Ngành → loại hợp / ít hợp, archetype (id, tên, palette_id, hero cho phép); danh sách hero pattern và layout family |

- Dự án làm trước hệ thống ghi `archetype: "legacy"`, `palette_id: "legacy-<accent>"`.
- `suy_doan: true` là ngành, loại, hero được đoán khi audit; xác nhận với người dùng rồi sửa bằng `register.js`.
- `catalog.json` phải khớp `web-archetypes/references/<slug>.md` và `web-layout-palette-type`.
  Thêm archetype mới: khai báo ở cả hai nơi, hoặc ghi tạm bằng `register.js --force`.

## Báo lại người dùng

Khi đề xuất, nêu: tổ hợp, seed, và một dòng lý do khác với từng dự án trong 3 dự án gần nhất (script in sẵn phần "SO VỚI 3 DỰ ÁN GẦN NHẤT").
