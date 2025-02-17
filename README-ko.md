# Typestone.io

GitHub를 이용하여 나만의 블로그를 만드세요!

Typestone은 [GitHub 저장소](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories)를 기반으로 하는 블로그 콘텐츠 데이터베이스 시스템입니다. 여러분의 할 일은 단순히 콘텐츠를 저장소에 업로드만 하는 것입니다.

이 프로젝트는 [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog 및 [giscus](https://github.com/giscus/giscus)에서 영감을 받았습니다.

- [오픈소스](https://github.com/discaptive/typestone-client). 🙏
- 광고 없음, 추적 없음, 항상 무료. ⛔️
- 저장소를 데이터베이스로 사용하세요. 모든 데이터는 항상 여러분의 저장소에 있습니다.
- 블로그 글은 Markdown으로 작성되며 웹사이트에서 읽을 수 있는 HTML로 변환됩니다. 🔗

## 동작 방식

1. 블로그 콘텐츠(예: Markdown 파일)를 GitHub 저장소에 푸시하면 [typestone-app](https://github.com/apps/typestone-app)이 설치된 경우 웹훅이 트리거됩니다.

2. 해당 웹훅은 블로그에 접근할 때 콘텐츠를 다시 검증하도록 동작합니다.

3. 사용자가 웹사이트에 접근하면 [Octokit SDK](https://github.com/octokit) 및 GitHub 클론을 사용하여 콘텐츠를 가져옵니다.

4. 블로그 게시글의 콘텐츠를 검색하여 처리한 후, 웹사이트에서 동적으로 렌더링합니다.

## 사용 방법

### `typestone`이라는 이름의 저장소 생성하기

❗️ 저장소 이름은 반드시 `typestone`이어야 합니다.

❗️ 저장소는 `public(공개)`이어야 합니다. 그렇지 않으면 방문자가 게시글을 볼 수 없습니다.

### `typestone-app`을 저장소에 설치하기

`typestone-app`이 설치되어 있어야 해당 저장소에서 정상적으로 작동합니다.

### [선택사항] `.no-typestone` 파일을 추가하여 [typestone.io](https://typestone.io)에서 호스팅 제외하기

`.no-typestone` 파일이 존재하면 웹사이트에서 해당 저장소의 블로그를 호스팅하지 않습니다.

> **참고** -
>
> `.nojekyll` 파일과 동일한 방식으로 작동합니다.

### 게시글 작성하기

#### 디렉토리 구조

블로그 콘텐츠는 다음과 같은 형식으로 저장소에 구성되어야 합니다.

- `settings.json` - 블로그 기본 정보를 담고 있는 메타데이터 파일입니다. `username`, 상단 네비게이션(`navigations`), 댓글 시스템(`giscus`) 정보를 포함합니다.

  ```json
  {
    "username": "사용자명",
    "navigations": [
      {
        "title": "소개",
        "path": "posts/about/content.md"
      },
      {
        "title": "Google",
        "path": "https://google.com"
      },
      {
        "title": "프로젝트",
        "path": "./posts/projects/content.md"
      }
    ],
    "giscus": {
      "repo": "[저장소 입력]",
      "repoId": "[저장소 ID 입력]",
      "category": "[카테고리 이름 입력]",
      "categoryId": "[카테고리 ID 입력]",
      "mapping": "pathname",
      "reactionsEnabled": "1",
      "lang": "ko"
    }
  }
  ```

- `posts/*/content.md` - 각 게시글 파일은 다음과 같은 형식을 따라야 합니다.

  - 예: `posts/example/content.md`

  ```markdown
  ---
  title: "이것은 게시글 제목입니다."
  summary: "이것은 게시글의 짧은 설명입니다."
  date: "2025-02-11 21:13"
  tags: ["태그1", "태그2"]
  ---

  이것은 게시글 본문입니다.
  ```

  > **Note** -
  >
  > 모든 이미지는 동일한 디렉토리에 위치하는 것이 좋으며, 상대 경로로 연결하는 것을 권장합니다.
  >
  > 물론 하이퍼링크를 사용하여 이미지를 추가할 수도 있습니다.

## 또 다른 사용 방법

### API 연동

개발자는 API를 통해 블로그 콘텐츠를 가져와 다른 애플리케이션과 쉽게 통합할 수 있습니다.

#### `/api/generate-api-key`

```bash
curl \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{"owner": "<OWNER>"}' \
  https://typestone.io/api/generate-api-key
```

❗️ API 키를 생성하기 전에 typestone-app이 설치되어 있어야 합니다.

❗️ API 키는 한 번만 발급됩니다.

**❗️ API 키를 다시 발급받으려면 [typestone-app](https://github.com/apps/typestone-app) GitHub 앱을 삭제 및 다시 설치한 후 시도하세요.**

#### `/api/get-single-content?owner=<OWNER>&path=<PATH>`

```bash
curl \
  -H 'X-API-KEY: <API_KEY>' \
  -X GET \
  https://typestone.io/api/generate-api-key?owner=<OWNER>&path=<PATH>
```
