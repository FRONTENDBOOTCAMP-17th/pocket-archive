import { BoardDetailContent, CommentSection } from './boardDetailUI.js';
import { BASE_URL } from '../../api/config.js';

export async function initPostDetail(postId) {
  let post = null;
  let comments = [];

  try {
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`, { method: 'GET' });
    const commentRes = await fetch(`${BASE_URL}/posts/${postId}/comments`, { method: 'GET' });
    if (!postRes.ok) throw new Error('게시물 불러오기 실패');
    if (!commentRes.ok) throw new Error('댓글 불러오기 실패');

    const postData = await postRes.json();
    const commentData = await commentRes.json();

    post = postData.data;
    comments = Array.isArray(commentData.data) ? commentData.data : [];
  } catch (error) {
    console.error(error);
    // 에러 발생 시 더미 데이터 사용
  }

  const dummyComment = [
    {
      content_id: 1,
      content: '포덕 수듄 실화냐....?',
      user_id: 25,
      authorNickname: '이규화',
      createdAt: '2026-04-03T10:05:00Z',
      updatedAt: '2026-04-03T10:05:00Z',
    },
    {
      content_id: 2,
      content: '입구 컷 당함요;;',
      user_id: 6,
      authorNickname: '이규화 숭배자',
      createdAt: '2026-04-03T10:12:00Z',
      updatedAt: '2026-04-03T10:12:00Z',
    },
    {
      content_id: 3,
      content: '으악 개귀엽다 ㄹㅇ ㅋㅋ',
      user_id: 52,
      authorNickname: '하이드로펌프',
      createdAt: '2026-04-03T10:20:00Z',
      updatedAt: '2026-04-03T10:20:00Z',
    },
  ];

  const dummydetailPost = {
    post_id: 2,
    title: '이야 이 피카츄 실화냐?',
    content: '안녕?',
    category: '자유게시판',
    ImgUrls: ['https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'],
    author: '엄인호',
    viewCount: 2521,
    favoriteCount: 142,
    comments: 3,
    createdAt: '2026-04-03T10:00:00Z',
    updatedAt: '2026-04-03T10:30:00Z',
  };

  const contentArea = document.getElementById('postDetailContent');
  const commentArea = document.getElementById('commentSection');

  if (contentArea) {
    contentArea.innerHTML = BoardDetailContent(post || dummydetailPost);
  }

  if (commentArea) {
    commentArea.innerHTML = CommentSection(comments.length > 0 ? comments : dummyComment);
  }

  setupCommentEvents(postId);
}

async function setupCommentEvents(postId) {
  const submitBtn = document.getElementById('submitComment');
  if (!submitBtn) return;

  submitBtn.onclick = async () => {
    const text = document.getElementById('commentInput').value;
    if (!text.trim()) {
      return alert('내용을 입력하세요');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return alert('로그인이 필요합니다.');
    }

    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
        }),
      });
      if (!res.ok) throw new Error('댓글 등록 실패');
      location.reload();
    } catch (error) {
      console.error(error);
      alert('댓글 등록에 실패했어요.');
    }
    document.getElementById('commentInput').value = '';
  };
}
