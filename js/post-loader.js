/**
 * post-loader.js - 마크다운 로딩, 파싱, 렌더링
 * marked.js를 사용하여 마크다운을 HTML로 변환하고,
 * Prism.js로 코드 하이라이팅을 적용합니다.
 * Giscus 댓글 시스템을 로드합니다.
 */
(function () {
  /**
   * URL 쿼리 파라미터에서 file 값을 가져옵니다.
   */
  function getFileParam() {
    var params = new URLSearchParams(window.location.search);
    return params.get("file");
  }

  /**
   * Front Matter를 파싱합니다.
   */
  function parseFrontMatter(content) {
    // UTF-8 BOM 제거
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    var match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      return { metadata: {}, body: content };
    }

    var frontMatter = match[1];
    var body = match[2];
    var metadata = {};

    var lines = frontMatter.split(/\r?\n/);
    lines.forEach(function (line) {
      var colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        var key = line.substring(0, colonIndex).trim();
        var value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value
              .slice(1, -1)
              .split(",")
              .map(function (tag) {
                return tag.trim().replace(/^['"]|['"]$/g, "");
              });
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata: metadata, body: body };
  }

  /**
   * marked.js 설정
   */
  function configureMarked() {
    if (typeof marked === "undefined") return;

    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
    });
  }

  /**
   * 마크다운을 HTML로 변환하여 렌더링합니다.
   */
  function renderPost(metadata, body) {
    // 제목
    var titleEl = document.getElementById("post-title");
    if (titleEl) {
      titleEl.textContent = metadata.title || "제목 없음";
    }

    // 페이지 제목 업데이트
    document.title = (metadata.title || "게시글") + " - parkwondo29 Blog";

    // 메타 정보
    var metaEl = document.getElementById("post-meta");
    if (metaEl) {
      var metaParts = [];
      if (metadata.date) metaParts.push(metadata.date);
      if (metadata.category) metaParts.push(metadata.category);
      metaEl.textContent = metaParts.join(" · ");
    }

    // 태그
    var tagsEl = document.getElementById("post-tags");
    if (tagsEl && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
      tagsEl.innerHTML = metadata.tags
        .map(function (tag) {
          return '<span class="tag-btn">' + escapeHtml(tag) + "</span>";
        })
        .join("");
    }

    // 본문 렌더링
    var bodyEl = document.getElementById("post-body");
    if (bodyEl && typeof marked !== "undefined") {
      bodyEl.innerHTML = marked.parse(body);

      // Prism.js 코드 하이라이팅 적용
      if (typeof Prism !== "undefined") {
        Prism.highlightAllUnder(bodyEl);
      }
    }
  }

  /**
   * HTML 이스케이프
   */
  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Giscus 댓글 로드
   */
  function loadGiscus() {
    var container = document.getElementById("giscus-container");
    if (!container) return;

    var theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    var script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "parkwondo29/parkwondo29.github.io");
    script.setAttribute("data-repo-id", "R_kgDORMyiEw"); // giscus.app에서 확인 후 교체
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDORMyiE84C2Icu"); // giscus.app에서 확인 후 교체
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "ko");
    script.crossOrigin = "anonymous";
    script.async = true;

    container.appendChild(script);
  }

  /**
   * 게시글 로드 실패 시 에러 표시
   */
  function showError(message) {
    var titleEl = document.getElementById("post-title");
    var bodyEl = document.getElementById("post-body");

    if (titleEl) titleEl.textContent = "오류";
    if (bodyEl) {
      bodyEl.innerHTML =
        '<p style="color: var(--text-muted);">' +
        escapeHtml(message) +
        "</p>" +
        '<p><a href="index.html">&larr; 목록으로 돌아가기</a></p>';
    }
  }

  /**
   * 초기화 - 마크다운 파일을 불러와 렌더링
   */
  async function init() {
    var filename = getFileParam();
    if (!filename) {
      showError("게시글 파일이 지정되지 않았습니다.");
      return;
    }

    configureMarked();

    try {
      var response = await fetch("pages/" + encodeURIComponent(filename));
      if (!response.ok) {
        throw new Error("파일을 찾을 수 없습니다: " + filename);
      }

      var content = await response.text();
      var parsed = parseFrontMatter(content);

      renderPost(parsed.metadata, parsed.body);
      loadGiscus();
    } catch (error) {
      console.error("게시글 로드 오류:", error);
      showError(error.message || "게시글을 불러올 수 없습니다.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
