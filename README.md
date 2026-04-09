# 📌 포켓아카이브 (Pocket Archive)

> **포켓몬 도감과 커뮤니티 기능을 함께 제공하는 Vanilla JS 웹 서비스**

[![Netlify Status](https://img.shields.io/badge/Netlify-deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://pocketarchive.netlify.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=)](https://developer.mozilla.org/ko/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/ko/docs/Web/HTML)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

## 🧑‍💻 팀 구성

|  이름  | 직책 |                    GitHub                    |
| :----: | :--: | :------------------------------------------: |
| 박규나 | 팀장 |     [@Gyu-me](https://github.com/Gyu-me)     |
| 엄인호 | 조원 |     [@djsy01](https://github.com/djsy01)     |
| 이규화 | 조원 | [@gyuhwa9922](https://github.com/gyuhwa9922) |

---

## ✨ 프로젝트 개요

| 항목               | 내용                                                            |
| :----------------- | :-------------------------------------------------------------- |
| 🎯 **목표**        | 포켓몬을 사랑하는 사람들이 자유롭게 소통하고 자신의 파티를 공유 |
| 🧑‍🤝‍🧑 **대상 사용자** | 포켓몬 게임을 즐기는 사람들과 포켓몬에 관심 있는 누구나         |
| 📅 **개발 기간**   | 2026.03.26 ~ 2026.04.20                                         |
| 🚀 **배포**        | [pocketarchive.netlify.app](https://pocketarchive.netlify.app)  |

## 🧩 핵심 기능

### 📄 페이지

| 페이지          | 설명                                        |
| :-------------- | :------------------------------------------ |
| 🏠 **Home**     | 포켓몬 도감 — 포켓몬 목록 검색 및 상세 조회 |
| 📋 **Board**    | 커뮤니티 공간 — 게시글 작성 · 조회 · 댓글   |
| ⚔️ **My Party** | 나만의 파티 구성 만들기                     |
| 👤 **My Page**  | 내 정보 및 작성 게시글 관리                 |

### 🔐 인증 시스템

- 로그인 / 회원가입 (중복 확인)
- JWT 토큰 기반 접근 권한 설정

### 🎨 UI/UX

- 모바일 반응형 디자인 (모바일 · 데스크톱 분기점 대응)
- 슬라이드 메뉴 (모바일)

## 🛠 기술 스택

| 분류          | 기술                           |
| :------------ | :----------------------------- |
| **마크업**    | HTML5                          |
| **스타일**    | CSS3, Tailwind CSS             |
| **언어**      | JavaScript (ES6+)              |
| **빌드 도구** | Vite                           |
| **외부 API**  | [PokéAPI](https://pokeapi.co/) |
| **배포**      | Netlify                        |

## 📂 프로젝트 구조

```text
pocket-archive/
├── docs/                  # 문서 (API 가이드, 리뷰 해결 내역 등)
├── reviews/               # 코드 리뷰 기록
├── pages/                 # HTML 페이지
│   ├── board.html
│   ├── detailPost.html
│   ├── mypage.html
│   ├── myparty.html
│   └── pokedex.html
├── public/                # 정적 에셋
│   ├── assets/
│   └── favicon.svg
├── src/
│   ├── api/               # API 통신 모듈 (config, pokemon, post, user)
│   ├── components/        # 페이지별 컴포넌트 (auth, board, pokedex, mypage 등)
│   ├── scripts/           # 페이지 스크립트
│   ├── utils/             # 유틸 함수
│   └── style.css
├── index.html
├── vite.config.js
└── README.md
```

---

## ⚙️ 설치 및 실행

> 아래 첨부되어있는 env파일을 생성 안할 시 도감기능만 활성화됩니다

```bash
# 1. 저장소 클론
git clone https://github.com/FRONTENDBOOTCAMP-17th/pocket-archive.git

# 2. 폴더 이동
cd pocket-archive

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

## 📦 사용 라이브러리

| 항목                 | 버전    |
| -------------------- | ------- |
| ⚡ vite              | v8.0.1  |
| 🎨 tailwindcss       | v4.2.2  |
| 🔌 @tailwindcss/vite | v4.2.2  |
| 🖥️ @tailwindcss/cli  | 4.2.2   |
| 🔐 dotenv            | v17.4.1 |

## ⚙️ vite.config.js 수정 방법

### 📄 새 페이지 추가 (MPA 빌드 입력)

`pages/` 폴더에 HTML 파일을 추가한 후, `build.rollupOptions.input`에 항목을 추가하세요.

```js
build: {
  rollupOptions: {
    input: {
      main: './index.html',
      board: './pages/board.html',
      // 새 페이지 추가 예시
      newPage: './pages/newPage.html',
    }
  }
},
```

### 🔄 개발 서버 프록시 변경

CORS 문제 해결을 위해 `/api` 경로를 백엔드 서버로 프록시하고 있습니다.  
백엔드 서버 주소가 바뀌면 `target` 값을 수정하세요.

```js
server: {
  proxy: {
    '/api': {
      target: '', // 백엔드 서버 URL
      changeOrigin: true,
    },
  },
},
```

### 🔌 플러그인 추가

Tailwind CSS 플러그인이 기본으로 등록되어 있습니다.  
추가 Vite 플러그인이 필요하면 `plugins` 배열에 추가하세요.

```js
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // 추가 플러그인
  ],
});
```

## 🔑 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정하세요.

```env
VITE_BASE_URL = <PocketBase 서버 URL>
POCKET_BASE_URL = <Pokemon 공식 URL>
```

---

## 🔒 라이선스

MIT License © 2026 [FRONTENDBOOTCAMP-17th](https://github.com/FRONTENDBOOTCAMP-17th)

## 📞 문의

- GitHub Issues: 이슈 등록을 통한 문의
