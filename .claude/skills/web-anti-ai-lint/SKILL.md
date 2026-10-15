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

## Tài liệu (chỉ nạp file cần cho việc đang làm)

| Việc | File |
| --- | --- |
| Viết copy, tiêu đề, CTA | `references/chu.md` + file hợp loại trang trong `references/cum-sao-rong/` |
| Chọn icon, hình, bo góc, hero | `references/icon-hinh.md` |
| Viết PLAN.md, sắp section | `references/bo-cuc.md` |
| Sửa lỗi kỹ thuật, cam kết theo ngành | `references/ky-thuat-nganh.md` |
| Trước khi báo xong | `references/preflight.md` |

`cum-sao-rong/`: `doanh-nghiep.md`, `ky-thuat-ket-qua.md`, `ban-hang-trai-nghiem.md`, `han-che.md`. `lint.js` đọc mọi bảng trong thư mục; thêm cụm bằng cách thêm dòng.
