# Chụp màn hình và soi giao diện

## shots.js

- Tham số: thư mục site (`website/<Du-an>`, chụp HTML đã build qua `file:///`) hoặc URL (`https://...`).
- `--pages=` danh sách cách nhau dấu phẩy: tên file `.html` (site ở máy) hoặc đường dẫn `/pages/x` (URL).
- `--height=` chiều cao khung chụp (mặc định 4000). Trang dài hơn thì tăng, hoặc chụp riêng trang đó.
- `--out=` thư mục ảnh (mặc định thư mục tạm `web-qa/<tên>`). Không để ảnh trong `website/` hay repo.
- Mobile 390px chụp qua `<iframe>`: Chrome headless trên Windows không thu cửa sổ dưới ~500px.
- Chrome: tự tìm Chrome / Edge; máy khác đặt biến `CHROME=<đường dẫn>`.

## Đọc ảnh

- Đọc các đoạn `-p1`, `-p2`... theo thứ tự; mỗi đoạn 1600px.
- Hiệu ứng hiện dần khi cuộn (`.reveal`) có thể chưa chạy xong trong ảnh: phần trống ở cuối trang thường là lý do này.
  Muốn chắc, chụp lại trang đó với `--height` nhỏ hơn hoặc xem phần đó trên ảnh mobile.
- Ảnh ePod: chụp sau `clear_storefront_cache`; ảnh còn bản cũ thì chờ vài giây rồi chụp lại.

## Lỗi hay gặp (đã gặp ở các site trước)

| Triệu chứng | Nguyên nhân thường gặp |
| --- | --- |
| Lề trái của nav / danh sách lệch so với `.wrap` | `ul[class] { padding: 0 }` đè `padding-inline` của `.wrap`: tăng độ ưu tiên selector |
| Breadcrumb hiện "1. 2." | `<ol>` không có class nên không bị reset `list-style` |
| Chữ tràn ngang trên mobile | phần tử con của flex thiếu `min-width: 0`, tiêu đề cỡ chữ quá lớn |
| Ảnh méo / dẹt trên ePod | ePod bỏ `width`/`height`, thêm `sizes="auto"`: cần khung `aspect-ratio` hoặc `height: 100%` |
| Số giỏ hàng về 0 trên ePod | `theme.js` của ePod ghi đè `[data-cart-count]`: dùng thuộc tính riêng |
| Ô cuối lưới bị lẻ | số mục không chia hết số cột: cho mục cuối trải 2 cột hoặc nằm ngang |
| Chữ đè lên ảnh khó đọc trên mobile | lớp tối dưới chữ quá nhẹ: tăng độ đậm gradient ở khổ nhỏ |

## Trước khi báo xong

- Desktop 1440px và mobile 390px của mọi trang có bố cục riêng (chủ, danh mục, chi tiết, giỏ, liên hệ).
- Không cuộn ngang, dấu tiếng Việt đúng, icon hiện, nút chính trong tầm tay trên mobile.
- Nêu rõ trong báo cáo phần nào đã chụp, phần nào chưa (ví dụ bấm nút trên ePod không chụp được).
