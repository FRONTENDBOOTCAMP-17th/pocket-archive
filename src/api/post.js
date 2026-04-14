const BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("token");

export async function togglePostLike(postId) {
  if (!token) return false;
  const res = await fetch(`${BASE_URL}/posts/${postId}/favorite`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.ok;
}

export async function postComment(postId, text) {
  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
}
//댓글 수정
export async function editComment(commentId) {
  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
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
}
//댓글삭제
export async function deleteCommnet(commentId) {
  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
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
}
export async function deletePost(postId) {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      location.href = "/board";
    }
  } catch (error) {
    console.error(error);
  }
}
