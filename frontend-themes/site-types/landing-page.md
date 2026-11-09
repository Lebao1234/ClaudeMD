# Landing page (landing-page)

## Mục tiêu

- **Một** mục tiêu chuyển đổi duy nhất (đăng ký, đặt lịch, mua một sản phẩm, gửi yêu cầu).
- Mọi section phục vụ mục tiêu đó; nội dung khác đưa sang trang ngoài hoặc bỏ.

## Cấu trúc tối thiểu

- `index.html` (trang chính), `404.html`, trang chính sách (bảo mật; thêm đổi trả nếu bán hàng), trang cảm ơn sau form.
- Header tối giản: logo + 2 - 4 liên kết neo + nút hành động chính. Không menu nhiều cấp.
- Footer gọn: pháp nhân, liên hệ, chính sách.

File bắt buộc ở gốc dự án (mọi loại site): `.mcp.json` chuẩn `templates/mcp.template.json`, tạo bằng `ensure-mcp.js` (skill `web-project-scaffold`).

## Ba biến thể thứ tự section (chọn một, ghi vào DESIGN.md)

| Biến thể | Thứ tự | Hợp khi |
| --- | --- | --- |
| A. Vấn đề trước | Hero → vấn đề của khách → cách giải quyết → bằng chứng → giá/ưu đãi → FAQ → form | Khách chưa biết mình cần |
| B. Sản phẩm trước | Hero có sản phẩm → tính năng chính → cách dùng (bước) → bằng chứng → giá → FAQ → form | Khách đã biết loại sản phẩm, đang so sánh |
| C. Ưu đãi trước | Hero có ưu đãi và hạn chót thật → điều kiện → sản phẩm/dịch vụ → bằng chứng → form → FAQ | Chiến dịch có thời hạn |

## Hành vi bắt buộc

- CTA chính lặp lại có chủ ý: hero, giữa trang (sau phần thuyết phục chính), cuối trang. Cùng nhãn, cùng hành động.
- Không quá 1 CTA phụ (ví dụ "Xem giá"); không đặt CTA cạnh tranh nhau.
- Form ngắn: tối đa 4 trường bắt buộc; báo lỗi ngay dưới trường; trạng thái gửi thành công rõ ràng.
- Trên mobile có thanh hành động dính đáy (gọi / Zalo / đăng ký) khi đã cuộn qua hero.
- Bằng chứng chỉ dùng dữ liệu thật; thiếu thì bỏ khối, không lấp bằng số liệu mẫu.

## Khối UI toàn cục

- **Thanh liên hệ nổi** góc phải dưới: Facebook, Zalo, hotline; link thật, chưa có thì ẩn và ghi `[CẦN DỮ LIỆU THẬT]`.
- **Nhận thông báo sản phẩm / ưu đãi**: dùng panel hover/focus hoặc form inline; một tín hiệu email duy nhất, không chồng lên CTA chính.
- Trên mobile, thanh liên hệ nổi và thanh CTA dính đáy không được chồng nhau; thanh CTA chính giữ ưu tiên cao hơn.
- Panel email không tự bật ngay khi tải, không che hero, chỉ hiện 1 lần/phiên; đóng được bằng Esc và nút X.

## Kiểm tra trước khi báo xong

- Chỉ một CTA chính; nhãn CTA giống nhau ở hero, giữa trang và cuối trang.
- Form tối đa 4 trường, báo lỗi tại trường, trạng thái gửi thành công rõ ràng.
- Thanh liên hệ nổi và panel email không che CTA, không gây cuộn ngang ở 390px.

## Giới hạn của stack hiện tại

- Form gửi tới `data-endpoint` nếu có (Google Apps Script, Formspree, API riêng); chưa có thì mô phỏng thành công và ghi trong README.
- Đo chuyển đổi (GA4, Meta Pixel) chỉ thêm khi người dùng cung cấp mã; ghi vị trí chèn trong README.
- Không A/B test động; nếu cần thì tạo nhiều file trang (`index.html`, `uu-dai-b.html`) cùng nguồn `src/`.
