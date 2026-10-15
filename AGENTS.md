# AGENTS.md

Hướng dẫn chung cho mọi agent (Claude Code, Antigravity, Codex...) làm việc trong repo này.

- **Luật thiết kế và quy trình làm site:** đọc `frontend-themes/CLAUDE.md` trước khi làm bất kỳ việc gì trong `website/`.
- **Thứ tự ưu tiên:** lệnh trực tiếp của người dùng > `DESIGN.md` của dự án > `frontend-themes/industries` và `site-types` > skill `web-*` > taste skill.
- **Skill:** nằm trong `.agents/skills/`. Skill riêng của repo có tiền tố `web-`. Không sửa các taste skill đã cài (danh sách trong `skills-lock.json`).
- **Stack:** HTML tĩnh + `src/` + `tools/build.js` (Node, không npm). Không tự đổi framework.
- **Bảo mật:** không commit `.mcp.json` (chứa token thật).
- **Git:** chỉ commit khi người dùng yêu cầu.
- **Prompt mẫu cho dự án mới:** `frontend-themes/templates/NEW-PROJECT.prompt.md`.
