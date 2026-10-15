# Dữ liệu

| File | Nội dung |
| --- | --- |
| `data/registry.json` | Lịch sử dự án: project, site_type, industry, niche, archetype, palette_id, hero_pattern, layout_families, date, suy_doan |
| `data/catalog.json` | Ngành → loại hợp / ít hợp, archetype (id, tên, palette_id, hero cho phép); danh sách hero pattern và layout family |

- Dự án làm trước hệ thống ghi `archetype: "legacy"`, `palette_id: "legacy-<accent>"`.
- `suy_doan: true` là ngành, loại, hero được đoán khi audit; xác nhận với người dùng rồi sửa bằng `register.js`.
- `catalog.json` phải khớp `web-archetypes/references/<slug>.md` và `web-layout-palette-type`.
  Thêm archetype mới: khai báo ở cả hai nơi, hoặc ghi tạm bằng `register.js --force`.
