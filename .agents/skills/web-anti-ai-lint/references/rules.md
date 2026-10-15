# Luật chống dấu vết AI

Mỗi luật kiểm tra được. Cột "Script" cho biết `lint.js` tự bắt hay phải kiểm bằng mắt.

## 1. Icon

| Luật | Script |
| --- | --- |
| Không emoji làm icon (cho phép © ® ™ trong chữ) | có |
| Một bộ icon mỗi dự án (Phosphor, Lucide hoặc Tabler), một độ nét, cùng lưới 24 px | có (cảnh báo khi nạp hơn 1 bộ) |
| Không icon trong vòng tròn màu pastel lặp ở mọi card | mắt |
| Icon chỉ khi mang nghĩa (hành động, trạng thái, phân loại). Còn lại ưu tiên ảnh thật, số lớn, typography, minh họa riêng | mắt |
| Mũi tên trong nút: tối đa một kiểu cho cả site | mắt |

## 2. Chữ

| Luật | Script |
| --- | --- |
| Không số liệu, testimonial, đánh giá, chứng nhận bịa. Thiếu thì ghi `[CẦN DỮ LIỆU THẬT]` | một phần (bắt chữ "số liệu mẫu", "dữ liệu mẫu") |
| Không cụm trong `banned-phrases-vi.md` | có |
| Tiêu đề cụ thể: có đối tượng, con số hoặc hành động. Ví dụ "Học IELTS 6.5 trong 24 tuần", không "Nâng tầm tiếng Anh" | mắt |
| Đủ dấu tiếng Việt ở chữ hiển thị, `<title>`, meta, `alt` | có (title, meta) |
| Font có subset vietnamese (xem `web-layout-palette-type/references/typography.md`) | mắt |
| `text-wrap: balance` cho h1-h3 | mắt |
| Hạn chế câu ba vế song song ("nhanh, gọn, chuẩn"); tối đa 1 lần mỗi trang | mắt |
| Không dấu `–` `—`; dùng `-` | có (build cũng chặn) |
| Không lorem ipsum, "TODO", "Lorem", "Placeholder" | có |
| CTA nói rõ hành động: "Đặt lịch khám", không "Khám phá ngay", "Tìm hiểu thêm" | có (cảnh báo) |

## 3. Hình

| Luật | Script |
| --- | --- |
| Không gradient tím-xanh mặc định (`#6366f1`, `#8b5cf6`, `#3b82f6` phối nhau) | mắt |
| Không glassmorphism mặc định cho header, card, thanh nổi. Chỉ dùng khi nằm trên ảnh và có lý do | mắt |
| Không bóng mờ lớn (blur > 40px) trên mọi card | mắt |
| Không bo góc đồng loạt mọi khối; một hệ bo khai báo trong DESIGN.md | mắt |
| Hero không là "badge + tiêu đề + 2 nút" căn giữa trên nền trơn hoặc mesh | mắt |
| Không `#000` thuần; bóng pha màu nền | mắt |
| Không div giả làm ảnh chụp màn hình sản phẩm | mắt |

## 4. Nhịp bố cục

| Luật | Script |
| --- | --- |
| Không 2 section liền kề cùng layout family (tên family ở `web-layout-palette-type/references/layouts.md`) | mắt (ghi family vào PLAN.md) |
| Ít nhất 4 layout family mỗi trang dài (trang chủ, trang dịch vụ) | mắt |
| Section "3 card icon" tối đa 1 lần mỗi trang | mắt |
| Nền xen kẽ: ít nhất 2 tông (sáng / đậm / màu nhấn / ảnh full-bleed). Không để cả trang một tông | mắt |
| Không quá 1 eyebrow trên mỗi 3 section | mắt |
| Section head xếp chồng (eyebrow, tiêu đề, mô tả, link); không chia tiêu đề trái, mô tả phải | mắt |
| Không chấm màu trang trí trước eyebrow; không chữ thương hiệu khổng lồ ở đáy footer | mắt |

## 5. Kỹ thuật

| Luật | Script |
| --- | --- |
| `<html lang="vi">` (hoặc mã ngôn ngữ đúng cho thư mục `en/`, `ja/`...) | có |
| Mọi `<img>` có `alt` (rỗng nếu chỉ trang trí) | có |
| Không `href="#"` hoặc `href=""` | có |
| Heading không nhảy cấp (h2 → h4); đúng 1 `h1` mỗi trang | có |
| `[CẦN DỮ LIỆU THẬT]` còn trong trang: liệt kê cho người dùng, không tính là lỗi | có (thông tin) |

## 6. Cam kết quá mức theo ngành (`--industry`)

| Ngành | Cụm bị bắt | Mức |
| --- | --- | --- |
| y-te-lam-dep | khỏi hoàn toàn, 100%, cam kết hiệu quả, vĩnh viễn, không đau, an toàn tuyệt đối, trị dứt điểm, tận gốc | LỖI |
| bat-dong-san | pháp lý đầy đủ, sổ hồng trao tay, cam kết lợi nhuận, cam kết cho thuê, lợi nhuận đảm bảo | LỖI nếu không có `lint-ok` |
| nong-nghiep-thuc-pham | VietGAP, GlobalGAP, OCOP, HACCP, hữu cơ, organic (chứng nhận cần nguồn) | CẢNH BÁO |
| nong-nghiep-thuc-pham | chữa bệnh, sạch 100%, không hóa chất | LỖI |
| giao-duc | cam kết đầu ra, đảm bảo đầu ra, 100% đỗ, đỗ 100% | LỖI |
| Mọi ngành | ISO, giải thưởng, chứng nhận, top 1 | CẢNH BÁO (cần nguồn) |
