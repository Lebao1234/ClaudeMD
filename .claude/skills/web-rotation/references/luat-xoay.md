# Luật xoay vòng

`next-combo.js` áp dụng luật 1-6. Luật 7, 8 do agent làm.

1. **Lệnh trực tiếp của người dùng luôn thắng.** Cờ khóa được giữ; vi phạm luật dưới đây chỉ in thành lưu ý.
2. **Loại site** xoay vòng landing-page → corporate-site → ecommerce, bắt đầu sau loại của dự án gần nhất.
   - Bỏ qua loại nằm trong "Ít hợp" của ngành (`frontend-themes/industries/<slug>.md` mục 5).
   - Không dùng cùng loại site 2 lần liên tiếp.
3. **Archetype**: không trùng ngành + archetype trong 4 dự án gần nhất. Ưu tiên archetype chưa từng dùng trong ngành đó.
4. **Hero pattern**: không trùng trong 3 dự án gần nhất.
5. **palette_id**: không trùng trong 5 dự án gần nhất. Hai archetype cùng ngành không dùng chung họ màu.
6. **Ngành** (khi không chỉ định): giao-duc, dich-vu-chuyen-nghiep, cong-nghe-phan-mem chiếm khoảng 60%; 9 ngành còn lại chia 40%.
   Ngành của dự án liền trước bị giảm trọng số.
7. **doi-song**: chưa có ngách thì hỏi người dùng trước khi dùng tổ hợp.
8. Kết quả có seed: ghi seed vào DESIGN.md để chạy lại ra cùng tổ hợp.
