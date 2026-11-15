# CLAUDE.md — KPOP 團體圖鑑（kpop-group-guide）

> 這份文件是給 AI（Claude Code、Codex、Cursor 等）與協作者看的「專案說明書」。
> **開始任何修改前，請完整讀完本文件。** 若本文件與你的習慣做法衝突，以本文件為準。

---

## 1. 專案目的

「KPOP 團體圖鑑」是一個**繁體中文**的 KPOP 團體介紹網站，目標讀者是「剛入坑、想快速認識一個團」的台灣粉絲。

- 每個 KPOP 團體 = 一個獨立頁面，**所有團體頁使用同一套版型與區塊順序**。
- 首頁是「團體卡片牆」，可依「男團 / 女團」與「經紀公司」篩選。
- 這個專案的重點是「**可以照規則一直加下去**」：使用者只要說「新增 IVE」，AI 就能依本文件產出一頁風格、結構、資料格式都一致的新頁面。

## 2. 技術限制（不可違反）

| 項目 | 規定 |
|---|---|
| 技術 | 純 HTML + CSS + 原生 JavaScript。**不使用** React/Vue、npm 套件、打包工具、建置步驟 |
| 部署 | GitHub Pages，從 `main` 分支根目錄 `/` 發布 |
| 本機預覽 | 直接雙擊 `index.html` 就要能看（`file://`），所以**不可用 `fetch()` 讀 JSON**；資料一律放在 `assets/js/groups-data.js` |
| 外部資源 | 只允許 Google Fonts。不可引用外部圖片、外部 JS、CDN 套件 |
| 路徑 | 一律使用**相對路徑**（例如 `../assets/css/style.css`），不可用 `/` 開頭的絕對路徑（GitHub Pages 子路徑會壞掉） |
| 驗證工具 | `scripts/check.mjs`，用 Node.js 執行，不需安裝任何套件 |

## 3. 目錄結構

```
kpop-group-guide/
├── CLAUDE.md                  ← 本文件（主要規則）
├── AGENTS.md                  ← 給其他 AI 工具的入口，指向本文件
├── README.md                  ← 給人看的專案簡介
├── index.html                 ← 首頁：團體卡片牆（由 JS 依 groups-data.js 產生）
├── about.html                 ← 關於本站：製作方式與擴充流程
├── groups/                    ← 所有團體頁，一團一檔
│   ├── bts.html
│   ├── blackpink.html
│   └── ...
├── templates/
│   └── group-template.html    ← 團體頁範本，新增團體時「複製這份」
├── assets/
│   ├── css/style.css          ← 全站唯一的樣式檔
│   └── js/
│       ├── groups-data.js     ← 團體註冊表（首頁卡片、上下頁導覽的資料來源）
│       └── main.js            ← 首頁渲染、篩選、團體頁導覽
├── scripts/
│   └── check.mjs              ← 結構驗證腳本
├── .claude/commands/
│   └── add-group.md           ← Claude Code 指令：/add-group <團名>
└── .nojekyll                  ← 讓 GitHub Pages 不經過 Jekyll 處理
```

**不要**新增其他頂層資料夾或其他 CSS/JS 檔。需要新樣式時，加到 `style.css` 對應區段。

## 4. 視覺風格

整體概念：**「演唱會場館的夜晚」**——深色舞台背景，每個團有自己的「螢光棒色」當主色。

### 4.1 色彩（定義在 `style.css` 的 `:root`）

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#0b0b14` | 頁面背景（舞台黑） |
| `--surface` | `#151524` | 卡片、區塊底色 |
| `--line` | `#2a2a40` | 分隔線、邊框 |
| `--text` | `#f2f0ff` | 主要文字 |
| `--muted` | `#a19fbf` | 次要文字 |
| `--accent` | 每團自訂 | 該團主色，在團體頁 `<body style="--accent:#xxxxxx">` 設定 |

- 每個團的 `--accent` 必須與 `groups-data.js` 中的 `color` 相同。
- `color` 是**本站的設計用色**，不等於官方應援色。只有查證過官方應援色時，才可在頁面文字寫「官方應援色」。
- 主色需在深色背景上清楚可讀：避免太暗的顏色（例如純黑、深藍 `#1a237e`）。若官方色太暗，改用同色系較亮的版本。

