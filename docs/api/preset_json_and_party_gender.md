# preset JSON Object + Party gender 필드 추가 안내

> 2026-04-09: `docs/요청사항2.md`의 6건을 모두 처리했습니다.

API 문서: https://www.fullstackfamily.com/pocket-archive/api-docs

---

## 1. Post preset: Integer → JSON Object

### 변경 내용

`preset` 필드가 정수(Integer)에서 **JSON Object**로 변경되었습니다.

| 항목 | 이전 | 현재 |
|------|------|------|
| 타입 | `Integer` (0, 1, 2...) | `Object` (JSON) |
| 예시 | `"preset": 0` | `"preset": { "deckname": "...", "pocketmons": [...], "gender": "..." }` |

### 게시글 생성

```bash
POST /api/pocket-archive/v1/posts
Authorization: Bearer {토큰}

{
  "title": "최강 파티 공유합니다",
  "content": "리자몽, 갸라도스, 피카츄로 구성한 파티입니다.",
  "category": "파티공유",
  "preset": {
    "deckname": "불 파티",
    "pocketmons": [6, 136, 257],
    "gender": "women"
  },
  "imgUrl": "https://storage.fullstackfamily.com/.../image.webp"
}
```

### 게시글 수정

```bash
PUT /api/pocket-archive/v1/posts/{id}
Authorization: Bearer {토큰}

{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "category": "파티공유",
  "preset": {
    "deckname": "물 파티",
    "pocketmons": [9, 134, 130],
    "gender": "men"
  }
}
```

### 게시글 상세 응답

```json
{
  "postId": 1,
  "title": "최강 파티 공유합니다",
  "content": "...",
  "category": "파티공유",
  "preset": {
    "deckname": "불 파티",
    "pocketmons": [6, 136, 257],
    "gender": "women"
  },
  "userId": 1,
  "nickname": "테스트유저",
  "imgUrl": "https://...",
  "images": [...]
}
```

> `preset`이 null이면 JSON에서 생략됩니다.
> `preset` 안에 어떤 구조든 넣을 수 있습니다 (자유 JSON).

---

## 2. Party gender 필드 추가

### 파티 생성

```bash
POST /api/pocket-archive/v1/party
Authorization: Bearer {토큰}

{
  "deckname": "최강 불 파티",
  "pocketmons": [6, 136, 257],
  "gender": "women"
}
```

### 파티 수정

```bash
PUT /api/pocket-archive/v1/party/{id}
Authorization: Bearer {토큰}

{
  "deckname": "최강 불+풀 파티",
  "pocketmons": [6, 136, 257, 3],
  "gender": "men"
}
```

### 파티 목록 응답

```json
[
  {
    "partyId": 1,
    "deckname": "최강 불 파티",
    "pocketmons": [6, 136, 257],
    "gender": "women",
    "isPublished": true,
    "createdAt": "2026-04-09T10:00:00"
  }
]
```

> `gender`는 선택 필드입니다. null이면 JSON에서 생략됩니다.

---

## 프론트엔드 사용 예시

```javascript
// 게시글 생성 (preset JSON)
await fetch('/api/pocket-archive/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '나의 파티',
    content: '최강 조합!',
    category: '파티공유',
    preset: {
      deckname: '불 파티',
      pocketmons: [6, 136, 257],
      gender: 'women',
    },
  }),
})

// 파티 생성 (gender 포함)
await fetch('/api/pocket-archive/v1/party', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    deckname: '물 파티',
    pocketmons: [9, 134, 130],
    gender: 'men',
  }),
})
```

프로덕션에 이미 반영되었습니다.
