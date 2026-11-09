# Dữ liệu

| File | Nội dung |
| --- | --- |
| `data/registry.json` | Lịch sử dự án: project, site_type, industry, niche, archetype, palette_id, hero_pattern, header_family, footer_family, layout_families, date, suy_doan, epod |
| `data/catalog.json` | Ngành → loại hợp / ít hợp, archetype (id, tên, palette_id, hero cho phép); danh sách hero pattern, layout family, header family, footer family |

- Dự án làm trước hệ thống ghi `archetype: "legacy"`, `palette_id: "legacy-<accent>"`; chưa có `header_family`/`footer_family`.
- `epod: true` là site đã đưa lên ePod; ghi bằng `register.js --epod` khi deploy.
- `suy_doan: true` là ngành, loại, hero được đoán khi audit; xác nhận với người dùng rồi sửa bằng `register.js`.
- `catalog.json` là nguồn máy đọc duy nhất cho archetype, palette_id, hero, layout, header/footer family.
  Màu và font cụ thể do agent chốt trong `DESIGN.md`. Thêm archetype mới: khai báo trong `catalog.json`, hoặc ghi tạm bằng `register.js --force`.
