const BASE_URL = import.meta.env.VITE_BASE_URL;
import { escapeHtml } from '../../utils/escapeHtml.js';

function getToken() {
  return localStorage.getItem('token') || '';
}

const categoryMap = {
  free: '자유게시판',
  guide: '질문게시판',
  battle: '공략',
  party: '파티 공유',
};

const categoryColors = {
  자유게시판: 'text-[#00bba7] bg-[#e6f7f5]',
  질문게시판: 'text-pink-500 bg-pink-50',
  '파티 공유': 'text-amber-500 bg-amber-50',
  공략: 'text-blue-500 bg-blue-50',
  공지: 'text-purple-500 bg-purple-50',
};

function formatDate(dateStr) {
  return dateStr.split('T')[0].replace(/-/g, '.');
}

function renderMyPosts(postlist, data) {
  postlist.innerHTML = '';

  if (!data.length) {
    postlist.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">작성한 게시글이 없습니다.</p>`;
    return;
  }

  data.forEach((post) => {
    const category = categoryMap[post.category] ?? post.category;
    const badgeClass = categoryColors[category] || 'text-gray-500 bg-gray-100';
    const postElement = document.createElement('div');
    postElement.dataset.postId = post.post_id || post.postId;
    postElement.className = 'bg-white rounded-2xl border border-[#00bba7]/15 shadow-sm cursor-pointer hover:shadow-md transition-shadow';
    postElement.style =
      'display:flex; min-height:181px; padding:24px 24px 16px 24px; flex-direction:column; align-items:flex-start; gap:12px; flex-shrink:0; align-self:stretch;';
    postElement.innerHTML = `
      <span class="text-xs font-medium rounded-md ${badgeClass}" style="display:flex; width:80px; height:24px; padding:4px 10px; justify-content:center; align-items:center; text-align:center;">${escapeHtml(category)}</span>
      <p style="color:#101828; font-size:18px; font-style:normal; font-weight:400; line-height:28px;">${escapeHtml(post.title)}</p>
      <div class="flex items-center gap-3" style="color:#6A7282; font-size:14px; font-style:normal; font-weight:400; line-height:20px;">
        <span>${escapeHtml(post.nickname ?? post.user ?? '')}</span>
        <span>${formatDate(post.createdAt ?? post.date)}</span>
      </div>
      <div class="flex items-center gap-4 mt-3 text-xs text-[#6a7282]" style="border-top: 1.108px solid #F3F4F6; padding-top: 12px; width: 100%;">
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M1.37468 8.232C1.31912 8.08232 1.31912 7.91767 1.37468 7.768C1.91581 6.4559 2.83435 5.33402 4.01386 4.5446C5.19336 3.75517 6.58071 3.33374 8.00001 3.33374C9.41932 3.33374 10.8067 3.75517 11.9862 4.5446C13.1657 5.33402 14.0842 6.4559 14.6253 7.768C14.6809 7.91767 14.6809 8.08232 14.6253 8.232C14.0842 9.54409 13.1657 10.666 11.9862 11.4554C10.8067 12.2448 9.41932 12.6663 8.00001 12.6663C6.58071 12.6663 5.19336 12.2448 4.01386 11.4554C2.83435 10.666 1.91581 9.54409 1.37468 8.232Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.views ?? post.viewCount ?? 0}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M12.0001 8.00008C12.9934 7.02675 14.0001 5.86008 14.0001 4.33341C14.0001 3.36095 13.6138 2.42832 12.9261 1.74069C12.2385 1.05306 11.3059 0.666748 10.3334 0.666748C9.16008 0.666748 8.33341 1.00008 7.33341 2.00008C6.33341 1.00008 5.50675 0.666748 4.33341 0.666748C3.36095 0.666748 2.42832 1.05306 1.74069 1.74069C1.05306 2.42832 0.666748 3.36095 0.666748 4.33341C0.666748 5.86675 1.66675 7.03341 2.66675 8.00008L7.33341 12.6667L12.0001 8.00008Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.likes ?? post.likeCount ?? 0}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4.60008 12.0053C5.87247 12.658 7.33614 12.8348 8.72734 12.5038C10.1185 12.1729 11.3458 11.3559 12.1879 10.2001C13.0301 9.04434 13.4317 7.62579 13.3205 6.2001C13.2092 4.7744 12.5925 3.4353 11.5813 2.42412C10.5701 1.41293 9.23101 0.796155 7.80531 0.684932C6.37961 0.573708 4.96106 0.975352 3.80529 1.81749C2.64953 2.65962 1.83254 3.88686 1.50156 5.27806C1.17058 6.66926 1.34738 8.13294 2.00008 9.40532L0.666748 13.3387L4.60008 12.0053Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.comments ?? post.commentCount ?? 0}
        </span>
      </div>
    `;
    postlist.appendChild(postElement);
  });
}

export async function initMyBoard() {
  const content = document.getElementById('mypage-content');
  content.innerHTML = `
    <div id="my-postlist" style="display:flex; flex-direction:column; gap:16px;">
      <p style="text-align:center; padding:40px; color:#4a7a72;">불러오는 중...</p>
    </div>
  `;

  const postlist = document.getElementById('my-postlist');

  try {
    const res = await fetch(`${BASE_URL}/posts/my`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('게시글 불러오기 실패');
    const result = await res.json();
    const posts = result.data?.posts ?? result.data ?? [];
    renderMyPosts(postlist, posts);

    // Click on the post to go to the detail page
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
