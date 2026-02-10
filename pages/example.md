---
title: "첫 번째 게시글 - 블로그에 오신 것을 환영합니다"
date: 2026-02-10
tags: ["Blog", "Introduction"]
category: "General"
description: "GitHub Pages로 만든 정적 블로그의 첫 번째 게시글입니다."
---

# 블로그에 오신 것을 환영합니다

안녕하세요! 이 블로그는 **GitHub Pages**와 **Vanilla JavaScript**로 만들어진 정적 블로그입니다.

## 주요 기능

- **마크다운 기반 글 작성**: `pages/` 폴더에 `.md` 파일을 추가하면 자동으로 게시글이 등록됩니다.
- **다크/라이트 모드**: 우측 상단 토글 버튼으로 테마를 전환할 수 있습니다.
- **태그 필터링**: 태그를 클릭하여 관련 게시글만 모아볼 수 있습니다.
- **검색 기능**: 제목, 태그, 설명을 기반으로 게시글을 검색할 수 있습니다.
- **코드 하이라이팅**: Prism.js를 사용하여 코드 블록이 예쁘게 표시됩니다.
- **댓글 시스템**: Giscus를 통해 GitHub Discussions 기반 댓글을 남길 수 있습니다.

## 코드 예시

JavaScript 코드 예시입니다:

```javascript
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
  return `환영합니다!`;
}

greet("방문자");
```

Python 코드도 지원합니다:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i), end=' ')
```

## 게시글 작성 방법

1. `pages/` 폴더에 새로운 `.md` 파일을 생성합니다.
2. 파일 상단에 Front Matter를 작성합니다:

```markdown
---
title: "게시글 제목"
date: 2026-02-10
tags: ["태그1", "태그2"]
category: "카테고리"
description: "게시글 설명"
---
```

3. Front Matter 아래에 마크다운으로 본문을 작성합니다.
4. `git push`하면 GitHub Actions가 자동으로 배포합니다.

## 마무리

이 블로그는 빌드 도구 없이 순수 HTML, CSS, JavaScript만으로 구성되어 있어 가볍고 빠릅니다. 자유롭게 커스터마이징하여 사용하세요!