### 4.2 字體

- 中文內文：`Noto Sans TC`
- 英文標題 / 團名：`Space Grotesk`
- 兩者都由 Google Fonts 載入，已寫在範本 `<head>` 中，不要改。

### 4.3 圖片政策（重要）

- **不放任何偶像照片、專輯封面、團體 Logo**（版權與肖像權）。
- 團體視覺一律使用 CSS 產生的「螢光棒光暈卡」（`.hero-glow`），內容是團名文字 + 主色漸層。
- 可使用 emoji 作為小圖示（例如 🎤 💿 ✨），但每頁最多 10 個，不要濫用。

## 5. 團體頁結構（每一頁都必須一致）

每個團體頁都由 `templates/group-template.html` 複製而來，`<main>` 內的區塊**必須依下列順序全部出現**，且 `id` 不可更改（`scripts/check.mjs` 會檢查）：

| 順序 | 區塊 `id` | 標題 | 內容規則 |
|---|---|---|---|
| 1 | `hero` | （無標題，團名大字） | 英文團名、韓文團名、一句話介紹（tagline，20 字內） |
| 2 | `profile` | 基本資料 | 固定 6 列表格：出道日、經紀公司、粉絲名、成員人數、類型（男團/女團）、出道曲 |
| 3 | `members` | 成員 | 每位成員一個 `<li class="member">`：藝名（英文）+ 本名或中文譯名 + 1–2 個標籤（角色或狀態，例如 隊長、主唱、台灣成員、服役中），多個標籤以「・」分隔放在同一個 `.role` 內。依官方排序 |
| 4 | `story` | 團體故事 | 2–4 段，介紹組成背景、團名意義、重要轉折。每段 60–150 字 |
| 5 | `discography` | 代表作時間軸 | 5–8 個項目，依年份**由舊到新**。每項：年份、作品名（英文原名）、一句話說明 |
| 6 | `latest` | 最新動態 | 3–5 點近況，**第一行必須寫「資料截至 YYYY-MM-DD」**。只寫有新聞來源的事 |
| 7 | `starter` | 入坑推薦 | 剛好 3 首歌，每首附一句「為什麼適合當第一首」 |
| 8 | `trivia` | 小知識 | 3–5 則有趣但可查證的事實 |
| 9 | `sources` | 資料來源 | 列出本頁用到的所有來源連結（至少 2 個，至少 1 個是新聞或官方來源） |

頁面最下方的 `<nav class="pager" data-slug="...">` 由 `main.js` 自動產生「上一團 / 下一團」，不要手寫。

## 6. 命名與放置規則

- **slug**（檔名與資料 key）：團體英文名轉小寫，空白與符號改為 `-`，去掉其他特殊字元。
  - `BTS` → `bts`
  - `Stray Kids` → `stray-kids`
  - `(G)I-DLE` → `gi-dle`
  - `aespa` → `aespa`
- 團體頁檔名：`groups/<slug>.html`
- `<body>` 必須帶 `data-slug="<slug>"`，且與檔名一致。
- `<title>` 格式：`<團名> | KPOP 團體圖鑑`
- 團名大小寫：**照官方寫法**（`aespa` 全小寫、`BLACKPINK` 全大寫、`Stray Kids` 首字大寫）。

## 7. 資料註冊表 `assets/js/groups-data.js`

首頁卡片與上下頁導覽都讀這個檔。每個團一個物件，格式固定：

```js
{
  slug: "bts",                // 與檔名一致
  name: "BTS",                // 官方英文團名
  nameKo: "방탄소년단",        // 韓文團名
  nameZh: "防彈少年團",        // 常見中文譯名，沒有就填 ""
  type: "boy",                // "boy" | "girl" | "coed"
  agency: "BIGHIT MUSIC",     // 目前經紀公司（團體活動）
  debut: "2013-06-13",        // YYYY-MM-DD
  fandom: "ARMY",
  members: 7,                 // 目前官方成員數（數字）
  color: "#a855f7",           // 本站主色，與頁面 --accent 相同
  tagline: "從小公司走到世界頂點的七人團",  // 20 字內，與頁面 hero 相同
  updated: "2026-11-16"       // 本頁最後查證日期
}
```

