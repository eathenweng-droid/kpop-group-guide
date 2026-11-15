---
description: 依 CLAUDE.md 規則新增一個 KPOP 團體頁
argument-hint: <團體名稱>
---

請新增 KPOP 團體「$ARGUMENTS」到本站。

1. 先完整閱讀 `CLAUDE.md`，特別是第 5（區塊）、6（命名）、7（資料）、8（內容）、9（SOP）節。
2. 用網路搜尋查證：出道日、經紀公司、粉絲名、現役成員與排序、出道曲、代表作、近 6 個月動態。查不到可靠來源的內容不要寫。
3. 依第 6 節決定 slug，確認 `groups/<slug>.html` 尚不存在；若已存在，停下來詢問使用者是否改為更新。
4. 複製 `templates/group-template.html` 為 `groups/<slug>.html`，依序填滿 9 個區塊，刪除範本中的說明註解。
5. 選一個在深色背景上清楚的主色，同時寫入 `<body style="--accent:...">` 與 `groups-data.js` 的 `color`。
6. 在 `assets/js/groups-data.js` 依出道日順序插入資料，`updated` 填今天日期。
7. 執行 `node scripts/check.mjs`，有錯誤就修到通過。
8. 回報：新頁面路徑、用了哪些來源、有哪些資訊因查不到而略過。
9. `git commit -m "feat(group): add $ARGUMENTS"`
