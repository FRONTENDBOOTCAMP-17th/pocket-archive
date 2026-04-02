// dummy data
const dummyData = [
  {
    id: 1,
    title: '카비곤 육성 팁 공유합니다!',
    user: '트레이너A',
    category: '자유게시판',
    date: '2026-03-27T14:23:00',
    views: 1234,
    likes: 89,
    comments: 23,
  },
  {
    id: 2,
    title: '레전드 포켓몬 추천해주세요',
    user: '피카츄마스터',
    category: '자유게시판',
    date: '2026-03-26T09:11:00',
    views: 892,
    likes: 45,
    comments: 31,
  },
  {
    id: 3,
    title: '뮤츠 잡았어요!!!',
    user: '포켓마스터',
    category: '자유게시판',
    date: '2026-03-25T21:47:00',
    views: 2341,
    likes: 156,
    comments: 67,
  },
  {
    id: 4,
    title: '불꽃타입 vs 물타입 어느게 더 좋나요?',
    user: '초보트레이너',
    category: '질문게시판',
    date: '2026-03-24T16:05:00',
    views: 567,
    likes: 34,
    comments: 42,
  },
  {
    id: 5,
    title: '진화 타이밍 질문',
    user: '파이리조아',
    category: '질문게시판',
    date: '2026-03-23T11:30:00',
    views: 445,
    likes: 28,
    comments: 19,
  },
  {
    id: 6,
    title: '내가 만든 최강 덱 자랑',
    user: '파티마스터',
    category: '파티 공유',
    date: '2026-03-22T18:52:00',
    views: 1567,
    likes: 234,
    comments: 56,
  },
  {
    id: 7,
    title: '이브이 진화형 중에 뭐가 제일 예쁨?',
    user: '이브이러브',
    category: '자유게시판',
    date: '2026-03-21T13:08:00',
    views: 2103,
    likes: 187,
    comments: 94,
  },
  {
    id: 8,
    title: '포켓몬 배틀 초보 가이드',
    user: '배틀킹',
    category: '공략',
    date: '2026-03-20T08:44:00',
    views: 3421,
    likes: 412,
    comments: 78,
  },
  {
    id: 9,
    title: '포켓몬스터 레전드 아르세우스 공략 공유합니다.',
    user: '배틀킹',
    category: '공략',
    date: '2026-03-19T20:17:00',
    views: 250,
    likes: 30,
    comments: 15,
  },
  {
    id: 10,
    title: '나는야 이규화 여기서 제일 잘생겼지.',
    user: '이규화',
    category: '자유게시판',
    date: '2026-04-02T12:00:00',
    views: 9999,
    likes: 9999,
    comments: 9999,
  },
];

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

// Dummy data output
const postlist = document.querySelector('postlist');
postlist.style = 'display:flex; flex-direction:column; gap:16px;';
const pagination = document.getElementById('pagination');
const PAGE_SIZE = 6;
let currentPage = 1;
let currentData = dummyData;

