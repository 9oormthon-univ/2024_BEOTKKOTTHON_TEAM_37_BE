### 2024_BEOTKKOTTHON_TEAM_37_BE
# 댓칼코마니

![Slide 16_9 - 318](https://github.com/goormthon-Univ/2024_BEOTKKOTTHON_TEAM_37_BE/assets/90598552/b481341a-ff46-4d02-b0a6-d6ef4bd0e16e)

"댓칼코마니"는 웹툰 작가와 독자들 간의 긍정적인 소통을 지원하는 서비스입니다. "댓글은 깔끔히, 코멘트는 많이"라는 슬로건 아래, 창작자들이 안전한 환경에서 독자의 반응을 볼 수 있게 도와줍니다.

## 소개

웹툰 작가들은 종종 악성 댓글로부터의 보호 없이 창작 활동을 해야 하는 어려움에 직면해 있습니다. "댓칼코마니"는 이러한 문제에 대한 해결책을 제공합니다. AI를 이용해 악성 댓글은 필터링 하고, 정제되고 요약된 피드백을 제공함으로써 창작자들이 자신의 작품에 대한 피드백을 받을 수 있도록 하면서도 동시에 그들을 불필요한 공격으로부터 보호합니다.

## 기능

- **안전한 댓글 필터링:** 작가들이 독자의 반응을 보면서도 부정적인 영향을 받지 않도록 필터링 기능을 제공합니다.
- **긍정적 피드백 강조:** 작품 개선에 도움이 되는 건설적인 코멘트를 강조하여 창작자에게 긍정적인 원동력을 제공합니다.
- **창작자와 독자의 교류:** 독자와 창작자 간의 건강한 대화를 장려하여 웹툰 커뮤니티를 강화합니다.
- **내 피드백 모아보기:** 작가들은 자신의 작품에 대한 피드백을 모아볼 수 있습니다.

## 팀원 소개

| 정윤서 | 성나영 | 최윤서 | 황채원 |
| --- | --- | --- | --- |
|  |  |  |  |
| 기획 | 디자인 | 백엔드 | 백엔드, PM |

| 이종범 | 이준원 | 이태환 |
| --- | --- | --- |
|  |  |  |
| 프론트엔드 | 프론트엔드 | 프론트엔드 |

## 기술 스택

**FRONTEND**

- html, css, js

**BACKEND**

- express.js
- puppeteer
- openAI API
- MySQL 8.0
- Github Actions
- Docker/Google Artifact Registry
- Google Cloud Storage/Cloud Run

```
2024_BEOTKKOTTHON_TEAM_37_BE
├─ .dockerignore
├─ .nvmrc
├─ config
├─ controller
│  ├─ chatGpt.js
│  ├─ crawl.js
│  └─ user.js
├─ crawling_kakao.js
├─ crawling_naver.js
├─ Dockerfile
├─ init-script.sh
├─ models
│  ├─ feedback.js
│  ├─ index.js
│  ├─ user.js
│  └─ webtoon.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ server.js

```
