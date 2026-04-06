import { TrainerCard } from "../components/trainerCard.js";
import { PokemonCard } from "../components/pokedex/pokedex.js";

const BASE_URL = "https://api.fullstackfamily.com/api/pocket-archive/v1";

// --- 상태 ---
let selectedSlot = null;
let party = Array(6).fill(null);
let gender = "man";
let loadedPresetIndex = null;

let root = null;
let listEl = null;
let countEl = null;
let presetListEl = null;
let presetCountEl = null;

let pokemons = [];
let presets = [];
let koNameMap = {};

// 개발용 더미 포켓몬 ID (API 미인증 시 폴백)
const DUMMY_IDS = [1, 4, 7, 25, 39, 94];

// 프리셋 행 색상 팔레트 (이모지 없음)
const PRESET_COLORS = [
  { bg: "background-color:#fff7ed; border-color:#fed7aa;", text: "color:#ea580c;" },
  { bg: "background-color:#eff6ff; border-color:#bfdbfe;", text: "color:#2563eb;" },
  { bg: "background-color:#f0fdfa; border-color:#99f6e4;", text: "color:#0d9488;" },
];

// --- 인증 ---
function getToken() {
  return localStorage.getItem("token") || "";
}
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// --- 초기화 ---
export async function init() {
  root          = document.getElementById("trainer-card-root");
  listEl        = document.getElementById("pokemon-list");
  countEl       = document.getElementById("count");
  presetListEl  = document.getElementById("preset-list");
  presetCountEl = document.getElementById("preset-count");

  if (!root || !listEl || !countEl || !presetListEl || !presetCountEl) {
    console.error("myparty 요소를 찾지 못했습니다.");
    return;
  }

  // 한국어 이름 맵 로드
  try {
    const res = await fetch("/public/pokemon_full_ko.json");
    const json = await res.json();
    if (Array.isArray(json)) {
      json.forEach((p) => { koNameMap[p.id] = p.name; });
    } else {
      koNameMap = json;
    }
  } catch (e) {
    console.warn("한국어 이름 파일 로드 실패:", e);
  }

  await loadBookmarkedPokemons();
  await loadPartyPresets();

  renderTrainerCard();
  renderList();
  renderPresets();
  bindActionButtons();
}

// --- 포켓몬 ID 배열 → PokeAPI 상세 데이터 변환 ---
async function fetchPokemonsByIds(ids) {
  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json())
    )
  );
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => ({
      ...r.value,
      koName: koNameMap[r.value.id] || r.value.name,
    }));
}

// --- 북마크 포켓몬 불러오기 ---
async function loadBookmarkedPokemons() {
  const token = getToken();

  // 토큰 없으면 바로 더미데이터
  if (!token) {
    console.info("[dev] 토큰 없음 → 더미 포켓몬 사용");
    pokemons = await fetchPokemonsByIds(DUMMY_IDS);
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/pocketmons`, { headers: authHeaders() });

    if (!res.ok) {
      console.warn(`북마크 조회 실패(${res.status}) → 더미 포켓몬 사용`);
      pokemons = await fetchPokemonsByIds(DUMMY_IDS);
      return;
    }

    const { myPocketmons } = await res.json();

    if (!myPocketmons || myPocketmons.length === 0) {
      pokemons = [];
      return;
    }

    pokemons = await fetchPokemonsByIds(myPocketmons);
  } catch (err) {
    console.error("북마크 로드 에러 → 더미 포켓몬 사용:", err);
    pokemons = await fetchPokemonsByIds(DUMMY_IDS);
  }
}

// --- 저장된 파티 불러오기 ---
async function loadPartyPresets() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/party`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`파티 목록 조회 실패: ${res.status}`);
    const data = await res.json();

    presets = data.map((p) => ({
      apiId: p.id,
      name: p.deckname,
      gender: "man",
      pokemonIds: p.pocketmons,
      party: p.pocketmons.map((id) => pokemons.find((pk) => pk.id === id) || null),
    }));
  } catch (err) {
    console.error("파티 목록 로드 에러:", err);
    presets = [];
  }
}

// --- 트레이너 카드 ---
function renderTrainerCard() {
  if (!root) return;
  root.innerHTML = TrainerCard({ gender, party });
  bindSlots();
  bindGenderSelect();
}

