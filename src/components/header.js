import { showModal } from './modal';

export function Header() {
  const isLoggedin = localStorage.getItem('token');

  return `
    <header class="header">
    <div class="header-inner">
    <a href="/" data-page="home" class="logo"><img src="/assets/pocketarchive.png" alt="포켓아카이브" /> 포켓아카이브</a>

    <nav class="nav">
      <a href="/" data-page="home">포켓몬 도감</a>
      <a href="/board" data-page="board">게시판</a>
      <a href="/myparty" data-page="myparty">나의 파티 만들기</a>
      <a href="/mypage" data-page="mypage">마이페이지</a>
    </nav>

    <div class="header-icons">
      ${isLoggedin ? `<button class="logout-btn">로그아웃</button>` : `<button class="login-btn">로그인</button>`}

      <button class="icon-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M9.16 15.82C12.84 15.82 15.82 12.84 15.82 9.16C15.82 5.48 12.84 2.49 9.16 2.49C5.48 2.49 2.49 5.48 2.49 9.16C2.49 12.84 5.48 15.82 9.16 15.82Z"
            stroke="white"
            stroke-width="1.6"
          />
          <path
            d="M17.49 17.49L13.91 13.91"
            stroke="white"
            stroke-width="1.6"
          />
        </svg>
      </button>

      <button class="menu-btn" id="menuBtn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20" stroke="white" stroke-width="2" />
          <path d="M4 12H20" stroke="white" stroke-width="2" />
          <path d="M4 18H20" stroke="white" stroke-width="2" />
        </svg>
      </button>
    </div>
  </div>

  <div class="fixed top-0 -right-80 w-80 h-screen bg-white shadow-[0_25px_50px_rgba(0,0,0,0.25)] transition-all duration-300 z-40 flex flex-col" id="sidebar">
    <div class="flex justify-between p-5 font-bold border-b border-gray-200">
      <span>메뉴</span>
      <button id="closeBtn" class="bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17.9925 5.99707L5.9975 17.9921" stroke="#364153" stroke-width="1.99917" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.9975 5.99707L17.9925 17.9921" stroke="#364153" stroke-width="1.99917" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div class="sidebar-nav">
        <a href="/" data-page="home" class="py-4 px-5 block no-underline text-[#333]">포켓몬 도감</a>
        <a href="/board" data-page="board" class="py-4 px-5 block no-underline text-[#333]">게시판</a>
        <a href="/myparty" data-page="myparty" class="py-4 px-5 block no-underline text-[#333]">나의 파티 만들기</a>
        <a href="/mypage" data-page="mypage" class="py-4 px-5 block no-underline text-[#333]">마이페이지</a>
        <div class="flex flex-row">
          <img src="https://img.icons8.com/?size=100&id=vQOFSUMXPpGA&format=png&color=000000" alt="Login Icon" class="w-6 h-6 my-3 ml-3"/>
          ${
            isLoggedin
              ? `<a class="logout-btn cursor-pointer p-3">로그아웃</a>`
              : `<a href="/login" data-page="login" class="text-[#e7000b] p-3">로그인</a>`
          }
        </div>
    </div>
  </div>

  <div class="fixed top-0 left-0 w-full h-full bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300 z-10" id="overlay"></div>
</header>
  `;
}

// 로그인 페이지 이동
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('login-btn')) {
    history.pushState(null, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
});

// 로그아웃
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('logout-btn')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();

    // 로그아웃 후 홈으로 이동
    window.location.href = '/';
  }
});

// 나의 파티 만들기 - 로그인 필요
document.addEventListener('click', async (e) => {
  if (e.target.closest('a[data-page="myparty"]')) {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      e.preventDefault();
      await showModal('비로그인 상태', '나의 파티 만들기 페이지는 로그인 후 이용 가능합니다.');
      history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }
});

// 마이페이지 - 로그인 필요
document.addEventListener('click', async (e) => {
  if (e.target.closest('a[data-page="mypage"]')) {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      e.preventDefault();
      await showModal('비로그인 상태', '마이페이지는 로그인 후 이용 가능합니다.');

      history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }
});
