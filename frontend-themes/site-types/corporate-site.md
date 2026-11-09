# Website giới thiệu (corporate-site)

## Mục tiêu

- Giới thiệu doanh nghiệp đầy đủ để khách tự tìm hiểu, rồi liên hệ / đặt lịch / gửi yêu cầu.
- Nhiều đối tượng đọc (khách, đối tác, ứng viên) nhưng một hành động chính cho khách.

## Cấu trúc tối thiểu

| Trang | Ghi chú |
| --- | --- |
| Trang chủ | Tóm tắt, dẫn tới các trang chính; không nhồi mọi thứ |
| Giới thiệu | Doanh nghiệp là ai, làm gì, ở đâu; tránh khối "Tầm nhìn / Sứ mệnh / Giá trị cốt lõi" chung chung |
| Dịch vụ / khóa học / sản phẩm | Trang tổng + trang chi tiết sinh từ `src/data/` + `src/templates/` |
| Case / đội ngũ / giáo viên | Theo ngành (xem `industries/`) |
| Blog / tin tức | Chỉ khi có bài thật hoặc kế hoạch viết; không tạo bài rỗng |
| Liên hệ | Form, địa chỉ, bản đồ, giờ làm việc |
| Chính sách | Bảo mật; thêm các chính sách ngành yêu cầu |
| 404 | Có đường quay lại trang chủ và trang chính |

File bắt buộc ở gốc dự án (mọi loại site): `.mcp.json` chuẩn `templates/mcp.template.json`, tạo bằng `ensure-mcp.js` (skill `web-project-scaffold`).

## Hành vi bắt buộc

- Header, footer dùng chung từ `src/partials/`; menu đánh dấu trang hiện tại (`aria-current`).
- Breadcrumb ở trang con; mỗi trang chi tiết có liên kết sang mục liên quan.
- Hành động chính có trên mọi trang (header + cuối trang), cùng nhãn.
- Dữ liệu lặp (dịch vụ, chi nhánh, giáo viên, liên hệ) chỉ khai báo một lần trong `src/data/`.
- Sitemap sinh tự động; mỗi trang có meta riêng.

## Khối UI toàn cục

- **Thanh liên hệ nổi** góc phải dưới: Facebook, Zalo, hotline. Link thật; chưa có thì ẩn nút và ghi `[CẦN DỮ LIỆU THẬT]`; không dùng `href="#"`.
- **Nhận thông báo sản phẩm / tin mới**: panel hover/focus hoặc bản inline ở footer. Có email + checkbox đồng ý (mặc định không tick) + link chính sách; 1 lần/phiên; endpoint thật hoặc mô phỏng có ghi README.
- Không bắt khách đăng ký email mới xem được thông tin cơ bản, bảng giá hay hồ sơ năng lực.
- Header/footer dùng family khác 3 dự án gần nhất; không mặc định header pill kính mờ + footer 4 cột giống nhau.

## Kiểm tra trước khi báo xong

- Menu đánh dấu trang hiện tại, breadcrumb, internal link giữa trang tổng và trang chi tiết.
- Form liên hệ có label, báo lỗi tại trường, trạng thái gửi thành công.
- Thanh liên hệ nổi và panel email không che CTA chính, không che nội dung ở mobile 390px.

## Giới hạn của stack hiện tại

- Blog tĩnh: bài viết là dữ liệu trong `src/data/` hoặc file trong `src/pages/`; muốn tác giả tự đăng thì cần CMS headless (ghi vào "việc tồn").
- Tìm kiếm trong trang: lọc phía client trên dữ liệu đã build, không có tìm kiếm toàn văn.
- Form như landing-page: `data-endpoint` hoặc mô phỏng.
