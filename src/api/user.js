import { BASE_URL } from './config.js';

export function getToken() {
  return localStorage.getItem('token') || '';
}

export function authHeaders() {
  return {
    'Content-Type': 'application/json', 
    Authorization: `Bearer ${getToken()}`,
  };
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



// ── 나만의 파티 만들기 ──────────────────────────────────────────────
// ─── 북마크 (pocketmons) ─────────────────────────────────────
export async function fetchBookmarkedPokemons() {
  const res = await fetch(`${BASE_URL}/pocketmons`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("북마크 불러오기 실패");
  const result = await res.json();
  return result.data.myPocketmons; // 숫자 ID 배열
}

export async function deleteBookmark(id) {
  const res = await fetch(`${BASE_URL}/pocketmons/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("북마크 삭제 실패");
}

// ─── 파티 (party) ────────────────────────────────────────────
export async function fetchPartyPresets() {
  const res = await fetch(`${BASE_URL}/party`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`파티 목록 조회 실패: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function postPartyPreset(presetName, pokemonIds, gender) {
  const res = await fetch(`${BASE_URL}/party`, {
    method: "POST",
    headers: authHeaders(),  
    body: JSON.stringify({ deckname: presetName, pocketmons: pokemonIds, gender }),
  });
  if (!res.ok) throw new Error(`파티 저장 실패: ${res.status}`);
}

export async function putPartyPreset(apiId, presetName, pokemonIds, gender) {
  const res = await fetch(`${BASE_URL}/party/${apiId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ deckname: presetName, pocketmons: pokemonIds, gender: gender}),
  });
  if (!res.ok) throw new Error(`파티 수정 실패: ${res.status}`);
  return res.json();
}

export async function deletePartyPreset(apiId) {
  const res = await fetch(`${BASE_URL}/party/${apiId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`파티 삭제 실패: ${res.status}`);
}