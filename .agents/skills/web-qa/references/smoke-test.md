# Test hành vi JS bằng jsdom (tools/smoke.js)

Kiểm tra giỏ hàng, bộ lọc, form... trên HTML đã build mà không mở trình duyệt. Mỗi site một file `tools/smoke.js`.

## API của harness (`.agents/skills/web-qa/scripts/harness.js`)

| Hàm | Làm gì |
| --- | --- |
| `load(siteDir, page, search, opts)` | Mở trang đã build, chạy `assets/js/main.js`, trả `window`. `search` như `"?q=keo"` |
| `fire(w, el, "change")` | Phát sự kiện như người dùng (change, input, submit) |
| `ok(điều kiện, "mô tả")` | Ghi PASS / FAIL |
| `wait(ms)` | Chờ promise (fetch, gửi form) |
| `done()` | In tổng và thoát (mã 1 nếu có FAIL); bắt buộc gọi cuối vì main.js hay có setInterval |
| `storage` | localStorage giả, dùng chung giữa các lần `load` như cùng một trình duyệt |

`opts`: `script` (đường dẫn JS khác `assets/js/main.js`), `origin`, `fetch` (giả lập trả lỗi), `before(w)` (đặt biến trước khi chạy JS, ví dụ `w.MX_FORMS`).

## Khung

```js
const path = require("path");
const { load, fire, ok, wait, done } = require("../../../.agents/skills/web-qa/scripts/harness.js");
const SITE = path.join(__dirname, "..");
(async () => {
  let w = load(SITE, "index.html"), d = w.document;
  d.querySelector('[data-add-cart="mon-a"]').click();
  ok(d.querySelector("[data-cart-count]").textContent === "1", "thêm giỏ, số trên icon = 1");
  w = load(SITE, "gio-hang.html"); d = w.document;   // giỏ vẫn còn: localStorage dùng chung
  ok(d.querySelectorAll(".cart-item").length === 1, "giỏ có 1 dòng");
  done();
})();
```

## Nên test gì

- Thêm giỏ từ thẻ và từ trang chi tiết (có quy cách, số lượng), tổng tiền, phí giao, xóa, đổi số lượng.
- Bộ lọc đọc từ URL (`?cat=...`), tìm kiếm không dấu, trạng thái không có kết quả.
- Form: gửi trống báo đúng số lỗi; gửi đủ thì hiện xác nhận, giỏ được xóa.
- Thanh liên hệ nổi: đủ `[data-contact]` đang có link thật, không có `href="#"`; panel email mở/đóng bằng `[data-notify-open]` và `[data-notify-close]`.
- Panel email: submit thiếu email hoặc chưa tick `[data-notify-consent]` thì báo lỗi; submit hợp lệ hiện `[data-notify-status]`; `sessionStorage.notify-dismissed` chặn tự mở lại.
- Thành phần tương tác riêng của site (tab, chọn hộp quà, băng chữ nhân bản có `aria-hidden`).

## Lưu ý

- jsdom không có layout: không test vị trí, kích thước, sticky, cuộn; phần đó xem bằng `shots.js`.
- Không có `CSS.supports`, `animation-timeline`: test phải chạy được khi JS bỏ qua các nhánh đó.
- Cần jsdom: harness lấy từ `node_modules` của site khác trong `website/` nếu thư mục đang chạy không có.
- Test FAIL: đọc lại selector của bài test trước (trang không có phần tử đó?) rồi mới sửa site.
