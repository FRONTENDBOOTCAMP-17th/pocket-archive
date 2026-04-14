import { BoardDetailContent, CommentSection } from './boardDetailUI.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
          url: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default || '',
        })),
    ),
  );
  results.forEach((r) => {
    if (r.status === 'fulfilled') map[r.value.id] = r.value.url;
  });
  return map;
}

export async function initPostDetail(postId) {
  let post = null;
  let comments = [];
  let currentUserId = localStorage.getItem('userId');
  if (!currentUserId) {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = String(payload.userId ?? payload.id ?? payload.sub ?? '');
      }
    } catch (error) {
      console.error(error);
    }
  }
  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'GET',
    });
    const commentRes = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
    });
    if (!postRes.ok) {
      throw new Error('게시물 불러오기 실패');
    }
    if (!commentRes.ok) {
      throw new Error('댓글 불러오기 실패');
    }

    const postJson = await postRes.json();
    const commentJson = await commentRes.json();

    post = postJson.data;
    console.log(post, 'post');
    comments = Array.isArray(commentJson.data) ? commentJson.data : [];
  } catch (error) {
    console.error(error);
  }
  const contentArea = document.getElementById('postDetailContent');
  const commentArea = document.getElementById('commentSection');

  if (contentArea) {
    let spriteMap = {};

    // 게시글에 실제 프리셋이 있을 때만 포켓몬 스프라이트 로드
    if (post.preset && post.preset.pocketmons?.length > 0) {
      spriteMap = await fetchSprites(post.preset.pocketmons);
    }

    contentArea.innerHTML = BoardDetailContent(
      post,
      currentUserId,
      spriteMap
    );
  }

  if (commentArea) {
    commentArea.innerHTML = CommentSection(comments, currentUserId);
  }
  setupLikeEvent(postId);
  setupCommentEvents(postId);
}

async function setupCommentEvents(postId) {
  const submitBtn = document.getElementById('submitComment');
  const userToken = localStorage.getItem('token');
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const text = document.getElementById('commentInput').value;
      if (!text.trim()) {
        return alert('내용을 입력하세요');
      }
      if (userToken) {
        try {
          await fetch(`${BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: text,
            }),
          });

          document.getElementById('commentInput').value = '';
          location.reload();
        } catch (error) {
          console.error(error);
        }
      }
    };
  }

  // data-action 이벤트 위임
  document.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === 'edit-comment') {
      const commentId = e.target.dataset.commentId;
      toggleEditMode(commentId);
    }

    if (action === 'delete-comment') {
      const commentId = e.target.dataset.commentId;
      await handleDeleteComment(commentId);
    }

    if (action === 'edit-post') {
      const pid = e.target.dataset.postId;
      handleEditPost(pid);
    }

    if (action === 'delete-post') {
      const pid = e.target.dataset.postId;
      await handleDeletePost(pid);
    }
  });
}

async function setupLikeEvent(postId) {
  const likeBtn = document.getElementById('post-like-btn');
  const userToken = localStorage.getItem('token');

  if (likeBtn) {
    likeBtn.onclick = async () => {
      if (!userToken) return alert('로그인이 필요한 서비스입니다.');

      try {
        const res = await fetch(`${BASE_URL}/posts/${postId}/favorite`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const emojiSpan = likeBtn.querySelector('span:first-of-type');
          const countSpan = likeBtn.querySelector('span:last-of-type');
          const isCurrentlyLiked = emojiSpan?.textContent.includes('❤️');
          const currentCount = parseInt(countSpan?.textContent.trim() || '0', 10);

          if (emojiSpan) emojiSpan.textContent = isCurrentlyLiked ? '🤍' : '❤️';
          if (countSpan) countSpan.textContent = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
        } else {
          console.error('좋아요 실패');
        }
      } catch (error) {
        console.error(error);
      }
    };
  }
}
// 수정 모드 전환
function toggleEditMode(commentId) {
  const contentP = document.getElementById(`comment-content-${commentId}`);
  const btnGroup = document.getElementById(`comment-btns-${commentId}`);
  const originalContent = contentP.innerText;

  // 1. 내용 영역을 textarea로 교체
  contentP.innerHTML = `
    <textarea id="edit-input-${commentId}"
      class="w-full p-3 mt-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#05B29F] text-[14px] resize-none"
      rows="3">${originalContent}</textarea>
  `;

  // 2. 버튼을 '저장/취소'로 교체 (인라인 onclick 대신 id로 이벤트 연결)
  btnGroup.innerHTML = `
    <button id="save-btn-${commentId}" class="text-[11px] text-[#05B29F] font-bold">저장</button>
    <button id="cancel-btn-${commentId}" class="text-[11px] text-gray-400 font-bold">취소</button>
  `;

  document.getElementById(`save-btn-${commentId}`).addEventListener('click', () => saveEditComment(commentId, originalContent));
  document.getElementById(`cancel-btn-${commentId}`).addEventListener('click', () => location.reload());
}

// 수정 취소
function cancelEditMode(commentId, originalContent) {
  location.reload();
}

async function saveEditComment(commentId, oldContent) {
  const newContent = document.getElementById(`edit-input-${commentId}`).value;

  if (!newContent.trim() || newContent === oldContent) {
    return location.reload();
  }

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (res.ok) {
      location.reload();
    } else {
      console.log('수정에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
  }
}
async function handleDeleteComment(commentId) {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
  }
}

async function handleDeletePost(postId) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      location.href = '/board';
    }
  } catch (error) {
    console.error(error);
  }
}
function handleEditPost(postId) {
  location.href = `/write-post?postId=${postId}`;
}
