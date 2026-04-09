# JavaScript 파일 구조화 가이드

> 포켓 아카이브 프로젝트 코드를 기반으로, JS 파일을 어떻게 나누고 폴더를 어떻게 구성해야 유지보수하기 좋은지 설명합니다.

---

## 목차

1. [왜 파일을 나눠야 할까?](#1-왜-파일을-나눠야-할까)
2. [현재 우리 프로젝트 구조 분석](#2-현재-우리-프로젝트-구조-분석)
3. [개선된 폴더 구조 제안](#3-개선된-폴더-구조-제안)
4. [파일 분리의 3가지 원칙](#4-파일-분리의-3가지-원칙)
5. [실전 리팩토링 예제](#5-실전-리팩토링-예제)
6. [window 전역 함수 제거하기](#6-window-전역-함수-제거하기)
7. [API 호출 코드 분리하기](#7-api-호출-코드-분리하기)
8. [공통 유틸리티 만들기](#8-공통-유틸리티-만들기)
9. [파일 이름 짓기 규칙](#9-파일-이름-짓기-규칙)
10. [단계별 마이그레이션 가이드](#10-단계별-마이그레이션-가이드)

---

## 1. 왜 파일을 나눠야 할까?

### 나누지 않으면 생기는 문제

한 파일에 모든 코드를 넣으면 이런 일이 생깁니다:

```
board.js (381줄)
├── 더미 데이터 (105줄)
├── API 호출 함수
├── 카테고리 색상 매핑
├── 날짜 포맷 함수
├── 게시글 렌더링 함수
├── 페이지네이션 렌더링 함수
├── 검색 이벤트 핸들러
├── 카테고리 필터 이벤트 핸들러
├── 드래그 스크롤 이벤트 핸들러
└── 글쓰기 버튼 이벤트 핸들러
```

**문제점:**
- "검색 버그를 고치고 싶은데 어디에 있지?" -> 381줄을 다 뒤져야 함
- "페이지네이션을 다른 페이지에서도 쓰고 싶은데?" -> 복사 붙여넣기 해야 함
- "팀원이 게시글 렌더링을 수정하고, 나는 검색을 수정하면?" -> 같은 파일을 동시에 수정하니 충돌 발생

### 나누면 좋은 점

```
board/
├── boardApi.js          ← API 호출만 모아둠 (재사용 가능)
├── boardUI.js           ← HTML 생성만 모아둠 (디자인 수정이 쉬움)
├── board.js             ← 초기화와 이벤트 연결 (전체 흐름 파악이 쉬움)
└── boardConstants.js    ← 상수 데이터 (카테고리 매핑 등)
```

**장점:**
- "검색 버그를 고치고 싶어" -> `board.js`의 검색 이벤트 부분만 보면 됨
- "페이지네이션을 재사용하고 싶어" -> `boardUI.js`에서 import하면 끝
- "팀원과 충돌이 안 남" -> 각자 다른 파일을 수정하니까

---

## 2. 현재 우리 프로젝트 구조 분석

### 현재 폴더 구조

```
src/
├── api/
│   ├── config.js          ← BASE_URL만 있음 (2줄)
│   ├── pokemonApi.js      ← 비어있음!
│   ├── post.js            ← 비어있음!
│   └── user.js            ← 비어있음!
├── components/
│   ├── auth/
│   │   ├── login.js       ← HTML + 유효성검사 + API 호출이 한 파일에
│   │   └── register.js    ← 마찬가지
│   ├── board/
│   │   ├── board.js       ← 381줄! 더미데이터 + API + UI + 이벤트 전부
│   │   ├── boardDetail.js ← API + UI + 이벤트 + window 전역함수
│   │   ├── boardDetailUI.js
│   │   └── write.js       ← HTML + API + 이벤트
│   ├── mypage/
│   │   ├── my.js
│   │   ├── myboard.js
│   │   └── myinfo.js
│   ├── pokedex/
│   │   ├── pokedex.js     ← 249줄. API + 렌더링 + window 전역함수
│   │   └── pokedexUI.js   ← UI 분리 잘했음!
│   ├── footer.js
│   ├── header.js
│   └── trainerCard.js
├── scripts/
│   └── myparty.js         ← 637줄! 가장 큰 파일
├── utils/
│   └── escapeHtml.js      ← 유틸리티 분리 잘했음!
├── main.js                ← 라우팅 + 사이드바 + 메뉴 활성화
└── style.css
```

### 잘한 점

- `pokedexUI.js`를 별도로 분리한 것 (UI 컴포넌트 분리의 좋은 예!)
- `escapeHtml.js`를 유틸리티로 분리한 것
- `api/config.js`로 BASE_URL을 중앙 관리한 것
- 기능별 폴더(`board/`, `pokedex/`, `auth/`)로 나눈 것

### 개선이 필요한 점

| 문제 | 해당 파일 | 설명 |
|------|----------|------|
| API 파일이 비어있음 | `api/pokemonApi.js`, `api/post.js`, `api/user.js` | 의도는 좋았지만 실제 API 코드는 각 컴포넌트에 흩어져 있음 |
| 한 파일이 너무 큼 | `myparty.js` (637줄), `board.js` (381줄) | 한 파일에서 API, UI, 이벤트, 상태를 모두 관리 |
| API 호출이 흩어져 있음 | 거의 모든 파일 | `fetch()`가 여기저기 중복됨 |
| window 전역 함수 | `pokedex.js`, `boardDetail.js`, `pokedexUI.js` | `window.selectPokemon`, `window.poketmonReg` 등 |
| BASE_URL 중복 선언 | `board.js`, `pokedex.js`, `login.js`, `write.js`, `myparty.js` | `config.js`에서 export하는데도 각 파일에서 직접 선언 |

---

## 3. 개선된 폴더 구조 제안

```
src/
├── api/                          ← API 호출 함수만 모아두는 곳
│   ├── client.js                 ← fetch 래퍼 (공통 헤더, 에러 처리)
│   ├── postApi.js                ← 게시글 관련 API 함수들
│   ├── pokemonApi.js             ← 포켓몬 관련 API 함수들
│   ├── userApi.js                ← 유저 관련 API 함수들
│   └── partyApi.js               ← 파티 관련 API 함수들
│
├── components/                   ← 재사용 가능한 UI 조각들
│   ├── header.js                 ← 헤더 HTML 생성
│   ├── footer.js                 ← 푸터 HTML 생성
│   ├── trainerCard.js            ← 트레이너 카드 HTML 생성
│   └── pokemonCard.js            ← 포켓몬 카드 HTML 생성 (pokedexUI.js에서 분리)
│
├── pages/                        ← 각 페이지의 "조립" 로직
│   ├── board/
│   │   ├── boardPage.js          ← initBoard() - 이벤트 연결, 초기화
│   │   ├── boardUI.js            ← 게시글 목록, 페이지네이션 HTML 생성
│   │   └── boardConstants.js     ← 카테고리 매핑, 색상, 더미데이터
│   ├── boardDetail/
│   │   ├── boardDetailPage.js    ← initPostDetail() - 이벤트 연결
│   │   └── boardDetailUI.js      ← 게시글 상세, 댓글 HTML 생성
│   ├── pokedex/
│   │   ├── pokedexPage.js        ← initPokedex() - 이벤트 연결
│   │   └── pokedexUI.js          ← 사이드바, 카드, 페이지네이션 HTML
│   ├── myparty/
│   │   ├── mypartyPage.js        ← init() - 이벤트 연결, 상태 관리
│   │   └── mypartyUI.js          ← 프리셋, 리스트 HTML 생성
│   ├── auth/
│   │   ├── loginPage.js          ← Login HTML + initLogin()
│   │   └── registerPage.js       ← Register HTML + initRegister()
│   └── mypage/
│       ├── mypagePage.js
│       ├── myinfoUI.js
│       └── myboardUI.js
│
├── utils/                        ← 여러 곳에서 쓰는 도우미 함수
│   ├── escapeHtml.js             ← XSS 방지 (이미 있음!)
│   ├── formatDate.js             ← 날짜 포맷 (여러 파일에서 중복됨)
│   └── auth.js                   ← 토큰 관련 (getToken, isLoggedIn, getUserId)
│
├── router.js                     ← 라우팅 로직만 따로 분리
├── main.js                       ← 앱 시작점 (최소한의 초기화만)
└── style.css
```

### 핵심 원칙: 각 폴더의 역할

| 폴더 | 역할 | 비유 |
|------|------|------|
| `api/` | 서버와 대화하는 코드 | 음식 배달 앱의 "주문 전화" |
| `components/` | 재사용 가능한 UI 조각 | 레고 블록 |
| `pages/` | 페이지별 조립 로직 | 레고 설명서 |
| `utils/` | 여러 곳에서 쓰는 도구 | 공구함 |

---

## 4. 파일 분리의 3가지 원칙

### 원칙 1: "이 파일은 무엇을 하는 파일인가?" 한 문장으로 설명할 수 있어야 한다

```
좋은 예:
- boardApi.js → "게시글 API를 호출하는 파일"
- boardUI.js → "게시글 목록 HTML을 만드는 파일"
- escapeHtml.js → "HTML 특수문자를 변환하는 파일"

나쁜 예:
- board.js → "게시글 API도 호출하고, HTML도 만들고, 이벤트도 연결하고,
              검색도 하고, 페이지네이션도 하고, 카테고리 필터도 하는 파일"
```

### 원칙 2: "API 호출", "HTML 생성", "이벤트 연결"은 분리한다

하나의 기능을 만들 때 항상 이 3가지가 섞이는데, 이걸 분리하면 관리가 훨씬 쉬워집니다.

```
┌──────────────────────────────────────────────┐
│                boardPage.js                   │
│    (이벤트 연결 + 초기화 = "지휘자" 역할)       │
│                                               │
│    ┌─────────────┐    ┌─────────────┐         │
│    │ boardApi.js  │    │ boardUI.js  │         │
│    │ (API 호출)   │    │ (HTML 생성) │         │
│    └─────────────┘    └─────────────┘         │
└──────────────────────────────────────────────┘
```

지휘자(Page)가 API에게 "데이터 가져와!"라고 시키고,
UI에게 "이 데이터로 화면 만들어!"라고 시키는 구조입니다.

### 원칙 3: 200줄이 넘으면 분리를 고려한다

절대적인 규칙은 아니지만, 한 파일이 200줄을 넘기 시작하면 여러 가지 역할을 하고 있을 가능성이 높습니다.

현재 우리 프로젝트의 파일 길이:
- `myparty.js`: **637줄** -> 분리 필요!
- `board.js`: **381줄** -> 분리 필요!
- `register.js`: **294줄** -> 분리 고려
- `pokedex.js`: **249줄** -> 분리 고려
- `login.js`: **218줄** -> 분리 고려

---

## 5. 실전 리팩토링 예제

### 예제 1: board.js 분리하기

**현재 board.js (381줄, 모든 것이 한 파일에):**

```js
// board.js - 현재 상태
const dummyData = [ /* 105줄의 더미 데이터... */ ];
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getPosts = async () => { /* API 호출 */ };

const categoryMap = { /* 카테고리 매핑 */ };
const categoryColors = { /* 카테고리 색상 */ };

function formatDate(dateStr) { /* 날짜 포맷 */ }

export async function initBoard() {
  // 게시글 렌더링
  function renderPosts(data, page) { /* 50줄... */ }

  // 페이지네이션 렌더링
  function renderPagination(data, page) { /* 50줄... */ }

  // 검색 이벤트
  document.getElementById('search-btn')?.addEventListener('click', () => { /* ... */ });

  // 카테고리 필터 이벤트
  categoryButtons.forEach((btn) => { /* ... */ });

  // 드래그 스크롤 이벤트
  categoryScroll.addEventListener('mousedown', (e) => { /* ... */ });

  // 게시글 클릭 이벤트
  postlist.addEventListener('click', (e) => { /* ... */ });

  // 글쓰기 버튼 이벤트
  document.getElementById('write-post-btn')?.addEventListener('click', () => { /* ... */ });
}
```

**분리 후 (3개 파일):**

```js
// 파일 1: board/boardConstants.js - 상수 데이터
// ─────────────────────────────────────────────
// 이 파일은 "게시판에서 사용하는 고정된 값들"을 모아두는 파일입니다.

export const categoryMap = {
  free: '자유게시판',
  guide: '질문게시판',
  battle: '공략',
  party: '파티 공유',
};

export const categoryColors = {
  '자유게시판': 'text-[#00bba7] bg-[#e6f7f5]',
  '질문게시판': 'text-pink-500 bg-pink-50',
  '파티 공유': 'text-amber-500 bg-amber-50',
  '파티공유': 'text-amber-500 bg-amber-50',
  '공략': 'text-blue-500 bg-blue-50',
  '공지': 'text-purple-500 bg-purple-50',
};

// API 연결 전에 사용할 테스트용 데이터
export const dummyData = [
  { postId: 1, title: '카비곤 육성 팁 공유합니다!', /* ... */ },
  // ...
];
```

```js
// 파일 2: board/boardUI.js - HTML 생성 함수들
// ──────────────────────────────────────────────
// 이 파일은 "화면에 보여줄 HTML을 만드는" 함수들만 모아두는 파일입니다.

import { escapeHtml } from '../../utils/escapeHtml.js';
import { formatDate } from '../../utils/formatDate.js';
import { categoryMap, categoryColors } from './boardConstants.js';

// 게시글 카드 하나를 HTML로 만드는 함수
export function PostCard(post) {
  const category = categoryMap[post.category] ?? post.category;
  const badgeClass = categoryColors[category] || 'text-gray-500 bg-gray-100';

  return `
    <div data-post-id="${post.postId}"
         class="bg-white rounded-2xl border border-[#00bba7]/15 shadow-sm
                cursor-pointer hover:shadow-md transition-shadow"
         style="display:flex; min-height:181px; padding:24px;
                flex-direction:column; gap:12px;">
      <span class="text-xs font-medium rounded-md ${badgeClass}"
            style="width:80px; height:24px; padding:4px 10px;
                   text-align:center;">${escapeHtml(category)}</span>
      <p style="font-size:18px;">${escapeHtml(post.title)}</p>
      <div class="flex items-center gap-3 text-sm text-[#6A7282]">
        <span>${escapeHtml(post.nickname)}</span>
        <span>${formatDate(post.createdAt)}</span>
      </div>
    </div>
  `;
}

// 페이지네이션 버튼을 만드는 함수
export function PaginationButton(page, currentPage, totalPages) {
  // ... 페이지네이션 HTML 생성 로직
}
```

```js
// 파일 3: board/boardPage.js - 초기화 + 이벤트 연결
// ──────────────────────────────────────────────────
// 이 파일은 "게시판 페이지의 지휘자" 역할입니다.
// API에서 데이터 가져오고, UI에 그리라고 시키고, 이벤트를 연결합니다.

import { getPosts } from '../../api/postApi.js';
import { PostCard } from './boardUI.js';

const PAGE_SIZE = 8;

export async function initBoard() {
  const posts = await getPosts();
  const postlist = document.getElementById('postlist');
  if (!postlist) return;

  let currentPage = 1;
  let currentData = posts;

  // 게시글 그리기
  function renderPosts(data, page = 1) {
    currentData = [...data].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt));
    currentPage = page;

    const start = (page - 1) * PAGE_SIZE;
    const pageItems = currentData.slice(start, start + PAGE_SIZE);

    // PostCard UI 함수를 사용해서 그리기
    postlist.innerHTML = pageItems.map(PostCard).join('');
  }

  // 검색 이벤트 연결
  document.getElementById('search-btn')?.addEventListener('click', () => {
    // ...
  });

  renderPosts(posts);
}
```

**이렇게 분리하면 좋은 점:**
- 게시글 카드 디자인을 수정하고 싶다 -> `boardUI.js`만 열면 됨
- 카테고리를 추가하고 싶다 -> `boardConstants.js`만 열면 됨
- 검색 버그를 고치고 싶다 -> `boardPage.js`의 검색 부분만 보면 됨

---

### 예제 2: myparty.js 분리하기 (가장 큰 파일)

현재 `myparty.js`는 **637줄**입니다. 이걸 4개 파일로 나눌 수 있습니다:

```
pages/myparty/
├── mypartyPage.js        ← init() + 이벤트 연결 + 상태 관리
├── mypartyUI.js          ← 프리셋 렌더링, 리스트 렌더링
├── mypartyModal.js       ← 모달 열기/닫기/확인 로직
└── mypartyConstants.js   ← PRESET_COLORS, DUMMY_IDS 등
```

**분리 기준:**
```
현재 myparty.js의 내용               →  이동할 파일
──────────────────────────────────    ──────────────────
상수 (PRESET_COLORS, DUMMY_IDS)       → mypartyConstants.js
getToken(), authHeaders()             → utils/auth.js (공통!)
API 호출 (loadBookmarkedPokemons 등)  → api/partyApi.js
renderList(), renderPresets()         → mypartyUI.js
모달 관련 함수 3개                     → mypartyModal.js
init(), bind 함수들                    → mypartyPage.js
```

---

## 6. window 전역 함수 제거하기

### 현재 문제

우리 프로젝트에서 `window`에 함수를 붙이는 곳이 많습니다:

```js
// pokedex.js
window.selectPokemon = async function(no) { /* ... */ };
window.poketmonReg = async function(event, id) { /* ... */ };
window.poketmonDelete = async function(event, id) { /* ... */ };

// pokedexUI.js
window.toggleSidebar = function() { /* ... */ };

// boardDetail.js
window.toggleEditMode = (commentId) => { /* ... */ };
window.cancelEditMode = (commentId, originalContent) => { /* ... */ };
window.saveEditComment = async (commentId, oldContent) => { /* ... */ };
window.handleDeleteComment = async (commentId) => { /* ... */ };
window.handleDeletePost = async (postId) => { /* ... */ };
window.handleEditPost = (postId) => { /* ... */ };
```

### 왜 안 좋을까?

1. **이름 충돌**: 다른 파일에서 같은 이름의 함수를 만들면 덮어씌워짐
2. **추적이 어려움**: `window.selectPokemon`이 어디서 정의됐는지 찾기 어려움
3. **테스트가 어려움**: 전역 상태에 의존하면 테스트하기 힘듦

### 해결 방법: 이벤트 위임 (Event Delegation)

**지금 방식 (onclick 속성에 window 함수 사용):**

```js
// pokedexUI.js - 현재
export const SidebarItem = (p) => `
  <div onclick="selectPokemon(${p.no})" class="...">
    No.${p.no} ${p.name}
  </div>
`;

// pokedex.js - 현재
window.selectPokemon = async function(no) {
  // 포켓몬 선택 로직
};
```

**개선된 방식 (data 속성 + addEventListener):**

```js
// pokedexUI.js - 개선
export const SidebarItem = (p) => `
  <div data-pokemon-no="${p.no}" class="sidebar-item ...">
    No.${p.no} ${p.name}
  </div>
`;
// onclick="..." 대신 data-pokemon-no 속성을 넣어둡니다.
// 함수 이름을 HTML에 직접 쓰지 않습니다!


// pokedexPage.js - 개선
function setupSidebarEvents() {
  const sidebarList = document.getElementById('sidebarList');
  if (!sidebarList) return;

  // 사이드바 전체에 클릭 이벤트를 한 번만 건다 (이벤트 위임)
  sidebarList.addEventListener('click', async (e) => {
    // 클릭된 요소에서 가장 가까운 data-pokemon-no를 찾는다
    const item = e.target.closest('[data-pokemon-no]');
    if (!item) return;

    const no = Number(item.dataset.pokemonNo);
    await selectPokemon(no);  // 모듈 내부 함수로 호출
  });
}

// 이제 window에 안 붙여도 됩니다!
async function selectPokemon(no) {
  // 포켓몬 선택 로직 (동일)
}
```

**핵심 차이점:**

| | 기존 (window 함수) | 개선 (이벤트 위임) |
|---|---|---|
| HTML | `onclick="selectPokemon(1)"` | `data-pokemon-no="1"` |
| JS | `window.selectPokemon = function(no) {...}` | `list.addEventListener('click', ...)` |
| 범위 | 전역 (어디서든 접근 가능) | 모듈 내부 (해당 파일에서만) |
| 안전성 | 이름 충돌 위험 | 안전 |

---

## 7. API 호출 코드 분리하기

### 현재 문제: 같은 패턴이 반복됨

지금 우리 프로젝트에서 API를 호출하는 코드를 보면, 거의 똑같은 패턴이 반복됩니다:

```js
// pokedex.js에서
const token = localStorage.getItem('token');
const res = await fetch(`${BASE_URL}/pocketmons`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error('불러오기 실패');
const result = await res.json();

// myparty.js에서 (거의 동일!)
const token = localStorage.getItem('token');
const res = await fetch(`${BASE_URL}/pocketmons`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error('불러오기 실패');
const result = await res.json();

// boardDetail.js에서
const token = localStorage.getItem('token');
const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ content: text }),
});
```

매번 `localStorage.getItem('token')`, `Bearer ${token}`, `res.json()`, 에러 처리를 반복합니다.

### 해결: API 클라이언트 만들기

```js
// api/client.js - 공통 API 호출 도우미
// ──────────────────────────────────────
// 이 파일은 fetch()를 감싸서, 매번 반복하는 작업을 자동으로 해줍니다.

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 토큰이 필요한 요청의 헤더를 자동으로 만들어주는 함수
function getHeaders(hasBody = false) {
  const headers = {};
  const token = localStorage.getItem('token');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

// GET 요청
export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GET ${path} 실패: ${res.status}`);
  return res.json();
}

// POST 요청
export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} 실패: ${res.status}`);
  return res.json();
}

// PUT 요청
export async function put(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`PUT ${path} 실패: ${res.status}`);
  return res.json();
}

// DELETE 요청
export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${path} 실패: ${res.status}`);
  return res;
}
```

### 사용 예시

```js
// api/postApi.js - 게시글 API 함수들
// ───────────────────────────────────
import { get, post, put, del } from './client.js';

// 게시글 목록 가져오기
export async function getPosts() {
  const data = await get('/posts');
  return data.data?.content ?? data.data ?? [];
}

// 게시글 하나 가져오기
export async function getPost(postId) {
  const data = await get(`/posts/${postId}`);
  return data.data;
}

// 게시글 작성
export async function createPost({ title, category, content }) {
  return post('/posts', { title, category, content });
}

// 게시글 삭제
export async function deletePost(postId) {
  return del(`/posts/${postId}`);
}

// 좋아요 토글
export async function toggleFavorite(postId) {
  return put(`/posts/${postId}/favorite`);
}
```

```js
// api/pokemonApi.js - 포켓몬 API 함수들
// ──────────────────────────────────────
import { get, post, del } from './client.js';

// 내 포켓몬 목록
export async function getMyPocketmons() {
  const data = await get('/pocketmons');
  return data.data.myPocketmons;
}

// 포켓몬 등록
export async function registerPocketmon(pocketmonId) {
  return post('/pocketmons', { pocketmonId: Number(pocketmonId) });
}

// 포켓몬 삭제
export async function deletePocketmon(pocketmonId) {
  return del(`/pocketmons/${pocketmonId}`);
}
```

**이제 컴포넌트에서는 이렇게 쓰면 됩니다:**

```js
// 이전: 30줄의 fetch 코드
const token = localStorage.getItem('token');
try {
  const res = await fetch(`${BASE_URL}/pocketmons`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('불러오기 실패');
  const result = await res.json();
  return result.data.myPocketmons;
} catch (error) {
  console.error(error);
  return [];
}

// 이후: 1줄!
import { getMyPocketmons } from '../../api/pokemonApi.js';
const myPokemons = await getMyPocketmons();
```

---

## 8. 공통 유틸리티 만들기

여러 파일에서 반복되는 코드를 `utils/` 폴더에 모아둡니다.

### formatDate.js

현재 `board.js`에만 있는 날짜 포맷 함수를, 여러 곳에서 쓸 수 있게 분리:

```js
// utils/formatDate.js
export function formatDate(dateStr) {
  return dateStr.split('T')[0].replace(/-/g, '.');
}
```

### auth.js

토큰 관련 로직이 여러 파일에 반복됩니다:

```js
// utils/auth.js
// 여러 파일에서 반복되는 토큰/인증 관련 코드를 모아둡니다.

export function getToken() {
  return localStorage.getItem('token') || '';
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getUserId() {
  const stored = localStorage.getItem('userId');
  if (stored) return stored;

  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return String(payload.userId ?? payload.id ?? payload.sub ?? '');
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
}
```

**사용 전후 비교:**

```js
// 이전: boardDetail.js에서 (9줄)
let currentUserId = localStorage.getItem('userId');
if (!currentUserId) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId = String(payload.userId ?? payload.id ?? payload.sub ?? '');
    }
  } catch {}
}

// 이후: (1줄)
import { getUserId } from '../../utils/auth.js';
const currentUserId = getUserId();
```

---

## 9. 파일 이름 짓기 규칙

### 규칙 1: 역할이 이름에 드러나게

```
좋은 예:
  postApi.js       ← "게시글 API"임을 바로 알 수 있음
  boardUI.js       ← "게시판 UI"임을 바로 알 수 있음
  boardPage.js     ← "게시판 페이지 메인"임을 바로 알 수 있음
  formatDate.js    ← "날짜 포맷"임을 바로 알 수 있음

나쁜 예:
  post.js          ← API? UI? 어느 쪽이지?
  utils.js         ← 무슨 유틸인지 모름
  helpers.js       ← 너무 모호함
```

### 규칙 2: camelCase 사용

```
좋은 예: boardDetail.js, pokemonApi.js, formatDate.js
나쁜 예: board-detail.js, Board_Detail.js, BOARD_DETAIL.js
```

프로젝트 내에서 일관성 있게 하나의 규칙을 정하면 됩니다.
우리 프로젝트는 이미 camelCase를 쓰고 있으니 그대로 유지합시다.

### 규칙 3: 접미사로 역할 구분

| 접미사 | 역할 | 예시 |
|--------|------|------|
| `~Api.js` | API 호출 함수 | `postApi.js`, `pokemonApi.js` |
| `~UI.js` | HTML 생성 함수 | `boardUI.js`, `pokedexUI.js` |
| `~Page.js` | 페이지 초기화/이벤트 | `boardPage.js`, `mypartyPage.js` |
| `~Constants.js` | 상수 데이터 | `boardConstants.js` |

---

## 10. 단계별 마이그레이션 가이드

한 번에 다 바꾸면 위험합니다. 단계별로 조금씩 바꿔나갑시다.

### 1단계: API 클라이언트 만들기 (가장 효과적)

```
우선순위: ★★★★★
난이도: ★★☆☆☆
효과: 중복 코드 대폭 감소
```

1. `src/api/client.js` 만들기
2. `src/api/postApi.js` 만들기 (빈 파일에 실제 코드 채우기)
3. `src/api/pokemonApi.js` 만들기
4. `src/api/userApi.js` 만들기
5. `src/api/partyApi.js` 만들기
6. 기존 파일에서 `fetch()` 코드를 하나씩 API 함수 호출로 교체

**팁:** 한 파일씩 교체하세요. `board.js`의 `getPosts()`를 먼저 바꿔보고, 잘 되면 다음 파일로 넘어가세요.

### 2단계: 공통 유틸리티 분리

```
우선순위: ★★★★☆
난이도: ★☆☆☆☆
효과: 코드 중복 감소, 일관성 향상
```

1. `src/utils/auth.js` 만들기
2. `src/utils/formatDate.js` 만들기
3. 기존 파일에서 중복되는 코드를 유틸리티 호출로 교체

### 3단계: 큰 파일 분리

```
우선순위: ★★★☆☆
난이도: ★★★☆☆
효과: 유지보수성 대폭 향상
```

1. `myparty.js`를 `mypartyPage.js` + `mypartyUI.js` + `mypartyModal.js`로 분리
2. `board.js`를 `boardPage.js` + `boardUI.js` + `boardConstants.js`로 분리
3. `boardDetail.js`에서 `window` 전역 함수를 이벤트 위임으로 교체

### 4단계: window 전역 함수 제거

```
우선순위: ★★☆☆☆
난이도: ★★★★☆
효과: 코드 안정성 향상
```

1. `pokedexUI.js`의 `onclick="selectPokemon(...)"` → `data-pokemon-no` 속성으로 변경
2. `pokedex.js`에서 이벤트 위임 방식으로 교체
3. `boardDetail.js`의 `window.toggleEditMode` 등을 이벤트 위임으로 교체

### 5단계: 라우터 분리

```
우선순위: ★☆☆☆☆
난이도: ★★★★☆
효과: main.js 간결해짐
```

1. `main.js`의 라우팅 로직을 `router.js`로 분리
2. `main.js`는 초기화만 담당

---

## 요약: 오늘부터 적용할 수 있는 3가지

> 모든 걸 한 번에 바꿀 필요는 없습니다.
> 아래 3가지만 기억하고, 새 코드를 작성할 때부터 적용해보세요!

### 1. 새 파일을 만들 때: "이 파일은 ____하는 파일" 한 문장으로 정의하기

파일을 만들기 전에 한 문장으로 역할을 정의해보세요.
"이 파일은 게시글 API를 호출하는 파일이다" -> `postApi.js`

### 2. fetch() 코드를 쓸 때: API 파일에 쓰기

새로운 API 호출이 필요하면 `api/` 폴더의 해당 파일에 함수를 추가하세요.
컴포넌트 파일에 직접 `fetch()`를 쓰지 마세요.

### 3. 파일이 길어질 때: "API / UI / 이벤트"로 분리 고려하기

200줄이 넘어간다 싶으면, API 호출 부분과 HTML 생성 부분을 별도 파일로 빼보세요.

---

## 부록: import/export 빠른 참고

```js
// ─── 내보내기 (export) ───

// 이름 붙여서 내보내기 (여러 개 가능)
export function getPosts() { /* ... */ }
export const PAGE_SIZE = 8;

// 기본으로 내보내기 (파일당 1개)
export default function initBoard() { /* ... */ }


// ─── 가져오기 (import) ───

// 이름 붙인 것 가져오기 (중괄호 필요)
import { getPosts, PAGE_SIZE } from './postApi.js';

// 기본 내보내기 가져오기 (중괄호 없음, 이름 자유)
import initBoard from './boardPage.js';

// 여러 파일에서 가져오기
import { get, post } from '../api/client.js';
import { PostCard } from './boardUI.js';
import { formatDate } from '../utils/formatDate.js';
```

**팁:** 우리 프로젝트에서는 `export function` (이름 붙여서 내보내기)을 주로 사용합니다.
한 파일에서 여러 함수를 내보낼 때 편리하기 때문입니다.