function bindSlots() {
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      selectedSlot = Number(slot.dataset.index);
      document.querySelectorAll(".slot").forEach((s) =>
        s.classList.remove("ring-2", "ring-teal-400", "ring-offset-2")
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

// --- 북마크 포켓몬 리스트 ---
function renderList() {
  if (!listEl) return;

  if (pokemons.length === 0) {
    listEl.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:#9ca3af; padding:40px 0;">
        북마크된 포켓몬이 없습니다 😢
      </div>
    `;
    updateCount();
    return;
  }

  listEl.innerHTML = pokemons.map((pokemon) => {
    const isInParty = party.some((p) => p?.id === pokemon.id);
    return `
      <div
        data-id="${pokemon.id}"
        class="pokemon-pick-card"
        style="position:relative; cursor:pointer; border-radius:16px; transition:all 0.2s;
               ${isInParty ? "opacity:0.6; cursor:not-allowed; outline:2px solid #5eead4; outline-offset:2px;" : ""}"
      >
        ${isInParty ? `
          <span style="position:absolute; top:10px; right:10px; z-index:10;
                       width:24px; height:24px; background:#14b8a6; border-radius:50%;
                       display:flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,0.2);">
            <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </span>` : `
          <span style="position:absolute; top:10px; right:10px; z-index:10; opacity:0.2;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#374151" stroke-width="2"/>
              <path d="M2 12h20" stroke="#374151" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white" stroke="#374151" stroke-width="2"/>
            </svg>
          </span>`}
        ${PokemonCard(pokemon, pokemon.koName)}
      </div>
    `;
  }).join("");

  bindPokemonClick();
  updateCount();
}

function bindPokemonClick() {
  listEl.querySelectorAll("[data-id]").forEach((card) => {
    card.addEventListener("click", () => {
      if (selectedSlot === null) {
        alert("먼저 트레이너 카드의 슬롯을 선택해주세요.");
        return;
      }
      const id = Number(card.dataset.id);
      const pokemon = pokemons.find((p) => p.id === id);
      if (!pokemon) return;

      const duplicatedIndex = party.findIndex((p) => p?.id === pokemon.id);
      if (duplicatedIndex !== -1) {
        if (duplicatedIndex === selectedSlot) {
          party[selectedSlot] = null;
        } else {
          const temp = party[selectedSlot];
          party[selectedSlot] = party[duplicatedIndex];
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

function updateCount() {
  if (!countEl) return;
  countEl.textContent = `${party.filter(Boolean).length} / 6 선택됨`;
}

// --- 액션 버튼 ---
function bindActionButtons() {
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    party = Array(6).fill(null);
    selectedSlot = null;
    loadedPresetIndex = null;
    renderTrainerCard();
    renderList();
  });
  document.getElementById("saveBtn")?.addEventListener("click", openSaveModal);
}

// --- 모달 ---
function openSaveModal() {
  if (party.filter(Boolean).length === 0) {
    alert("포켓몬을 하나 이상 선택한 뒤 저장해주세요.");
    return;
  }
  if (presets.length >= 3) {
    alert("파티는 최대 3개까지 저장할 수 있습니다.");
    return;
  }

  const modal = document.getElementById("preset-modal");
  const input = document.getElementById("preset-name-input");
  if (!modal || !input) return;

  input.value = "";
  modal.classList.remove("hidden");
  input.focus();

  document.getElementById("modal-overlay")?.addEventListener("click", closeModal, { once: true });
  document.getElementById("modal-cancel")?.addEventListener("click", closeModal, { once: true });
  document.getElementById("modal-confirm")?.addEventListener("click", () => {
    const name = input.value.trim() || `나의 파티 ${presets.length + 1}`;
    closeModal();
    savePreset(name);
  }, { once: true });
}

function closeModal() {
  document.getElementById("preset-modal")?.classList.add("hidden");
}

// --- 프리셋 CRUD ---
async function savePreset(presetName) {
  const pokemonIds = party.filter(Boolean).map((p) => p.id);
  try {
    const res = await fetch(`${BASE_URL}/party`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ deckname: presetName, pocketmons: pokemonIds }),
    });
    if (!res.ok) throw new Error(`파티 저장 실패: ${res.status}`);
    const created = await res.json();

    presets.push({
      apiId: created.id,
      name: created.deckname,
      gender,
      pokemonIds: created.pocketmons,
      party: [...party],
    });
    renderPresets();
  } catch (err) {
    console.error("파티 저장 에러:", err);
    alert("파티 저장에 실패했습니다.");
  }
}

async function updatePreset(index) {
  const preset = presets[index];
  if (!preset?.apiId) return;
  const pokemonIds = party.filter(Boolean).map((p) => p.id);
  try {
    const res = await fetch(`${BASE_URL}/party/${preset.apiId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ deckname: preset.name, pocketmons: pokemonIds }),
    });
    if (!res.ok) throw new Error(`파티 수정 실패: ${res.status}`);
    presets[index].party = [...party];
    presets[index].pokemonIds = pokemonIds;
    presets[index].gender = gender;
    renderPresets();
  } catch (err) {
    console.error("파티 수정 에러:", err);
    alert("파티 수정에 실패했습니다.");
  }
}

