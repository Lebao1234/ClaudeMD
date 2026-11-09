---
name: web-rotation
description: Chọn tổ hợp (loại site, ngành, archetype, palette_id, hero pattern, layout family, header/footer family) cho dự án web mới trong website/ để các dự án không giống nhau, và ghi dự án đã làm vào registry. Dùng ở bước 2 và bước 9 của quy trình trong frontend-themes/CLAUDE.md, hoặc khi người dùng hỏi "dự án tới làm loại gì", "các site đang giống nhau", "xoay vòng".
---

# web-rotation

## Chạy

```bash
# Đề xuất tổ hợp (cờ nào có thì khóa, phần còn lại tự xoay)
node .agents/skills/web-rotation/scripts/next-combo.js [--industry=<slug>] [--type=<loại>] [--archetype=<id>] [--hero=<pattern>] [--palette=<id>] [--header=<family>] [--footer=<family>] [--seed=<số>] [--json]

# Ghi dự án sau khi build xong (cập nhật nếu đã có)
node .agents/skills/web-rotation/scripts/register.js --project=<Thu-muc> --type=<loại> --industry=<slug> --archetype=<id> --hero=<pattern> [--palette=<id>] [--header=<family>] [--footer=<family>] [--layouts=a,b,c] [--niche=...] [--date=YYYY-MM-DD] [--dry-run] [--force]
```

## Tài liệu (chỉ nạp file cần cho việc đang làm)

| Việc | File |
| --- | --- |
| Hiểu vì sao script chọn tổ hợp, xử lý lưu ý | `references/luat-xoay.md` |
| Sửa registry, thêm archetype vào catalog | `references/du-lieu.md` |

## Báo lại người dùng

Khi đề xuất, nêu: tổ hợp, seed, và một dòng lý do khác với từng dự án trong 3 dự án gần nhất (script in sẵn phần "SO VỚI 3 DỰ ÁN GẦN NHẤT").
