import { showModal, showConfirm, showPrompt } from "../modal.js";
import {
  renderTrainerCardUI,
  renderCount,
  renderPresetCount,
  renderListUI,
  renderPresetsUI,
} from "./mypartyUI.js";
import {
  loadBookmarkedPokemons,
  loadPartyPresets,
  createPreset,
  updatePreset,
  deletePreset,
} from "./mypartyCrud.js";
import { deleteBookmark } from "/src/api/user.js";

// ─── 상태 ───────────────────────────────────────────────────
let selectedSlot      = null;
let party             = Array(6).fill(null);
let gender            = "man";
let loadedPresetIndex = null;

let root          = null;
let listEl        = null;
let countEl       = null;
let presetListEl  = null;
let presetCountEl = null;

let pokemons = [];
let presets  = [];

let searchQuery = "";

// ─── 초기화 ─────────────────────────────────────────────────
export async function init() {
  // 진입할 때마다 상태 초기화 (이전 진입 잔존 방지)
  selectedSlot      = null;
  party             = Array(6).fill(null);
  gender            = "man";
  loadedPresetIndex = null;
  pokemons          = [];
  presets           = [];
  searchQuery       = "";

  root          = document.getElementById("trainer-card-root");
  listEl        = document.getElementById("pokemon-list");
  countEl       = document.getElementById("count");
  presetListEl  = document.getElementById("preset-list");
  presetCountEl = document.getElementById("preset-count");

  if (!root || !listEl || !countEl || !presetListEl || !presetCountEl) {
    console.error("myparty 요소를 찾지 못했습니다.");
    return;
  }

  try {
    pokemons = await loadBookmarkedPokemons();
  } catch (error) {
    console.error("북마크 로드 에러:", error);
  }

  try {
    presets = await loadPartyPresets(pokemons);
  } catch (err) {
    console.error("파티 목록 로드 에러:", err);
  }

  renderTrainerCard();
  renderList();
  renderPresets();
  bindActionButtons();
  bindSearch();
  bindBookmarkEvents();
}

// ─── 프리셋 CRUD 핸들러 ──────────────────────────────────────
async function handleSavePreset(presetName) {
  try {
    const pokemonIds = party.filter(Boolean).map((p) => p.id);
    await createPreset(presetName, gender, pokemonIds);
    presets = await loadPartyPresets(pokemons);
    renderPresets();
  } catch (err) {
    console.error("파티 저장 에러:", err);
    await showModal("파티 저장 실패", "파티 저장에 실패했습니다.");
  }
}

async function handleUpdatePreset(index) {
  const preset = presets[index];
  if (!preset?.apiId) return;
  try {
    const pokemonIds          = party.filter(Boolean).map((p) => p.id);
    const updated             = await updatePreset(preset.apiId, preset.name, pokemonIds, gender);
    presets[index].party      = [...party];
    presets[index].pokemonIds = updated.pocketmons;
    presets[index].gender     = gender;
    renderPresets();
  } catch (err) {
    console.error("파티 수정 에러:", err);
    await showModal("파티 수정 실패", "파티 수정에 실패했습니다.");
  }
}

async function handleDeletePreset(index) {
  const preset = presets[index];
  if (!preset?.apiId) return;
  try {
    await deletePreset(preset.apiId);
    if (loadedPresetIndex === index) loadedPresetIndex = null;
    presets = await loadPartyPresets(pokemons);
    renderPresets();
  } catch (err) {
    console.error("파티 삭제 에러:", err);
    await showModal("파티 삭제 실패", "파티 삭제에 실패했습니다.");
  }
}

// ─── 렌더 래퍼 ──────────────────────────────────────────────
function renderTrainerCard() {
  renderTrainerCardUI(root, gender, party);
  bindSlots();
  bindGenderSelect();
}

function renderList() {
  renderListUI(listEl, pokemons, party, searchQuery);
  renderCount(countEl, party);
  bindPokemonClick();
}

function renderPresets() {
  renderPresetCount(presetCountEl, presets);
  renderPresetsUI(presetListEl, presets, loadedPresetIndex);
  bindPresetEvents();
}

// ─── 이벤트 바인딩 ───────────────────────────────────────────
function bindSlots() {
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      selectedSlot = Number(slot.dataset.index);
      document.querySelectorAll(".slot").forEach((s) =>
        s.classList.remove("ring-2", "ring-teal-400", "ring-offset-2"),
      );
      slot.classList.add("ring-2", "ring-teal-400", "ring-offset-2");
    });
  });
}

