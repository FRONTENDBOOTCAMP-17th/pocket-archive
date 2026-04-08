import { TrainerCard } from "../components/trainerCard.js";
import { PokemonCard } from "../components/pokedex/pokedexUI.js";


const BASE_URL = import.meta.env.VITE_BASE_URL;

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

let searchQuery = "";


// 개발용 더미 포켓몬 ID (API 미인증 시 폴백)
const DUMMY_IDS = [1, 4, 7, 25, 39, 94];

// 프리셋 행 색상 팔레트 
const PRESET_COLORS = [
  { bg: "background-color:#fff7ed; border-color:#fed7aa;", text: "color:#ea580c;" },
  { bg: "background-color:#eff6ff; border-color:#bfdbfe;", text: "color:#2563eb;" },
  { bg: "background-color:#f0fdfa; border-color:#99f6e4;", text: "color:#0d9488;" },
];

// 인증
function getToken() {
  return localStorage.getItem("token") || "";
}
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// 초기화 
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

  await loadBookmarkedPokemons();
  await loadPartyPresets();

  renderTrainerCard();
  renderList();
  renderPresets();
  bindActionButtons();
  bindSearch();
  bindBookmarkEvents()
}

// 한국어 이름 맵 로드
async function fetchKoNames(list) {
  try {
    const res = await fetch("/public/pokemon_full_ko.json");
    const json = await res.json();
    
    console.log(list);

    const mybookmarkpokemon = json.filter(p => list.includes(p.no));

    
    console.log(mybookmarkpokemon);
    return mybookmarkpokemon;
    // if (Array.isArray(json)) {
    //   json.forEach((p) => { koNameMap[p.id] = p.name; });
    // } else {
    //   koNameMap = json;
    // }
  } catch (e) {
    console.warn("한국어 이름 파일 로드 실패:", e);
  }
}

//북마크 내 검색
function bindSearch() {
  const searchInput = document.getElementById("pokemon-search");
  console.log("검색창 찾음:", searchInput); // ← null이면 id 문제
  if (!searchInput) return;
  
  searchInput.addEventListener("input", async (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    console.log("검색어:", searchQuery);
    await renderList();
  });
}

// 포켓몬 ID 배열 → PokeAPI 상세 데이터 변환
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

// 북마크 포켓몬 불러오기
async function loadBookmarkedPokemons() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/pocketmons`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error("불러오기 실패");
    }
    const result = await res.json();
    const ids = [...result.data.myPocketmons]; // 숫자 ID 배열

    // PokeAPI에서 상세 데이터 받기
    const pokemonDetails = await fetchPokemonsByIds(ids);

    // 한글 이름 매핑 데이터 받기 ({no, name} 배열)
    const koList = await fetchKoNames(ids);
    const koMap = {};
    koList.forEach((p) => { koMap[p.no] = p.name; });

    //  합치기: PokeAPI 객체에 koName 붙이기
    pokemons = pokemonDetails.map((p) => ({
      ...p,
      koName: koMap[p.id] || p.name,
    }));

    console.log("최종 pokemons:", pokemons);
  } catch (error) {
    console.error(error);
    pokemons = [];
  }

}

// 저장된 파티 불러오기
// loadPartyPresets — API 응답 구조 확인 후 배열 접근
//너였냐~~~~~~~~젠자앙~~~~~~~~
async function loadPartyPresets() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/party`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`파티 목록 조회 실패: ${res.status}`);
    const data = await res.json();
    
    console.log("파티 API 원본 응답:", JSON.stringify(data)); 
    
    const list = Array.isArray(data) ? data : data.data ?? [];
    console.log("파티 list:", list); 

    presets = list.map((p) => ({
      apiId: p.partyId,
      name: p.deckname,
      gender: "man",
      pokemonIds: p.pocketmons,
      // pokemons가 완성된 후 호출되므로 id 기준으로 매핑
      party: p.pocketmons.map((id) => pokemons.find((pk) => pk.id === id) || null),
    }));
    
    console.log("최종 presets:", presets);
  } catch (err) {
    console.error("파티 목록 로드 에러:", err);
    presets = [];
  }
}

// 트레이너 카드
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

