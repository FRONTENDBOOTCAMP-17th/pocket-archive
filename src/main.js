import { Header } from './components/header.js';
import { Footer } from './components/footer.js';

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
    let page = './pages/pokedex.html';
    let current = 'home';

    if (path.includes('myparty')) {
      page = './pages/myparty.html';
      current = 'myparty';
    }
    if (path.includes('board')) {
      page = './pages/board.html';
      current = 'board';
    }
    if (path.includes('mypage')) {
      page = './pages/mypage.html';
      current = 'mypage';
    }

    const res = await fetch(page);
    const html = await res.text();

    if (current === 'board') {
      import('./components/board.js');
    }

    if (current === 'mypage') {
      import('./components/mypage/my.js');
    }

    document.getElementById('content').innerHTML = html;

    setActiveMenu(current);
  } catch (err) {
    console.error(err);
  }
}

loadPage();

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
