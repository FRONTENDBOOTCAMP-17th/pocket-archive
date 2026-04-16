import { register, checkNickname, checkLoginId } from '../../api/user.js';
import { Register } from './registerUI.js';
import { showModal } from '../modal.js';
import { guardFn } from '../../utils/guardFn.js';
export { Register };

export function initRegister() {
  let validNickname = false;
  let validId = false;

  const pwd = document.getElementById('register_password');
  const eye = document.getElementById('eye');
  const pwd2 = document.getElementById('register_password_confirm');
  const eye2 = document.getElementById('eye2');
  const id = document.getElementById('register_id');
  const nickname = document.getElementById('register_nickname');

  eye.onclick = function () {
    eye.classList.toggle('active');
    pwd.type = pwd.type === 'password' ? 'text' : 'password';

    const slash = document.getElementById('eye-slash');
    slash.style.strokeDashoffset = eye.classList.contains('active') ? '0' : '24';
  };

  eye2.onclick = function () {
    eye2.classList.toggle('active');
    pwd2.type = pwd2.type === 'password' ? 'text' : 'password';

    const slash2 = document.getElementById('eye-slash2');
    slash2.style.strokeDashoffset = eye2.classList.contains('active') ? '0' : '24';
  };

  let isSubmitting = false;

  document.registerForm.onsubmit = async function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!checkRegister()) return;

    isSubmitting = true;
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) signupBtn.disabled = true;

    try {
      const result = await register(id.value, nickname.value, pwd.value);
      const token = result.data?.token;
      const userId = result.data?.user?.userId;

      if (!token) throw new Error('토큰 정보 없음');
      localStorage.setItem('token', token);
      if (userId != null) localStorage.setItem('userId', String(userId));
      await showModal('회원가입 성공', '메인페이지로 이동합니다.');
      location.replace('/');
    } catch (error) {
      console.error(error);
      await showModal('오류', '회원가입에 실패했어요. 다시 시도해주세요.', 'danger');
    }
  };

  document.getElementById('loginBtn').onclick = function () {
    history.pushState(null, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  document.getElementById('checkNicknameBtn').onclick = guardFn(async () => {
    const nicknameVal = nickname.value.trim();
    if (!nicknameVal) return;
    try {
      const result = await checkNickname(nicknameVal);
      const exists = result.data.exists;
      validNickname = !exists;
      showFieldMsg('nickname-check-msg', exists ? '이미 사용 중인 닉네임입니다.' : '사용 가능한 닉네임입니다.', exists ? 'red' : 'green');
    } catch (error) {
      console.error(error);
    }
    updateButtonState();
  });

  document.getElementById('checkIdBtn').onclick = guardFn(async () => {
    const idVal = id.value.trim();
    if (!idVal) return;
    try {
      const result = await checkLoginId(idVal);
      const exists = result.data.exists;
      validId = !exists;
      showFieldMsg('id-check-msg', exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.', exists ? 'red' : 'green');
    } catch (error) {
      console.error(error);
    }
    updateButtonState();
  });

  nickname.oninput = () => {
    validNickname = false;
    showFieldMsg('nickname-check-msg', '', '');
    updateButtonState();
  };

  id.oninput = () => {
    validId = false;
    showFieldMsg('id-check-msg', '', '');
    updateButtonState();
  };

  pwd.oninput = updateButtonState;
  pwd2.oninput = updateButtonState;

  function showFieldMsg(elementId, text, color) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.style.color = color === 'green' ? '#00BBA7' : color === 'red' ? '#ef4444' : '';
    el.classList.toggle('hidden', !text);
  }

  function updateButtonState() {
    const signupBtn = document.getElementById('signupBtn');
    const allFilled = nickname.value.trim() && id.value.trim() && pwd.value && pwd2.value;
    signupBtn.disabled = !(validNickname && validId && allFilled);
  }
}

function checkRegister() {
  var nickname = document.registerForm.register_nickname;
  var register_id = document.registerForm.register_id;
  var password = document.registerForm.register_password;
  var passwordConfirm = document.registerForm.register_password_confirm;
  var msg = document.getElementById('register-msg');

  if (nickname.value === '') {
    msg.classList.remove('hidden');
    msg.textContent = '닉네임을 입력해주세요';
    nickname.focus();
    return false;
  } else {
    msg.textContent = '';
  }

  if (register_id.value === '') {
    msg.classList.remove('hidden');
    msg.textContent = '아이디를 입력해주세요';
    register_id.focus();
    return false;
  } else {
    msg.textContent = '';
  }

  if (password.value === '') {
    msg.classList.remove('hidden');
    msg.textContent = '비밀번호를 입력해주세요';
    password.focus();
    return false;
  } else {
    msg.textContent = '';
  }

  if (passwordConfirm.value === '') {
    msg.classList.remove('hidden');
    msg.textContent = '비밀번호 확인을 입력해주세요';
    passwordConfirm.focus();
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    msg.classList.remove('hidden');
    msg.textContent = '비밀번호가 일치하지 않습니다';
    passwordConfirm.focus();
    return false;
  }

  msg.classList.add('hidden');
  msg.textContent = '';
  return true;
}
