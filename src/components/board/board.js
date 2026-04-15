import { escapeHtml } from '../../utils/escapeHtml.js';
import { categoryMap, categoryColors, formatDate } from '../../utils/boardConstants.js';
import { loadPosts } from '../../api/post.js';
import { showModal } from '../modal.js';

// API 연결 오류 시 임시데이터로 변환
const getPosts = async () => {
  try {
    const data = await loadPosts();
    const posts = data.data?.content ?? data.data;
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const PAGE_SIZE = 8;

export async function initBoard() {
  const posts = await getPosts();
  const postlist = document.getElementById('postlist');
  if (!postlist) return;

  // 인라인 스타일 제거 및 Tailwind 클래스 적용
  postlist.className = 'flex flex-col gap-4';
  postlist.removeAttribute('style');

  const pagination = document.getElementById('pagination');
  let currentPage = 1;
  let currentData = posts;

  // Render posts
  function renderPosts(data, page = 1) {
    const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    currentData = sorted;
    currentPage = page;
    const start = (page - 1) * PAGE_SIZE;
    postlist.innerHTML = '';

    // 데이터가 없을 때의 UI 처리
    if (sorted.length === 0) {
      postlist.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 shadow-sm">
          <p class="text-lg font-medium">등록된 게시글이 없습니다.</p>
        </div>
      `;
      renderPagination([], 1);
      return;
    }

    sorted.slice(start, start + PAGE_SIZE).forEach((post) => {
      const category = categoryMap[post.category] ?? post.category;
      const badgeClass = categoryColors[category] || 'text-gray-500 bg-gray-100';
      const postElement = document.createElement('div');
      postElement.dataset.postId = post.postId;

      // 인라인 스타일을 Tailwind 클래스로 전환
      postElement.className =
        'flex flex-col items-start gap-3 p-6 bg-white rounded-2xl border border-[#00bba7]/15 shadow-sm cursor-pointer hover:shadow-md transition-all min-h-[181px] shrink-0 self-stretch';

      postElement.innerHTML = `
        <span class="flex items-center justify-center w-20 h-6 text-xs font-medium rounded-md ${badgeClass}">${escapeHtml(category)}</span>
        <p class="text-[18px] font-normal leading-7 text-[#101828]">${escapeHtml(post.title)}</p>
        <div class="flex items-center gap-3 text-sm font-normal leading-5 text-[#6A7282]">
          <span>${escapeHtml(post.nickname)}</span>
          <span>${formatDate(post.createdAt)}</span>
        </div>
        <div class="flex items-center gap-4 mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#6a7282] w-full">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M1.37468 8.232C1.31912 8.08232 1.31912 7.91767 1.37468 7.768C1.91581 6.4559 2.83435 5.33402 4.01386 4.5446C5.19336 3.75517 6.58071 3.33374 8.00001 3.33374C9.41932 3.33374 10.8067 3.75517 11.9862 4.5446C13.1657 5.33402 14.0842 6.4559 14.6253 7.768C14.6809 7.91767 14.6809 8.08232 14.6253 8.232C14.0842 9.54409 13.1657 10.666 11.9862 11.4554C10.8067 12.2448 9.41932 12.6663 8.00001 12.6663C6.58071 12.6663 5.19336 12.2448 4.01386 11.4554C2.83435 10.666 1.91581 9.54409 1.37468 8.232Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8" cy="8" r="2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${post.viewCount}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 15 14" fill="none" stroke="currentColor">
              <path d="M12.0001 8.00008C12.9934 7.02675 14.0001 5.86008 14.0001 4.33341C14.0001 3.36095 13.6138 2.42832 12.9261 1.74069C12.2385 1.05306 11.3059 0.666748 10.3334 0.666748C9.16008 0.666748 8.33341 1.00008 7.33341 2.00008C6.33341 1.00008 5.50675 0.666748 4.33341 0.666748C3.36095 0.666748 2.42832 1.05306 1.74069 1.74069C1.05306 2.42832 0.666748 3.36095 0.666748 4.33341C0.666748 5.86675 1.66675 7.03341 2.66675 8.00008L7.33341 12.6667L12.0001 8.00008Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${post.favoriteCount}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor">
              <path d="M4.60008 12.0053C5.87247 12.658 7.33614 12.8348 8.72734 12.5038C10.1185 12.1729 11.3458 11.3559 12.1879 10.2001C13.0301 9.04434 13.4317 7.62579 13.3205 6.2001C13.2092 4.7744 12.5925 3.4353 11.5813 2.42412C10.5701 1.41293 9.23101 0.796155 7.80531 0.684932C6.37961 0.573708 4.96106 0.975352 3.80529 1.81749C2.64953 2.65962 1.83254 3.88686 1.50156 5.27806C1.17058 6.66926 1.34738 8.13294 2.00008 9.40532L0.666748 13.3387L4.60008 12.0053Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${post.commentCount}
          </span>
        </div>
      `;
      postlist.appendChild(postElement);
    });

    renderPagination(data, page);
  }

  // Render pagination
  function renderPagination(data, page) {
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const isMobile = window.innerWidth <= 391;
    pagination.innerHTML = '';

    // previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '이전';
    prevBtn.className = `flex items-center justify-center px-4 py-2 text-sm rounded-lg border transition-all ${
      page === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#e6f7f5]'
    }`;
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) renderPosts(currentData, currentPage - 1);
      window.scrollTo(0, 0);
    });
    pagination.appendChild(prevBtn);

    if (isMobile) {
      // Mobile: Show only current page number
      const pageBtn = document.createElement('button');
      pageBtn.textContent = page;
      pageBtn.className = 'flex items-center justify-center w-10 h-10 text-sm rounded-lg transition-all bg-[#05B29F] text-white font-medium shrink-0';
      pagination.appendChild(pageBtn);
    } else {
      // Desktop: Show only 3 page numbers
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages, page + 1);
      for (let i = start; i <= end; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `flex items-center justify-center w-10 h-10 text-sm rounded-lg transition-all shrink-0 ${
          i === page ? 'bg-[#05B29F] text-white font-medium' : 'border border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#e6f7f5]'
        }`;
        pageBtn.addEventListener('click', () => {
          renderPosts(currentData, i);
          window.scrollTo(0, 0);
        });
        pagination.appendChild(pageBtn);
      }
    }

    // next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '다음';
    nextBtn.className = `flex items-center justify-center px-4 py-2 text-sm rounded-lg border transition-all ${
      page === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#e6f7f5]'
    }`;
    nextBtn.disabled = page === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) renderPosts(currentData, currentPage + 1);
      window.scrollTo(0, 0);
    });
    pagination.appendChild(nextBtn);
  }

  // Re-render pagination when screen size changes
  window.addEventListener('resize', () => renderPagination(currentData, currentPage));

  // Search
  document.getElementById('search-btn')?.addEventListener('click', () => {
    const keyword = document.getElementById('search-input').value.trim().toLowerCase();
    if (!keyword) {
      renderPosts(posts);
      return;
    }
    const filterType = document.getElementById('filter-type')?.value ?? 'title';
    const filtered = posts.filter((post) => {
      if (filterType === 'author') return post.nickname.toLowerCase().includes(keyword);
      return post.title.toLowerCase().includes(keyword);
    });
    renderPosts(filtered);
  });

  document.getElementById('search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('search-btn').click();
  });

  // Category filter (all, free bulletin board, question board, party sharing, strategy)
  const categoryButtons = document.querySelectorAll('.category-btn');

  function setActiveCategoryButton(activeButton) {
    categoryButtons.forEach((button) => {
      const isActive = button === activeButton;

      // 스타일 클래스 토글
      button.classList.toggle('bg-[#e6f7f5]', isActive);
      button.classList.toggle('text-[#00bba7]', isActive);
      button.classList.toggle('border', !isActive);
      button.classList.toggle('border-[#00bba7]/25', !isActive);
      button.classList.toggle('text-[#4a7a72]', !isActive);

      // 모바일 스타일
      button.classList.toggle('max-[1025px]:bg-[#05B29F]!', isActive);
      button.classList.toggle('max-[1025px]:text-white!', isActive);
      button.classList.toggle('max-[1025px]:bg-[#F3F4F6]!', !isActive);
      button.classList.toggle('max-[1025px]:border-none!', !isActive);
    });
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      setActiveCategoryButton(btn);

      if (category === '전체') {
        renderPosts(posts);
      } else {
        const filtered = posts.filter((post) => (categoryMap[post.category] ?? post.category) === category);
        renderPosts(filtered);
      }
    });
  });

  renderPosts(posts);

  // Category drag-to-scroll
  const categoryScroll = document.getElementById('category-scroll');
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  categoryScroll.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - categoryScroll.offsetLeft;
    scrollLeft = categoryScroll.scrollLeft;
    categoryScroll.style.cursor = 'grabbing';
  });

  categoryScroll.addEventListener('mouseleave', () => {
    isDragging = false;
    categoryScroll.style.cursor = '';
  });

  categoryScroll.addEventListener('mouseup', () => {
    isDragging = false;
    categoryScroll.style.cursor = '';
  });

  categoryScroll.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categoryScroll.offsetLeft;
    categoryScroll.scrollLeft = scrollLeft - (x - startX);
  });

  // Click on the post to go to the detail page
  postlist.addEventListener('click', (e) => {
    const postElement = e.target.closest('[data-post-id]');
    if (!postElement) return;
    const postId = postElement.dataset.postId;
    if (postId) {
      history.pushState(null, '', `/board/${postId}`);
      window.loadPage();
    }
  });

  // Go to the writing page when you click the writing button (only when there is a local token)
  document.getElementById('write-post-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (token) {
      history.pushState(null, '', '/write-post');
      window.loadPage();
    } else {
      //버튼 색 바꾸고싶으면 뒤에 변수 빼셈
      await showModal('비로그인 상태', '로그인이 필요한 서비스 입니다.', 'danger');
      history.pushState(null, '', '/login');
      window.loadPage();
    }
  });
}
