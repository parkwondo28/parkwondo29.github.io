/**
 * search.js - 클라이언트 사이드 검색 기능
 * 제목, 태그, 설명, 카테고리를 대상으로 검색합니다.
 * 전역 변수 충돌 방지를 위해 searchPosts 등 고유 이름 사용.
 */
(function () {
  let searchTimeout = null;

  /**
   * 검색어로 게시글을 필터링합니다.
   */
  function filterPosts(query) {
    if (!window.blogApp) return;

    var searchPosts = window.blogApp.getAllPosts();
    var activeTag = window.blogApp.getActiveTag();
    var lowerQuery = query.toLowerCase().trim();

    // 활성 태그가 있으면 해당 태그 게시글만 대상
    if (activeTag) {
      searchPosts = searchPosts.filter(function (post) {
        return Array.isArray(post.tags) && post.tags.includes(activeTag);
      });
    }

    if (!lowerQuery) {
      window.blogApp.renderPosts(searchPosts);
      return;
    }

    var results = searchPosts.filter(function (post) {
      // 제목 검색
      if (post.title && post.title.toLowerCase().includes(lowerQuery))
        return true;

      // 설명 검색
      if (
        post.description &&
        post.description.toLowerCase().includes(lowerQuery)
      )
        return true;

      // 발췌문 검색
      if (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery))
        return true;

      // 카테고리 검색
      if (post.category && post.category.toLowerCase().includes(lowerQuery))
        return true;

      // 태그 검색
      if (Array.isArray(post.tags)) {
        return post.tags.some(function (tag) {
          return tag.toLowerCase().includes(lowerQuery);
        });
      }

      return false;
    });

    window.blogApp.renderPosts(results);
  }

  /**
   * 검색 초기화 (태그 전환 시 호출)
   */
  function resetSearch() {
    var input = document.getElementById("search-input");
    if (input) {
      input.value = "";
    }
  }

  /**
   * 초기화 - 검색 입력 이벤트 등록
   */
  function init() {
    var searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", function (e) {
      // 디바운싱: 300ms 후 검색 실행
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        filterPosts(e.target.value);
      }, 300);
    });

    // 엔터 키로 즉시 검색
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        if (searchTimeout) clearTimeout(searchTimeout);
        filterPosts(e.target.value);
      }
    });
  }

  // 검색 모듈 공개
  window.blogSearch = {
    reset: resetSearch,
  };

  document.addEventListener("DOMContentLoaded", init);
})();
