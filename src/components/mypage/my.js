import { withdraw } from '../../api/user.js';
import { initMyInfo } from './myinfo.js';
import { initMyBoard } from './myboard.js';
import { initMyPocketmon } from './mypocketmon.js';

export function init() {
  const btnMyInfo = document.getElementById('btn-myinfo');
  const btnMyBoard = document.getElementById('btn-myboard');
  const btnPokemon = document.getElementById('btn-pokemon');
  const btnLogout = document.getElementById('btn-logout');
  const btnWithdraw = document.getElementById('btn-withdraw');

  const tabBtns = [btnMyInfo, btnMyBoard, btnPokemon].filter(Boolean);

  function setActiveTab(activeBtn) {
    tabBtns.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('bg-[#e6f7f5]', isActive);
      btn.classList.toggle('text-[#00bba7]', isActive);
      btn.classList.toggle('border', !isActive);
      btn.classList.toggle('border-[#00bba7]/25', !isActive);
      btn.classList.toggle('text-[#4a7a72]', !isActive);
      btn.classList.toggle('max-[1084px]:bg-[#22A9DA]/40!', isActive);
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

  btnPokemon.addEventListener('click', () => {
    setActiveTab(btnPokemon);
    initMyPocketmon();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 로그아웃 모달
  const logoutModal = document.getElementById('logout-modal');
  btnLogout.addEventListener('click', () => {
    logoutModal.classList.remove('hidden');
    logoutModal.classList.add('flex');
  });
  document.getElementById('logout-modal-cancel').addEventListener('click', () => {
    logoutModal.classList.add('hidden');
    logoutModal.classList.remove('flex');
  });
  document.getElementById('logout-modal-overlay').addEventListener('click', () => {
    logoutModal.classList.add('hidden');
    logoutModal.classList.remove('flex');
  });
  document.getElementById('logout-modal-confirm').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });

  // 회원탈퇴 모달
  const withdrawModal = document.getElementById('withdraw-modal');
  const withdrawMsg = document.getElementById('withdraw-msg');
  const withdrawPassword = document.getElementById('withdraw-password');

  function closeWithdrawModal() {
    withdrawModal.classList.add('hidden');
    withdrawModal.classList.remove('flex');
    withdrawPassword.value = '';
    withdrawMsg.classList.add('hidden');
    withdrawMsg.textContent = '';
  }

  btnWithdraw.addEventListener('click', () => {
    withdrawModal.classList.remove('hidden');
    withdrawModal.classList.add('flex');
    withdrawPassword.focus();
  });
  document.getElementById('withdraw-modal-cancel').addEventListener('click', closeWithdrawModal);
  document.getElementById('withdraw-modal-overlay').addEventListener('click', closeWithdrawModal);
  document.getElementById('withdraw-modal-confirm').addEventListener('click', async () => {
    const password = withdrawPassword.value.trim();
    if (!password) {
      withdrawMsg.textContent = '비밀번호를 입력해주세요.';
      withdrawMsg.classList.remove('hidden');
      return;
    }
    try {
      const res = await withdraw(password);
      if (res.status === 401) {
        withdrawMsg.textContent = '비밀번호가 일치하지 않습니다.';
        withdrawMsg.classList.remove('hidden');
        return;
      }
      if (!res.ok) throw new Error('탈퇴 실패');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      withdrawMsg.textContent = '탈퇴 처리 중 오류가 발생했습니다.';
      withdrawMsg.classList.remove('hidden');
    }
  });

  // 기본 탭: 내 정보
  initMyInfo();
}
