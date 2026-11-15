/* =========================================================
   KPOP 團體圖鑑 — 全站共用腳本
   1) 首頁：依 window.GROUPS 產生卡片牆與篩選
   2) 團體頁：依 window.GROUPS 產生「上一團 / 下一團」導覽
   資料格式見 CLAUDE.md 第 7 節。
   ========================================================= */
(function () {
  "use strict";

  var GROUPS = (window.GROUPS || []).slice().sort(function (a, b) {
    return a.debut.localeCompare(b.debut);
  });
  var TYPE_LABEL = { boy: "男團", girl: "女團", coed: "混聲團" };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    var grid = document.getElementById("group-grid");
    if (!grid) return;

    var state = { type: "all", agency: "all" };

    // 依資料動態產生「經紀公司」篩選按鈕
    var agencyBox = document.getElementById("agency-filters");
    var agencies = [];
    GROUPS.forEach(function (g) {
      if (agencies.indexOf(g.agency) === -1) agencies.push(g.agency);
    });
    agencies.sort();
    agencyBox.innerHTML =
      '<button class="chip" data-agency="all" aria-pressed="true">全部公司</button>' +
      agencies.map(function (a) {
        return '<button class="chip" data-agency="' + esc(a) + '" aria-pressed="false">' + esc(a) + "</button>";
      }).join("");

    function draw() {
      var list = GROUPS.filter(function (g) {
        return (state.type === "all" || g.type === state.type) &&
               (state.agency === "all" || g.agency === state.agency);
      });
      document.getElementById("group-count").textContent = list.length;
      if (!list.length) {
        grid.innerHTML = '<p class="empty">這個條件下還沒有團體 🥲</p>';
        return;
      }
      grid.innerHTML = list.map(function (g) {
        return (
          '<a class="card" href="groups/' + esc(g.slug) + '.html" style="--c:' + esc(g.color) + '">' +
            '<div class="card-glow en">' + esc(g.name) + "</div>" +
            '<div class="card-body">' +
              '<h3>' + esc(g.name) + "</h3>" +
              '<div class="ko">' + esc(g.nameKo) + (g.nameZh ? "・" + esc(g.nameZh) : "") + "</div>" +
              "<p>" + esc(g.tagline) + "</p>" +
              '<div class="card-meta">' +
                '<span class="tag">' + esc(TYPE_LABEL[g.type] || g.type) + "</span>" +
                '<span class="tag">' + esc(g.debut.slice(0, 4)) + " 出道</span>" +
                '<span class="tag">' + esc(g.members) + " 人</span>" +
                '<span class="tag">' + esc(g.fandom) + "</span>" +
              "</div>" +
            "</div>" +
          "</a>"
        );
      }).join("");
    }

    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var key = btn.hasAttribute("data-type") ? "type" : "agency";
      state[key] = btn.getAttribute("data-" + key);
      document.querySelectorAll(".chip[data-" + key + "]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      draw();
    });

    draw();
  }

  /* ---------- 團體頁：上一團 / 下一團 ---------- */
  function renderPager() {
    var pager = document.querySelector(".pager[data-slug]");
    if (!pager) return;
    var slug = pager.getAttribute("data-slug");
    var i = GROUPS.findIndex(function (g) { return g.slug === slug; });
    if (i === -1) {
      pager.innerHTML = '<p class="muted">⚠️ 這一團尚未登錄在 groups-data.js</p>';
      return;
    }
    var prev = GROUPS[i - 1], next = GROUPS[i + 1];
    pager.innerHTML =
      (prev
        ? '<a class="prev" href="' + esc(prev.slug) + '.html"><span class="dir">← 上一團（較早出道）</span><span class="en">' + esc(prev.name) + "</span></a>"
        : '<span class="placeholder"></span>') +
      (next
        ? '<a class="next" href="' + esc(next.slug) + '.html"><span class="dir">下一團（較晚出道）→</span><span class="en">' + esc(next.name) + "</span></a>"
        : '<span class="placeholder"></span>');
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHome();
    renderPager();
  });
})();
