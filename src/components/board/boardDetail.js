import { BoardDetailContent, CommentSection } from "./boardDetailUI.js";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function initPostDetail(postId) {
  let postData = {};
  let commentData = [];
  const currentUserId = localStorage.getItem("userId");
  try {
    const postRes = await fetch(`${BASE_URL}posts/${postId}`, {
      method: "GET",
    });
    const commentRes = await fetch(`${BASE_URL}posts/${postId}/comments`, {
      method: "GET",
    });
    if (!postRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }
    if (!commentRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }

    postData = await postRes.json();
    commentData = await commentRes.json();
  } catch (error) {
    console.error(error);
  }
  const contentArea = document.getElementById("postDetailContent");
  const commentArea = document.getElementById("commentSection");

  if (contentArea) {
    contentArea.innerHTML = BoardDetailContent(postData.data);
  }

  if (commentArea) {
    commentArea.innerHTML = CommentSection(commentData.data, currentUserId);
  }
  setupLikeEvent(postId);
  setupCommentEvents(postId);
}

async function setupCommentEvents(postId) {
  const submitBtn = document.getElementById("submitComment");
  const userToken = localStorage.getItem("token");
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const text = document.getElementById("commentInput").value;
      if (!text.trim()) {
        return alert("내용을 입력하세요");
      }
      if (userToken) {
        try {
          const res = await fetch(`${BASE_URL}posts/${postId}/comments`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: text,
            }),
          });

          document.getElementById("commentInput").value = "";
          location.reload();
        } catch (error) {
          console.error(error);
        }
      } else {
        return;
      }
    };
  }
}
async function setupLikeEvent(postId) {
  const likeBtn = document.getElementById("post-like-btn");
  const userToken = localStorage.getItem("token");

  if (likeBtn) {
    likeBtn.onclick = async () => {
      if (!userToken) return alert("로그인이 필요한 서비스입니다.");

      try {
        const res = await fetch(`${BASE_URL}posts/${postId}/favorite`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          location.reload();
        } else {
          console.error("좋아요 실패");
        }
      } catch (error) {
        console.error(error);
      }
    };
  }
}
// 수정 모드 전환
window.toggleEditMode = (commentId) => {
  const contentP = document.getElementById(`comment-content-${commentId}`);
  const btnGroup = document.getElementById(`comment-btns-${commentId}`);
  const originalContent = contentP.innerText;

  // 1. 내용 영역을 textarea로 교체
  contentP.innerHTML = `
    <textarea id="edit-input-${commentId}" 
      class="w-full p-3 mt-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#05B29F] text-[14px] resize-none"
      rows="3">${originalContent}</textarea>
  `;

  // 2. 버튼을 '저장/취소'로 교체
  btnGroup.innerHTML = `
    <button onclick="saveEditComment(${commentId}, '${originalContent}')" 
            class="text-[11px] text-[#05B29F] font-bold">저장</button>
    <button onclick="cancelEditMode(${commentId}, '${originalContent}')" 
            class="text-[11px] text-gray-400 font-bold">취소</button>
  `;
};

// 수정 취소
window.cancelEditMode = (commentId, originalContent) => {
  location.reload();
};

window.saveEditComment = async (commentId, oldContent) => {
  const newContent = document.getElementById(`edit-input-${commentId}`).value;

  if (!newContent.trim() || newContent === oldContent) {
    return location.reload();
  }

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}comments/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (res.ok) {
      location.reload();
    } else {
      console.log("수정에 실패했습니다.");
    }
  } catch (error) {
    console.error(error);
  }
};
window.handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (error) {
    console.error("댓글 삭제 에러:", error);
  }
};

window.handleDeletePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      location.href = "/board";
    }
  } catch (error) {
    console.error(error);
  }
};
window.handleEditPost = (postId) => {
  location.href = `/write-post?edit=${postId}`;
};
