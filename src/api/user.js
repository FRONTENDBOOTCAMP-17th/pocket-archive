import { BASE_URL } from './config.js';

function getToken() {
  return localStorage.getItem('token') || '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ── Auth ──────────────────────────────────────────────

export async function login(loginId, password) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password }),
  });
  if (!res.ok) throw new Error('로그인 실패');
  return res.json();
}

export async function register(loginId, nickname, password) {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, nickname, password }),
  });
  if (!res.ok) throw new Error('회원가입 실패');
  return res.json();
}

export async function checkNickname(nickname) {
  const res = await fetch(`${BASE_URL}/user/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error('닉네임 중복확인 실패');
  return res.json();
}

export async function checkLoginId(loginId) {
  const res = await fetch(`${BASE_URL}/user/check-login-id?loginId=${encodeURIComponent(loginId)}`);
  if (!res.ok) throw new Error('아이디 중복확인 실패');
  return res.json();
}

// ── User (인증 필요) ──────────────────────────────────

export async function getMe() {
  const res = await fetch(`${BASE_URL}/user/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('유저 정보 불러오기 실패');
  return res.json();
}

export async function updateMe(nickname, introduce) {
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ nickname, introduce }),
  });
  if (!res.ok) throw new Error('저장 실패');
  return res.json();
}

export async function withdraw(password) {
  const res = await fetch(`${BASE_URL}/user/me/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ password }),
  });
  return res; // 상태코드(401 등) 호출부에서 직접 처리
}

// ── Posts / Pocketmons (인증 필요) ────────────────────

export async function getMyPosts() {
  const res = await fetch(`${BASE_URL}/posts/my`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('게시글 불러오기 실패');
  return res.json();
}

export async function getMyPocketmons() {
  const res = await fetch(`${BASE_URL}/pocketmons`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('포켓몬 불러오기 실패');
  return res.json();
}
