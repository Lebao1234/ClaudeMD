# DESIGN: [Tên dự án]

Nguồn: BRIEF.md + `industries/[slug].md` + `site-types/[loại].md` + `.agents/skills/web-rotation/data/catalog.json`.
File này thắng taste skill khi mâu thuẫn.

## Tổ hợp (từ web-rotation)

| Mục | Giá trị | Lý do khác 3 dự án gần nhất |
| --- | --- | --- |
| Loại site | | |
| Ngành / ngách | | |
| Archetype | | |
| palette_id | | |
| Hero pattern | | |
| Header family | [utility-bar / centered-logo / transparent-over-hero / split-cta / mega-catalog / minimal-drawer] | |
| Footer family | [editorial-4col / compact-legal / dark-cta / contact-first / minimal-single-row / mega-sitemap] | |
| Layout family dùng | [ít nhất 5] | |
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

- Vùng nền dùng trong trang (ít nhất 3 tông): [sáng / xám-tint / đậm / màu nhấn / ảnh full-bleed]
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

- Header: [family, kiểu nền, hành vi khi cuộn, mobile] · Footer: [family, số cột, khối CTA]
- Nghĩa family: utility-bar (dải tiện ích + nav), centered-logo, transparent-over-hero, split-cta, mega-catalog (ecommerce), minimal-drawer; footer: editorial-4col, compact-legal, dark-cta, contact-first, minimal-single-row, mega-sitemap.
- Nav: [phẳng / mega / drawer]
- Hero: [pattern, tối đa 4 phần tử chữ, nội dung cụ thể]

## UI toàn cục

| Khối | Vị trí | Hành vi | Dữ liệu |
| --- | --- | --- | --- |
| Thanh liên hệ nổi | góc phải dưới | Facebook, Zalo, gọi điện; 44x44; không che CTA/mua | link thật hoặc `[CẦN DỮ LIỆU THẬT]` |
| Nhận thông báo email | panel phải dưới, hover/focus; thêm bản inline ở footer/trang sản phẩm | trigger 40-60% hoặc 8-12 giây, 1 lần/phiên, Esc đóng | endpoint + checkbox đồng ý, link chính sách |

Hook QA: `[data-contact-rail]`, `[data-contact]`, `[data-notify]`, `[data-notify-open]`, `[data-notify-form]`, `[data-notify-email]`, `[data-notify-consent]`, `[data-notify-close]`, `[data-notify-status]`; sessionStorage `notify-dismissed`.

## Đa dạng section

- Thứ tự section trang chủ (khác 3 dự án gần nhất): [liệt kê]
- Section chỉ dùng 1 lần/trang: [lưới 3 card đều, stats, testimonial, blog teaser, bảng giá, FAQ]
- Thay thế khi muốn lặp:
  - Lưới card -> danh sách hàng ngang -> bento -> băng cuộn ngang.
  - Dải stats -> số lớn một cột -> metric inline trong đoạn.
  - Testimonial -> trích dẫn đơn -> tường 2 cột -> case rows.
  - Quy trình -> steps ngang -> timeline dọc -> sticky-scroll.
  - Dịch vụ -> tabs -> accordion -> bảng so sánh -> index list.
  - CTA -> band cuối trang -> form inline -> thanh dính đáy -> panel email.
- Nền xen kẽ: [ít nhất 3 tông]

## Cấm riêng cho dự án

- [mục từ industries/<slug>.md §3]
- [mục từ archetype]
- [màu, font của 3 dự án gần nhất không được lặp]
