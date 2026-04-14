//경고/알림 모달 컴포넌트
const MODAL_ID = 'custom-modal';


function injectModal() {
  if (document.getElementById(MODAL_ID)) return;

  const el = document.createElement('div');
  el.innerHTML = `
    <div id="${MODAL_ID}" class="fixed inset-0 z-50 items-center justify-center hidden">
      <div id="${MODAL_ID}-overlay" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-xl"
        style="width:100%; max-width:360px; margin:0 16px; padding:24px; display:flex; flex-direction:column; gap:20px;">
        <div>
          <h3 id="${MODAL_ID}-title" class="text-lg font-black text-slate-900">알림</h3>
          <p id="${MODAL_ID}-desc" class="text-sm text-slate-400" style="margin-top:4px;"></p>
        </div>
        <button id="${MODAL_ID}-confirm"
          class="w-full rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition"
          style="padding:10px 16px;">
          확인
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(el.firstElementChild);
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById(MODAL_ID);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}


// 모달 열기
export function showModal(title, desc) {
  injectModal();

  const modal   = document.getElementById(MODAL_ID);
  const titleEl = document.getElementById(`${MODAL_ID}-title`);
  const descEl  = document.getElementById(`${MODAL_ID}-desc`);
  const confirm = document.getElementById(`${MODAL_ID}-confirm`);
  const overlay = document.getElementById(`${MODAL_ID}-overlay`);

  titleEl.textContent = title;
  descEl.textContent  = desc;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  return new Promise((resolve) => {
    function close() {
      closeModal();
      resolve();
    }
    confirm.addEventListener('click', close, { once: true });
    overlay.addEventListener('click', close, { once: true });
  });
}