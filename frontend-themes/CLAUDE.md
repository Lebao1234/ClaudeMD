# Luật thiết kế cho mọi site trong website/

Site tĩnh tiếng Việt: HTML/CSS/JS thuần, `src/` + `tools/build.js` (Node, không npm). Không đổi stack, không dùng framework.
Được nạp qua `website/CLAUDE.md` và `AGENTS.md`. Bản cũ: `_legacy/CLAUDE.v1.md` (chỉ để tham khảo).

## Thứ tự ưu tiên (cao xuống thấp)

1. Lệnh trực tiếp của người dùng.
2. `DESIGN.md` của dự án.
3. `industries/<slug>.md` và `site-types/<loại>.md`.
4. Skill `web-*` trong `.agents/skills/` (web-rotation, web-project-scaffold, web-anti-ai-lint, web-qa, web-epod-deploy).
5. Taste skill: chỉ bổ sung chỗ DESIGN.md không nói. Mâu thuẫn thì DESIGN.md thắng.

## Quy trình bắt buộc cho dự án mới

1. **BRIEF**: điền `templates/BRIEF.template.md` và lưu thành `BRIEF.md` trong thư mục dự án (ngành, ngách nếu `doi-song`, loại site, đối tượng, mục tiêu, dữ liệu thật, liên hệ thật).
2. **Chọn tổ hợp**: `node .agents/skills/web-rotation/scripts/next-combo.js [--industry=] [--type=] [--archetype=] [--header=] [--footer=]`.
   Phần người dùng chỉ định thì khóa; nêu lý do tổ hợp khác 3 dự án gần nhất, gồm cả header/footer family.
3. **Đọc luật chung**: `industries/<slug>.md` + `site-types/<loại>.md`.
4. **Chốt thiết kế**: lấy archetype, palette_id, hero, layout, header/footer family từ `.agents/skills/web-rotation/data/catalog.json`; tự chốt mã màu, font, spacing trong `DESIGN.md`. Không dùng skill không có trong repo.
5. **Sinh** `DESIGN.md` + `PLAN.md` trong thư mục dự án từ `templates/`, gồm bảng UI toàn cục (thanh liên hệ nổi, khối email) và kiểm tra đa dạng section/header/footer. **DỪNG, chờ người dùng duyệt.**
6. **Build** theo PLAN.md (cấu trúc thư mục bên dưới). Chạy `node tools/build.js` rồi `node tools/check.js`, cả hai phải báo OK.
7. **Lint**: `node .agents/skills/web-anti-ai-lint/scripts/lint.js website/<Du-an> --industry=<slug>`, sửa hết lỗi.
8. **Kiểm tra thực tế**: `node .agents/skills/web-qa/scripts/shots.js website/<Du-an> --pages=index.html,...` (tự chụp desktop 1440px và mobile 390px) và `node website/<Du-an>/tools/smoke.js`. Soi bố cục, dấu tiếng Việt, icon, liên kết, form, giỏ/lọc, thanh liên hệ nổi, khối email, không cuộn ngang.
9. **Ghi registry**: `node .agents/skills/web-rotation/scripts/register.js ... --header=<family> --footer=<family> --layouts=...`.
10. **Đưa lên ePod** khi người dùng yêu cầu: skill `web-epod-deploy` (`epod.config.js` + `epod.js push`), rồi `web-qa` trên URL store.
11. **Báo cáo**: tổ hợp, file, danh sách `[CẦN DỮ LIỆU THẬT]`, lỗi lint đã sửa, việc tồn. Không commit khi chưa được bảo.

## Cấu trúc thư mục dự án

