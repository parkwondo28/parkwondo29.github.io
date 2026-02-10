/**
 * app.js - 메인 애플리케이션 로직
 * posts.json을 fetch하여 게시글 목록을 렌더링하고 태그 필터링을 처리합니다.
 */
(function () {
  // 전역 변수 (app 모듈 전용)
  let allPosts = [];
  let allTags = [];
  let activeTag = null;

  /**
   * posts.json에서 게시글 목록을 가져옵니다.
   */
  async function fetchPosts() {
    try {
      const response = await fetch("posts.json");
      if (!response.ok) throw new Error("posts.json 로드 실패");
      allPosts = await response.json();
      return allPosts;
    } catch (error) {
      console.error("게시글 목록 로드 오류:", error);
      return [];
    }
  }

  /**
   * 태그 목록을 추출하고 렌더링합니다.
   */
  function renderTags(posts) {
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) return;

    // 모든 태그 추출 및 빈도 계산
    const tagCount = {};
    posts.forEach(function (post) {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(function (tag) {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    allTags = Object.keys(tagCount).sort();

    // 태그 버튼 생성
    tagsContainer.innerHTML = "";

    // "전체" 버튼
    var allBtn = document.createElement("button");
    allBtn.className = "tag-btn active";
    allBtn.textContent = "전체";
    allBtn.addEventListener("click", function () {
      activeTag = null;
      updateActiveTagButton(tagsContainer);
      renderPosts(allPosts);
      // 검색과 연동
      if (window.blogSearch && typeof window.blogSearch.reset === "function") {
        window.blogSearch.reset();
      }
    });
    tagsContainer.appendChild(allBtn);

    allTags.forEach(function (tag) {
      var btn = document.createElement("button");
      btn.className = "tag-btn";
      btn.textContent = tag + " (" + tagCount[tag] + ")";
      btn.dataset.tag = tag;
      btn.addEventListener("click", function () {
        activeTag = tag;
        updateActiveTagButton(tagsContainer);
        var filtered = allPosts.filter(function (post) {
          return Array.isArray(post.tags) && post.tags.includes(tag);
        });
        renderPosts(filtered);
      });
      tagsContainer.appendChild(btn);
    });
  }

  /**
   * 활성 태그 버튼 스타일을 업데이트합니다.
   */
  function updateActiveTagButton(container) {
    var buttons = container.querySelectorAll(".tag-btn");
    buttons.forEach(function (btn) {
      btn.classList.remove("active");
      if (activeTag === null && !btn.dataset.tag) {
        btn.classList.add("active");
      } else if (btn.dataset.tag === activeTag) {
        btn.classList.add("active");
      }
    });
  }

  /**
   * 게시글 카드를 렌더링합니다.
   */
  function renderPosts(posts) {
    var container = document.getElementById("posts-container");
    var noResults = document.getElementById("no-results");
    if (!container) return;

    if (posts.length === 0) {
      container.innerHTML = "";
      if (noResults) noResults.style.display = "block";
      return;
    }

    if (noResults) noResults.style.display = "none";

    container.innerHTML = posts
      .map(function (post) {
        var tagsHtml = "";
        if (Array.isArray(post.tags) && post.tags.length > 0) {
          tagsHtml =
            '<div class="post-card-tags">' +
            post.tags
              .map(function (tag) {
                return (
                  '<span class="post-card-tag">' + escapeHtml(tag) + "</span>"
                );
              })
              .join("") +
            "</div>";
        }

        var description = post.description || post.excerpt || "";

        return (
          '<a href="post.html?file=' +
          encodeURIComponent(post.file) +
          '" class="post-card">' +
          '<h2 class="post-card-title">' +
          escapeHtml(post.title) +
          "</h2>" +
          '<div class="post-card-meta">' +
          escapeHtml(post.date) +
          (post.category ? " &middot; " + escapeHtml(post.category) : "") +
          "</div>" +
          (description
            ? '<p class="post-card-description">' +
              escapeHtml(description) +
              "</p>"
            : "") +
          tagsHtml +
          "</a>"
        );
      })
      .join("");
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
   * 초기화
   */
  async function init() {
    var posts = await fetchPosts();
    renderTags(posts);
    renderPosts(posts);

    // 검색 모듈에 데이터 공유
    window.blogApp = {
      getAllPosts: function () {
        return allPosts;
      },
      getActiveTag: function () {
        return activeTag;
      },
      renderPosts: renderPosts,
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