// 북마크 포켓몬 리스트
// renderList에서 koNames를 별도로 받을 필요 없이 pokemons 그대로 사용
async function renderList() {
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

  //검색 기능
  const filtered = searchQuery ? pokemons.filter((p) =>
    p.koName?.toLowerCase().includes(searchQuery) ||
    p.name?.toLowerCase().includes(searchQuery) ||
    String(p.id).includes(searchQuery)
  ) : pokemons;

  if (filtered.length === 0) {
    listEl.innerHTML = `
    <div style= "gird-column:1/-1; tezt-align:center; color:#9ca3af; padding:40px 0;">
      검색 결과가 없습니다 😢
    </div>
    `;
    updateCount();
    return;
    
  }



  // koNames 별도 fetch 제거 — pokemons에 이미 koName이 있음
  listEl.innerHTML = filtered.map((pokemon) => {
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

// 액션 버튼
function bindActionButtons() {
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    party = Array(6).fill(null);
    selectedSlot = null;
    loadedPresetIndex = null;
    renderTrainerCard();
    renderList();
    renderPresets();
  });

  document.getElementById("saveBtn")?.addEventListener("click", () => {
    if (party.filter(Boolean).length === 0) {
      alert("포켓몬을 하나 이상 선택해주세요.");
      return;
    }
    if (loadedPresetIndex === null) {
      alert("저장할 슬롯을 선택해주세요.");
      return;
    }

    const preset = presets[loadedPresetIndex];
    if (preset) {
      openOverwriteModal();
    } else {
      openNewSaveModal();
    }
  });
}

//  완성버튼을 클릭 시 로드된 프리셋이 있으면 덮어쓰기 + 없으면 새저장 ㄲ
function openSaveModal() {
  if (party.filter(Boolean).length === 0) {
    alert("포켓몬을 하나 이상 선택한 뒤 저장해주세요.");
    return;
  }

  const modal = document.getElementById("preset-modal");
  const input = document.getElementById("preset-name-input");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  if (!modal || !input) return;

  // 로드된 프리셋이 있으면 덮어쓰기 모드
  if (loadedPresetIndex !== null) {
    const preset = presets[loadedPresetIndex];

    const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

    modalTitle.textContent = "파티 덮어쓰기";
    modalDesc.textContent = `"${preset.name}" 파티에 현재 구성을 덮어씁니다.`;
    input.value = preset.name;
    input.style.display = "none"; // 이름 수정 불필요하면 숨김
    modal.classList.remove("hidden");

    document.getElementById("modal-overlay")?.addEventListener("click", closeModal, { once: true });
    document.getElementById("modal-cancel")?.addEventListener("click", closeModal, { once: true });
    document.getElementById("modal-confirm")?.addEventListener("click", () => {
      closeModal();
      updatePreset(loadedPresetIndex);
    }, { once: true });

  } else {
    // 새 저장 모드
    if (presets.length >= 3) {
      alert("파티는 최대 3개까지 저장할 수 있습니다.");
      return;
    }
    modalTitle.textContent = "파티 이름 저장";
    modalDesc.textContent = "나만의 파티 이름을 입력해주세요";
    input.value = "";
    input.style.display = "block";
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
}

function closeModal() {
  document.getElementById("preset-modal")?.classList.add("hidden");
}

//  프리셋 CRUD
async function savePreset(presetName) {
  const pokemonIds = party.filter(Boolean).map((p) => p.id);
  try {
    const res = await fetch(`${BASE_URL}/party`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ deckname: presetName, pocketmons: pokemonIds }),
    });
    if (!res.ok) throw new Error(`파티 저장 실패: ${res.status}`);

    // 저장 응답 파싱 대신 목록 전체를 다시 불러오기
    await loadPartyPresets();
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
    
    const updated = await res.json();
    presets[index].party = [...party];

    // 응답에서 뼝
    presets[index].pokemonIds = updated.pocketmons; 
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
    
    if (loadedPresetIndex === index) loadedPresetIndex = null;

    await loadPartyPresets(); 
    renderPresets();

  } catch (err) {
    console.error("파티 삭제 에러:", err);
    alert("파티 삭제에 실패했습니다.");
  }
}

// 프리셋 렌더링
function renderPresets() {
  presetCountEl.textContent = `${presets.length} / 3`;

  presetListEl.innerHTML = [0, 1, 2].map((slotIndex) => {
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
  }).join("");

  bindPresetEvents();
}

function bindPresetEvents() {
  // 채워진 슬롯 클릭 → 파티 로드
  document.querySelectorAll("[data-load-index]").forEach((btn) =>
    btn.addEventListener("click", () => loadPreset(Number(btn.dataset.loadIndex)))
  );

  // 삭제
  document.querySelectorAll("[data-delete-index]").forEach((btn) =>
    btn.addEventListener("click", () => deletePreset(Number(btn.dataset.deleteIndex)))
  );

  // 빈 슬롯 클릭 → 트레이너 카드 초기화 + 해당 슬롯 선택
  document.querySelectorAll("[data-new-slot]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const slotIndex = Number(btn.dataset.newSlot);
      party = Array(6).fill(null);
      selectedSlot = null;
      loadedPresetIndex = slotIndex; // 빈 슬롯도 선택 상태로
      renderTrainerCard();
      renderList();
      renderPresets();
    })
  );
}



// 덮어쓰기 모달
function openOverwriteModal() {
  const preset = presets[loadedPresetIndex];
  const modal = document.getElementById("preset-modal");
  const input = document.getElementById("preset-name-input");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");

  if (modalTitle) modalTitle.textContent = "파티 덮어쓰기";
  if (modalDesc) modalDesc.textContent = `"${preset.name}" 파티에 현재 구성을 덮어씁니다.`;
  input.style.display = "none";
  modal.classList.remove("hidden");

  document.getElementById("modal-overlay")?.addEventListener("click", () => { input.style.display = "block"; closeModal(); }, { once: true });
  document.getElementById("modal-cancel")?.addEventListener("click", () => { input.style.display = "block"; closeModal(); }, { once: true });
  document.getElementById("modal-confirm")?.addEventListener("click", () => {
    input.style.display = "block";
    closeModal();
    updatePreset(loadedPresetIndex);
  }, { once: true });
}

// 새 저장 모달
function openNewSaveModal() {
  const modal = document.getElementById("preset-modal");
  const input = document.getElementById("preset-name-input");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");

  if (modalTitle) modalTitle.textContent = "파티 이름 저장";
  if (modalDesc) modalDesc.textContent = "나만의 파티 이름을 입력해주세요";
  input.value = "";
  input.style.display = "block";
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


// init() 안에 추가
function bindBookmarkEvents() {
  window.poketmonDelete = async function(event, id) {
    event.stopPropagation();
    try {
      const res = await fetch(`${BASE_URL}/pocketmons/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("삭제 실패");
      
      // 로컬 목록에서 제거 후 다시 렌더링
      pokemons = pokemons.filter((p) => p.id !== id);
      
      // 파티에서도 제거
      party = party.map((p) => p?.id === id ? null : p);
      
      renderTrainerCard();
      renderList();
    } catch (err) {
      console.error("북마크 삭제 에러:", err);
    }
  };
}