async function deletePreset(index) {
  const preset = presets[index];
  if (!preset?.apiId) return;
  try {
    const res = await fetch(`${BASE_URL}/party/${preset.apiId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`파티 삭제 실패: ${res.status}`);
    presets.splice(index, 1);
    if (loadedPresetIndex === index) loadedPresetIndex = null;
    renderPresets();
  } catch (err) {
    console.error("파티 삭제 에러:", err);
    alert("파티 삭제에 실패했습니다.");
  }
}

// --- 프리셋 렌더링 ---
function renderPresets() {
  presetCountEl.textContent = `${presets.length} / 3`;

  if (presets.length === 0) {
    presetListEl.innerHTML = `
      <div style="border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0;
                  padding:12px 16px; font-size:14px; color:#94a3b8; text-align:center;">
        아직 저장된 파티가 없습니다.
      </div>
    `;
    return;
  }

  presetListEl.innerHTML = presets.map((preset, index) => {
    const color = PRESET_COLORS[index % PRESET_COLORS.length];
    const isLoaded = loadedPresetIndex === index;
    return `
      <div style="display:flex; align-items:center; justify-content:space-between;
                  border-radius:12px; padding:10px 12px; border:1px solid;
                  ${color.bg} transition:all 0.15s;
                  ${isLoaded ? "outline:2px solid #5eead4; outline-offset:1px;" : ""}">
        <button type="button"
          style="display:flex; align-items:center; gap:8px; text-align:left; flex:1; min-width:0; background:none; border:none; cursor:pointer;"
          data-load-index="${index}">
          <span style="font-size:13px; font-weight:600; ${color.text} white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(preset.name)}
          </span>
        </button>
        <div style="display:flex; align-items:center; gap:4px; margin-left:8px; flex-shrink:0;">
          ${isLoaded ? `
            <button type="button"
              style="font-size:12px; font-weight:600; color:#0d9488; padding:4px 8px;
                     border-radius:8px; border:none; background:none; cursor:pointer;"
              data-update-index="${index}">수정</button>
          ` : ""}
          <button type="button"
            style="width:24px; height:24px; display:flex; align-items:center; justify-content:center;
                   color:#d1d5db; border:none; background:none; cursor:pointer; border-radius:8px; font-size:14px;"
            data-delete-index="${index}">✕</button>
        </div>
      </div>
    `;
  }).join("");

  bindPresetEvents();
}

function bindPresetEvents() {
  document.querySelectorAll("[data-load-index]").forEach((btn) =>
    btn.addEventListener("click", () => loadPreset(Number(btn.dataset.loadIndex)))
  );
  document.querySelectorAll("[data-update-index]").forEach((btn) =>
    btn.addEventListener("click", () => updatePreset(Number(btn.dataset.updateIndex)))
  );
  document.querySelectorAll("[data-delete-index]").forEach((btn) =>
    btn.addEventListener("click", () => deletePreset(Number(btn.dataset.deleteIndex)))
  );
}

function loadPreset(index) {
  const preset = presets[index];
  if (!preset) return;
  gender = preset.gender || "man";
  party = [...preset.party];
  selectedSlot = null;
  loadedPresetIndex = index;
  renderTrainerCard();
  renderList();
  renderPresets();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}