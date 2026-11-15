# AGENTS.md

本專案（KPOP 團體圖鑑）的完整規則寫在 **[CLAUDE.md](./CLAUDE.md)**。
不論你是 Claude Code、Codex、Cursor 或其他 AI 工具，**修改任何檔案前請先完整閱讀 CLAUDE.md**。

## 最重要的 6 條（摘要，細節以 CLAUDE.md 為準）

1. 純 HTML/CSS/原生 JS，無建置步驟；不可用 `fetch()`，資料放 `assets/js/groups-data.js`。
2. 一團一頁：`groups/<slug>.html`，一律從 `templates/group-template.html` 複製。
3. 每頁 9 個區塊依序出現：`hero` → `profile` → `members` → `story` → `discography` → `latest` → `starter` → `trivia` → `sources`。
4. 新增團體後要在 `groups-data.js` 依出道日順序登錄，並執行 `node scripts/check.mjs`。
5. 不放偶像照片、Logo、專輯封面、歌詞；會變動的資訊先上網查證並標「資料截至」日期。
6. 改版型就要改「全部」頁面與範本，保持一致。
