import { getMyPosts } from '../../api/user.js';
import { getBoardContainerHTML, getPostCardHTML } from './myboardUI.js';

function renderMyPosts(postlist, data) {
  postlist.innerHTML = '';

  if (!data.length) {
    postlist.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">작성한 게시글이 없습니다.</p>`;
    return;
  }

  data.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.dataset.postId = post.post_id || post.postId;
    postElement.className = 'bg-white rounded-2xl border border-[#00bba7]/15 shadow-sm cursor-pointer hover:shadow-md transition-shadow';
    postElement.style =
      'display:flex; min-height:181px; padding:24px 24px 16px 24px; flex-direction:column; align-items:flex-start; gap:12px; flex-shrink:0; align-self:stretch;';
    postElement.innerHTML = getPostCardHTML(post);
    postlist.appendChild(postElement);
  });
}

export async function initMyBoard() {
  const content = document.getElementById('mypage-content');
  content.innerHTML = getBoardContainerHTML();

  const postlist = document.getElementById('my-postlist');

  try {
    const result = await getMyPosts();
    const posts = result.data?.posts ?? result.data ?? [];
    renderMyPosts(postlist, posts);

    postlist.addEventListener('click', (e) => {
      const postElement = e.target.closest('div[data-post-id]');
      if (!postElement) return;
      const postId = postElement.dataset.postId;
      if (postId) {
        history.pushState(null, '', `/board/${postId}`);
        window.loadPage();
      }
    });
  } catch (e) {
    console.error(e);
    postlist.innerHTML = `<p style="text-align:center; padding:40px; color:red;">게시글을 불러오지 못했습니다.</p>`;
  }
}
