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
- Tham khảo (nếu có): [link hoặc mô tả]
- Ghi đè (nếu có): [ví dụ: màu chủ đạo, archetype, hero pattern bắt buộc]

YÊU CẦU
1. Dùng skill web-rotation (scripts/next-combo.js) chọn tổ hợp gồm loại site, archetype, palette_id, hero pattern. Nêu tổ hợp được chọn và lý do khác 3 dự án gần nhất. Phần tôi đã chỉ định thì khóa theo tôi.
2. Đọc frontend-themes/industries/<slug>.md và site-types/<loại>.md, kết hợp skill web-archetypes và web-layout-palette-type để sinh DESIGN.md và PLAN.md cho dự án từ templates/. DỪNG và chờ tôi duyệt trước khi viết code.
3. Sau khi tôi duyệt, dựng đúng cấu trúc folder chuẩn của dự án:
     .claude/, assets/, src/, tools/ (build.js), .mcp.json, 404.html, index.html và các trang theo PLAN.md.
   Áp dụng:
     - Nhịp bố cục luân phiên: không hai section liền kề cùng cấu trúc, tối thiểu 4 layout family, nền xen kẽ nhiều tông.
     - Một bộ icon duy nhất, không emoji làm icon; ưu tiên ảnh thật, số, typography.
     - Không bịa số liệu, testimonial, chứng nhận; chỗ thiếu dữ liệu ghi [CẦN DỮ LIỆU THẬT] và liệt kê lại cho tôi cuối buổi.
     - Font có subset tiếng Việt, đủ dấu, responsive mobile/tablet/desktop.
   Taste skill chỉ bổ sung chỗ DESIGN.md không nói; mâu thuẫn thì DESIGN.md thắng.
4. Chạy `node .agents/skills/web-anti-ai-lint/scripts/lint.js website/<Ten-duan> --industry=<slug>`, sửa hết lỗi báo ra. Sau đó kiểm tra thực tế trang ở mobile và desktop (bố cục, dấu tiếng Việt, icon, liên kết, form), nêu lại những gì đã kiểm tra.
5. Chạy scripts/register.js để ghi dự án vào registry.
6. Báo cáo cuối: tổ hợp đã dùng, danh sách file, các mục [CẦN DỮ LIỆU THẬT] cần tôi cung cấp, lỗi lint đã sửa, việc còn tồn. KHÔNG commit nếu tôi chưa bảo.
```
