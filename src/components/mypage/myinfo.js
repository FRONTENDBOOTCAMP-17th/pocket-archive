import { getMe, updateMe, checkNickname, getMyPosts, getMyPocketmons } from '../../api/user.js';
import { getMyInfoHTML } from './myinfoUI.js';
import { guardFn } from '../../utils/guardFn.js';

export async function initMyInfo() {
  const content = document.getElementById('mypage-content');

  content.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">불러오는 중...</p>`;

  let user = {};
  let postCount = 0;
  let catchCount = 0;

  try {
    const [userResult, postsResult, catchResult] = await Promise.allSettled([
      getMe(),
      getMyPosts(),
      getMyPocketmons(),
    ]);

    if (userResult.status === 'rejected') throw new Error('유저 정보 불러오기 실패');
    user = userResult.value.data;

    if (postsResult.status === 'fulfilled') {
      const posts = postsResult.value.data?.posts ?? postsResult.value.data ?? [];
      postCount = Array.isArray(posts) ? posts.length : 0;
    }

    if (catchResult.status === 'fulfilled') {
      const catches = catchResult.value.data?.myPocketmons ?? catchResult.value.data ?? [];
      catchCount = Array.isArray(catches) ? catches.length : 0;
    }
  } catch (e) {
    console.error(e);
    content.innerHTML = `<p style="text-align:center; padding:40px; color:red;">유저 정보를 불러오지 못했습니다.</p>`;
    return;
  }

  content.innerHTML = getMyInfoHTML(user, postCount, catchCount);

  function showModal(title, desc) {
    const modal = document.getElementById('myinfo-modal');
    document.getElementById('myinfo-modal-title').textContent = title;
    document.getElementById('myinfo-modal-desc').textContent = desc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    document.getElementById('myinfo-modal-confirm').addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, { once: true });
    document.getElementById('myinfo-modal-overlay').addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, { once: true });
  }

  let isEditing = false;
  let nicknameChecked = false;
  const originalNickname = user.nickname ?? '';

  const nicknameInput = document.getElementById('input-nickname');
  const bioInput = document.getElementById('input-bio');
  const editBtn = document.getElementById('edit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const checkNicknameBtn = document.getElementById('check-nickname-btn');
  const nicknameMsg = document.getElementById('nickname-msg');
  const originalBio = user.introduce ?? '';

  function exitEditMode() {
    isEditing = false;
    nicknameChecked = false;
    nicknameInput.value = originalNickname;
    bioInput.value = originalBio;
    nicknameInput.disabled = true;
    bioInput.disabled = true;
    checkNicknameBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    nicknameMsg.style.display = 'none';
    editBtn.textContent = '수정하기';
  }

  cancelBtn.addEventListener('click', exitEditMode);

  nicknameInput.addEventListener('input', () => {
    nicknameChecked = false;
    nicknameMsg.style.display = 'none';
  });

  checkNicknameBtn.addEventListener('click', guardFn(async () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
      nicknameMsg.style.display = 'block';
      nicknameMsg.style.color = 'red';
      nicknameMsg.textContent = '닉네임을 입력해주세요.';
      return;
    }
    try {
      const result = await checkNickname(nickname);
      if (result.data.exists) {
        nicknameChecked = false;
        nicknameMsg.style.color = 'red';
        nicknameMsg.textContent = '이미 사용 중인 닉네임입니다.';
      } else {
        nicknameChecked = true;
        nicknameMsg.style.color = '#00bba7';
        nicknameMsg.textContent = '사용 가능한 닉네임입니다.';
      }
      nicknameMsg.style.display = 'block';
    } catch (e) {
      console.error(e);
      showModal('오류', '중복 확인 중 오류가 발생했습니다.');
    }
  }));

  document.getElementById('edit-btn').addEventListener('click', guardFn(async () => {
    if (!isEditing) {
      isEditing = true;
      nicknameInput.disabled = false;
      bioInput.disabled = false;
      checkNicknameBtn.style.display = 'block';
      cancelBtn.style.display = 'block';
      editBtn.textContent = '저장하기';
      return;
    }

    if (nicknameInput.value.trim() !== originalNickname && !nicknameChecked) {
      nicknameMsg.style.display = 'block';
      nicknameMsg.style.color = 'red';
      nicknameMsg.textContent = '닉네임 중복확인을 해주세요.';
      return;
    }

    try {
      await updateMe(nicknameInput.value, bioInput.value);
      isEditing = false;
      nicknameChecked = false;
      nicknameInput.disabled = true;
      bioInput.disabled = true;
      checkNicknameBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      nicknameMsg.style.display = 'none';
      editBtn.textContent = '수정하기';
      showModal('알림', '정보가 수정되었습니다.');
    } catch (e) {
      console.error(e);
      showModal('오류', '저장 중 오류가 발생했습니다.');
    }
  }));
}
