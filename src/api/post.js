const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem('token');

export async function loadPosts() {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function togglePostLike(postId) {
  if (!getToken()) return false;
  const res = await fetch(`${BASE_URL}/posts/${postId}/favorite`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  return res.ok;
}

export async function postComment(postId, text) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: text }),
  });
  if (!res.ok) throw new Error('댓글 작성 실패');
  return res.json();
}
//댓글 수정
export async function editComment(commentId, content) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('댓글 수정 실패');
  return res.json();
}
//댓글삭제
export async function deleteCommnet(commentId) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('댓글 삭제 실패');
}
//게시물 삭제
export async function deletePost(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('게시글 삭제 실패');
}
export async function loadDetailPost(postId) {
  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!postRes.ok) {
      throw new Error('게시물 불러오기 실패');
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
      method: 'GET',
    });
    if (!commentRes.ok) {
      throw new Error('댓글 불러오기 실패');
    }
    const commentJson = await commentRes.json();
    return commentJson;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function writePost(title, category, content, selectedPreset, uploadImgUrl) {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
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
    if (!response.ok) throw new Error('게시글 작성 실패');
    return response.json();
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function publishPost(postId) {
  try {
    const publishRes = await fetch(`${BASE_URL}/posts/${postId}/publish`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!publishRes.ok) throw new Error('게시글 발행 실패');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//글 수정 버튼 눌렀을때 기존 글 불러오기 (수정하기전에 작성되있는 글 덮어주기)
export async function loadEditPost(postId) {
  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'GET',
    });
    if (!postRes.ok) {
      throw new Error('게시물 불러오기 실패');
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
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch (e) {
    console.warn('파티 프리셋 로드 실패:', e);
    return [];
  }
}

export async function editPost(postId, { title, content, category, preset, uploadImgUrl, postData, presets }) {
  let editPreset = null;
  try {
    if (preset === 'default') {
      editPreset = {
        deckname: postData.preset.deckname,
        pocketmons: postData.preset.pocketmons,
        gender: postData.preset.gender,
      };
    } else if (preset !== '') {
      const selectedPreset = presets.find((item) => item.partyId === Number(preset));
      editPreset = {
        deckname: selectedPreset.deckname,
        pocketmons: selectedPreset.pocketmons,
        gender: selectedPreset.gender,
      };
    }

    const editRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
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
      throw new Error(errorData.message || '수정 실패');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadImg(formData) {
  try {
    const uploadRes = await fetch(`${BASE_URL}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!uploadRes.ok) {
      throw new Error('이미지 업로드 실패');
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
