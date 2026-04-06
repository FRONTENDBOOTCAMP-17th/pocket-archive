# Pocket Archive API 사용 가이드

> FullStackFamily에서 제공하는 포켓몬 도감 + 커뮤니티 프로젝트용 백엔드 API
> 명세서 리뷰를 반영하여 구현 완료 (2026-04-03)

---

## Base URL

```
https://api.fullstackfamily.com/api/pocket-archive/v1
```

## 테스트 계정

| loginId | password | nickname |
|---------|----------|----------|
| testuser@test.com | Test1234! | 테스터 |
| pokemon@fan.com | Poke1234! | 포켓몬마스터 |

---

## API 목록 (28개)

### User (7개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/user/check-login-id?loginId=` | X | 이메일 중복확인 |
| GET | `/user/check-nickname?nickname=` | X | 닉네임 중복확인 |
| POST | `/user/register` | X | 회원가입 |
| POST | `/user/login` | X | 로그인 |
| GET | `/user/me` | O | 내 정보 |
| PUT | `/user/me` | O | 내 정보 수정 |
| POST | `/user/me/withdraw` | O | 회원 탈퇴 |

### Posts (9개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/posts?page=&size=&keyword=&category=` | X | 게시글 목록 |
| GET | `/posts/{id}` | X | 게시글 상세 |
| GET | `/posts/my?limit=5` | O | 내 작성글 |
| POST | `/posts` | O | 게시글 생성 |
| PUT | `/posts/{id}` | O | 게시글 수정 |
| PUT | `/posts/{id}/publish` | O | 발행 토글 |
| PUT | `/posts/{id}/favorite` | O | 좋아요 토글 |
| DELETE | `/posts/{id}` | O | 게시글 삭제 |
| POST | `/images` | O | 이미지 업로드 |

### Comments (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/posts/{id}/comments` | X | 댓글 목록 |
| POST | `/posts/{id}/comments` | O | 댓글 작성 |
| PUT | `/comments/{id}` | O | 댓글 수정 |
| DELETE | `/comments/{id}` | O | 댓글 삭제 |

### Pocketmons (3개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/pocketmons` | O | 보유 포켓몬 목록 |
| POST | `/pocketmons` | O | 포켓몬 등록 |
| DELETE | `/pocketmons/{pocketmonId}` | O | 포켓몬 삭제 |

### Party (5개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/party` | O | 파티 목록 |
| POST | `/party` | O | 파티 생성 |
| PUT | `/party/{id}` | O | 파티 수정 |
| PUT | `/party/{id}/publish` | O | 발행 토글 |
| DELETE | `/party/{id}` | O | 파티 삭제 |

---

## 사용 예시

### 로그인

```javascript
const res = await fetch("https://api.fullstackfamily.com/api/pocket-archive/v1/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ loginId: "testuser@test.com", password: "Test1234!" })
});
const { data } = await res.json();
const token = data.token;
```

### 게시글 + 좋아요

```javascript
// 게시글 생성
const postRes = await fetch(".../posts", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ title: "피카츄 최고!", content: "피카츄 육성 공략", category: "공략" })
});
const { data: { postId } } = await postRes.json();

// 발행
await fetch(`.../posts/${postId}/publish`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });

// 좋아요 토글
await fetch(`.../posts/${postId}/favorite`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
```

### 포켓몬 수집 + 파티

```javascript
// 포켓몬 등록
await fetch(".../pocketmons", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ pocketmonId: 25 }) // 피카츄
});

// 파티 생성
await fetch(".../party", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ deckname: "최강 파티", pocketmons: [25, 6, 7] })
});
```

### 이미지 업로드

```javascript
const formData = new FormData();
formData.append("file", imageFile);
const uploadRes = await fetch(".../images", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
const { data: { imageUrl } } = await uploadRes.json();
```

---

## 명세서 리뷰 반영 사항

| # | 원본 | 반영 |
|---|------|------|
| 1 | Base URL 버전 없음 | `/api/pocket-archive/v1` |
| 2 | DELETE+Body 탈퇴 | POST /user/me/withdraw |
| 3 | 필드명 혼재 | camelCase 통일 |
| 4 | 중복확인 POST | GET 변경 |
| 5 | 게시글 조회 인증 | 비로그인 허용 |
| 6 | 이미지 단일 필드 | 별도 테이블 |
| 7 | 포켓몬 테이블 | 제거, PokeAPI ID 직접 참조 |
| 8 | 파티 필드 불일치 | API 기준 통일 |
| 9 | 좋아요 취소 없음 | 토글 방식 |

---

## 테스트 결과 (2026-04-03)

| # | API | 결과 |
|---|-----|------|
| 1 | 이메일 중복확인 | PASS (200) |
| 2 | 회원가입 | PASS (201) |
| 3 | 로그인 | PASS (200) |
| 4 | 로그인 실패 | PASS (401) |
| 5 | 내 정보 | PASS (200) |
| 6 | 정보 수정 | PASS (200) |
| 7 | 게시글 생성 | PASS (201) |
| 8 | 게시글 발행 | PASS (200) |
| 9 | 게시글 목록 | PASS (200) |
| 10 | 게시글 상세 | PASS (200) |
| 11 | 내 작성글 | PASS (200) |
| 12 | 게시글 수정 | PASS (200) |
| 13 | 좋아요 토글 | PASS (200) |
| 14 | 이미지 업로드 | PASS (201) |
| 15 | 댓글 작성 | PASS (201) |
| 16 | 댓글 목록 | PASS (200) |
| 17 | 댓글 수정 | PASS (200) |
| 18 | 댓글 삭제 | PASS (200) |
| 19 | 포켓몬 등록 | PASS (201) |
| 20 | 포켓몬 중복 | PASS (409) |
| 21 | 보유 목록 | PASS (200) |
| 22 | 포켓몬 삭제 | PASS (200) |
| 23 | 파티 생성 | PASS (201) |
| 24 | 파티 목록 | PASS (200) |
| 25 | 파티 수정 | PASS (200) |
| 26 | 파티 발행 | PASS (200) |
| 27 | 파티 삭제 | PASS (200) |
| 28 | 게시글 삭제 | PASS (200) |
| 29 | 회원 탈퇴 | PASS (200) |
| 30 | API 문서 페이지 | PASS (200) |

**결과: 30/30 PASS**

---

## API 문서 페이지

온라인: https://www.fullstackfamily.com/pocket-archive/api-docs
