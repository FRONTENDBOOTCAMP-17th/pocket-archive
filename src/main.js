import './style.css';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Login, initLogin } from './components/auth/login';
import { Register, initRegister } from './components/auth/register';
import { initPokedex } from './components/pokedex/pokedex';
import { initPostDetail } from './components/board/boardDetail';

const app = document.getElementById('app');

app.innerHTML = `
  ${Header()}
  <main class="flex-1 min-h-[calc(100vh-200px)] grid grid-cols-[1fr_10fr_1fr] py-10">
    <div id="content" class="col-start-2 w-full min-w-0"></div>
  </main>
  ${Footer()}
`;

initSidebar();

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
        <main class="flex-1 min-h-[calc(100vh-200px)] grid grid-cols-[1fr_10fr_1fr] py-10">
          <div id="content" class="col-start-2 w-full min-w-0"></div>
        </main>
        ${Footer()}
      `;
      initSidebar();
    }

    let page = './pages/pokedex.html';

    const pathParts = path.split('/');
    const postId = pathParts[2];

    if (path.includes('write-post')) {
      page = './pages/writePost.html';
      current = 'board';
    } else if (path.startsWith('/board/') && postId) {
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

    // HTML을 먼저 삽입한 후 초기화
    document.getElementById('content').innerHTML = html;
    window.scrollTo(0, 0);

    if (current === 'board' && page.includes('board.html')) {
      const { initBoard } = await import('./components/board/board.js');
      initBoard();
    }

    if (page.includes('pokedex.html')) {
      initPokedex();
    }

    if (page.includes('detailPost.html')) {
      initPostDetail(postId);
    }

    if (page.includes('writePost.html')) {
      const { initWrite } = await import('./components/board/write.js');
      initWrite();
    }

    if (page.includes('myparty.html')) {
      const { init } = await import('./components/myparty/myparty.js');
      init();
    }
    if (page.includes('mypage.html')) {
      const { init } = await import('./components/mypage/my.js');
      init();
    }
    setActiveMenu(current);
  } catch (err) {
    console.error(err);
  }
}

window.loadPage = loadPage;

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
    link.classList.remove('bg-[#cde5ec]', 'rounded-xl', 'font-bold');

    if (link.dataset.page === current) {
      link.classList.add('bg-[#cde5ec]', 'rounded-xl', 'font-bold');
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

  function openSidebar() {
    sidebar.classList.remove('-right-80');
    sidebar.classList.add('right-0');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closeSidebar() {
    sidebar.classList.remove('right-0');
    sidebar.classList.add('-right-80');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
  }

  // 열기
  menuBtn.addEventListener('click', openSidebar);

  // 닫기 버튼
  closeBtn?.addEventListener('click', closeSidebar);

  // 배경 클릭
  overlay.addEventListener('click', closeSidebar);
}
