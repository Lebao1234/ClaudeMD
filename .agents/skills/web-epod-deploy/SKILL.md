---
name: web-epod-deploy
description: Đưa một site tĩnh đã build trong website/ lên ePod (store <slug>.epodsystem.com) bằng một script dùng chung - ảnh lên media (tự đổi SVG sang webp), CSS/JS thành theme asset, mỗi phần của <main> thành section Liquid chỉnh được, trang CMS /pages/<slug>, header/footer, menu, form is_form nhận đơn, SEO. Dùng khi người dùng nói "đưa lên ePod", "deploy", "push ePod", khi sửa site đã có trên ePod, hoặc khi gặp lỗi hợp đồng section của ePod.
---

# web-epod-deploy

Chạy từ gốc repo, sau `build.js` + `check.js` của site. Cần token ePod trong `website/<Du-an>/.mcp.json` (skill `web-project-scaffold`).

## Chạy

```bash
node .agents/skills/web-epod-deploy/scripts/epod.js website/<Du-an> export   # xem trước .epod/out/, không đẩy
node .agents/skills/web-epod-deploy/scripts/epod.js website/<Du-an> push     # đẩy hết, in URL store khi xong
node .agents/skills/web-epod-deploy/scripts/mcp.js  website/<Du-an> get_context '{}'   # gọi 1 tool ePod
```

1. Site mới: chép mẫu `epod.config.js` trong `references/cau-hinh.md` vào gốc site, sửa phần riêng.
2. `export` trước, đọc vài file `.epod/out/sections/*.liquid`; `push` khi đã ổn.
3. Kiểm trên site thật bằng skill `web-qa` (`shots.js` với URL store). Có form: gửi 1 bản ghi thử, xem bằng
   `list_content_records`, rồi xóa bằng `deleteContentRecord(type_code, id)`.
4. Ghi `--epod` vào registry (skill `web-rotation`).

## Tài liệu (chỉ nạp file cần cho việc đang làm)

| Việc | File |
| --- | --- |
| Viết `epod.config.js` cho site mới, ý nghĩa từng khóa | `references/cau-hinh.md` |
| `push` bị từ chối, site trên ePod hiển thị sai, form không nhận | `references/loi-epod.md` |

Site đã chạy trên script chung: Mexung-anuong. Các site cũ (Cocphache, Phusong, MathE, Anhvang, EnSchool) còn bản riêng
trong `tools/epod*.js`; chuyển sang script chung khi sửa lại site đó (viết `epod.config.js`, so `export` với bản cũ).
