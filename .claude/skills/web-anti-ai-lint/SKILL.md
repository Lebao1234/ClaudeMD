---
name: web-anti-ai-lint
description: Kiểm tra và sửa dấu vết "trang do AI làm" trên site tĩnh tiếng Việt trong website/. Dùng trước khi bàn giao hoặc sau khi build một dự án, khi viết copy tiếng Việt, khi rà một site có sẵn, hoặc khi người dùng nói site "trông như AI", "sáo rỗng", "nhàm". Có script lint.js quét emoji, cụm sáo rỗng, placeholder, href="#", alt, lang, heading, cam kết quá mức theo ngành.
---

# web-anti-ai-lint

Lớp kiểm tra cuối của quy trình trong `frontend-themes/CLAUDE.md` (bước 7). Không thay DESIGN.md của dự án.

## Chạy

```bash
node .agents/skills/web-anti-ai-lint/scripts/lint.js website/<Du-an> --industry=<slug>
```

- Quét mọi `*.html` đã build (gốc dự án và thư mục ngôn ngữ như `en/`), bỏ qua `src/`, `assets/`, `tools/`, `node_modules/`.
- Kết quả theo `file:dòng`.
  - `LỖI` phải sửa hết.
  - `CẢNH BÁO` phải xem từng mục: sửa, hoặc giữ kèm lý do.
- Thoát với mã 1 nếu còn `LỖI`.
- Bỏ qua có chủ đích một dòng: thêm `<!-- lint-ok: lý do -->` trên cùng dòng (chỉ khi có dữ liệu xác nhận).
- `--json` để in kết quả dạng JSON. `--industry` là một trong 12 slug ở `frontend-themes/industries/`.

## Tài liệu (nạp khi cần)

- `references/rules.md`: luật icon, chữ, hình, nhịp bố cục (đọc khi viết DESIGN.md/PLAN.md hoặc khi sửa lỗi bố cục).
- `references/banned-phrases-vi.md`: cụm sáo rỗng và cách viết thay (đọc khi viết copy; script đọc bảng trong file này).

## Pre-flight (tick trước khi báo xong)

- [ ] `lint.js` không còn `LỖI`; mọi `CẢNH BÁO` đã xử lý hoặc ghi lý do.
- [ ] Không emoji làm icon; cả dự án dùng một bộ icon, một nét.
- [ ] Không số liệu, testimonial, chứng nhận bịa; chỗ thiếu ghi `[CẦN DỮ LIỆU THẬT]` và đã liệt kê cho người dùng.
- [ ] Mỗi tiêu đề section có đối tượng, con số hoặc hành động cụ thể; không cụm trong `banned-phrases-vi.md`.
- [ ] Đủ dấu tiếng Việt ở chữ hiển thị, `<title>`, meta description, `alt`.
- [ ] Không 2 section liền kề cùng layout family; ít nhất 4 family mỗi trang; "3 card icon" tối đa 1 lần.
- [ ] Nền xen kẽ ít nhất 2 tông (sáng / đậm / màu nhấn / ảnh full-bleed).
- [ ] Không gradient tím-xanh, không glassmorphism mặc định, không bo góc đồng loạt mọi khối.
- [ ] Hero không phải "badge + tiêu đề + 2 nút" căn giữa (trừ khi DESIGN.md chọn có lý do).
- [ ] Đã xem thực tế ở 390px và 1440px.
