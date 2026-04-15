import { login } from '../../api/user.js';
import { Login } from './loginUI.js';
import { showModal } from '../modal.js';
export { Login };

export function initLogin() {
  var pwd = document.getElementById('pwd');
  var eye = document.getElementById('eye');

  eye.addEventListener('click', function () {
    eye.classList.toggle('active');
    pwd.type = pwd.type === 'password' ? 'text' : 'password';

    const slash = document.getElementById('eye-slash');
    slash.style.strokeDashoffset = eye.classList.contains('active') ? '0' : '24';
  });

  document.form1.addEventListener('submit', function (e) {
    e.preventDefault();
    checkStuff();
  });

  document.getElementById('registerBtn').addEventListener('click', function () {
    history.pushState(null, '', '/register');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

async function checkStuff() {
  var login_id = document.form1.login_id;
  var password = document.form1.password;
  var msg = document.getElementById('msg');

  if (login_id.value === '') {
    msg.style.display = 'block';
    msg.textContent = '아이디를 입력해주세요';
    login_id.focus();
    return;
  } else {
    msg.textContent = '';
  }

  if (password.value === '') {
    msg.style.display = 'block';
    msg.textContent = '비밀번호를 입력해주세요';
    password.focus();
    return;
  } else {
    msg.textContent = '';
  }

  try {
    const result = await login(login_id.value, password.value);
    const token = result.data?.token;
    if (!token) throw new Error('토큰 정보 없음');
    localStorage.setItem('token', token);
    const userId = result.data?.userId ?? result.data?.id;
    if (userId != null) localStorage.setItem('userId', String(userId));
    location.replace('/');
  } catch (error) {
    showLoginError('로그인 정보가 일치하지 않습니다.');
    console.error(error);
  }
}

export async function showLoginError(message) {
  await showModal('오류', message, 'danger');
}

export function redirectToHome() {
  history.pushState(null, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}
