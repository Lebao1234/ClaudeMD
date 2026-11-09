# PLAN: [Tên dự án]

Trạng thái: [chờ duyệt / đã duyệt dd/mm] · Loại site: [ ] · Ngành: [ ]

## Danh sách trang

| File | Mục đích | Sinh từ |
|---|---|---|
| index.html | | src/pages/index.html |
| 404.html | | src/pages/404.html |
| | | src/templates/... + src/data/... |

## Section từng trang

### index.html

| # | Section | Layout family | Nền | Nội dung chính | Dữ liệu |
|---|---|---|---|---|---|
| 1 | Hero | [pattern] | [tông] | [tiêu đề, mô tả, CTA] | [thật / CẦN DỮ LIỆU THẬT] |
| 2 | | | | | |

Kiểm tra: không 2 section liền kề cùng layout family; ít nhất 5 family ở trang chủ; mỗi kiểu section chính tối đa 1 lần/trang; nền xen kẽ ít nhất 3 tông.

### [trang khác]

## UI toàn cục

| Khối | Trang | Vị trí | Hành vi | Dữ liệu |
| --- | --- | --- | --- | --- |
| Thanh liên hệ nổi | toàn site | góc phải dưới | Facebook, Zalo, gọi điện; mobile đặt trên thanh mua/CTA | link thật hoặc `[CẦN DỮ LIỆU THẬT]` |
| Nhận thông báo email | toàn site | panel phải dưới + inline footer/trang sản phẩm | hover/focus, trigger 40-60% hoặc 8-12 giây, 1 lần/phiên | endpoint + checkbox đồng ý |

## Kiểm tra đa dạng

| Kiểu section | Số lần trong trang | Ghi chú |
| --- | --- | --- |
| Lưới 3 card đều | [tối đa 1] | |
| Dải stats | [tối đa 1] | |
| Testimonial | [tối đa 1] | |
| Blog teaser 3 bài | [tối đa 1] | |
| Bảng giá / FAQ accordion | [tối đa 1] | |

## File cần tạo

- `src/data/`: [site.js, services.js ...]
- `src/partials/`: header.html, footer.html, [form.html]
- `src/templates/`: [ ]
- `assets/`: css/style.css, js/main.js, img/ (danh sách ảnh)
- `tools/`: build.js (token: [ ]), check.js, smoke.js
- `README.md`, `.claude/`, `sitemap.xml` (build sinh)
- `.mcp.json` (bắt buộc): tạo bằng `ensure-mcp.js`, đúng `templates/mcp.template.json`, token dán vào file hoặc đặt biến

## Cần dữ liệu thật

| Mục | Trang | Đang để |
|---|---|---|
| | | `[CẦN DỮ LIỆU THẬT]` |

## Việc tồn sau khi build

- [form endpoint, analytics, thanh toán thật, CMS...]