- 陣列依**出道日由舊到新**排序（上下頁導覽依此順序）。
- 新增欄位前，必須先更新本文件第 7 節，再改 `main.js` 與 `check.mjs`。

## 8. 內容與事實規則

1. **先查證再寫**：成員、經紀公司、最新動態這類「會變動」的資訊，必須用網路搜尋確認目前狀態，不可只憑記憶。
2. **時效資訊要標日期**：`latest` 區塊第一行寫「資料截至 YYYY-MM-DD」，並同步更新 `groups-data.js` 的 `updated`。
3. **不確定就不寫**：查不到可靠來源的傳聞、八卦、戀愛新聞、爭議事件一律不寫。
4. **語氣中立友善**：介紹而不是吹捧，不比較團體之間的高低、不寫「最強」「第一」這類無來源的評價。有來源的紀錄（例如「首支登上 Billboard Hot 100 冠軍」）可以寫。
5. **不貼歌詞**：可以寫歌名與一句話描述，**不可引用任何歌詞**（版權）。
6. **用語**：繁體中文、台灣慣用譯名（例如「經紀公司」不寫「經紀社」、「回歸」、「出道」可直接使用）。英文專有名詞（歌名、專輯名）保留原文。
7. 成員入伍、休息、退團等狀態，寫在 `members` 的標籤或 `latest`，用中性描述（例如「服役中」）。

## 9. 新增一個團體的標準流程（SOP）

當使用者說「新增 <團名>」時，依序執行：

1. **查證**：搜尋該團的出道日、經紀公司、粉絲名、現役成員、代表作、近 6 個月動態。
2. **決定 slug**：依第 6 節規則。確認 `groups/<slug>.html` 尚不存在。
3. **複製範本**：把 `templates/group-template.html` 複製成 `groups/<slug>.html`。
4. **填內容**：把所有 `{{...}}` 佔位符與 `TODO` 換成真實內容，依第 5 節規則填滿 9 個區塊。
5. **設定主色**：在 `<body style="--accent:#xxxxxx">` 設主色。
6. **登錄資料**：在 `assets/js/groups-data.js` 依出道日順序插入一筆物件。
7. **驗證**：執行 `node scripts/check.mjs`，必須顯示 `✅ All checks passed`。
8. **預覽**：開 `index.html` 確認新卡片出現、點進去版面正常、上下頁導覽正確。
9. **Commit**：`git commit -m "feat(group): add <團名>"`

## 10. 修改既有內容的規則

- **更新近況**：只改 `latest` 區塊與 `updated` 日期，其他區塊不動。Commit：`content(<slug>): update latest`
- **修正錯誤**：直接修正，並在 `sources` 補上佐證來源。Commit：`fix(<slug>): <修正內容>`
- **改版型 / 樣式**：會影響所有頁面，必須同時更新 `templates/group-template.html`、**全部**既有團體頁、本文件第 5 節。Commit：`style: ...` 或 `refactor: ...`
- 不可只改某一個團體頁的結構而不改其他頁——一致性是本站最重要的規則。
- 不要刪除任何團體頁，除非使用者明確要求。

## 11. 完成檢查清單

每次新增或修改後，逐項確認：

- [ ] `node scripts/check.mjs` 通過
- [ ] 新頁面沒有殘留 `{{`、`TODO`
- [ ] 9 個區塊都在，順序正確
- [ ] `latest` 有「資料截至」日期，且與 `groups-data.js` 的 `updated` 一致
- [ ] `--accent` 與 `color` 相同
- [ ] 沒有 `<img>`、沒有歌詞、沒有外部腳本
- [ ] 所有連結都是相對路徑（站內）或 `https://`（來源）
- [ ] 首頁卡片、篩選、上下頁導覽正常

## 12. Commit 訊息格式

```
feat(group): add <團名>        新增團體
content(<slug>): <說明>         更新內容
fix(<slug>): <說明>             修正錯誤
style: <說明>                   樣式調整
docs: <說明>                    修改 CLAUDE.md / README / about
```
