# API 수정 완료 안내 (요청사항 4건)

> 2026-04-08: `docs/요청사항.md`의 4건을 모두 처리했습니다.

API 문서: https://www.fullstackfamily.com/pocket-archive/api-docs

---

## 1. 회원가입 응답에 토큰 포함

회원가입 후 별도 로그인 없이 바로 메인 진입이 가능합니다.

```
POST /api/pocket-archive/v1/user/register

{ "loginId": "user@test.com", "nickname": "포켓몬마스터", "password": "Test1234!" }
```

**응답 (변경 후)** — 로그인과 동일한 구조:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 3,
      "loginId": "user@test.com",
      "nickname": "포켓몬마스터",
      "introduce": null,
      "status": true,
      "createdAt": "2026-04-08T10:00:00"
    }
  }
}
```

프론트엔드에서:
```javascript
const res = await fetch('/api/pocket-archive/v1/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ loginId, nickname, password }),
})
const { data } = await res.json()
// data.token → 바로 저장하여 인증 사용
// data.user → 사용자 정보
```

---

## 2. 게시글 생성 시 imgUrl 필드

이미지 업로드 후 받은 URL을 게시글 생성 시 함께 전달합니다.

```
POST /api/pocket-archive/v1/posts
Authorization: Bearer {토큰}

{
  "title": "나의 포켓몬 컬렉션",
  "content": "이번에 잡은 포켓몬들입니다",
  "category": "collection",
  "preset": 0,
  "imgUrl": "https://storage.fullstackfamily.com/.../image.webp"
}
```

**imgUrl 처리:**
- 이미지가 있으면: `imgUrl`에 업로드된 URL 전달
- 이미지가 없으면: 필드 생략 또는 `null`

**응답에 imgUrl 포함:**
```json
{
  "postId": 1,
  "imgUrl": "https://storage.fullstackfamily.com/.../image.webp",
  "images": [
    { "imageId": 1, "url": "https://...", "sortOrder": 0 }
  ]
}
```

> `imgUrl`은 `images[0].url`의 편의 필드입니다. 기존 `images` 배열도 그대로 유지됩니다.

---

## 3. 게시글 수정 시 imgUrl 필드

```
PUT /api/pocket-archive/v1/posts/{id}
Authorization: Bearer {토큰}

{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "category": "collection",
  "preset": 0,
  "imgUrl": "https://storage.fullstackfamily.com/.../new-image.webp"
}
```

**imgUrl 동작 규칙:**

| 전송 값 | 동작 |
|---------|------|
| `"imgUrl": "https://..."` | 기존 이미지 교체 |
| `"imgUrl": ""` | 이미지 삭제 |
| 필드 생략 | 기존 이미지 유지 (변경 안 함) |

---

## 4. User introduce (자기소개) 필드

### 프로필 수정

```
PUT /api/pocket-archive/v1/user/me
Authorization: Bearer {토큰}

{ "introduce": "포켓몬을 사랑하는 트레이너입니다" }
```

> 다른 필드(nickname, password)와 함께 또는 개별적으로 수정 가능합니다.

### 프로필 조회

```
GET /api/pocket-archive/v1/user/me
Authorization: Bearer {토큰}
```

응답:
```json
{
  "userId": 3,
  "loginId": "user@test.com",
  "nickname": "포켓몬마스터",
  "introduce": "포켓몬을 사랑하는 트레이너입니다",
  "status": true,
  "createdAt": "2026-04-08T10:00:00"
}
```

---

## 이미지 업로드 → 게시글 작성 흐름

```
1. POST /v1/images (이미지 업로드)
   → { "imageUrl": "https://storage.fullstackfamily.com/.../image.webp" }

2. POST /v1/posts (게시글 생성, imgUrl에 위 URL 전달)
   → { "postId": 1, "imgUrl": "https://...", ... }
```

```javascript
// 1. 이미지 업로드
const formData = new FormData()
formData.append('file', fileInput.files[0])

const uploadRes = await fetch('/api/pocket-archive/v1/images', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData,
})
const { data: { imageUrl } } = await uploadRes.json()

// 2. 게시글 생성
const postRes = await fetch('/api/pocket-archive/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '나의 포켓몬',
    content: '내용',
    category: 'collection',
    preset: 0,
    imgUrl: imageUrl,
  }),
})
```

프로덕션에 이미 반영되었습니다.
