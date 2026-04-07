# 강사님께 요청할 것

## api 로직 관련

> Base_URL : api/pocket-archive
> PokeAPI : <https://pokeapi.co/api/v2/pokemon>

### 🔐 인증 방식

로그인 성공 시 응답의 `data.token` 값을 이후 요청의 헤더에 담아 보내야 합니다.

```text
Authorization: Bearer {token}
```

> 🔒 표시된 API는 반드시 토큰이 필요합니다. 토큰 없이 요청하면 `401 Unauthorized` 응답이 옵니다.

---

### HTTP 상태 코드 정리

| 상태 코드 | 의미                                  |
| --------- | ------------------------------------- |
| 200       | 요청 성공                             |
| 201       | 생성 성공                             |
| 400       | 잘못된 요청 (입력값 오류 등)          |
| 401       | 인증 필요 (토큰 없음 또는 만료)       |
| 403       | 권한 없음 (본인 글/댓글이 아님 등)    |
| 404       | 리소스 없음                           |
| 409       | 충돌 (이미 존재하는 이메일/닉네임 등) |
| 500       | 서버 내부 오류                        |

---

### 유저관련

#### 유저 회원가입

> post api/pocket-archive/user/register

```json
{
  "name": "유저 회원가입",
  "method": "POST",
  "path": "/api/pocket-archive/user/register",
  "description": "이메일, 닉네임, 비밀번호로 회원가입합니다.",
  "request": {
    "body": {
      "login_id": "string",
      "nickname": "string",
      "password": "string"
    }
  },
  "response": {
    "201": {
      "description": "회원가입 성공",
      "body": {
        "message": "string",
        "data": {
          "user_id": "int",
          "login_id": "string",
          "nickname": "string",
          "status": "boolean",
          "createdAt": "date"
        }
      }
    },
    "400": {
      "description": "잘못된 요청 (유효성 검사 실패)",
      "body": {
        "message": "string"
      }
    },
    "409": {
      "description": "이메일 또는 닉네임 중복",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 닉네임 중복확인

> post api/pocket-archive/user/register/nickname

```json
{
  "name": "닉네임 중복확인",
  "method": "POST",
  "path": "/api/pocket-archive/user/register/nickname",
  "description": "닉네임 중복 여부를 확인합니다.",
  "request": {
    "body": {
      "nickname": "string"
    }
  },
  "response": {
    "200": {
      "description": "사용 가능한 닉네임",
      "body": {
        "message": "string"
      }
    },
    "409": {
      "description": "이미 사용 중인 닉네임",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 이메일 중복확인

> post api/pocket-archive/user/register/login_id

```json
{
  "name": "이메일 중복확인",
  "method": "POST",
  "path": "/api/pocket-archive/user/register/login_id",
  "description": "이메일 중복 여부를 확인합니다.",
  "request": {
    "body": {
      "login_id": "string"
    }
  },
  "response": {
    "200": {
      "description": "사용 가능한 이메일",
      "body": {
        "message": "string"
      }
    },
    "409": {
      "description": "이미 사용 중인 이메일",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 유저 로그인

> post api/pocket-archive/user/login

```json
{
  "name": "유저 로그인",
  "method": "POST",
  "path": "/api/pocket-archive/user/login",
  "description": "이메일과 비밀번호로 로그인하고 토큰을 발급받습니다.",
  "request": {
    "body": {
      "login_id": "string",
      "password": "string"
    }
  },
  "response": {
    "200": {
      "description": "로그인 성공",
      "body": {
        "message": "string",
        "data": {
          "user_id": "int",
          "login_id": "string",
          "nickname": "string",
          "status": "boolean",
          "createdAt": "date",
          "updatedAt": "date",
          "token": "string"
        }
      }
    },
    "401": {
      "description": "이메일 또는 비밀번호 불일치",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 유저 정보 가져오기 🔒

> get api/pocket-archive/user/me

```json
{
  "name": "유저 정보 가져오기",
  "method": "GET",
  "path": "/api/pocket-archive/user/me",
  "description": "토큰을 기반으로 로그인한 유저 정보를 가져옵니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": {
          "user_id": "int",
          "login_id": "string",
          "nickname": "string",
          "status": "boolean",
          "createdAt": "date",
          "updatedAt": "date"
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 유저 정보 수정

> put api/pocket-archive/user/me

```json
{
  "name": "유저 정보 수정",
  "method": "PUT",
  "path": "/api/pocket-archive/user/me",
  "description": "로그인한 유저의 정보를 수정합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "login_id": "string",
      "nickname": "string",
      "password": "string"
    }
  },
  "response": {
    "200": {
      "description": "수정 성공",
      "body": {
        "message": "string",
        "data": {
          "user_id": "int",
          "login_id": "string",
          "nickname": "string",
          "status": "boolean",
          "createdAt": "date",
          "updatedAt": "date"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 유저 정보 삭제

> delete api/pocket-archive/user/me

- put api/pocket-archive/user/me
  - put을 사용하여 status 컬럼을 생성하여 탈퇴와 사용중으로 status를 분류 가능

```json
{
  "name": "회원 탈퇴 (비밀번호 확인)",
  "method": "DELETE",
  "path": "/api/pocket-archive/user/me",
  "description": "비밀번호 확인 후 계정을 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "password": "string"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "회원 탈퇴가 완료되었습니다."
      }
    },
    "401": {
      "description": "비밀번호 불일치",
      "body": {
        "message": "비밀번호가 올바르지 않습니다."
      }
    }
  }
}
```

### 게시글관련

#### 게시글 목록 조회

> get api/pocket-archive/posts

query: page(optional), size(optional), keyword(optional), category(optional)

```json
{
  "name": "게시글 목록 조회",
  "method": "GET",
  "path": "/api/pocket-archive/posts",
  "description": "게시글 목록을 페이지네이션과 함께 조회합니다.",
  "request": {
    "query": {
      "page": "int (optional)",
      "size": "int (optional)",
      "keyword": "string (optional)",
      "category": "string (optional)"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": {
          "content": [
            {
              "post_id": "int",
              "title": "string",
              "author": "string",
              "viewCount": "int",
              "favoriteCount": "int",
              "commentCount": "int",
              "category": "string",
              "createdAt": "date"
            }
          ],
          "page": "int",
          "totalPages": "int"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 상세 조회

> get api/pocket-archive/posts/{post_id}

```json
{
  "name": "게시글 상세 조회",
  "method": "GET",
  "path": "/api/pocket-archive/posts/{post_id}",
  "description": "특정 게시글의 상세 정보를 조회합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": {
          "post_id": "int",
          "title": "string",
          "content": "string",
          "category": "string",
          "ImgUrls": "[string]",
          "author": "string",
          "viewCount": "int",
          "favoriteCount": "int",
          "comments": "int",
          "createdAt": "date",
          "updatedAt": "date"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 생성 🔒

> post api/pocket-archive/posts

```json
{
  "name": "게시글 생성",
  "method": "POST",
  "path": "/api/pocket-archive/posts",
  "description": "새 게시글을 생성합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "title": "string",
      "content": "string",
      "category": "string",
      "preset": "int"
    }
  },
  "response": {
    "201": {
      "description": "생성 성공",
      "body": {
        "message": "string",
        "data": {
          "post_id": "int"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 수정 🔒

> put api/pocket-archive/posts/{post_id}

```json
{
  "name": "게시글 수정",
  "method": "PUT",
  "path": "/api/pocket-archive/posts/{post_id}",
  "description": "작성한 게시글을 수정합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "title": "string",
      "content": "string",
      "category": "string",
      "preset": "int"
    }
  },
  "response": {
    "200": {
      "description": "수정 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "403": {
      "description": "수정 권한 없음",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 발행 🔒

> put api/pocket-archive/posts/{post_id}/publish

```json
{
  "name": "게시글 발행",
  "method": "PUT",
  "path": "/api/pocket-archive/posts/{post_id}/publish",
  "description": "작성한 게시글을 발행합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "발행 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "403": {
      "description": "발행 권한 없음",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 좋아요 (내 포켓몬 바구니에 담기) 🔒

> put api/pocket-archive/posts/{post_id}/favorite

```json
{
  "name": "게시글 좋아요",
  "method": "PUT",
  "path": "/api/pocket-archive/posts/{post_id}/favorite",
  "description": "게시글을 좋아요(내 포켓몬 바구니에 담기)합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "좋아요 성공",
      "body": {
        "message": "string",
        "data": {
          "favoriteCount": "int"
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 이미지 업로드 🔒

> post api/pocket-archive/posts/{post_id}/images

```json
{
  "name": "이미지 업로드",
  "method": "POST",
  "path": "/api/pocket-archive/posts/{post_id}/images",
  "description": "게시글에 이미지를 업로드합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}",
      "Content-Type": "multipart/form-data"
    },
    "body": {
      "image": "file"
    }
  },
  "response": {
    "200": {
      "description": "업로드 성공",
      "body": {
        "message": "string",
        "data": {
          "imageUrl": "string",
          "originalFilename": "string"
        }
      }
    },
    "400": {
      "description": "잘못된 파일 형식",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 이미지 수정 🔒

> put api/pocket-archive/posts/{post_id}/images/{image_id}

```json
{
  "name": "이미지 수정",
  "method": "PUT",
  "path": "/api/pocket-archive/posts/{post_id}/images/{image_id}",
  "description": "게시글에 업로드된 이미지를 수정합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}",
      "Content-Type": "multipart/form-data"
    },
    "body": {
      "image": "file"
    }
  },
  "response": {
    "200": {
      "description": "수정 성공",
      "body": {
        "message": "string"
      }
    },
    "400": {
      "description": "잘못된 파일 형식",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "이미지 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 이미지 삭제 🔒

> delete api/pocket-archive/posts/{post_id}/images/{image_id}

```json
{
  "name": "이미지 삭제",
  "method": "DELETE",
  "path": "/api/pocket-archive/posts/{post_id}/images/{image_id}",
  "description": "게시글에 업로드된 이미지를 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "이미지 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 게시글 삭제 🔒

> delete api/pocket-archive/posts/{post_id}

```json
{
  "name": "게시글 삭제",
  "method": "DELETE",
  "path": "/api/pocket-archive/posts/{post_id}",
  "description": "작성한 게시글을 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "403": {
      "description": "삭제 권한 없음",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 마이페이지에서 최신순 내 작성글 5개 가져오기 🔒

> get api/pocket-archive/posts/my

query: limit=5

```json
{
  "name": "내 작성글 최신순 5개 조회",
  "method": "GET",
  "path": "/api/pocket-archive/posts/my",
  "description": "마이페이지에서 최신순으로 내 작성글 5개를 가져옵니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "query": {
      "limit": "5"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": {
          "content": [
            {
              "post_id": "int",
              "title": "string",
              "category": "string",
              "favoriteCount": "int",
              "commentCount": "int",
              "createdAt": "date"
            }
          ]
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

### 댓글관련

#### 해당 게시물의 댓글들 불러오기

> get api/pocket-archive/posts/{post_id}/comments

```json
{
  "name": "댓글 목록 조회",
  "method": "GET",
  "path": "/api/pocket-archive/posts/{post_id}/comments",
  "description": "해당 게시물의 댓글 목록을 불러옵니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": [
          {
            "content_id": "int",
            "content": "string",
            "user_id": "int",
            "authorNickname": "string",
            "createdAt": "date",
            "updatedAt": "date"
          }
        ]
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 해당 게시물의 댓글 생성 🔒

> post api/pocket-archive/posts/{post_id}/comments

```json
{
  "name": "댓글 생성",
  "method": "POST",
  "path": "/api/pocket-archive/posts/{post_id}/comments",
  "description": "해당 게시물에 댓글을 작성합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "content": "string"
    }
  },
  "response": {
    "201": {
      "description": "댓글 생성 성공",
      "body": {
        "message": "string",
        "data": {
          "content_id": "int",
          "content": "string",
          "user_id": "int",
          "authorNickname": "string",
          "createdAt": "date",
          "updatedAt": "date"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "게시글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 댓글 수정 🔒

> put api/pocket-archive/comments/{content_id}

```json
{
  "name": "댓글 수정",
  "method": "PUT",
  "path": "/api/pocket-archive/comments/{content_id}",
  "description": "작성한 댓글을 수정합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "content": "string"
    }
  },
  "response": {
    "200": {
      "description": "수정 성공",
      "body": {
        "message": "string",
        "data": {
          "content_id": "int",
          "content": "string",
          "user_id": "int",
          "authorNickname": "string",
          "createdAt": "date",
          "updatedAt": "date"
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "403": {
      "description": "수정 권한 없음",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "댓글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 댓글 삭제 🔒

> delete api/pocket-archive/comments/{content_id}

```json
{
  "name": "댓글 삭제",
  "method": "DELETE",
  "path": "/api/pocket-archive/comments/{content_id}",
  "description": "작성한 댓글을 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "403": {
      "description": "삭제 권한 없음",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "댓글 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

### 포켓몬관련

#### 지닌 포켓몬 가져오기 🔒

> get api/pocket-archive/pocketmons

```json
{
  "name": "지닌 포켓몬 가져오기",
  "method": "GET",
  "path": "/api/pocket-archive/pocketmons",
  "description": "내가 보유한 포켓몬 목록을 가져옵니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": {
          "myPocketmons": "[int]"
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 포켓몬 등록(북마크) 🔒

> post api/pocket-archive/pocketmons

```json
{
  "name": "포켓몬 등록",
  "method": "POST",
  "path": "/api/pocket-archive/pocketmons",
  "description": "포켓몬을 내 보유 목록에 등록합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "pocketmon_id": "int"
    }
  },
  "response": {
    "201": {
      "description": "등록 성공",
      "body": {
        "message": "string",
        "data": {
          "myPocketmons": "[int]"
        }
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "409": {
      "description": "이미 보유 중인 포켓몬",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 포켓몬 삭제 🔒

> delete api/pocket-archive/pocketmons/{mypocketmon_id}

```json
{
  "name": "포켓몬 삭제",
  "method": "DELETE",
  "path": "/api/pocket-archive/pocketmons/{mypocketmon_id}",
  "description": "보유 중인 포켓몬을 목록에서 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "보유 중인 포켓몬 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

### 파티 만들기

#### 파티 정보 가져오기 🔒

> get api/pocket-archive/party

```json
{
  "name": "파티 정보 가져오기",
  "method": "GET",
  "path": "/api/pocket-archive/party",
  "description": "내 포켓몬 파티 목록을 가져옵니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "조회 성공",
      "body": {
        "message": "string",
        "data": [
          {
            "party_id": "int",
            "deckname": "string",
            "pocketmons": "[int]"
          }
        ]
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 파티 생성 🔒

> post api/pocket-archive/party

```json
{
  "name": "파티 생성",
  "method": "POST",
  "path": "/api/pocket-archive/party",
  "description": "새 포켓몬 파티를 생성합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "deckname": "string",
      "pocketmons": "[int]"
    }
  },
  "response": {
    "201": {
      "description": "생성 성공",
      "body": {
        "message": "string",
        "data": {
          "party_id": "int",
          "deckname": "string",
          "pocketmons": "[int]"
        }
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 파티 수정 🔒

> put api/pocket-archive/party/{party_id}

```json
{
  "name": "파티 수정",
  "method": "PUT",
  "path": "/api/pocket-archive/party/{party_id}",
  "description": "기존 포켓몬 파티를 수정합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "deckname": "string",
      "pocketmons": "[int]"
    }
  },
  "response": {
    "200": {
      "description": "수정 성공",
      "body": {
        "message": "string",
        "data": [
          {
            "party_id": "int",
            "deckname": "string",
            "pocketmons": "[int]"
          }
        ]
      }
    },
    "400": {
      "description": "잘못된 요청",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "파티 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 파티 발행 🔒

> put api/pocket-archive/party/{party_id}/publish

```json
{
  "name": "파티 발행",
  "method": "PUT",
  "path": "/api/pocket-archive/party/{party_id}/publish",
  "description": "포켓몬 파티를 발행(공개/비공개 전환)합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    },
    "body": {
      "isPublished": "boolean"
    }
  },
  "response": {
    "200": {
      "description": "발행 성공",
      "body": {
        "message": "string",
        "data": [
          {
            "party_id": "int",
            "deckname": "string",
            "pocketmons": "[int]"
          }
        ]
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "파티 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

#### 파티 삭제 🔒

> delete api/pocket-archive/party/{party_id}

```json
{
  "name": "파티 삭제",
  "method": "DELETE",
  "path": "/api/pocket-archive/party/{party_id}",
  "description": "포켓몬 파티를 삭제합니다.",
  "request": {
    "headers": {
      "Authorization": "Bearer {token}"
    }
  },
  "response": {
    "200": {
      "description": "삭제 성공",
      "body": {
        "message": "string"
      }
    },
    "401": {
      "description": "인증 실패",
      "body": {
        "message": "string"
      }
    },
    "404": {
      "description": "파티 없음",
      "body": {
        "message": "string"
      }
    }
  }
}
```

---

## DB스키마

> **네이밍 컨벤션**
>
> - DB 컬럼명: `snake_case` (예: `user_id`, `post_id`)
> - API 요청/응답 필드명: `camelCase` (예: `authorId`, `viewCount`)

### 유저테이블

| 컬럼명    | 논리명          | 타입         | PK/FK |
| --------- | --------------- | ------------ | ----- |
| user_id   | 사용자 id       | int          | PK    |
| login_id  | 사용자 아이디   | varchar(100) |       |
| nickname  | 사용자 닉네임   | varchar(100) |       |
| password  | 사용자 비밀번호 | varchar(255) |       |
| status    | 사용자 상태     | boolean      |       |
| createdAt | 생성날짜        | date         |       |
| updatedAt | 수정날짜        | date         |       |

### 게시판

| 컬럼명        | 논리명     | 타입         | PK/FK |
| ------------- | ---------- | ------------ | ----- |
| post_id       | 게시판 id  | int          | PK    |
| user_id       | 사용자 id  | int          | FK    |
| category      | 카테고리   | varchar(20)  |       |
| title         | 제목       | varchar(100) |       |
| content       | 내용       | text         |       |
| img           | 이미지링크 | varchar(255) |       |
| favoriteCount | 좋아요     | int          |       |
| commentCount  | 댓글수     | int          |       |
| viewCount     | 조회수     | int          |       |
| isPublished   | 발행여부   | boolean      |       |
| createdAt     | 생성날짜   | date         |       |
| updatedAt     | 수정날짜   | date         |       |

### 댓글

| 컬럼명     | 논리명    | 타입         | PK/FK |
| ---------- | --------- | ------------ | ----- |
| content_id | 댓글 id   | int          | PK    |
| post_id    | 게시물 id | int          | FK    |
| user_id    | 사용자 id | int          | FK    |
| content    | 내용      | varchar(500) |       |
| createdAt  | 생성날짜  | date         |       |
| updatedAt  | 수정날짜  | date         |       |

### 포켓몬

| 컬럼명       | 논리명      | 타입 | PK/FK |
| ------------ | ----------- | ---- | ----- |
| pocketmon_id | 포켓몬 번호 | int  | PK    |

### 유저 보유 포켓몬

> `pocketmon_id`는 우리 DB의 포켓몬 테이블 id를 FK로 참조합니다. (PokeAPI id와 동일하게 동기화 가정)

| 컬럼명         | 논리명    | 타입 | PK/FK |
| -------------- | --------- | ---- | ----- |
| mypocketmon_id | id        | int  | PK    |
| user_id        | 사용자 id | int  | FK    |
| pocketmon_id   | 포켓몬 id | int  | FK    |

### 포켓몬 파티

| 컬럼명      | 논리명      | 타입        | PK/FK |
| ----------- | ----------- | ----------- | ----- |
| party_id    | 파티 id     | int         | PK    |
| user_id     | 사용자 id   | int         | FK    |
| slot        | 프리셋 제한 | int         |       |
| preset      | 파티명      | varchar(20) |       |
| isPublished | 발행여부    | boolean     |       |
| createdAt   | 생성날짜    | date        |       |
| updatedAt   | 수정날짜    | date        |       |

### 파티 포켓몬

| 컬럼명              | 논리명    | 타입 | PK/FK |
| ------------------- | --------- | ---- | ----- |
| mypartypocketmon_id | id        | int  | PK    |
| party_id            | 파티 id   | int  | FK    |
| pocketmon_id        | 포켓몬 id | int  | FK    |
