# epod.config.js (gốc mỗi site)

Mẫu đầy đủ đang chạy: `website/Mexung-anuong/epod.config.js`. Khung tối thiểu:

```js
module.exports = {
  folder: "tenstore",          // bắt buộc: thư mục media + tên JS trên theme (/assets/tenstore.js)
  name: "Tên thương hiệu",     // tên section Header / Footer trong customizer
  prefix: "ts-",               // tiền tố file section: ts-001.liquid
  ogImage: "hero.webp",        // ảnh chia sẻ, đường dẫn tính từ assets/img/
  globalSettings: { color_accent: "#...", color_paper: "#...", color_ink: "#...", font_heading: "...", font_body: "..." },
  cssImports: ["https://fonts.googleapis.com/css2?family=...", "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css"],
  chrome: { header: ["header"], footer: ["footer"], nav: ".nav ul", search: { form: "form.search", page: "cua-hang" } },
  menu: [["Trang chủ", "/"], ["Dịch vụ", "dich-vu"], ["Liên hệ", "lien-he"]],
};
```

| Khóa | Ý nghĩa |
| --- | --- |
| `chrome.header`, `chrome.footer` | Selector cắt từ `index.html` đã build, theo thứ tự (dải trên cùng, ô thông báo nằm ngoài header thì thêm vào) |
| `chrome.nav` | `<ul>` menu chính: nội dung bị thay bằng vòng lặp `linklists` (bắt buộc với ePod) |
| `menu` | Mục menu `main-menu`, tạo lại mỗi lần push. Giá trị là slug trang (`lien-he`), `/` hoặc URL ngoài |
| `forms` | `{ khóa: { code, label, singular, notifyEmail?, fields: [[code, label, "text" \| "textarea"]] } }`, tạo kiểu `is_form` nếu chưa có |
| `jsReplace` | `[[đoạn cũ, đoạn mới]]` thay trong `main.js` cho bản ePod; đoạn cũ không còn thì push dừng |
| `jsPrefix({ images, urlOf })` | Chuỗi JS chèn đầu file JS của theme: dữ liệu, map ảnh (`images[đường dẫn] = URL media`), đường dẫn trang |
| `extraClasses` | Lớp chỉ JS gắn (không có trong HTML) để không bị lọc khỏi theme.css gốc |
| `skipPages` | File `.html` không đưa lên |
| `hideAnnouncement: false` | Giữ thanh thông báo của theme (mặc định tắt khi layout có `announcement-bar`) |
| `cssExtra`, `rasterSize` | CSS thêm cuối theme-skin.css; cỡ ảnh khi đổi SVG sang webp (mặc định 600) |

## Để main.js chạy được cả ở máy và trên ePod

- Đường dẫn trang: hàm `PAGE(slug)` trả `slug + ".html"`, trên ePod dùng `window.<X>_PAGE` từ `jsPrefix` (`/pages/slug`).
- Ảnh do JS vẽ (giỏ, gợi ý tìm kiếm): `IMG(src)` đọc `window.<X>_IMG` từ `jsPrefix`, không có thì `assets/img/`.
- Form: `data-form-type="khóa"` trên `<form>`; có `window.<X>_FORMS` thì gửi `FormData` (thêm `type_code`, `_hp`) tới
  `/api/storefront/forms/submit` kèm header `X-Requested-With: fetch`, thành công khi JSON trả `status: "success"`.
- Dữ liệu sản phẩm đọc từ `<script type="application/json">` ở bản tĩnh: dùng `jsReplace` đổi sang `window.<X>_PRODUCTS`.

## Sau push

- `.epod/images.json` là cache ảnh đã tải; xóa một dòng để tải lại ảnh đó. `.epod/raster/` là bản webp của SVG.
- `.epod/theme-base.css` là theme.css gốc của theme cha; xóa file để tải lại khi theme cha đổi.
