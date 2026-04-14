import { writePost, publishPost, loadEditPost, loadPreset as fetchPresets, editPost, uploadImg } from '../../api/post.js';
import { showModal } from '../modal.js';

import { categoryMap, reverseCategoryMap } from '../../utils/boardConstants';

let uploadImgUrl = '';
let loadPreset = [];
async function submitPost({ title, category, content, preset }) {
  // number 선언안해서 문법 맞는데 왜 안되지 계속 이 난리30분침
  const selectedPreset = loadPreset.find((item) => item.partyId === Number(preset));

  const data = await writePost(title, category, content, selectedPreset, uploadImgUrl);
  const postId = data.data?.postId;

  if (postId) {
    publishPost(postId);
  }
  return data;
}

export async function initWrite() {
  const container = document.getElementById('content');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('postId');
  let postData = null;
  if (postId) {
    postData = await loadEditPost(postId);
  }
  container.innerHTML = `
    <div class="flex w-full flex-col items-start shrink-0 rounded-2xl bg-white shadow" style="padding: 32px; gap: 32px;">
      <button id="write-back-btn" class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-500 hover:bg-[#05B29F]/10 hover:text-[#05B29F] transition-all text-sm font-bold">
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
        목록으로 돌아가기
      </button>

      <h1 class="text-3xl font-bold text-[#1a3a35]">게시글 작성</h1>

      <div class="flex flex-col w-full" style="gap: 24px;">

        <!-- 카테고리 -->
        <div class="flex flex-col" style="gap: 8px;">
          <p class="text-sm font-semibold text-[#1a3a35]">카테고리</p>
          <select id="write-category" class="w-full rounded-lg border border-[#D1D5DC] text-sm text-[#1a3a35] bg-white outline-none cursor-pointer" style="height: 44px; padding: 0 12px;">
            <option value="">카테고리를 선택하세요</option>
            <option value="자유게시판">자유게시판</option>
            <option value="질문게시판">질문게시판</option>
            <option value="공략">공략</option>
            <option value="파티공유">파티공유</option>
          </select>
        </div>

        <!-- 제목 -->
        <div class="flex flex-col" style="gap: 8px;">
          <p class="text-sm font-semibold text-[#1a3a35]">제목</p>
          <input id="write-title" type="text" placeholder="제목을 입력하세요"
            class="w-full rounded-lg border border-[#D1D5DC] text-sm text-[#1a3a35] placeholder-[#9CA3AF] outline-none"
            style="height: 44px; padding: 0 12px;" />
        </div>

        <!-- 파티 프리셋 -->
        <div class="flex flex-col" style="gap: 8px;">
          <p class="text-sm font-semibold text-[#1a3a35]">나의 파티 프리셋 불러오기 <span class="text-[#9CA3AF] font-normal whitespace-nowrap">(선택)</span></p>
          <select id="write-party-preset" class="w-full rounded-lg border border-[#D1D5DC] text-sm text-[#1a3a35] bg-white outline-none cursor-pointer" style="height: 44px; padding: 0 12px;">
            <option value="">프리셋을 선택하세요</option>
          </select>
        </div>

        <!-- 내용 -->
        <div class="flex flex-col" style="gap: 8px;">
          <p class="text-sm font-semibold text-[#1a3a35]">내용</p>
          <textarea id="write-content" placeholder="내용을 입력하세요"
            class="w-full rounded-lg border border-[#D1D5DC] text-sm text-[#1a3a35] placeholder-[#9CA3AF] outline-none resize-none"
            style="height: 180px; padding: 12px;"></textarea>
        </div>

        <!-- 이미지 첨부 -->
        <div class="flex flex-col" style="gap: 8px;" >
          <p class="text-sm font-semibold text-[#1a3a35]">이미지 첨부 <span class="text-[#9CA3AF] font-normal">(선택)</span></p>
          <label  for="write-image" class="flex flex-col items-center justify-center w-full cursor-pointer rounded-[10px] border border-dashed border-[#D1D5DC] text-[#9CA3AF] hover:bg-gray-50 transition-colors" style="height: 152px; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span class="text-sm">클릭하면 이미지를 업로드</span>
            <span class="text-xs">PNG, JPG, GIF 이하 5MB</span>
            <input id="write-image" type="file" accept="image/*" class="hidden" />
          </label>
          <div id="imgUrl"></div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex w-full" style="gap: 16px;">
        
        
        ${
          postId
            ? `<button
              id="edit-submit-btn"
              class="flex-1 rounded-lg bg-[#05B29F] text-white text-sm font-semibold hover:bg-[#049e8d] transition-colors"
              style="height: 48px;"
            >
              수정
            </button>`
            : ` <button
                  id="write-middle-btn"
                  class="flex-1 rounded-lg border border-[#D1D5DC] text-sm text-[#4B5563] hover:bg-gray-50 transition-colors"
                  style="height: 48px;"
                >
                  임시 저장
                </button>
              <button
              id="write-submit-btn"
              class="flex-1 rounded-lg bg-[#05B29F] text-white text-sm font-semibold hover:bg-[#049e8d] transition-colors"
              style="height: 48px;"
            >
              작성 완료
            </button>`
        }
      </div>
    </div>
  `;

  // 로그인 체크 (비로그인 시 board로 이동)
  const token = localStorage.getItem('token');

  if (!token) {
    history.replaceState(null, '', '/board');
    window.loadPage();
    return;
  }

  // 뒤로가기 버튼
  document.getElementById('write-back-btn')?.addEventListener('click', () => {
    history.back();
  });

  // 파티 프리셋 목록 로드
  loadPreset = await fetchPresets();
  // 작성글 수정 값 넘겨주기
  if (postData && postId) {
    document.getElementById('write-title').value = postData.title || '';
    document.getElementById('write-content').value = postData.content || '';
    const categorySelect = document.getElementById('write-category');
    categorySelect.value = reverseCategoryMap[postData.category] || postData.category;
    if (postData.preset) {
      const select = document.getElementById('write-party-preset');
      const option = document.createElement('option');
      option.value = 'default';
      option.textContent = '기존 파티';
      option.selected = true;
      select.appendChild(option);
    }
    if (postData.imgUrl) {
      uploadImgUrl = postData.imgUrl;
    }
  }
  //수정 로직
  document.getElementById('edit-submit-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('write-title')?.value.trim();
    const content = document.getElementById('write-content')?.value.trim();
    const selectedCategory = document.getElementById('write-category')?.value;
    const preset = document.getElementById('write-party-preset').value;

    if (!title) return await showModal('제목 미입력', '제목을 입력해주세요.', 'danger');
    if (!selectedCategory) return await showModal('카테고리 미선택', '카테고리를 선택해주세요.', 'danger');
    if (!content) return await showModal('내용 미입력', '내용을 입력해주세요.', 'danger');

    const apiCategory = categoryMap[selectedCategory] ?? selectedCategory;
    await editPost(postId, {
      title,
      content,
      category: apiCategory,
      preset,
      uploadImgUrl,
      postData,
      presets: loadPreset,
    });
  });
  // 폼 제출 (글작성 , 수정)
  document.getElementById('write-submit-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('write-title')?.value.trim();
    const content = document.getElementById('write-content')?.value.trim();
    const selectedCategory = document.getElementById('write-category')?.value;
    const preset = document.getElementById('write-party-preset').value;

    if (!title) return await showModal('제목 미입력', '제목을 입력해주세요.', 'danger');
    if (!selectedCategory) return await showModal('카테고리 미선택', '카테고리를 선택해주세요.', 'danger');
    if (!content) return await showModal('내용 미작성', '내용을 입력해주세요.', 'danger');

    try {
      const apiCategory = categoryMap[selectedCategory] ?? selectedCategory;
      await submitPost({ title, category: apiCategory, content, preset });
      history.pushState(null, '', '/board');
      window.loadPage();
    } catch (error) {
      console.error(error);
      await showModal('오류', '게시글 작성 중 오류가 발생했습니다.', 'danger');
    }
  });
  document.getElementById('write-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    uploadImgUrl = await uploadImg(formData);
    const uploadContainer = document.getElementById('imgUrl');
    const img = document.createElement('img');
    img.src = uploadImgUrl;
    img.alt = '업로드 이미지';
    img.className = 'w-full h-48 object-contain rounded-lg';
    //계속 올려도 하나만 업로드 되게
    uploadContainer.replaceChildren(img);
  });
}
