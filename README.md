# KPOP 團體圖鑑 · KPOP Group Guide

給新粉絲的 KPOP 入坑指南：每個團一頁，包含基本資料、成員、團體故事、代表作時間軸、最新動態、三首入坑推薦與小知識。

🔗 **網站**：https://eathenweng-droid.github.io/kpop-group-guide/

## 這個專案的重點

這不是一個「做完就結束」的網頁，而是一套**可以讓 AI 照規則持續擴充**的網站：

- [`CLAUDE.md`](./CLAUDE.md)：完整的專案規則（目的、風格、目錄結構、頁面區塊、命名、資料格式、內容原則、新增流程、檢查清單）
- [`AGENTS.md`](./AGENTS.md)：給 Codex / Cursor 等其他 AI 工具的入口，指向 CLAUDE.md
- [`templates/group-template.html`](./templates/group-template.html)：團體頁範本
- [`assets/js/groups-data.js`](./assets/js/groups-data.js)：團體註冊表，首頁卡片與上下頁導覽自動由它產生
- [`scripts/check.mjs`](./scripts/check.mjs)：自動檢查每一頁是否符合規則
- [`.claude/commands/add-group.md`](./.claude/commands/add-group.md)：Claude Code 指令 `/add-group <團名>`

## 目前收錄

BTS · SEVENTEEN · TWICE · BLACKPINK · Stray Kids · aespa

## 新增一個團

```bash
# 在 Claude Code 中
/add-group IVE

# 或直接對任何 AI 說：「請依 CLAUDE.md 新增 IVE」
# 完成後驗證
node scripts/check.mjs
```

## 本機預覽

直接用瀏覽器打開 `index.html` 即可，不需要任何建置步驟。

## 聲明

粉絲自製的非官方介紹站。本站不使用偶像照片、專輯封面、團體 Logo 與歌詞，所有視覺皆為 CSS 繪製。
