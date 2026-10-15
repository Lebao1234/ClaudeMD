# DESIGN: [Tên dự án]

Nguồn: BRIEF.md + `industries/[slug].md` + `site-types/[loại].md` + `web-archetypes` + `web-layout-palette-type`.
File này thắng taste skill khi mâu thuẫn.

## Tổ hợp (từ web-rotation)

| Mục | Giá trị | Lý do khác 3 dự án gần nhất |
|---|---|---|
| Loại site | | |
| Ngành / ngách | | |
| Archetype | | |
| palette_id | | |
| Hero pattern | | |
| Layout family dùng | [ít nhất 4] | |
| Bộ icon | [Phosphor / Lucide / Tabler, một nét] | |
| Taste skill bật | [theo archetype] | |

Design Read: "Reading this as: [loại trang] for [khách], with [giọng] language, leaning toward [trường phái]."
Dial: `DESIGN_VARIANCE` [1-10] · `MOTION_INTENSITY` [1-10] · `VISUAL_DENSITY` [1-10]

## Token màu (60 / 30 / 10)

```css
:root {
  --neutral-0: #; --neutral-1: #; --ink: #; --muted: #;
  --primary: #; --secondary: #; --accent: #;
  --surface-dark: #; --on-dark: #;
}
```

- Vùng nền dùng trong trang (ít nhất 2 tông): [sáng / đậm / màu nhấn / ảnh full-bleed]
- Kiểm tra tương phản AA: [cặp màu chữ / nền đã kiểm]

## Chữ

| Vai trò | Font | Cỡ (clamp) | Line-height | Ghi chú |
| --- | --- | --- | --- | --- |
| Display | | | | có subset vietnamese |
| Body | | | | |
| Phụ (mono/số) | | | | không bắt buộc |

## Hình khối và chuyển động

- Bo góc: nút [ ], card [ ], ảnh [ ], input [ ] (một hệ, không bo đồng loạt mọi thứ).
- Viền, bóng: [ ]
- Ảnh: [phong cách, tỷ lệ, xử lý màu]
- Motion: [hiệu ứng nào, ở đâu, tắt khi reduced-motion]

## Header, footer, hero

- Header: [kiểu] · Footer: [kiểu] · Nav: [phẳng / mega]
- Hero: [pattern, tối đa 4 phần tử chữ, nội dung cụ thể]

## Cấm riêng cho dự án

- [mục từ industries/<slug>.md §3]
- [mục từ archetype]
- [màu, font của 3 dự án gần nhất không được lặp]
