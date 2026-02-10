# 작업 기록: 블로그 초기 구축

- **작업일**: 2026-02-10
- **작업자**: AI Assistant
- **프롬프트**: PLAN.md 기반 GitHub Pages 정적 블로그 전체 구축

## 작업 내용

PLAN.md에 기술된 계획에 따라 GitHub Pages 정적 블로그를 처음부터 구축하였습니다.

### 생성된 파일 목록

| 파일                                | 설명                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| `.nojekyll`                         | Jekyll 비활성화 (GitHub Pages 필수)                    |
| `index.html`                        | 메인 페이지 - 게시글 목록, 검색, 태그 필터             |
| `post.html`                         | 게시글 상세 페이지 - 마크다운 렌더링, 댓글             |
| `css/style.css`                     | 메인 스타일시트 - 다크/라이트 모드, 반응형             |
| `css/prism.css`                     | 코드 하이라이팅 테마 - 다크/라이트 대응                |
| `js/theme.js`                       | 다크/라이트 모드 토글, localStorage 저장               |
| `js/app.js`                         | 게시글 목록 렌더링, 태그 필터링                        |
| `js/search.js`                      | 클라이언트 사이드 검색 (디바운싱 적용)                 |
| `js/post-loader.js`                 | 마크다운 파싱/렌더링, Giscus 댓글 로드                 |
| `pages/example.md`                  | 샘플 게시글 (Front Matter 포함)                        |
| `posts.json`                        | 게시글 메타데이터 (초기 파일, Actions에서 자동 재생성) |
| `.github/workflows/deploy.yml`      | GitHub Pages 자동 배포 워크플로우                      |
| `.github/scripts/generate-posts.js` | posts.json 자동 생성 스크립트                          |

### 구현된 기능

1. **마크다운 기반 게시글**: `pages/` 폴더에 `.md` 파일 추가로 게시글 작성
2. **다크/라이트 모드**: CSS 변수 기반, localStorage 저장, 시스템 테마 감지
3. **태그 필터링**: 태그별 게시글 필터링 (빈도수 표시)
4. **클라이언트 사이드 검색**: 제목/태그/설명/카테고리 대상, 300ms 디바운싱
5. **코드 하이라이팅**: Prism.js (JS, Python, CSS, Bash, JSON, YAML, Java, TypeScript)
6. **Giscus 댓글**: GitHub Discussions 기반 (설정값 교체 필요)
7. **GitHub Actions 자동 배포**: push 시 posts.json 생성 + Pages 배포
8. **반응형 디자인**: 모바일/태블릿/데스크톱 대응
9. **UTF-8 BOM 처리**: Windows 호환성 확보

### 사용자 조치 필요 사항

- **Giscus 설정**: `js/post-loader.js`의 `YOUR_REPO_ID`, `YOUR_CATEGORY_ID`를 실제 값으로 교체
  - https://giscus.app/ko 에서 설정 후 값 확인
- **GitHub 저장소 설정**: Discussions 활성화, Giscus 앱 설치
- **GitHub Pages 설정**: Settings > Pages > Source를 "GitHub Actions"로 설정

## 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- marked.js v12.0.0 (CDN)
- Prism.js v1.29.0 (CDN)
- Giscus (GitHub Discussions 댓글)
- GitHub Actions (자동 배포)
