---
name: web-project-scaffold
description: Dựng và kiểm tra phần khung bắt buộc của một dự án web trong website/ (hiện có .mcp.json chuẩn kết nối ePod; token ghi thẳng trong file hoặc qua biến EPOD_MCP_TOKEN_<TÊN_THƯ_MỤC>). Dùng ở bước dựng cấu trúc folder của quy trình trong frontend-themes/CLAUDE.md, khi dự án thiếu .mcp.json, hoặc khi lint báo lỗi [mcp].
---

# web-project-scaffold

## Chạy

```bash
# Một dự án / toàn bộ website/*. Luôn chạy --dry-run trước và báo bảng cho người dùng.
node .agents/skills/web-project-scaffold/scripts/ensure-mcp.js website/<Du-an> [--dry-run] [--fix] [--json]
node .agents/skills/web-project-scaffold/scripts/ensure-mcp.js --all --dry-run
```

| Hành động | Nghĩa | Ghi file |
| --- | --- | --- |
| tạo mới | chưa có `.mcp.json`, tạo từ template | có |
| đã đúng | `epodsystem` khớp chuẩn, có token (trong file hoặc biến) | không |
| đã hợp nhất | thêm `epodsystem`, giữ server khác | có |
| cần token | `epodsystem` đúng nhưng Authorization còn giữ chỗ | không |
| cần xem lại | `epodsystem` khác chuẩn hoặc JSON lỗi | chỉ khi `--fix` |

## Luật

- Chuẩn: `frontend-themes/templates/mcp.template.json`. Không thêm bớt khóa.
- Token ePod: ghi thẳng trong `website/<Du-an>/.mcp.json` là được (`website/` bị gitignore, người dùng không push).
  Muốn dùng biến môi trường thì đặt `EPOD_MCP_TOKEN_<TÊN_THƯ_MỤC>` (cột "Biến", `frontend-themes/templates/ENV-SETUP.md`).
- Không ghi token vào file được git theo dõi (skill, template, tài liệu). Không in giá trị token ra màn hình.
- Không ghi đè cả file: chỉ thêm hoặc thay khóa `epodsystem`, giữ server khác; `--fix` giữ token đang có.
- `cần xem lại`: báo người dùng, chỉ chạy `--fix` khi được duyệt.
- Có token trong `.mcp.json` nghĩa là site đã lên ePod; ghi `register.js --epod` vào registry của web-rotation.
