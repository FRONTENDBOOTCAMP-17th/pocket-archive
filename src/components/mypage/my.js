import { initMyInfo } from './myinfo.js';
import { initMyBoard } from './myboard.js';

export function init() {
  const btnMyInfo = document.getElementById('btn-myinfo');
  const btnMyBoard = document.getElementById('btn-myboard');
  const btnLogout = document.getElementById('btn-logout');
  const btnWithdraw = document.getElementById('btn-withdraw');

  function setActiveTab(activeBtn) {
    [btnMyInfo, btnMyBoard].forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('bg-[#e6f7f5]', isActive);
      btn.classList.toggle('text-[#00bba7]', isActive);
      btn.classList.toggle('border', !isActive);
      btn.classList.toggle('border-[#00bba7]/25', !isActive);
      btn.classList.toggle('text-[#4a7a72]', !isActive);
      btn.classList.toggle('max-[1025px]:bg-[#22A9DA]/40!', isActive);
      btn.classList.toggle('max-[1025px]:bg-[#F3F4F6]!', !isActive);
    });
  }

  btnMyInfo.addEventListener('click', () => {
    setActiveTab(btnMyInfo);
    initMyInfo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btnMyBoard.addEventListener('click', () => {
    setActiveTab(btnMyBoard);
    initMyBoard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btnLogout.addEventListener('click', () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      window.location.href = '/';
    }
  });

  btnWithdraw.addEventListener('click', () => {
    if (confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      alert('회원탈퇴가 완료되었습니다.');
      window.location.href = '/';
    }
  });

  // 기본 탭: 내 정보
  initMyInfo();
}
