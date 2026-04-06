// 더미 유저 데이터 (추후 실제 로그인 유저 정보로 교체)
const currentUser = {
  nickname: '배틀킹',
  id: 'battleking',
  bio: '포켓몬 배틀 전문가입니다.',
  postCount: 2,
  catchCount: 0,
};

export function initMyInfo() {
  const content = document.getElementById('mypage-content');
  content.innerHTML = `
    <!-- 플레이어 카드 -->
    <div style="display:flex; width:100%; height:244px; padding:16px 16px 0 16px; flex-direction:column; align-items:center; gap:16px; border-radius:14px; background:#FFF; box-shadow:0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10);">
      <!-- 아이콘 -->
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="플레이어 아이콘" style="width:80px; height:80px; object-fit:contain;" />
      <!-- 플레이어 닉네임 -->
      <h2>${currentUser.nickname}</h2>
      <!-- 게시글 / 포획 통계 -->
      <div style="display:flex; flex-direction:row; gap:16px; width:100%; justify-content:center;">
        <div style="display:flex; flex:1; max-width:268px; height:72px; padding:16px; flex-direction:column; align-items:center; gap:4px; border-radius:10px; background:#F9FAFB;">
          <p>게시글</p>
          <span>${currentUser.postCount}</span>
        </div>
        <div style="display:flex; flex:1; max-width:268px; height:72px; padding:16px; flex-direction:column; align-items:center; gap:4px; border-radius:10px; background:#F9FAFB;">
          <p>포획</p>
          <span>${currentUser.catchCount}</span>
        </div>
      </div>
    </div>

    <!-- 내 정보 관리 -->
    <div style="display:flex; height:auto; padding:24px; flex-direction:column; align-items:flex-start; gap:24px; align-self:stretch; border-radius:16px; background:#FFF; box-shadow:0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10);">
      <p style="font-size:18px; font-weight:600; color:#1a3a35;">내 정보</p>

      <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
        <!-- 닉네임 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">닉네임</p>
          <!-- 수정 불가능한 input -->
          <input type="text" id="input-nickname" value="${currentUser.nickname}" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none;" />
        </div>

        <!-- 아이디 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">아이디</p>
          <!-- 수정 불가능한 input -->
          <input type="text" id="input-id" value="${currentUser.id}" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none;" />
        </div>

        <!-- 자기소개 -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <p style="font-size:14px; font-weight:500; color:#4a7a72;">자기소개</p>
          <!-- 수정 가능한 textarea -->
          <textarea id="input-bio" disabled
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none; resize:none; height:88px;">${currentUser.bio}</textarea>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; width:100%;">
        <button id="edit-btn"
          style="padding:10px 24px; border-radius:8px; background:#00bba7; color:#FFF; font-size:14px; font-weight:600; border:none; cursor:pointer;">수정하기</button>
      </div>
    </div>
  `;

  let isEditing = false;

  document.getElementById('edit-btn').addEventListener('click', () => {
    const bioInput = document.getElementById('input-bio');
    const editBtn = document.getElementById('edit-btn');

    isEditing = !isEditing;
    bioInput.disabled = !isEditing;
    editBtn.textContent = isEditing ? '저장하기' : '수정하기';

    if (!isEditing) {
      currentUser.bio = bioInput.value;
      alert('정보가 수정되었습니다.');
    }
  });
}
