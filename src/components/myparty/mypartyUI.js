import { TrainerCard } from "./trainerCard.js";
import { PokemonCard } from "../pokedex/pokedexUI";

// 프리셋 행 색상 팔레트
export const PRESET_COLORS = [
  { bg: "background-color:#fff7ed; border-color:#fed7aa;", text: "color:#ea580c;" },
  { bg: "background-color:#eff6ff; border-color:#bfdbfe;", text: "color:#2563eb;" },
  { bg: "background-color:#f0fdfa; border-color:#99f6e4;", text: "color:#0d9488;" },
];

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ─── 트레이너 카드 ──────────────────────────────────────────
export function renderTrainerCardUI(root, gender, party) {
  if (!root) return;
  root.innerHTML = TrainerCard({ gender, party });
}

// ─── 포켓몬 카운트 ──────────────────────────────────────────
export function renderCount(countEl, party) {
  if (!countEl) return;
  countEl.textContent = `${party.filter(Boolean).length} / 6 선택됨`;
}

// ─── 프리셋 카운트 ──────────────────────────────────────────
export function renderPresetCount(presetCountEl, presets) {
  if (!presetCountEl) return;
  presetCountEl.textContent = `${presets.length} / 3`;
}

// ─── 포켓몬 리스트 ──────────────────────────────────────────
export function renderListUI(listEl, pokemons, party, searchQuery) {
  if (!listEl) return;

  if (pokemons.length === 0) {
    listEl.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:#9ca3af; padding:40px 0;">
        북마크된 포켓몬이 없습니다 😢
      </div>
    `;
    return;
  }

  const filtered = searchQuery
    ? pokemons.filter(
        (p) =>
          p.koName?.toLowerCase().includes(searchQuery) ||
          p.name?.toLowerCase().includes(searchQuery) ||
          String(p.id).includes(searchQuery),
      )
    : pokemons;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:#9ca3af; padding:40px 0;">
        검색 결과가 없습니다 😢
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered
    .map((pokemon) => {
      const isInParty = party.some((p) => p?.id === pokemon.id);
      return `
        <div
          data-id="${pokemon.id}"
          class="pokemon-pick-card"
          style="position:relative; cursor:pointer; border-radius:16px; transition:all 0.2s;
                 ${isInParty ? "opacity:0.6; cursor:not-allowed; outline:2px solid #5eead4; outline-offset:2px;" : ""}"
        >
          ${isInParty ? `
            <span style="position:absolute; top:10px; left:10px; z-index:10;
                         width:24px; height:24px; background:#14b8a6; border-radius:50%;
                         display:flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,0.2);">
              <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </span>` : ``}
          ${PokemonCard(pokemon, pokemon.koName, [pokemon.id])}
        </div>
      `;
    })
    .join("");
}

// ─── 프리셋 리스트 ──────────────────────────────────────────
export function renderPresetsUI(presetListEl, presets, loadedPresetIndex) {
  if (!presetListEl) return;

  presetListEl.innerHTML = [0, 1, 2]
    .map((slotIndex) => {
      const preset = presets[slotIndex];
      const isLoaded = loadedPresetIndex === slotIndex;

      if (!preset) {
        return `
          <button type="button" data-new-slot="${slotIndex}"
            style="width:100%; padding:10px; border-radius:12px; border:1.5px dashed #d1d5db;
                   background:#f8fafc; color:#9ca3af; font-size:13px; font-weight:600;
                   cursor:pointer; transition:all 0.15s; text-align:center;
                   ${isLoaded ? "outline:2px solid #5eead4; outline-offset:1px;" : ""}"
            onmouseover="this.style.borderColor='#5eead4'; this.style.color='#0d9488'; this.style.background='#f0fdfa';"
            onmouseout="this.style.borderColor='#d1d5db'; this.style.color='#9ca3af'; this.style.background='#f8fafc';">
            + 새 파티 저장
          </button>
        `;
      }

      const color = PRESET_COLORS[slotIndex % PRESET_COLORS.length];
      return `
        <div style="display:flex; align-items:center; justify-content:space-between;
                    border-radius:12px; padding:10px 12px; border:1px solid;
                    ${color.bg} transition:all 0.15s;
                    ${isLoaded ? "outline:2px solid #5eead4; outline-offset:1px;" : ""}">
          <button type="button"
            style="display:flex; align-items:center; gap:8px; text-align:left; flex:1; min-width:0; background:none; border:none; cursor:pointer;"
            data-load-index="${slotIndex}">
            <span style="font-size:13px; font-weight:600; ${color.text} white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(preset.name)}
            </span>
          </button>
          <div style="display:flex; align-items:center; gap:4px; margin-left:8px; flex-shrink:0;">
            <button type="button"
              style="width:24px; height:24px; display:flex; align-items:center; justify-content:center;
                     color:#d1d5db; border:none; background:none; cursor:pointer; border-radius:8px; font-size:14px;"
              data-delete-index="${slotIndex}">✕</button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ─── 파티 저장/덮어쓰기 모달 (preset-modal) ─────────────────
export function openOverwriteModalUI(preset, onConfirm, onClose) {
  const modal     = document.getElementById("preset-modal");
  const input     = document.getElementById("preset-name-input");
  const titleEl   = document.getElementById("modal-title");
  const descEl    = document.getElementById("modal-desc");
  if (!modal || !input) return;

  if (titleEl) titleEl.textContent = "파티 덮어쓰기";
  if (descEl)  descEl.textContent  = `"${preset.name}" 파티에 현재 구성을 덮어씁니다.`;
  input.style.display = "none";
  modal.classList.remove("hidden");

  const close = () => { input.style.display = "block"; closePresetModal(); onClose?.(); };
  document.getElementById("modal-overlay")?.addEventListener("click",   close,      { once: true });
  document.getElementById("modal-cancel")?.addEventListener("click",    close,      { once: true });
  document.getElementById("modal-confirm")?.addEventListener("click", () => { close(); onConfirm(); }, { once: true });
}

export function openNewSaveModalUI(presets, onConfirm, onClose) {
  const modal   = document.getElementById("preset-modal");
  const input   = document.getElementById("preset-name-input");
  const titleEl = document.getElementById("modal-title");
  const descEl  = document.getElementById("modal-desc");
  if (!modal || !input) return;

  if (titleEl) titleEl.textContent = "파티 이름 저장";
  if (descEl)  descEl.textContent  = "나만의 파티 이름을 입력해주세요";
  input.value = "";
  input.style.display = "block";
  modal.classList.remove("hidden");
  input.focus();

  const close = () => { closePresetModal(); onClose?.(); };
  document.getElementById("modal-overlay")?.addEventListener("click", close, { once: true });
  document.getElementById("modal-cancel")?.addEventListener("click",  close, { once: true });
  document.getElementById("modal-confirm")?.addEventListener("click", () => {
    const name = input.value.trim() || `나의 파티 ${presets.length + 1}`;
    closePresetModal();
    onConfirm(name);
  }, { once: true });
}

export function closePresetModal() {
  document.getElementById("preset-modal")?.classList.add("hidden");
}