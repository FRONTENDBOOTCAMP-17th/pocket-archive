import './style.css';
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { Login, initLogin } from './components/(Auth)/login.js';
import { Register, initRegister } from './components/(Auth)/register.js';
import { initPokedex } from './components/pokedex/pokedex.js';
import { initPostDetail } from './components/board/boardDetail.js';

console.log('포켓아카이브 실행중');

const app = document.getElementById('app');

app.innerHTML = `
  ${Header()}
  <main class="main">
    <div id="content" class="content"></div>
  </main>
  ${Footer()}
`;

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });
}

async function loadPage() {
  try {
    const path = window.location.pathname;
    let current = 'home';

    if (path.includes('login')) {
      app.innerHTML = Login();
      initLogin();
      return;
    }

    if (path.includes('register')) {
      app.innerHTML = Register();
      initRegister();
      return;
    }

    if (!document.getElementById('content')) {
      app.innerHTML = `
        ${Header()}
        <main class="main">
          <div id="content" class="content"></div>
        </main>
        ${Footer()}
      `;
      initSidebar();
    }

    let page = './pages/pokedex.html';

    const pathParts = path.split('/');
    const postId = pathParts[2];

    if (path.startsWith('/board/') && postId) {
      page = '/pages/detailPost.html';
      current = 'board';
    } else if (path.includes('board')) {
      page = './pages/board.html';
      current = 'board';
    }
    if (path.includes('myparty')) {
      page = './pages/myparty.html';
      current = 'myparty';
    }
    if (path.includes('mypage')) {
      page = './pages/mypage.html';
      current = 'mypage';
    }

    const res = await fetch(page);
    if (!res.ok) {
      console.error('HTML 파일을 찾을 수 없습니다:', page);
      return;
    }
    const html = await res.text();

    if (current === 'board') {
      import('./components/board.js');
    }

    if (current === 'mypage') {
      import('./components/mypage/my.js');
    }

    if (page.includes('pokedex.html')) {
      initPokedex();
    }
    // if (page.includes("detailPost.html")) {
    //   // const postId = new URLSearchParams(window.location.search).get("id");
    //   //테스트용으로 2번 게시물을 불러옴 수정 꼭!! 해야함!!! postId로!!!
    //   console.log(`2번 게시글 상세페이지 로드 중...`);
    //   initPostDetail(2);
    // }
    setTimeout(() => {
      if (page.includes('detailPost.html')) {
        initPostDetail(postId || 2);
      }
    }, 2);
    document.getElementById('content').innerHTML = html;

    if (page.includes('myparty.html')) {
      const { init } = await import('./scripts/myparty.js');
      init();
    }
    if (page.includes("mypage.html")) {
      const { init } = await import("./components/mypage/my.js");
      init();
    }
    setActiveMenu(current);
  } catch (err) {
    console.error(err);
  }
}

loadPage();

window.addEventListener('popstate', loadPage);

function setActiveMenu(current) {
  //네비게이션 페이지 활성화
  const navLinks = document.querySelectorAll('.nav a');

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.dataset.page === current) {
      link.classList.add('active');
    }
  });

  //사이드바 페이지 활성화
  const links = document.querySelectorAll('.sidebar-nav a');

  links.forEach((link) => {
    link.classList.remove('active');

    if (link.dataset.page === current) {
      link.classList.add('active');
    }
  });
}

//햄버거 버튼 활성화 시 사이드 메뉴바 활성화
function initSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');

  if (!menuBtn || !sidebar || !overlay) return;

  // 열기
  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });

  // 닫기 버튼
  closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // 배경 클릭
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
}

initSidebar();
