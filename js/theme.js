/**
 * theme.js - 다크/라이트 모드 토글
 * localStorage에 테마 설정을 저장하고, 시스템 테마를 감지합니다.
 */
(function () {
  const THEME_KEY = "blog-theme";

  /**
   * 저장된 테마를 가져오거나 시스템 테마를 감지
   */
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;

    // 시스템 다크 모드 감지
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  /**
   * 테마 적용
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    // Giscus 테마 동기화
    updateGiscusTheme(theme);
  }

  /**
   * Giscus 댓글 테마 동기화
   */
  function updateGiscusTheme(theme) {
    const giscusFrame = document.querySelector("iframe.giscus-frame");
    if (giscusFrame) {
      const giscusTheme = theme === "dark" ? "dark" : "light";
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        "https://giscus.app",
      );
    }
  }

  /**
   * 테마 토글
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  // 초기 테마 적용 (FOUC 방지를 위해 즉시 실행)
  applyTheme(getPreferredTheme());

  // DOM이 준비되면 토글 버튼 이벤트 등록
  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleTheme);
    }
  });

  // 시스템 테마 변경 감지
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        // 사용자가 수동으로 설정한 경우 시스템 테마 변경 무시
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }
})();
