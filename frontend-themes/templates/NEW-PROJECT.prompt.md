# Prompt mẫu: dự án mới

Sao chép phần dưới, điền vào chỗ trong ngoặc vuông, gửi cho Claude Code hoặc Antigravity.

```text
Đọc frontend-themes/CLAUDE.md và làm đúng quy trình trong đó.

DỰ ÁN MỚI
- Thư mục: website/[Ten-duan-nganh]
- Ngành: [nha-xay-dung | y-te-lam-dep | an-uong | ban-le-thuong-mai | du-lich-luu-tru | bat-dong-san | giao-duc | dich-vu-chuyen-nghiep | cong-nghe-phan-mem | van-tai-cong-nghiep | nong-nghiep-thuc-pham | doi-song | để trống để tự xoay]
- Ngách (nếu là doi-song): [thời trang | thể thao | thú cưng | sự kiện | cộng đồng | blog | khác: ...]
- Loại site: [landing-page | corporate-site | ecommerce | để trống để xoay]
- Brief: [khách hàng là ai, đối tượng của họ, mục tiêu chính của website, tông giọng mong muốn]
- Nội dung/ảnh/số liệu thật đã có: [liệt kê, hoặc "chưa có"]
- Liên hệ thật: [Facebook page URL, Zalo số/URL, hotline, email nhận thông báo sản phẩm; hoặc "chưa có"]
- Tham khảo (nếu có): [link hoặc mô tả]
- Ghi đè (nếu có): [ví dụ: màu chủ đạo, archetype, hero pattern, header/footer family bắt buộc]

YÊU CẦU
0. Tạo BRIEF.md trong thư mục dự án từ frontend-themes/templates/BRIEF.template.md. Ghi rõ liên hệ thật đã có và các mục [CẦN DỮ LIỆU THẬT].

1. Chọn tổ hợp bằng:
     node .agents/skills/web-rotation/scripts/next-combo.js [--industry=] [--type=] [--archetype=] [--header=] [--footer=]
   - Không dùng skill web-archetypes hay web-layout-palette-type (không có trong repo). Lấy archetype, palette_id, hero pattern, layout family, header/footer family từ .agents/skills/web-rotation/data/catalog.json.
   - Nêu tổ hợp được chọn, seed, và lý do khác 3 dự án gần nhất (gồm cả header/footer).
   - Phần tôi đã chỉ định thì khóa theo tôi.

2. Sinh DESIGN.md + PLAN.md từ templates/. DỪNG và chờ tôi duyệt trước khi viết code.
   DESIGN.md phải có:
   - Header family và footer family đã chọn, kèm lý do khác 3 dự án gần nhất.
   - Token màu cụ thể (mã hex), font có subset vietnamese, thang chữ, bo góc, motion.
   - Danh sách layout family dùng trong trang chủ (tối thiểu 5) và kiểu section nào chỉ dùng 1 lần.
   PLAN.md phải có:
   - Bảng section từng trang: layout family, nền, nội dung, dữ liệu thật hay [CẦN DỮ LIỆU THẬT].
   - Bảng UI toàn cục: thanh liên hệ nổi, khối nhận thông báo email (vị trí, trigger, hành vi, endpoint).
   - Mục "Kiểm tra đa dạng": số lần lặp của từng kiểu section, không 2 section liền kề cùng family.

3. Sau khi tôi duyệt, dựng đúng cấu trúc folder chuẩn:
     .claude/, assets/, src/{pages,partials,data,templates}/, tools/{build.js,check.js,smoke.js},
     .mcp.json, BRIEF.md, README.md, 404.html, index.html, sitemap.xml và các trang theo PLAN.md.
   Tạo .mcp.json bằng `node .agents/skills/web-project-scaffold/scripts/ensure-mcp.js website/<Ten-duan>` (dán token ePod vào Authorization, hoặc đặt biến ở cột "Biến").
   Viết `tools/smoke.js` theo `.agents/skills/web-qa/references/smoke-test.md`.
   Chạy `node tools/build.js` rồi `node tools/check.js`, cả hai phải báo OK.

4. Đa dạng bố cục (luật cứng):
   - Trang chủ tối thiểu 5 layout family; không 2 section liền kề cùng family.
   - Mỗi kiểu section chính (lưới 3 card đều, dải stats, testimonial, blog teaser 3 bài, bảng giá, FAQ accordion) tối đa 1 lần/trang. Muốn lặp thì đổi sang family khác: lưới -> danh sách -> bento -> băng cuộn ngang; stats -> số lớn -> metric inline; testimonial -> trích dẫn đơn -> tường 2 cột -> case rows; quy trình -> steps ngang -> timeline dọc -> sticky-scroll; dịch vụ -> tabs -> accordion -> bảng so sánh; CTA -> band -> form inline -> thanh dính đáy -> panel email.
   - Không lặp công thức hero -> stats -> 3 card -> quy trình -> gallery -> testimonial -> 3 bài -> CTA ở 2 dự án liên tiếp.
   - Header/footer dùng đúng family đã chốt, không sao chép kiểu của 3 dự án gần nhất.
   - Nền xen kẽ ít nhất 3 tông: sáng, xám/tint, tối hoặc ảnh full-bleed.

5. Thanh liên hệ nổi (bắt buộc với site bán hàng và giới thiệu):
   - Cố định góc phải dưới, gồm Facebook, Zalo, gọi điện; thêm email nếu có.
   - Nút 44x44, một bộ icon, có nhãn chữ hoặc tooltip, aria-label, focus nhìn thấy.
   - Chỉ dùng link thật. Chưa có thì ẩn nút và ghi [CẦN DỮ LIỆU THẬT]; cấm href="#".
   - Không che nội dung; mobile đặt trên thanh CTA/mua dính đáy và dùng safe-area-inset.
   - Không tự mở chat, không nhấp nháy, không giả số điện thoại.
   - Dùng hook cố định: [data-contact-rail], [data-contact="facebook|zalo|phone|email"].

6. Khối nhận thông báo sản phẩm bằng email:
   - Nút chuông/thư trong thanh nổi mở panel khi hover/focus trên desktop, tap trên mobile; hoặc slide-in nhỏ ở góc phải dưới.
   - Lần đầu tự mở sau khi cuộn 40-60% hoặc sau 8-12 giây; không bật ngay khi tải, không che hero.
   - Có input email, checkbox đồng ý nhận tin (mặc định không tick), link chính sách, nút đóng.
   - Esc đóng, focus trap nếu là modal, trả focus về nút mở, aria-live khi gửi.
   - Chỉ hiện 1 lần/phiên (sessionStorage), tắt animation khi prefers-reduced-motion.
   - Endpoint thật hoặc mô phỏng có ghi README; không bịa trạng thái "đã đăng ký".
   - Nội dung nói rõ: nhận thông báo sản phẩm mới, hàng về, ưu đãi thật.
   - Có biến thể inline ở footer hoặc trang sản phẩm nếu không dùng panel nổi.
   - Dùng hook cố định: [data-notify], [data-notify-open], [data-notify-form], [data-notify-email], [data-notify-consent], [data-notify-close], [data-notify-status]; key sessionStorage thống nhất `notify-dismissed`.

7. Nội dung tối thiểu theo loại site:
   - ecommerce: trang chủ, danh mục có lọc/sắp xếp/trạng thái không kết quả, chi tiết sản phẩm (ảnh, giá, biến thể, thông số, tồn kho, thêm giỏ, liên quan), giỏ, thanh toán mô phỏng, chính sách đổi trả/vận chuyển/bảo hành/thanh toán/bảo mật, liên hệ/cửa hàng, 404.
   - corporate-site: trang chủ, giới thiệu, dịch vụ/sản phẩm (tổng + chi tiết), case/đội ngũ theo ngành, liên hệ, chính sách, 404. Không tạo blog rỗng.
   - landing-page: một mục tiêu chuyển đổi, một trang chính + 404 + chính sách + trang cảm ơn; CTA lặp có chủ ý; form tối đa 4 trường.

8. Dữ liệu thật, pháp lý, SEO, hiệu năng:
   - Schema dữ liệu sản phẩm/dịch vụ trong src/data/: tên, giá, biến thể, tồn kho, thông số, ảnh, chính sách, trạng thái [CẦN DỮ LIỆU THẬT].
   - Thông tin doanh nghiệp: tên, MST, địa chỉ, hotline, giờ mở cửa. Thiếu thì ghi [CẦN DỮ LIỆU THẬT].
   - Mỗi trang: title, description 140-165 ký tự, canonical, og:*, đúng 1 h1, Schema.org phù hợp, breadcrumb, internal link.
   - Ảnh webp, kích thước cố định, lazy-load trừ ảnh hero; không dùng ảnh AI giả người thật.
   - Không bịa số liệu, testimonial, chứng nhận, giá gốc gạch ngang, "chỉ còn 2 sản phẩm", đồng hồ đếm ngược.

9. Kiểm tra trước khi báo xong:
   - `node .agents/skills/web-anti-ai-lint/scripts/lint.js website/<Ten-duan> --industry=<slug>`, sửa hết lỗi.
   - `node .agents/skills/web-qa/scripts/shots.js website/<Ten-duan> --pages=index.html,...` (tự chụp desktop 1440px và mobile 390px) và `node website/<Ten-duan>/tools/smoke.js`.
   - Kiểm tra thêm: thanh liên hệ nổi, panel email, form, giỏ, lọc/sắp xếp, thanh mua dính đáy, không cuộn ngang, dấu tiếng Việt.

10. Ghi registry:
      node .agents/skills/web-rotation/scripts/register.js --project=<Ten-duan> --type=<loại> --industry=<slug> --archetype=<id> --palette=<id> --hero=<pattern> --header=<family> --footer=<family> --layouts=<a,b,c>

11. Báo cáo cuối: tổ hợp đã dùng, danh sách file, các mục [CẦN DỮ LIỆU THẬT] cần tôi cung cấp, lỗi lint đã sửa, việc còn tồn, và ảnh chụp/đường dẫn QA. KHÔNG commit và KHÔNG deploy ePod nếu tôi chưa bảo.
```
