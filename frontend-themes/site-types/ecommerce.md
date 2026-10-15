# Website bán hàng (ecommerce)

## Mục tiêu

- Khách tìm sản phẩm, xem chi tiết, thêm giỏ và đặt hàng.
- Phụ: so sánh, hỏi tư vấn, tìm cửa hàng.

## Cấu trúc tối thiểu

| Trang | Ghi chú |
|---|---|
| Trang chủ | Danh mục chính, sản phẩm nổi bật, khuyến mãi thật (nếu có) |
| Danh mục | Lưới sản phẩm, lọc (giá, thuộc tính), sắp xếp, trạng thái "không có kết quả" |
| Chi tiết sản phẩm | Ảnh, giá, biến thể, thông số, tình trạng hàng, thêm giỏ, sản phẩm liên quan |
| Giỏ hàng | Sửa số lượng, xóa, tạm tính, phí giao dự kiến |
| Thanh toán | Thông tin nhận hàng, cách giao, cách trả tiền, xác nhận đơn |
| Chính sách | Đổi trả, vận chuyển, bảo hành, thanh toán, bảo mật |
| Liên hệ, cửa hàng | Hotline, địa chỉ, giờ mở cửa |
| 404 | Gợi ý danh mục |

## Hành vi bắt buộc

- Giá, tồn kho, biến thể lấy từ `src/data/products.js`; trang chi tiết sinh bằng template.
- Thêm giỏ có phản hồi ngay (số lượng ở header cập nhật, thông báo `aria-live`).
- Dấu hiệu tin cậy là thông tin thật: chính sách đổi trả, thời gian giao, phương thức thanh toán, thông tin doanh nghiệp.
  Không dùng huy hiệu "chính hãng", "100% an toàn" khi không có cơ sở.
- Thanh mua dính đáy ở trang chi tiết trên mobile.
- Giỏ hàng trống có lời dẫn về danh mục.

## Giới hạn của stack hiện tại (phải ghi trong README)

- Giỏ hàng chạy bằng `localStorage` (bọc try/catch, vẫn chạy khi bị chặn lưu trữ). Không đồng bộ giữa thiết bị.
- Thanh toán là **mô phỏng**: gửi đơn tới `data-endpoint` (email, Google Sheets, API) hoặc hiện màn hình xác nhận giả lập.
- Tồn kho và giá là dữ liệu tĩnh tại thời điểm build.
- Nâng cấp sau (ghi vào "việc tồn"): backend đơn hàng, cổng thanh toán (VNPay, MoMo, ZaloPay...), đồng bộ tồn kho,
  hoặc chuyển sang nền tảng thương mại điện tử có sẵn.
