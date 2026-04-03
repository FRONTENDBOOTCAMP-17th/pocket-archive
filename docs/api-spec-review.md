# Pocket Archive API 명세서 리뷰

> 리뷰어: FullStackFamily 강사
> 리뷰 일자: 2026-04-03

---

## 총평

포켓몬 도감 + 커뮤니티 앱의 API 명세서입니다. JSON 형태로 요청/응답이 체계적으로 정리되어 있고, DB 스키마까지 포함하여 매우 상세합니다. 도메인(유저, 게시글, 댓글, 포켓몬, 파티)이 잘 분리되어 있습니다. 아래는 구현 시 문제가 될 수 있는 항목들입니다.

---

## 1. 반드시 수정해야 할 문제 (Critical)

### 1.1 Base URL에 버전 누락

`Base_URL: api/pocket-archive` — 버전이 없습니다.

**구현**: `/api/pocket-archive/v1`로 통일

---

### 1.2 DELETE + Body (회원 탈퇴)

```
DELETE /api/pocket-archive/user/me
Body: { "password": "string" }
```

`fetch`로 DELETE 요청에 Body를 보내면 일부 브라우저/환경에서 무시됩니다.

**구현**: `POST /user/me/withdraw`로 변경

---

### 1.3 필드명 snake_case / camelCase 혼재

명세서에서 "API 요청/응답은 camelCase"라고 규칙을 정했지만, 실제 필드가 혼재합니다.

| snake_case | camelCase |
|-----------|-----------|
| `login_id`, `user_id`, `post_id` | `viewCount`, `favoriteCount` |
| `content_id`, `pocketmon_id` | `authorNickname`, `isPublished` |

**구현**: 모든 API 요청/응답을 camelCase로 통일 (`loginId`, `userId`, `postId`, `commentId`)

---

### 1.4 중복확인을 POST로 사용

닉네임/이메일 중복확인이 `POST`인데, 데이터를 변경하지 않는 조회 성격이므로 `GET`이 더 적합합니다.

**구현**:
- `GET /user/check-nickname?nickname=홍길동`
- `GET /user/check-login-id?loginId=test@email.com`

---

### 1.5 게시글 상세 조회가 인증 필수

`GET /posts/{post_id}`에 `Authorization` 헤더가 필수로 되어 있습니다. 게시글 조회는 비로그인도 허용하는 것이 일반적입니다.

**구현**: 비로그인 허용 (로그인 시 좋아요 여부 등 추가 정보 제공)

---

### 1.6 게시글 이미지 필드가 단일 문자열

DB 스키마에 `img varchar(255)` 1개인데, API 응답은 `ImgUrls: [string]` 배열입니다. 이미지 업로드/수정/삭제 API도 별도로 정의되어 있습니다.

**구현**: 별도 이미지 테이블(`pa_post_image`)로 분리하여 여러 이미지 지원

---

### 1.7 포켓몬 테이블 불필요

`pocketmon` 테이블이 `pocketmon_id` PK 하나만 있습니다. PokeAPI의 ID를 그대로 쓰면 별도 테이블 없이 `user_pocketmon`에 직접 저장하면 됩니다.

**구현**: pocketmon 테이블 제거, `pa_user_pocketmon` 테이블에서 PokeAPI ID를 직접 참조

---

### 1.8 파티 DB 스키마와 API 필드 불일치

| DB 스키마 | API 필드 |
|----------|---------|
| `preset` (파티명) | `deckname` (파티명) |
| `slot` (프리셋 제한) | 없음 |
| 없음 | `pocketmons` (포켓몬 배열) |

**구현**: API 필드명 기준으로 통일 (`deckname`, `pocketmons`)

---

## 2. 개선하면 좋은 항목 (Important)

### 2.1 게시글 목록 pagination에 totalCount 없음

`totalPages`만 있고 전체 게시글 수(`totalCount`)가 없으면 프론트에서 "전체 N건" 표시가 어렵습니다.

**구현**: `meta.totalCount` 추가

### 2.2 좋아요 취소 기능 없음

`PUT /posts/{id}/favorite`가 좋아요만 하고 취소가 없습니다.

**구현**: 토글 방식 — 이미 좋아요 했으면 취소, 아니면 추가

### 2.3 댓글 ID가 `content_id`

`content`(내용)와 `content_id`(댓글ID)가 혼동되기 쉽습니다.

**구현**: `commentId`로 변경

### 2.4 이미지 업로드가 게시글 종속

`POST /posts/{post_id}/images` — 게시글이 있어야 이미지 업로드 가능. 글 작성 중 이미지를 먼저 올려야 하는 경우 문제.

**구현**: 별도 이미지 업로드 API (`POST /images`) → URL 반환 → 게시글에 포함

---

## 3. 수정 요약표

| # | 우선순위 | 항목 | 현재 | 구현 반영 |
|---|---------|------|------|----------|
| 1 | Critical | Base URL | `/api/pocket-archive` | `/api/pocket-archive/v1` |
| 2 | Critical | 탈퇴 | DELETE+Body | POST /user/me/withdraw |
| 3 | Critical | 필드명 | snake/camel 혼재 | camelCase 통일 |
| 4 | Critical | 중복확인 | POST | GET |
| 5 | Critical | 게시글 조회 | 인증 필수 | 비로그인 허용 |
| 6 | Critical | 이미지 | 단일 varchar | 별도 테이블 |
| 7 | Critical | 포켓몬 테이블 | PK만 1개 | 제거 |
| 8 | Critical | 파티 필드 | DB/API 불일치 | API 기준 통일 |
| 9 | Important | totalCount | 없음 | 추가 |
| 10 | Important | 좋아요 | 추가만 | 토글 |
| 11 | Important | content_id | 혼동 | commentId |
| 12 | Important | 이미지 업로드 | 게시글 종속 | 별도 업로드 |
