# 강사님께 요청할 것

## api 로직 관련

> Base_URL : api/pocket-archive
> PokeAPI : <https://pokeapi.co/api/v2/pokemon>

### 유저관련

#### 유저 회원가입

> post api/pocket-archive/user/register

```json
//요청 값
{
  "email": string,
  "nickname": string,
  "password": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "email": string,
    "nickname": string,
    "createdAt": date
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 닉네임 중복확인

> post api/pocket-archive/user/register/nickname

```json
//요청 값
{
  "nickname": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 이메일 중복확인

> post api/pocket-archive/user/register/email

```json
//요청 값
{
  "email": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 유저 로그인

> post api/pocket-archive/user/login

```json
//요청 값
{
  "email": string,
  "password": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "email": string,
    "nickname": string,
    "createdAt": date,
    "token": string
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 유저 정보 가져오기

> get api/pocket-archive/user/me

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "email": string,
    "nickname": string,
    "createdAt": date
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

### 게시글관련

#### 게시글 목록 조회

> get api/pocket-archive/posts

query: page(optional), size(optional), keyword(optional), category(optional)

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "content": [
      {
        "id": int,
        "title": string,
        "author": string,
        "viewCount": int,
        "favoriteCount": int,
        "commentCount": int,
        "category": string,
        "createdAt": date
      }
    ],
    "page": int,
    "totalPages": int
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 게시글 생성

> post api/pocket-archive/posts

```json
//요청 값
{
  "title": string,
  "content": string,
  "category": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 게시글 수정

> put api/pocket-archive/posts/{id}

```json
//요청 값
{
  "title": string,
  "content": string,
  "category": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 게시글 발행

> put api/pocket-archive/posts/{id}/publish

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 게시글 좋아요 (내 포켓몬 바구니에 담기)

> put api/pocket-archive/posts/{id}/favorite

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "favoriteCount": int
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 이미지 업로드

> post api/pocket-archive/posts/{id}/images

```json
//요청 값 (Content-Type: multipart/form-data)
{
  "image": file
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "imageUrl": string,
    "originalFilename": string
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 게시글 삭제

> delete api/pocket-archive/posts/{id}

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 마이페이지에서 최신순 내 작성글 5개 가져오기

> get api/pocket-archive/posts/my

query: limit=5

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "content": [
      {
        "id": int,
        "title": string,
        "category": string,
        "favoriteCount": int,
        "commentCount": int,
        "createdAt": date
      }
    ]
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

### 댓글관련

#### 해당 게시물의 댓글들 불러오기

> get api/pocket-archive/posts/{postId}/comments

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": [
    {
      "id": int,
      "content": string,
      "authorId": int,
      "authorNickname": string,
      "createdAt": date,
      "updatedAt": date
    }
  ]
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 해당 게시물의 댓글 생성

> post api/pocket-archive/posts/{postId}/comments

```json
//요청 값
{
  "content": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "content": string,
    "authorId": int,
    "authorNickname": string,
    "createdAt": date,
    "updatedAt": date
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 댓글 수정

> put api/pocket-archive/comments/{commentId}

```json
//요청 값
{
  "content": string
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "content": string,
    "authorId": int,
    "authorNickname": string,
    "createdAt": date,
    "updatedAt": date
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 댓글 삭제

> delete api/pocket-archive/comments/{commentId}

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

### 포켓몬관련

#### 지닌 포켓몬 가져오기

> get api/pocket-archive/pocketmons

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "myPocketmons": [int]
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 포켓몬 등록

> post api/pocket-archive/pocketmons

```json
//요청 값
{
  "pocketmonId": int
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "myPocketmons": [int]
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 포켓몬 삭제

> delete api/pocket-archive/pocketmons/{id}

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

### 파티 만들기

#### 파티 정보 가져오기

> get api/pocket-archive/party

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": [
    {
      "id": int,
      "deckname": string,
      "pocketmons": [int]
    }
  ]
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 파티 생성

> post api/pocket-archive/party

```json
//요청 값
{
  "deckname": string,
  "pocketmons": [int]
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": {
    "id": int,
    "deckname": string,
    "pocketmons": [int]
  }
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 파티 수정

> put api/pocket-archive/party/{id}

```json
//요청 값
{
  "deckname": string,
  "pocketmons": [int]
}

//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": [
    {
      "id": int,
      "deckname": string,
      "pocketmons": [int]
    }
  ]
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 파티 발행

> put api/pocket-archive/party/{id}/private

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string,
  "data": [
    {
      "id": int,
      "deckname": string,
      "pocketmons": [int]
    }
  ]
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

#### 파티 삭제

> delete api/pocket-archive/party/{id}

```json
//응답 값(성공 시)
{
  "success": true,
  "message": string
}

//응답 값(실패 시)
{
  "success": false,
  "message": string
}
```

---

## DB스키마

### 유저테이블

| 컬럼명    | 논리명          | 타입    | PK/FK |
| --------- | --------------- | ------- | ----- |
| id        | 사용자 id       | int     | PK    |
| email     | 사용자 이메일   | var(20) |       |
| nickname  | 사용자 닉네임   | var(20) |       |
| password  | 사용자 비밀번호 | var(20) |       |
| createdAt | 생성날짜        | date    |       |

### 게시판

| 컬럼명        | 논리명     | 타입    | PK/FK |
| ------------- | ---------- | ------- | ----- |
| id            | 게시판 id  | int     | PK    |
| user_id       | 사용자 id  | int     | FK    |
| category      | 카테고리   | var(20) |       |
| title         | 제목       | var(20) |       |
| content       | 내용       | var(50) |       |
| img           | 이미지링크 | var(50) |       |
| favoriteCount | 좋아요     | int     |       |
| commentCount  | 댓글수     | int     |       |
| viewCount     | 조회수     | int     |       |
| isPublished   | 발행여부   | boolean |       |
| createdAt     | 생성날짜   | date    |       |
| updatedAt     | 수정날짜   | date    |       |

### 댓글

| 컬럼명    | 논리명    | 타입    | PK/FK |
| --------- | --------- | ------- | ----- |
| id        | 댓글 id   | int     | PK    |
| post_id   | 게시물 id | int     | FK    |
| user_id   | 사용자 id | int     | FK    |
| content   | 내용      | var(50) |       |
| createdAt | 생성날짜  | date    |       |
| updatedAt | 수정날짜  | date    |       |

### 포켓몬

| 컬럼명 | 논리명      | 타입     | PK/FK | PokeAPI 필드                  |
| ------ | ----------- | -------- | ----- | ----------------------------- |
| id     | 포켓몬 번호 | int      | PK    | id                            |
| name   | 포켓몬 이름 | var(50)  |       | name                          |
| type1  | 주 타입     | var(20)  |       | types[0].type.name            |
| type2  | 부 타입     | var(20)  |       | types[1].type.name (nullable) |
| img    | 이미지 URL  | var(150) |       | sprites.front_default         |
| height | 키          | int      |       | height                        |
| weight | 무게        | int      |       | weight                        |

### 유저 보유 포켓몬

| 컬럼명       | 논리명    | 타입 | PK/FK |
| ------------ | --------- | ---- | ----- |
| id           | id        | int  | PK    |
| user_id      | 사용자 id | int  | FK    |
| pocketmon_id | 포켓몬 id | int  | FK    |

### 포켓몬 파티

| 컬럼명      | 논리명    | 타입    | PK/FK |
| ----------- | --------- | ------- | ----- |
| id          | 파티 id   | int     | PK    |
| user_id     | 사용자 id | int     | FK    |
| deckname    | 파티명    | var(20) |       |
| isPublished | 발행여부  | boolean |       |

### 파티 포켓몬

| 컬럼명       | 논리명    | 타입 | PK/FK |
| ------------ | --------- | ---- | ----- |
| id           | id        | int  | PK    |
| party_id     | 파티 id   | int  | FK    |
| pocketmon_id | 포켓몬 id | int  | FK    |
