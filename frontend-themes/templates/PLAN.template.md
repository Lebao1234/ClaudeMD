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

Kiểm tra: không 2 section liền kề cùng layout family; ít nhất 4 family; "3 card icon" tối đa 1 lần; nền xen kẽ.

### [trang khác]

## File cần tạo

- `src/data/`: [site.js, services.js ...]
- `src/partials/`: header.html, footer.html, [form.html]
- `src/templates/`: [ ]
- `assets/`: css/style.css, js/main.js, img/ (danh sách ảnh)
- `tools/`: build.js (token: [ ]), check.js
- `README.md`, `.claude/`, `.mcp.json` (không commit)

## Cần dữ liệu thật

| Mục | Trang | Đang để |
|---|---|---|
| | | `[CẦN DỮ LIỆU THẬT]` |

## Việc tồn sau khi build

- [form endpoint, analytics, thanh toán thật, CMS...]
