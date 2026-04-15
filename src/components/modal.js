// 알림/확인/입력 모달 컴포넌트
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
        <input id="${MODAL_ID}-input" type="text" maxlength="20"
          class="w-full rounded-xl border border-gray-200 text-sm text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
          style="padding:12px 16px; display:none;" />
        <div style="display:flex; gap:12px;">
          <button id="${MODAL_ID}-cancel"
            class="flex-1 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            style="padding:10px 16px; display:none;">
            취소
          </button>
          <button id="${MODAL_ID}-confirm"
            class="flex-1 rounded-xl text-white text-sm font-semibold transition"
            style="padding:10px 16px;">
            확인
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el.firstElementChild);
}

function closeModal() {
  const modal = document.getElementById(MODAL_ID);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function openModal({ title, desc, modalType, colorType = 'default' }) {
  injectModal();

  const modal   = document.getElementById(MODAL_ID);
  const titleEl = document.getElementById(`${MODAL_ID}-title`);
  const descEl  = document.getElementById(`${MODAL_ID}-desc`);
  const inputEl = document.getElementById(`${MODAL_ID}-input`);
  const confirm = document.getElementById(`${MODAL_ID}-confirm`);
  const cancel  = document.getElementById(`${MODAL_ID}-cancel`);
  const overlay = document.getElementById(`${MODAL_ID}-overlay`);

  titleEl.textContent = title;
  descEl.textContent  = desc;

  // modalType별 input/cancel 표시
  inputEl.style.display = modalType === 'prompt'  ? 'block' : 'none';
  cancel.style.display  = modalType === 'alert'   ? 'none'  : 'block';

  if (modalType === 'prompt') {
    inputEl.value = '';
    setTimeout(() => inputEl.focus(), 0);
  }

  // 버튼 색상 (alert에서만 colorType 적용)
  const colorMap = {
    default: { bg: '#00BBA7', hover: '#009e8d' },
    danger:  { bg: '#ef4444', hover: '#dc2626' },
  };
  const color = colorMap[colorType] ?? colorMap.default;
  confirm.style.backgroundColor = color.bg;
  confirm.onmouseover = () => { confirm.style.backgroundColor = color.hover; };
  confirm.onmouseout  = () => { confirm.style.backgroundColor = color.bg; };

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  return new Promise((resolve) => {
    function cleanup() {
      confirm.removeEventListener('click', onConfirm);
      cancel.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onCancel);
    }
    function onConfirm() {
      cleanup();
      closeModal();
      if (modalType === 'prompt')  resolve(inputEl.value.trim() || null);
      else if (modalType === 'confirm') resolve(true);
      else resolve();
    }
    function onCancel() {
      cleanup();
      closeModal();
      if (modalType === 'prompt')  resolve(null);
      else if (modalType === 'confirm') resolve(false);
      else resolve();
    }
    confirm.addEventListener('click', onConfirm);
    cancel.addEventListener('click', onCancel);
    overlay.addEventListener('click', onCancel);
  });
}

// 알림 (확인 1개, 기존 호환)
export function showModal(title, desc, type = 'default') {
  return openModal({ title, desc, modalType: 'alert', colorType: type });
}

// 확인/취소 (resolve: true | false)
export function showConfirm(title, desc) {
  return openModal({ title, desc, modalType: 'confirm' });
}

// 텍스트 입력 (resolve: string | null)
export function showPrompt(title, desc) {
  return openModal({ title, desc, modalType: 'prompt' });
}
