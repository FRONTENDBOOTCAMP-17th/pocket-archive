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
//게시물 삭제
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
export async function loadDetailPost(postId) {
  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "GET",
    });
    if (!postRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }
    const postJson = await postRes.json();

    return postJson;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function loadDetailComment(postId) {
  try {
    const commentRes = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: "GET",
    });
    if (!commentRes.ok) {
      throw new Error("댓글 불러오기 실패");
    }
    const commentJson = await commentRes.json();
    return commentJson;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function writePost(
  title,
  category,
  content,
  selectedPreset,
  uploadImgUrl,
) {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        category,
        content,
        preset: selectedPreset
          ? {
              deckname: selectedPreset.deckname,
              pocketmons: selectedPreset.pocketmons,
              gender: selectedPreset.gender,
            }
          : null,
        imgUrl: uploadImgUrl,
      }),
    });
    if (!response.ok) throw new Error("게시글 작성 실패");
    return response.json();
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function publishPost(postId) {
  try {
    const publishRes = await fetch(`${BASE_URL}/posts/${postId}/publish`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!publishRes.ok) throw new Error("게시글 발행 실패");
  } catch (error) {
    console.error(error);
  }
}
//글 수정 버튼 눌렀을때 기존 글 불러오기 (수정하기전에 작성되있는 글 덮어주기)
export async function loadEditPost(postId) {
  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "GET",
    });
    if (!postRes.ok) {
      throw new Error("게시물 불러오기 실패");
    }
    const postJson = await postRes.json();

    return postJson.data;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function loadPreset() {
  try {
    const res = await fetch(`${BASE_URL}/party`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const presets = Array.isArray(data) ? data : (data.data ?? []);
    const select = document.getElementById("write-party-preset");
    presets.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.partyId;
      option.textContent = preset.deckname;
      select.appendChild(option);
    });
    return presets;
  } catch (e) {
    console.warn("파티 프리셋 로드 실패:", e);
    return [];
  }
}

export async function editPost(
  postId,
  { title, content, category, preset, uploadImgUrl, postData, presets },
) {
  let editPreset = null;
  try {
    if (preset === "default") {
      editPreset = {
        deckname: postData.preset.deckname,
        pocketmons: postData.preset.pocketmons,
        gender: postData.preset.gender,
      };
    } else if (preset !== "") {
      const selectedPreset = presets.find(
        (item) => item.partyId === Number(preset),
      );
      editPreset = {
        deckname: selectedPreset.deckname,
        pocketmons: selectedPreset.pocketmons,
        gender: selectedPreset.gender,
      };
    }

    const editRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        category,
        content,
        preset: editPreset || null,
        imgUrl: uploadImgUrl,
      }),
    });
    if (!editRes.ok) {
      const errorData = await editRes.json();
      throw new Error(errorData.message || "수정 실패");
    }
    history.pushState(null, "", `/board/${postId}`);
    window.loadPage();
  } catch (error) {
    console.error(error);
  }
}

export async function uploadImg(formData) {
  try {
    const uploadRes = await fetch(`${BASE_URL}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!uploadRes.ok) {
      throw new Error("이미지 업로드 실패");
    }
    const {
      data: { imageUrl },
    } = await uploadRes.json();
    return imageUrl;
  } catch (error) {
    console.error(error);
    return;
  }
}
