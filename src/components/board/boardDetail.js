import { BoardDetailContent, CommentSection } from "./boardDetailUI.js";
import {
  postComment,
  togglePostLike,
  editComment,
  deleteCommnet,
  deletePost,
  loadDetailPost,
  loadDetailComment,
} from "../../api/post.js";
//트레이너카드에 포켓몬 ID 배열 맵으로 반환
async function fetchSprites(ids) {
  if (!ids || ids.length === 0) return {};
  const map = {};
  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((r) => r.json())
        .then((data) => ({
          id,
          url:
            data.sprites?.other?.["official-artwork"]?.front_default ||
            data.sprites?.front_default ||
            "",
        })),
    ),
  );
  results.forEach((r) => {
    if (r.status === "fulfilled") map[r.value.id] = r.value.url;
  });
  return map;
}

export async function initPostDetail(postId) {
  let post = null;
  let comments = [];
  let currentUserId = localStorage.getItem("userId");
  if (!currentUserId) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserId = String(
          payload.userId ?? payload.id ?? payload.sub ?? "",
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
  const postJson = await loadDetailPost(postId);
  const commentJson = await loadDetailComment(postId);
  post = postJson?.data ?? null;
  comments = Array.isArray(commentJson?.data) ? commentJson.data : [];
  const contentArea = document.getElementById("postDetailContent");
  const commentArea = document.getElementById("commentSection");

  if (contentArea) {
    if (post.preset) {
      const spriteMap = await fetchSprites(post.preset.pocketmons);
      contentArea.innerHTML = BoardDetailContent(
        post,
        currentUserId,
        spriteMap,
      );
    } else {
      contentArea.innerHTML = BoardDetailContent(post, currentUserId);
    }
  }

  if (commentArea) {
    commentArea.innerHTML = CommentSection(comments, currentUserId);
  }
  setupLikeEvent(postId);
  setupCommentEvents(postId);
}

async function setupCommentEvents(postId) {
  const submitBtn = document.getElementById("submitComment");
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const text = document.getElementById("commentInput").value;
      if (!text.trim()) {
        return;
      }
      postComment(postId, text);
    };
  }
}

async function setupLikeEvent(postId) {
  const likeBtn = document.getElementById("post-like-btn");
  const userToken = localStorage.getItem("token");

  if (likeBtn) {
    likeBtn.onclick = async () => {
      if (!userToken) return;

      try {
        const ok = await togglePostLike(postId);

        if (ok) {
          const emojiSpan = likeBtn.querySelector("span:first-of-type");
          const countSpan = likeBtn.querySelector("span:last-of-type");
          const isCurrentlyLiked = emojiSpan?.textContent.includes("❤️");
          const currentCount = parseInt(
            countSpan?.textContent.trim() || "0",
            10,
          );

          if (emojiSpan) emojiSpan.textContent = isCurrentlyLiked ? "🤍" : "❤️";
          if (countSpan)
            countSpan.textContent = isCurrentlyLiked
              ? Math.max(0, currentCount - 1)
              : currentCount + 1;
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
  editComment(commentId);
};
//댓글삭제
window.handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  deleteCommnet(commentId);
};

window.handleDeletePost = async (postId) => {
  deletePost(postId);
};
window.handleEditPost = (postId) => {
  location.href = `/write-post?postId=${postId}`;
};
