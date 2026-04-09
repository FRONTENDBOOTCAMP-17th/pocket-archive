export function getMyInfoHTML(user, postCount, catchCount) {
  return `
    <!-- 커스텀 모달 -->
    <div id="myinfo-modal" class="fixed inset-0 z-50 items-center justify-center hidden">
      <div id="myinfo-modal-overlay" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-xl"
        style="width:100%; max-width:360px; margin:0 16px; padding:24px; display:flex; flex-direction:column; gap:20px;">
        <div>
          <h3 id="myinfo-modal-title" class="text-lg font-black text-slate-900">알림</h3>
          <p id="myinfo-modal-desc" class="text-sm text-slate-400" style="margin-top:4px;"></p>
        </div>
        <button id="myinfo-modal-confirm"
          class="w-full rounded-xl text-white text-sm font-semibold transition"
          style="padding:10px 16px; background:#00bba7;">
          확인
        </button>
      </div>
    </div>

    <!-- 플레이어 카드 -->
    <div style="display:flex; width:100%; padding:24px 16px; flex-direction:column; align-items:center; gap:16px; border-radius:14px; background:#FFF; box-shadow:0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10);">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="플레이어 아이콘" style="width:80px; height:80px; object-fit:contain;" />
      <h2>${user.nickname ?? ''}</h2>
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
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="text" id="input-nickname" value="${user.nickname ?? ''}" disabled
              style="flex:1; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none;" />
            <button id="check-nickname-btn" style="display:none; padding:10px 14px; border-radius:8px; border:1px solid #00bba7; background:#fff; color:#00bba7; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;">중복확인</button>
          </div>
          <p id="nickname-msg" style="font-size:12px; display:none;"></p>
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
            style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid #e6f7f5; background:#F9FAFB; color:#1a3a35; font-size:14px; outline:none; resize:none; height:88px;">${user.introduce ?? ''}</textarea>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px; width:100%;">
        <button id="cancel-btn" style="display:none; padding:10px 24px; border-radius:8px; background:#fff; color:#6a7282; font-size:14px; font-weight:600; border:1px solid #d1d5db; cursor:pointer;">취소하기</button>
        <button id="edit-btn"
          style="padding:10px 24px; border-radius:8px; background:#00bba7; color:#FFF; font-size:14px; font-weight:600; border:none; cursor:pointer;">수정하기</button>
      </div>
    </div>
  `;
}
