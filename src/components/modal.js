// 알림/확인/입력 모달 컴포넌트
const MODAL_ID = 'custom-modal';

function injectModal() {
  if (document.getElementById(MODAL_ID)) return;

  const el = document.createElement('div');
  el.innerHTML = `
    <div id="${MODAL_ID}" class="fixed inset-0 z-50 items-center justify-center hidden">
      <div id="${MODAL_ID}-overlay" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-90 mx-4 p-6 flex flex-col gap-5">
        <div>
          <h3 id="${MODAL_ID}-title" class="text-lg font-black text-slate-900">알림</h3>
          <p id="${MODAL_ID}-desc" class="text-sm text-slate-400 mt-1"></p>
        </div>
        <input id="${MODAL_ID}-input" type="text" maxlength="20"
          class="hidden w-full rounded-xl border border-gray-200 text-sm text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition px-4 py-3" />
        <div class="flex gap-3">
          <button id="${MODAL_ID}-cancel"
            class="hidden flex-1 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition px-4 py-2.5">
            취소
          </button>
          <button id="${MODAL_ID}-confirm"
            class="flex-1 rounded-xl text-white text-sm font-semibold transition px-4 py-2.5">
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
  if (modalType === 'prompt') {
    inputEl.classList.remove('hidden');
  } else {
    inputEl.classList.add('hidden');
  }
  if (modalType === 'alert') {
    cancel.classList.add('hidden');
  } else {
    cancel.classList.remove('hidden');
  }

  if (modalType === 'prompt') {
    inputEl.value = '';
    setTimeout(() => inputEl.focus(), 0);
  }

  // 버튼 색상 (colorType별 클래스 교체)
  const colorClasses = {
    default: ['bg-[#00BBA7]', 'hover:bg-[#009e8d]'],
    danger:  ['bg-[#ef4444]', 'hover:bg-[#dc2626]'],
  };
  const allColorClasses = [...colorClasses.default, ...colorClasses.danger];
  allColorClasses.forEach(cls => confirm.classList.remove(cls));
  (colorClasses[colorType] ?? colorClasses.default).forEach(cls => confirm.classList.add(cls));

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
