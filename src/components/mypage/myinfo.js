const BASE_URL = import.meta.env.VITE_BASE_URL;

function getToken() {
  return localStorage.getItem('token') || '';
}

export async function initMyInfo() {
  const content = document.getElementById('mypage-content');

  content.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">불러오는 중...</p>`;

  let user = {};
  let postCount = 0;
  let catchCount = 0;

  try {
    const token = getToken();
    const [userRes, postsRes, catchRes] = await Promise.all([
      fetch(`${BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/posts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/pocketmons`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!userRes.ok) throw new Error('유저 정보 불러오기 실패');
    const userResult = await userRes.json();
    user = userResult.data;

    if (postsRes.ok) {
      const postsResult = await postsRes.json();
      const posts = postsResult.data?.posts ?? postsResult.data ?? [];
      postCount = Array.isArray(posts) ? posts.length : 0;
    }

    if (catchRes.ok) {
      const catchResult = await catchRes.json();
      const catches = catchResult.data?.myPocketmons ?? catchResult.data ?? [];
      catchCount = Array.isArray(catches) ? catches.length : 0;
    }
  } catch (e) {
    console.error(e);
    content.innerHTML = `<p style="text-align:center; padding:40px; color:red;">유저 정보를 불러오지 못했습니다.</p>`;
    return;
  }

  content.innerHTML = `
    <!-- 플레이어 카드 -->
    <div style="display:flex; width:100%; padding:24px 16px; flex-direction:column; align-items:center; gap:16px; border-radius:14px; background:#FFF; box-shadow:0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10);">
      <!-- 아이콘 -->
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="플레이어 아이콘" style="width:80px; height:80px; object-fit:contain;" />
      <!-- 플레이어 닉네임 -->
      <h2>${user.nickname ?? ''}</h2>
      <!-- 게시글 / 포획 통계 -->
      <div style="display:flex; flex-direction:row; gap:16px; width:100%; justify-content:center; padding-bottom:24px;">
        <div style="display:flex; flex:1; max-width:268px; height:auto; padding:16px; flex-direction:column; align-items:center; gap:4px; border-radius:10px; background:#F9FAFB;">
          <p style="font-size:14px; color:#6a7282;">게시글</p>
          <span style="font-size:24px; font-weight:600; color:#00bba7;">${postCount}</span>
        </div>
        <div style="display:flex; flex:1; max-width:268px; height:auto; padding:16px; flex-direction:column; align-items:center; gap:4px; border-radius:10px; background:#F9FAFB;">
          <p style="font-size:14px; color:#6a7282;">포획</p>
          <span style="font-size:24px; font-weight:600; color:#ee8130;">${catchCount}</span>
        </div>
      </div>
    </div>

    <!-- 내 정보 관리 -->
    <div style="display:flex; height:auto; padding:24px; flex-direction:column; align-items:flex-start; gap:24px; align-self:stretch; border-radius:16px; background:#FFF; box-shadow:0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10); margin-bottom:40px;">
      <p style="font-size:18px; font-weight:600; color:#1a3a35;">내 정보</p>

      <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
        <!-- 닉네임 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">닉네임</p>
          <input type="text" id="input-nickname" value="${user.nickname ?? ''}" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none;" />
        </div>

        <!-- 아이디 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">아이디</p>
          <input type="text" id="input-id" value="${user.loginId ?? ''}" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none;" />
        </div>

        <!-- 자기소개 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">자기소개</p>
          <textarea id="input-bio" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none; resize:none; height:88px;">${user.bio ?? ''}</textarea>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; width:100%;">
        <button id="edit-btn"
          style="padding:10px 24px; border-radius:8px; background:#00bba7; color:#FFF; font-size:14px; font-weight:600; border:none; cursor:pointer;">수정하기</button>
      </div>
    </div>
  `;

  let isEditing = false;

  document.getElementById('edit-btn').addEventListener('click', async () => {
    const nicknameInput = document.getElementById('input-nickname');
    const bioInput = document.getElementById('input-bio');
    const editBtn = document.getElementById('edit-btn');

    if (!isEditing) {
      isEditing = true;
      nicknameInput.disabled = false;
      bioInput.disabled = false;
      editBtn.textContent = '저장하기';
      return;
    }

    // 저장 요청
    try {
      const res = await fetch(`${BASE_URL}/user/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nickname: nicknameInput.value,
          bio: bioInput.value,
        }),
      });
      if (!res.ok) throw new Error('저장 실패');
      isEditing = false;
      nicknameInput.disabled = true;
      bioInput.disabled = true;
      editBtn.textContent = '수정하기';
      alert('정보가 수정되었습니다.');
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    }
  });
}
