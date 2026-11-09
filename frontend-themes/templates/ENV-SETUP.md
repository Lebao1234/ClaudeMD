# Token ePod cho dự án

Mỗi site trên ePod có token riêng. Có hai cách, chọn một:

## Cách 1: ghi thẳng trong file (đơn giản, đang dùng)

Dán token vào `website/<Du-an>/.mcp.json`:

```json
"Authorization": "Bearer crmk_..."
```

`website/` bị gitignore nên file không lên git. Không `git add -f` thư mục này.

## Cách 2: biến môi trường

Tên biến: `EPOD_MCP_TOKEN_<TÊN_THƯ_MỤC>` (chữ hoa, ký tự khác chữ/số thành `_`).

- `VN-Nikko-cokhi` → `EPOD_MCP_TOKEN_VN_NIKKO_COKHI`
- Xem tên biến mọi dự án: `node .agents/skills/web-project-scaffold/scripts/ensure-mcp.js --all --dry-run` (cột "Biến").
- `.mcp.json` ghi `"Authorization": "Bearer ${EPOD_MCP_TOKEN_VN_NIKKO_COKHI}"` (`ensure-mcp.js` tạo sẵn).
- Đặt lâu dài: `setx EPOD_MCP_TOKEN_VN_NIKKO_COKHI "token"`, rồi đóng và mở lại terminal **và** VS Code.

## Kiểm tra

- Mở Claude Code trong thư mục dự án, chạy `/mcp`: `epodsystem` phải ở trạng thái đã kết nối.
- Lần đầu mở dự án, Claude Code hỏi có cho phép MCP server cấp dự án không: chọn đồng ý.
