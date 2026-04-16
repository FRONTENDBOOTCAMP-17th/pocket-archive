import { BoardDetailContent, CommentSection } from './boardDetailUI.js';
import { postComment, togglePostLike, editComment, deleteCommnet, deletePost, loadDetailPost, loadDetailComment } from '../../api/post.js';
import { showModal } from '../modal.js';

// 페이지 이동 시 이전 리스너를 정리하기 위한 컨트롤러
let _commentClickController = null;

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
  // 이전 리스너 정리
  _commentClickController?.abort();
  _commentClickController = new AbortController();
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
  const [postJson, commentJson] = await Promise.all([loadDetailPost(postId), loadDetailComment(postId)]);
  post = postJson?.data ?? null;
  comments = Array.isArray(commentJson?.data) ? commentJson.data : [];

  if (!post) {
    const contentArea = document.getElementById('postDetailContent');
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="text-center py-20 text-gray-400">
          <p class="text-lg font-bold">게시글을 불러오지 못했어요.</p>
          <button onclick="location.href='/board'"
                  class="mt-4 px-4 py-2 bg-[#05B29F] text-white rounded-lg">
            게시판으로 돌아가기
          </button>
        </div>
      `;
    }
    return;
  }

  const contentArea = document.getElementById('postDetailContent');
  const commentArea = document.getElementById('commentSection');

  if (contentArea) {
    let spriteMap = {};

    // 게시글에 실제 프리셋이 있을 때만 포켓몬 스프라이트 로드
    if (post.preset && post.preset.pocketmons?.length > 0) {
      spriteMap = await fetchSprites(post.preset.pocketmons);
    }

    contentArea.innerHTML = BoardDetailContent(post, currentUserId, spriteMap);
  }

  if (commentArea) {
    commentArea.innerHTML = CommentSection(comments, currentUserId);
  }
  setupLikeEvent(postId);
  setupCommentEvents(postId, _commentClickController.signal);
}

async function setupCommentEvents(postId, signal) {
  const submitBtn = document.getElementById('submitComment');
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const input = document.getElementById('commentInput');
      const text = input.value;
      if (!text.trim()) return;
      if (!localStorage.getItem('token')) {
        return await showModal('비로그인 상태', '로그인이 필요한 서비스 입니다.', 'danger');
      }
      try {
        await postComment(postId, text);
        input.value = '';
        await initPostDetail(postId);
      } catch (error) {
        console.error(error);
      }
    };
  }

  // data-action 이벤트 위임 — signal로 페이지 이동 시 자동 제거
  document.addEventListener(
    'click',
    async (e) => {
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
    },
    { signal },
  );
}

async function setupLikeEvent(postId) {
  const likeBtn = document.getElementById('post-like-btn');
  if (!likeBtn) return;

  let isInFlight = false;

  likeBtn.onclick = async () => {
    if (!localStorage.getItem('token') || isInFlight) return;
    isInFlight = true;

    try {
      const ok = await togglePostLike(postId);

      if (ok) {
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
    } finally {
      isInFlight = false;
    }
  };
}

// 수정 모드 전환
function toggleEditMode(commentId) {
  const contentP = document.getElementById(`comment-content-${commentId}`);
  const btnGroup = document.getElementById(`comment-btns-${commentId}`);
  const originalContent = contentP.innerText;

  // 1. textarea를 DOM으로 직접 생성 (innerHTML 문자열 주입 금지 — XSS 방지)
  const textarea = document.createElement('textarea');
  textarea.id = `edit-input-${commentId}`;
  textarea.className = 'w-full p-3 mt-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#05B29F] text-[14px] resize-none';
  textarea.rows = 3;
  textarea.value = originalContent; // value로 설정 — HTML 파싱 없음

  contentP.replaceChildren(textarea);

  // 2. 버튼을 '저장/취소'로 교체
  const saveBtn = document.createElement('button');
  saveBtn.className = 'text-[11px] text-[#05B29F] font-bold';
  saveBtn.textContent = '저장';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'text-[11px] text-gray-400 font-bold';
  cancelBtn.textContent = '취소';

  btnGroup.replaceChildren(saveBtn, cancelBtn);

  saveBtn.addEventListener('click', () => saveEditComment(commentId, originalContent));
  cancelBtn.addEventListener('click', () => location.reload());
}

async function saveEditComment(commentId, oldContent) {
  const newContent = document.getElementById(`edit-input-${commentId}`).value;

  if (!newContent.trim() || newContent === oldContent) {
    return location.reload();
  }
  try {
    await editComment(commentId, newContent);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

//댓글삭제
async function handleDeleteComment(commentId) {
  if (!localStorage.getItem('token')) return;
  try {
    await deleteCommnet(commentId);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

async function handleDeletePost(postId) {
  try {
    await deletePost(postId);
    history.pushState(null, '', '/board');
    window.loadPage();
  } catch (error) {
    console.error(error);
  }
}

function handleEditPost(postId) {
  location.href = `/write-post?postId=${postId}`;
}
