#!/usr/bin/env node
/**
 * KPOP 團體圖鑑 — 結構驗證腳本
 * 用法：node scripts/check.mjs
 * 對應規則：CLAUDE.md 第 5、6、7、8、11 節
 * 不需要安裝任何套件。
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SECTIONS = ["hero", "profile", "members", "story", "discography", "latest", "starter", "trivia", "sources"];
const REQUIRED_KEYS = ["slug", "name", "nameKo", "nameZh", "type", "agency", "debut", "fandom", "members", "color", "tagline", "updated"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const errors = [];
const err = (where, msg) => errors.push(`✗ [${where}] ${msg}`);

// ---------- 1. 讀取 groups-data.js ----------
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(ROOT, "assets/js/groups-data.js"), "utf8"), sandbox);
const groups = sandbox.window.GROUPS || [];
if (!groups.length) err("groups-data.js", "window.GROUPS 是空的");

const seen = new Set();
groups.forEach((g, i) => {
  const where = `groups-data.js #${i} ${g.slug ?? "?"}`;
  REQUIRED_KEYS.forEach((k) => { if (!(k in g)) err(where, `缺少欄位 ${k}`); });
  if (seen.has(g.slug)) err(where, "slug 重複");
  seen.add(g.slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug)) err(where, "slug 只能是小寫英數與 -");
  if (!["boy", "girl", "coed"].includes(g.type)) err(where, `type 必須是 boy/girl/coed`);
  if (!DATE.test(g.debut)) err(where, "debut 格式須為 YYYY-MM-DD");
  if (!DATE.test(g.updated)) err(where, "updated 格式須為 YYYY-MM-DD");
  if (!/^#[0-9a-fA-F]{6}$/.test(g.color)) err(where, "color 須為 #RRGGBB");
  if (typeof g.members !== "number") err(where, "members 必須是數字");
  if ([...String(g.tagline)].length > 20) err(where, "tagline 超過 20 字");
  if (i > 0 && groups[i - 1].debut > g.debut) err(where, "未依出道日由舊到新排序");
});

// ---------- 2. 檢查每個團體頁 ----------
const dir = join(ROOT, "groups");
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".html")) : [];
const fileSlugs = new Set(files.map((f) => f.replace(/\.html$/, "")));

groups.forEach((g) => {
  if (!fileSlugs.has(g.slug)) err(g.slug, `已登錄但找不到 groups/${g.slug}.html`);
});

files.forEach((file) => {
  const slug = file.replace(/\.html$/, "");
  const where = `groups/${file}`;
  const html = readFileSync(join(dir, file), "utf8");
  const g = groups.find((x) => x.slug === slug);

  if (!g) { err(where, "頁面存在但沒有登錄在 groups-data.js"); return; }

  // 區塊順序
  const ids = [...html.matchAll(/<section id="([a-z]+)"/g)].map((m) => m[1]);
  if (ids.join(",") !== SECTIONS.join(",")) err(where, `區塊順序應為 ${SECTIONS.join(" → ")}，目前是 ${ids.join(" → ")}`);

  // 殘留佔位符
  if (/\{\{|TODO/.test(html)) err(where, "仍有 {{...}} 或 TODO 未替換");

  // body 屬性
  if (!html.includes(`data-slug="${slug}"`)) err(where, "<body> 的 data-slug 與檔名不一致");
  if (!html.includes(`--accent:${g.color}`)) err(where, `--accent 必須與 groups-data.js 的 color (${g.color}) 相同`);
  if (!html.includes(`<title>${g.name} | KPOP 團體圖鑑</title>`)) err(where, "<title> 格式錯誤");
  if (!html.includes(`<nav class="pager" data-slug="${slug}"></nav>`)) err(where, "缺少空白的 pager 導覽");

  // hero 內容與資料一致
  if (!html.includes(`<p class="tagline">${g.tagline}</p>`)) err(where, "hero tagline 與 groups-data.js 不一致");

  // profile 固定 6 列
  const profile = html.split('id="profile"')[1]?.split("</section>")[0] ?? "";
  const rows = (profile.match(/<tr>/g) || []).length;
  if (rows !== 6) err(where, `基本資料表格應為 6 列，目前 ${rows} 列`);

  // members 數量
  const memberCount = (html.match(/<li class="member">/g) || []).length;
  if (memberCount !== g.members) err(where, `成員卡 ${memberCount} 張，但 members = ${g.members}`);

  // discography 5–8 項
  const disco = html.split('id="discography"')[1]?.split("</section>")[0] ?? "";
  const discoCount = (disco.match(/<li>/g) || []).length;
  if (discoCount < 5 || discoCount > 8) err(where, `代表作需 5–8 項，目前 ${discoCount}`);
  const years = [...disco.matchAll(/<span class="year">(\d{4})<\/span>/g)].map((m) => +m[1]);
  if (years.some((y, i) => i > 0 && y < years[i - 1])) err(where, "代表作年份未由舊到新排列");

  // latest 資料截至
  const asof = html.match(/資料截至 (\d{4}-\d{2}-\d{2})/);
  if (!asof) err(where, "最新動態缺少「資料截至 YYYY-MM-DD」");
  else if (asof[1] !== g.updated) err(where, `資料截至 ${asof[1]} 與 updated ${g.updated} 不一致`);

  // starter 剛好 3 首
  const starter = html.split('id="starter"')[1]?.split("</section>")[0] ?? "";
  const starterCount = (starter.match(/<li>/g) || []).length;
  if (starterCount !== 3) err(where, `入坑推薦需剛好 3 首，目前 ${starterCount}`);

  // sources 至少 2 個 https 連結
  const sources = html.split('id="sources"')[1]?.split("</section>")[0] ?? "";
  const links = (sources.match(/href="https:\/\//g) || []).length;
  if (links < 2) err(where, `資料來源至少 2 個 https 連結，目前 ${links}`);

  // 圖片與外部腳本
  if (/<img\b/i.test(html)) err(where, "不可使用 <img>（CLAUDE.md 4.3）");
  if (/<script[^>]+src="https?:/i.test(html)) err(where, "不可引用外部腳本");
  if (/(href|src)="\/(?!\/)/.test(html)) err(where, "站內連結不可使用 / 開頭的絕對路徑");
});

// ---------- 3. 結果 ----------
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n❌ ${errors.length} problem(s) found`);
  process.exit(1);
}
console.log(`✅ All checks passed — ${groups.length} groups, ${files.length} pages`);