// Render posts
function renderPosts(data, page = 1) {
  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  currentData = sorted;
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  postlist.innerHTML = '';
  sorted.slice(start, start + PAGE_SIZE).forEach((post) => {
    const badgeClass = categoryColors[post.category] || 'text-gray-500 bg-gray-100';
    const postElement = document.createElement('div');
    postElement.className = 'bg-white rounded-2xl border border-[#00bba7]/15 shadow-sm cursor-pointer hover:shadow-md transition-shadow';
    postElement.style =
      'display:flex; height:181px; padding:24px 24px 0 24px; flex-direction:column; align-items:flex-start; gap:12px; flex-shrink:0; align-self:stretch;';
    postElement.innerHTML = `
      <span class="text-xs font-medium rounded-md ${badgeClass}" style="display:flex; width:80px; height:24px; padding:4px 10px; justify-content:center; align-items:center; text-align:center;">${post.category}</span>
      <p style="color:#101828; font-size:18px; font-style:normal; font-weight:400; line-height:28px;">${post.title}</p>
      <div class="flex items-center gap-3" style="color:#6A7282; font-size:14px; font-style:normal; font-weight:400; line-height:20px;">
        <span style="color:#6A7282; font-size:14px; font-style:normal; font-weight:400; line-height:20px;">${post.user}</span>
        <span style="color:#6A7282; font-size:14px; font-style:normal; font-weight:400; line-height:20px;">${formatDate(post.date)}</span>
      </div>
      <div class="flex items-center gap-4 mt-3 text-xs text-[#6a7282]">
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M1.37468 8.232C1.31912 8.08232 1.31912 7.91767 1.37468 7.768C1.91581 6.4559 2.83435 5.33402 4.01386 4.5446C5.19336 3.75517 6.58071 3.33374 8.00001 3.33374C9.41932 3.33374 10.8067 3.75517 11.9862 4.5446C13.1657 5.33402 14.0842 6.4559 14.6253 7.768C14.6809 7.91767 14.6809 8.08232 14.6253 8.232C14.0842 9.54409 13.1657 10.666 11.9862 11.4554C10.8067 12.2448 9.41932 12.6663 8.00001 12.6663C6.58071 12.6663 5.19336 12.2448 4.01386 11.4554C2.83435 10.666 1.91581 9.54409 1.37468 8.232Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.views}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M12.0001 8.00008C12.9934 7.02675 14.0001 5.86008 14.0001 4.33341C14.0001 3.36095 13.6138 2.42832 12.9261 1.74069C12.2385 1.05306 11.3059 0.666748 10.3334 0.666748C9.16008 0.666748 8.33341 1.00008 7.33341 2.00008C6.33341 1.00008 5.50675 0.666748 4.33341 0.666748C3.36095 0.666748 2.42832 1.05306 1.74069 1.74069C1.05306 2.42832 0.666748 3.36095 0.666748 4.33341C0.666748 5.86675 1.66675 7.03341 2.66675 8.00008L7.33341 12.6667L12.0001 8.00008Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.likes}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4.60008 12.0053C5.87247 12.658 7.33614 12.8348 8.72734 12.5038C10.1185 12.1729 11.3458 11.3559 12.1879 10.2001C13.0301 9.04434 13.4317 7.62579 13.3205 6.2001C13.2092 4.7744 12.5925 3.4353 11.5813 2.42412C10.5701 1.41293 9.23101 0.796155 7.80531 0.684932C6.37961 0.573708 4.96106 0.975352 3.80529 1.81749C2.64953 2.65962 1.83254 3.88686 1.50156 5.27806C1.17058 6.66926 1.34738 8.13294 2.00008 9.40532L0.666748 13.3387L4.60008 12.0053Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${post.comments}
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
  pagination.innerHTML = '';

  // previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '이전';
  prevBtn.className = `text-sm rounded-lg border transition-colors ${
    page === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#e6f7f5]'
  }`;
  prevBtn.style = 'display:flex; padding:7px 17px 11px 17px; justify-content:center; align-items:center;';
  prevBtn.disabled = page === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) renderPosts(currentData, currentPage - 1);
  });
  pagination.appendChild(prevBtn);

  // page number
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = `text-sm rounded-lg transition-colors ${
      i === page ? 'bg-[#22A9DA]/40 text-white font-medium' : 'border border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#22A9DA]/40'
    }`;
    pageBtn.style = 'display:flex; width:40.813px; padding:6px 0 10px 0; justify-content:center; align-items:center; flex-shrink:0;';
    pageBtn.addEventListener('click', () => renderPosts(currentData, i));
    pagination.appendChild(pageBtn);
  }

  // next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음';
  nextBtn.className = `text-sm rounded-lg border transition-colors ${
    page === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#00bba7]/30 text-[#4a7a72] hover:bg-[#e6f7f5]'
  }`;
  nextBtn.style = 'display:flex; padding:7px 17px 11px 17px; justify-content:center; align-items:center;';
  nextBtn.disabled = page === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) renderPosts(currentData, currentPage + 1);
  });
  pagination.appendChild(nextBtn);
}

// Search
document.getElementById('search-btn')?.addEventListener('click', () => {
  const keyword = document.getElementById('search-input').value.trim().toLowerCase();
  if (!keyword) {
    renderPosts(dummyData);
    return;
  }
  const filtered = dummyData.filter((post) => post.title.toLowerCase().includes(keyword) || post.user.toLowerCase().includes(keyword));
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

    button.classList.toggle('bg-[#e6f7f5]', isActive);
    button.classList.toggle('text-[#00bba7]', isActive);
    button.classList.toggle('border', !isActive);
    button.classList.toggle('border-[#00bba7]/25', !isActive);
    button.classList.toggle('text-[#4a7a72]', !isActive);
  });
}

categoryButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    setActiveCategoryButton(btn);

    if (category === '전체') {
      renderPosts(dummyData);
    } else {
      const filtered = dummyData.filter((post) => post.category === category);
      renderPosts(filtered);
    }
  });
});

renderPosts(dummyData);