```text
website/<Ten-nganh>/
  .claude/  .mcp.json (không commit)  BRIEF.md  DESIGN.md  PLAN.md  README.md
  assets/{css,js,img}/  src/{pages,partials,data,templates}/  tools/{build.js,check.js,smoke.js}
  index.html  404.html  sitemap.xml  (các trang khác do build sinh ra)
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

## Đa dạng bố cục

- Mỗi trang chủ tối thiểu 5 layout family; không 2 section liền kề cùng family.
- Mỗi kiểu section chính (lưới 3 card đều, dải stats, testimonial, blog teaser 3 bài, bảng giá, FAQ accordion) tối đa 1 lần/trang; muốn lặp thì đổi sang family khác: lưới -> danh sách -> bento -> băng cuộn ngang; stats -> số lớn -> metric inline; testimonial -> trích dẫn đơn -> tường 2 cột -> case rows; quy trình -> steps ngang -> timeline dọc -> sticky-scroll; dịch vụ -> tabs -> accordion -> bảng so sánh; CTA -> band -> form inline -> thanh dính đáy -> panel email.
- Không lặp công thức hero -> stats -> 3 card -> quy trình -> gallery -> testimonial -> 3 bài -> CTA ở 2 dự án liên tiếp.
- Header/footer dùng đúng family đã chốt; không sao chép kiểu của 3 dự án gần nhất.
- Nền xen kẽ ít nhất 3 tông: sáng, xám/tint, tối hoặc ảnh full-bleed.

## Khối UI bắt buộc cho site bán hàng / giới thiệu

- **Thanh liên hệ nổi**: cố định góc phải dưới, gồm Facebook, Zalo, gọi điện (thêm email nếu có). Nút 44x44, một bộ icon, có nhãn/tooltip và `aria-label`, focus thấy. Chỉ dùng link thật; chưa có thì ẩn nút và ghi `[CẦN DỮ LIỆU THẬT]`, cấm `href="#"`. Không che nội dung; mobile đặt trên thanh CTA/mua dính đáy và dùng `safe-area-inset`. Không tự mở chat, không nhấp nháy.
- **Khối nhận thông báo sản phẩm bằng email**: nút chuông/thư trong thanh nổi mở panel khi hover/focus trên desktop, tap trên mobile; lần đầu tự mở sau khi cuộn 40-60% hoặc sau 8-12 giây, không che hero và không bật ngay khi tải. Có input email, checkbox đồng ý nhận tin (mặc định không tick), link chính sách, nút đóng, Esc đóng, focus trap nếu là modal, `aria-live` khi gửi. Chỉ hiện 1 lần/phiên (`sessionStorage`), tắt animation khi `prefers-reduced-motion`. Endpoint thật hoặc mô phỏng có ghi README; không bịa trạng thái "đã đăng ký".
- Hai khối này không được che CTA chính, không đặt cạnh nhau ở mobile, và phải có trong `PLAN.md` trước khi build.
- Hook cố định để QA và để mọi dự án dùng cùng cấu trúc: `[data-contact-rail]`, `[data-contact="facebook|zalo|phone|email"]`, `[data-notify]`, `[data-notify-open]`, `[data-notify-form]`, `[data-notify-email]`, `[data-notify-consent]`, `[data-notify-close]`, `[data-notify-status]`.

## Taste skill

| Skill | Dùng khi |
| --- | --- |
| redesign-existing-projects | Nâng cấp site có sẵn (hợp stack nhất) |
| design-taste-frontend | Lấy nguyên tắc: Design Read, dial, hero ≤ 4 phần tử chữ. Bỏ phần React/Tailwind/tạo ảnh/monogram |
| minimalist-ui, industrial-brutalist-ui, high-end-visual-design | Chỉ khi archetype chốt trong `DESIGN.md` gọi tên |
| full-output-enforcement | Khi viết file dài |
| **Không dùng** | design-taste-frontend-v1, gpt-taste, stitch-design-taste, image-to-code, imagegen-frontend-web, imagegen-frontend-mobile, brandkit |

Không dùng các skill cần công cụ tạo ảnh: repo không có. Ảnh thật để trong `assets/img/` (ảnh của khách, hoặc Unsplash có ghi giấy phép).

## Lĩnh vực và loại site

- 12 lĩnh vực: `industries/` (nha-xay-dung, y-te-lam-dep, an-uong, ban-le-thuong-mai, du-lich-luu-tru, bat-dong-san,
  giao-duc, dich-vu-chuyen-nghiep, cong-nghe-phan-mem, van-tai-cong-nghiep, nong-nghiep-thuc-pham, doi-song).
- 3 loại site: `site-types/` (landing-page, corporate-site, ecommerce).
- Mẫu: `templates/` (BRIEF, DESIGN, PLAN, NEW-PROJECT.prompt).
- Quy tắc trong `industries/` và `site-types/` là chung, ổn định. Archetype, layout, header/footer family nằm ở `web-rotation/data/catalog.json`; màu và font chốt trong `DESIGN.md`.
