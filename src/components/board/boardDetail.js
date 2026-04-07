import { BoardDetailContent, CommentSection } from "./boardDetailUI.js";

export async function initPostDetail(postId) {
  console.log("여기 실행?");
  const postData = {};
  const commentData = [];
  try {
    const postRes = await fetch(
      `https://api.fullstackfamily.com/api/pocket-archive/v1/posts/${postId}`,
      {
        method: "GET",
      },
    );
    const commentRes = await fetch(
      `https://api.fullstackfamily.com/api/pocket-archive/v1/posts/${postId}/comments`,
      {
        method: "GET",
      },
    );
    if (!postRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }
    if (!commentRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }

    postData = await res.json();
    commentData = await res.json();
  } catch (error) {
    console.error(error);
  }
  const dummyComment = [
    {
      content_id: 1,
      content: "포덕 수듄 실화냐....?",
      user_id: 25,
      authorNickname: "이규화",
      createdAt: "2026-04-03T10:05:00Z",
      updatedAt: "2026-04-03T10:05:00Z",
    },
    {
      content_id: 2,
      content: "입구 컷 당함요;;",
      user_id: 6,
      authorNickname: "이규화 숭배자",
      createdAt: "2026-04-03T10:12:00Z",
      updatedAt: "2026-04-03T10:12:00Z",
    },
    {
      content_id: 3,
      content: "으악 개귀엽다 ㄹㅇ ㅋㅋ",
      user_id: 52,
      authorNickname: "하이드로펌프",
      createdAt: "2026-04-03T10:20:00Z",
      updatedAt: "2026-04-03T10:20:00Z",
    },
  ];

  const dummydetailPost = {
    post_id: 2,
    title: "이야 이 피카츄 실화냐?",
    content: "안녕?",
    category: "자유게시판",
    ImgUrls: [
      "data:image/jpeg;base64,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",
    ],
    author: "엄인호",
    viewCount: 2521,
    favoriteCount: 142,
    comments: 3,
    createdAt: "2026-04-03T10:00:00Z",
    updatedAt: "2026-04-03T10:30:00Z",
  };
  const contentArea = document.getElementById("postDetailContent");
  const commentArea = document.getElementById("commentSection");
  console.log("게시글 영역 찾기 결과:", contentArea);
  console.log("댓글 영역 찾기 결과:", commentArea);

  // contentArea.innerHTML = BoardDetailContent(dummydetailPost);
  // commentArea.innerHTML = CommentSection(dummyComment);
  if (contentArea) {
    console.log("게시글 불러와지냐?");
    contentArea.innerHTML = BoardDetailContent(dummydetailPost);
  }

  if (commentArea) {
    console.log("댓글은? 불러와지냐?");
    commentArea.innerHTML = CommentSection(dummyComment);
  }
  console.log(commentArea, contentArea);

  setupCommentEvents();
}

async function setupCommentEvents() {
  const submitBtn = document.getElementById("submitComment");

  if (submitBtn) {
    submitBtn.onclick = async () => {
      const text = document.getElementById("commentInput").value;
      if (!text.trim()) {
        return alert("내용을 입력하세요");
      }
      try {
        const res = await fetch(
          `https://api.fullstackfamily.com/api/pocket-archive/v1/posts/${commentId}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: {
              content: text,
            },
          },
        );
        const data = await res.json();
        commentData.push(data);
      } catch (error) {
        console.error(error);
      }
      document.getElementById("commentInput").value = "";
    };
  }
}
