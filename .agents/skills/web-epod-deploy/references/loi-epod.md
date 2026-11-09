# Lỗi ePod đã gặp và cách xử lý

## push bị từ chối (contract violation)

| Thông báo / triệu chứng | Xử lý |
| --- | --- |
| `web-header-menu-binding` | Header phải lặp `linklists[section.settings.menu]` và có setting kiểu `menu`: script đã làm, kiểm `chrome.nav` đúng `<ul>` |
| `section-settings-empty` | Section thiếu nhóm Style: script luôn thêm `STYLE_GROUP` |
| Cấm `<canvas>` trong section | Để chỗ trống (`<span data-dust-slot>`), theme JS tự tạo canvas |
| `<svg>` inline bị từ chối | Inline SVG trong section cần `width` / `height` ≤ 48 |
| `SVG/HTML/XML uploads are blocked` | Không tải SVG lên media: script đổi sang webp ở `.epod/raster/` (cần Chrome + Pillow) |
| `graphql error: Something went wrong` | Thường do payload sai (thiếu tham số, sai tên), không phải máy chủ hỏng |

## Site trên ePod hiển thị sai

| Triệu chứng | Nguyên nhân, xử lý |
| --- | --- |
| Không thấy header / footer của site | Theme cha gọi `header` / `footer` thay vì `web-header`: script đọc `layout/theme.liquid` để chọn tên |
| Màu, font khác bản ở máy | `<style id="theme-settings-vars">` nạp sau CSS site: script đổi `:root {` thành `:root:root {` |
| Nút, lưới vỡ do CSS lạ | `theme.css` gốc dùng lớp trùng (.btn .section .logo): script lọc selector trùng, thêm lớp JS vào `extraClasses` |
| Số trên icon giỏ về 0 rồi ẩn | `theme.js` của ePod ghi đè `[data-cart-count]` theo giỏ của nền tảng: dùng thuộc tính riêng (`data-mx-cart-count`) |
| Ảnh méo / dẹt | ePod bỏ `width` / `height`, thêm `sizes="auto"`: cần khung `aspect-ratio` hoặc `height: 100%` trong CSS site |
| Chữ nghiêng tiếng Việt tách dấu | `font_heading` khiến ePod nạp font riêng không có trục / italic: đặt bằng font site đã tự nạp |
| Trang cũ vẫn hiện | `clear_storefront_cache` đã gọi ở cuối push; chờ vài giây rồi tải lại |

## Form

- Kiểu nội dung form phải `is_form: true`, `submit_status: "submitted"`: thiếu thì bản ghi (tên, số điện thoại) bị liệt kê công khai.
  Kiểm `https://<store>.epodsystem.com/<code>` trả 404.
- Gửi thử bằng curl trên Windows làm vỡ dấu tiếng Việt (bảng mã của shell); trình duyệt gửi UTF-8 nên không bị.
- Xóa bản ghi thử: `graphql_mutation` `deleteContentRecord(type_code: "...", id: "...")`.

## Máy, công cụ

- `epod` CLI cần Python, không dùng; mọi việc qua `scripts/mcp.js`.
- Git Bash đổi tham số `/pages/x` thành `C:/.../Git/pages/x`: đặt `MSYS_NO_PATHCONV=1` khi truyền đường dẫn bắt đầu bằng `/`.
- Store dùng theme bán hàng (layout có giỏ, `tailwind.css`) mà site không cần bán: `set_commerce_enabled { enabled: false }`
  hoặc layout riêng (xem `website/EnSchool-giaoduc/tools/epod-layout.liquid`); layout phải nạp `/assets/theme.js`.
