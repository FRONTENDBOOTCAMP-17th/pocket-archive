export function Header() {
  return `
    <header class="header">
  <div class="header-inner">
    <div class="logo">P 포켓아카이브</div>

    <nav class="nav">
      <a href="/" data-page="home">포켓몬 도감</a>
      <a href="/board" data-page="board">게시판</a>
      <a href="/myparty" data-page="myparty">나의 파티 만들기</a>
      <a href="/mypage" data-page="mypage">마이페이지</a>
    </nav>

    <div class="header-icons">
      <button class="login-btn">로그인</button>

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

  <div class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <span>메뉴</span>
      <button id="closeBtn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M17.9925 5.99707L5.9975 17.9921" stroke="#364153" stroke-width="1.99917" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.9975 5.99707L17.9925 17.9921" stroke="#364153" stroke-width="1.99917" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>    

    </div>

    <div class="sidebar-nav">
        <a href="/" data-page="home">포켓몬 도감</a>
        <a href="/board" data-page="board">게시판</a>
        <a href="/myparty" data-page="myparty">나의 파티 만들기</a>
        <a href="/mypage" data-page="mypage">마이페이지</a>
    </div>
  </div>

  <div class="overlay" id="overlay"></div>
</header>

  `;
}

