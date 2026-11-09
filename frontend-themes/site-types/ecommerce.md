# Website bán hàng (ecommerce)

## Mục tiêu

- Khách tìm sản phẩm, xem chi tiết, thêm giỏ và đặt hàng.
- Phụ: so sánh, hỏi tư vấn, tìm cửa hàng.

## Cấu trúc tối thiểu

| Trang | Ghi chú |
| --- | --- |
| Trang chủ | Danh mục chính, sản phẩm nổi bật, khuyến mãi thật (nếu có) |
| Danh mục | Lưới sản phẩm, lọc (giá, thuộc tính), sắp xếp, trạng thái "không có kết quả" |
| Chi tiết sản phẩm | Ảnh, giá, biến thể, thông số, tình trạng hàng, thêm giỏ, sản phẩm liên quan |
| Giỏ hàng | Sửa số lượng, xóa, tạm tính, phí giao dự kiến |
| Thanh toán | Thông tin nhận hàng, cách giao, cách trả tiền, xác nhận đơn |
| Chính sách | Đổi trả, vận chuyển, bảo hành, thanh toán, bảo mật |
| Liên hệ, cửa hàng | Hotline, địa chỉ, giờ mở cửa |
| 404 | Gợi ý danh mục |

File bắt buộc ở gốc dự án (mọi loại site): `.mcp.json` chuẩn `templates/mcp.template.json`, tạo bằng `ensure-mcp.js` (skill `web-project-scaffold`).

## Hành vi bắt buộc

- Giá, tồn kho, biến thể lấy từ `src/data/products.js`; trang chi tiết sinh bằng template.
- Thêm giỏ có phản hồi ngay (số lượng ở header cập nhật, thông báo `aria-live`).
- Dấu hiệu tin cậy là thông tin thật: chính sách đổi trả, thời gian giao, phương thức thanh toán, thông tin doanh nghiệp.
  Không dùng huy hiệu "chính hãng", "100% an toàn" khi không có cơ sở.
- Thanh mua dính đáy ở trang chi tiết trên mobile.
- Giỏ hàng trống có lời dẫn về danh mục.

## Khối UI toàn cục

- **Thanh liên hệ nổi** góc phải dưới: Facebook, Zalo, hotline. Link thật; chưa có thì ẩn nút và ghi `[CẦN DỮ LIỆU THẬT]`. Mobile đặt trên thanh mua dính đáy, không che giá/nút mua.
- **Nhận thông báo sản phẩm**: panel hover/focus ở góc phải dưới, thêm bản inline ở footer và trang sản phẩm. Có email + checkbox đồng ý (mặc định không tick) + link chính sách. Trigger sau 40-60% hoặc 8-12 giây, 1 lần/phiên. Endpoint thật hoặc mô phỏng có ghi README.
- Không hứa giảm giá, quà tặng, số lượng có hạn khi chưa có dữ liệu thật; không tự thêm email vào danh sách khi chưa tick đồng ý.

## Kiểm tra trước khi báo xong

- Thêm/xóa/sửa số lượng giỏ, giỏ trống, `localStorage` bị chặn vẫn chạy.
- Lọc, sắp xếp, trạng thái không có kết quả; đồng bộ URL nếu có.
- Thanh mua dính đáy mobile không che thanh liên hệ hoặc panel email.
- Thanh toán mô phỏng ghi rõ trong README; không hiện "đã thanh toán" khi chưa có cổng thật.

## Giới hạn của stack hiện tại (phải ghi trong README)

- Giỏ hàng chạy bằng `localStorage` (bọc try/catch, vẫn chạy khi bị chặn lưu trữ). Không đồng bộ giữa thiết bị.
- Thanh toán là **mô phỏng**: gửi đơn tới `data-endpoint` (email, Google Sheets, API) hoặc hiện màn hình xác nhận giả lập.
- Tồn kho và giá là dữ liệu tĩnh tại thời điểm build.
- Nâng cấp sau (ghi vào "việc tồn"): backend đơn hàng, cổng thanh toán (VNPay, MoMo, ZaloPay...), đồng bộ tồn kho,
  hoặc chuyển sang nền tảng thương mại điện tử có sẵn.