function bindGenderSelect() {
  const genderSelect = document.getElementById("gender-select");
  if (!genderSelect) return;
  genderSelect.addEventListener("change", (e) => {
    gender = e.target.value;
    renderTrainerCard();
  });
}

function bindSearch() {
  const searchInput = document.getElementById("pokemon-search");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderList();
  });
}

function bindPokemonClick() {
  listEl.querySelectorAll("[data-id]").forEach((card) => {
    card.addEventListener("click", async (e) => {
      // 북마크 삭제 버튼 클릭은 무시 (bindBookmarkEvents에서 처리)
      if (e.target.closest("[data-action='poketmon-delete']")) return;

      if (selectedSlot === null) {
        await showModal("트레이너 카드 슬롯 미선택", "먼저 트레이너 카드의 슬롯을 선택해주세요.");
        return;
      }
      const id      = Number(card.dataset.id);
      const pokemon = pokemons.find((p) => p.id === id);
      if (!pokemon) return;

      const duplicatedIndex = party.findIndex((p) => p?.id === pokemon.id);
      if (duplicatedIndex !== -1) {
        if (duplicatedIndex === selectedSlot) {
          party[selectedSlot] = null;
        } else {
          const temp             = party[selectedSlot];
          party[selectedSlot]    = party[duplicatedIndex];
          party[duplicatedIndex] = temp;
        }
      } else {
        party[selectedSlot] = pokemon;
      }

      renderTrainerCard();
      renderList();
    });
  });
}

function bindActionButtons() {
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    party             = Array(6).fill(null);
    selectedSlot      = null;
    loadedPresetIndex = null;
    renderTrainerCard();
    renderList();
    renderPresets();
  });

  document.getElementById("saveBtn")?.addEventListener("click", async () => {
    if (party.filter(Boolean).length === 0) {
      await showModal("포켓몬 미선택", "포켓몬을 하나 이상 선택해주세요.");
      return;
    }
    if (loadedPresetIndex === null) {
      await showModal("저장할 슬롯 미선택", "저장할 슬롯을 선택해주세요.");
      return;
    }

    const preset = presets[loadedPresetIndex];
    if (preset) {
      const ok = await showConfirm("파티 덮어쓰기", `"${preset.name}" 파티에 현재 구성을 덮어씁니다.`);
      if (ok) await handleUpdatePreset(loadedPresetIndex);
    } else {
      if (presets.length >= 3) {
        await showModal("저장 공간 부족", "파티는 최대 3개까지 저장할 수 있습니다.");
        return;
      }
      const name = await showPrompt("파티 이름 저장", "나만의 파티 이름을 입력해주세요");
      if (name) await handleSavePreset(name);
    }
  });
}

function bindPresetEvents() {
  document.querySelectorAll("[data-load-index]").forEach((btn) =>
    btn.addEventListener("click", () => loadPreset(Number(btn.dataset.loadIndex))),
  );
  document.querySelectorAll("[data-delete-index]").forEach((btn) =>
    btn.addEventListener("click", () => handleDeletePreset(Number(btn.dataset.deleteIndex))),
  );
  document.querySelectorAll("[data-new-slot]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const slotIndex   = Number(btn.dataset.newSlot);
      party             = Array(6).fill(null);
      selectedSlot      = null;
      loadedPresetIndex = slotIndex;
      renderTrainerCard();
      renderList();
      renderPresets();
    }),
  );
}

function loadPreset(index) {
  const preset = presets[index];
  if (!preset) return;
  gender            = preset.gender || "man";
  party             = [...preset.party];
  selectedSlot      = null;
  loadedPresetIndex = index;
  renderTrainerCard();
  renderList();
  renderPresets();
}

// ─── 북마크 삭제 이벤트 위임 ────────────────────────────────
function bindBookmarkEvents() {
  listEl.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action='poketmon-delete']");
    if (!target) return;
    e.stopPropagation();

    const id = Number(target.dataset.id);
    try {
      await deleteBookmark(id);
      pokemons = pokemons.filter((p) => p.id !== id);
      party    = party.map((p) => (p?.id === id ? null : p));
      renderTrainerCard();
      renderList();
    } catch (err) {
      console.error("북마크 삭제 에러:", err);
      await showModal("삭제 실패", "북마크 삭제에 실패했습니다.");
    }
  });
}
