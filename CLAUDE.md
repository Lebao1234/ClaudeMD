# SkillMD-BDSIDCORP

Thư viện skill + các site tĩnh tiếng Việt.

- Quy trình làm site, thứ tự ưu tiên và luật cứng nằm ở `frontend-themes/CLAUDE.md`.
- File đó được nạp tự động cho mọi site qua `website/CLAUDE.md` (`@import`), và `AGENTS.md` trỏ tới nó (dùng chung với Antigravity).
- Thứ tự ưu tiên: lệnh người dùng > `DESIGN.md` dự án > `industries`/`site-types` > skill `web-*` > taste skill.

7 taste skill có `disable-model-invocation: true` vì không hợp dự án HTML thuần, không có công cụ tạo ảnh:
image-to-code, imagegen-frontend-web/-mobile, brandkit, design-taste-frontend-v1, gpt-taste, stitch-design-taste.
Không dùng chúng cho việc làm site.

## Cấu trúc

- `.agents/skills/` là bản gốc. `.claude/skills/<tên>` là junction Windows trỏ về đó.
  - Git lưu junction thành bản sao (`core.symlinks=false`).
  - Sau khi sửa skill, kiểm tra bằng `diff -rq .agents/skills .claude/skills`.
- Skill mới:
  - Tạo `.agents/skills/web-<tên>/`, rồi chạy `cmd //c mklink /J .claude\\skills\\web-<tên> .agents\\skills\\web-<tên>`.
  - Skill riêng của repo dùng tiền tố `web-`.
  - Không sửa taste skill đã cài (danh sách trong `skills-lock.json`).
- 2 taste skill đã sửa cục bộ so với upstream Leonxlnx/taste-skill: design-taste-frontend và high-end-visual-design.
  - Phần đã sửa: hero archetype, hình dạng header/footer, nav hai chế độ, cấm monogram.
  - Đồng bộ lại từ upstream sẽ mất các sửa đổi này.
- `website/<Thương-hiệu>-<ngành>/` là một site. `website/` nằm trong `.gitignore`, chỉ có ở máy.
- `frontend-themes/_legacy/` chứa bộ luật cũ và bản nháp theme, chỉ để tham khảo.

## Site có bước build (phần lớn website/)

- Sửa `src/` (pages/, partials/, data/, templates/), không sửa `.html` ở gốc (do build sinh).
- Chạy `node tools/build.js`, rồi `node tools/check.js`.
  - `check.js` kiểm token `{{...}}` còn sót, file thiếu, `#anchor`, alt ảnh, id trùng; chỉ quét HTML ở gốc.
  - Chỉ cần Node, không `npm install`.
  - Mỗi site có `build.js` riêng (token, dữ liệu riêng).
  - `check.js` của VN-Nikko quét thêm `en/`, `ja/`, `ko/`.
- Dòng đầu mỗi `src/pages/*.html` là `<!--meta {JSON}-->` (title, description, nav, crumbs, cta...).
- Build báo lỗi khi gặp dấu – hoặc — (dùng `-`).
  - `build.js` của các site cũ dừng giữa chừng: trang trước lỗi đã bị ghi đè, `sitemap.xml` chưa.
  - Gặp lỗi thì sửa và build lại ngay.
- Ngoại lệ:
  - CongthongtinNeu build bằng `tools/build-data.js` + `tools/build-pages.js` (index.html, admin.html viết tay).
  - AttackK-congnghe không có build: sửa HTML trực tiếp; `tools/deploy-*` đẩy lên ePod bằng `.mcp.json`.
  - Cả hai kiểm tra bằng `node tools/smoke-test.js` (cần jsdom).

## Bảo mật

- File `.mcp.json` chứa token thật: không bao giờ commit.
