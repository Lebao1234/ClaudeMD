# Luật thiết kế cho mọi site trong website/

Site tĩnh tiếng Việt: HTML/CSS/JS thuần, `src/` + `tools/build.js` (Node, không npm). Không đổi stack, không dùng framework.
Được nạp qua `website/CLAUDE.md` và `AGENTS.md`. Bản cũ: `_legacy/CLAUDE.v1.md` (chỉ để tham khảo).

## Thứ tự ưu tiên (cao xuống thấp)
1. Lệnh trực tiếp của người dùng.
2. `DESIGN.md` của dự án.
3. `industries/<slug>.md` và `site-types/<loại>.md`.
4. Skill `web-*` trong `.agents/skills/` (web-rotation, web-archetypes, web-layout-palette-type, web-anti-ai-lint).
5. Taste skill: chỉ bổ sung chỗ DESIGN.md không nói. Mâu thuẫn thì DESIGN.md thắng.

## Quy trình bắt buộc cho dự án mới
1. **BRIEF**: điền `templates/BRIEF.template.md` từ yêu cầu (ngành, ngách nếu `doi-song`, loại site, đối tượng, mục tiêu, dữ liệu thật đã có).
2. **Chọn tổ hợp**: `node .agents/skills/web-rotation/scripts/next-combo.js [--industry=] [--type=] [--archetype=]`.
   Phần người dùng chỉ định thì khóa; nêu lý do tổ hợp khác 3 dự án gần nhất.
3. **Đọc luật chung**: `industries/<slug>.md` + `site-types/<loại>.md`.
4. **Lấy phần đa dạng**: skill `web-archetypes` (archetype, palette_id, font, hình khối, motion) + `web-layout-palette-type` (layout, palette, typography, icon).
5. **Sinh** `DESIGN.md` + `PLAN.md` trong thư mục dự án từ `templates/`. **DỪNG, chờ người dùng duyệt.**
6. **Build** theo PLAN.md (cấu trúc thư mục bên dưới).
7. **Lint**: `node .agents/skills/web-anti-ai-lint/scripts/lint.js website/<Du-an> --industry=<slug>`, sửa hết lỗi.
8. **Kiểm tra thực tế** mobile 390px và desktop 1440px: bố cục, dấu tiếng Việt, icon, liên kết, form, không cuộn ngang.
9. **Ghi registry**: `node .agents/skills/web-rotation/scripts/register.js ...`.
10. **Báo cáo**: tổ hợp, file, danh sách `[CẦN DỮ LIỆU THẬT]`, lỗi lint đã sửa, việc tồn. Không commit khi chưa được bảo.

## Cấu trúc thư mục dự án
```
website/<Ten-nganh>/
  .claude/  .mcp.json (không commit)  DESIGN.md  PLAN.md  README.md
  assets/{css,js,img}/  src/{pages,partials,data,templates}/  tools/{build.js,check.js}
  index.html  404.html  (các trang khác do build sinh ra)
```
- Sửa `src/`, không sửa HTML ở gốc (do build sinh).
- Trang trong `src/pages/` mở đầu bằng `<!--meta {JSON}-->` (title, description, nav, crumbs...).
- `node tools/build.js` rồi `node tools/check.js` phải báo OK.

## Luật cứng (mọi dự án, không ngoại lệ)
- **Dữ liệu thật**: không bịa số liệu, testimonial, đánh giá, chứng nhận, giải thưởng, pháp lý. Thiếu thì ghi `[CẦN DỮ LIỆU THẬT]`.
- **Không giả danh**: không dùng tên, logo, ảnh, số điện thoại, địa chỉ của doanh nghiệp có thật cho thương hiệu khác.
  Ảnh lấy từ site tham khảo chỉ để dựng giao diện, phải ghi rõ trong README.
- **Tiếng Việt**: đủ dấu (cả `<title>`, meta, alt); font có subset vietnamese; không dùng dấu `–` `—` (build lỗi), dùng `-`.
- **Icon**: một bộ icon mỗi dự án, không emoji làm icon.
- **Không**: chấm màu trang trí trước eyebrow; chữ tên thương hiệu khổng lồ ở đáy footer; section head chia đôi (tiêu đề trái, mô tả phải).
- **Không**: `href="#"`, ảnh thiếu `alt`, `#000` thuần, `height: 100vh` cho hero (dùng `min-height: 100dvh`).
- **Truy cập**: tương phản WCAG AA, focus nhìn thấy, form có label, đủ landmark, tôn trọng `prefers-reduced-motion`.
- **SEO tối thiểu**: mỗi trang `<title>[Từ khóa] | [Thương hiệu]</title>`, description 140 - 165 ký tự, canonical, og:*, đúng 1 `h1`, Schema.org phù hợp.

## Taste skill
| Skill | Dùng khi |
|---|---|
| redesign-existing-projects | Nâng cấp site có sẵn (hợp stack nhất) |
| design-taste-frontend | Lấy nguyên tắc: Design Read, dial, hero ≤ 4 phần tử chữ. Bỏ phần React/Tailwind/tạo ảnh/monogram |
| minimalist-ui, industrial-brutalist-ui, high-end-visual-design | Chỉ khi archetype trong `web-archetypes` gọi tên |
| full-output-enforcement | Khi viết file dài |
| **Không dùng** | design-taste-frontend-v1, gpt-taste, stitch-design-taste, image-to-code, imagegen-frontend-web, imagegen-frontend-mobile, brandkit |

Không dùng các skill cần công cụ tạo ảnh: repo không có. Ảnh thật để trong `assets/img/` (ảnh của khách, hoặc Unsplash có ghi giấy phép).

## Lĩnh vực và loại site
- 12 lĩnh vực: `industries/` (nha-xay-dung, y-te-lam-dep, an-uong, ban-le-thuong-mai, du-lich-luu-tru, bat-dong-san,
  giao-duc, dich-vu-chuyen-nghiep, cong-nghe-phan-mem, van-tai-cong-nghiep, nong-nghiep-thuc-pham, doi-song).
- 3 loại site: `site-types/` (landing-page, corporate-site, ecommerce).
- Mẫu: `templates/` (BRIEF, DESIGN, PLAN, NEW-PROJECT.prompt).
- Quy tắc trong `industries/` và `site-types/` là chung, ổn định. Palette, archetype, layout cụ thể nằm ở skill `web-*`.
