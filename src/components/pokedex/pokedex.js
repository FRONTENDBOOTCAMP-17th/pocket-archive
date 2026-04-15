import {
  SidebarItem,
  PokemonCard,
  Pagination,
  PokemonModalContent,
} from "./pokedexUI.js";
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  loadPoketmons,
  poketmonReg,
  poketmonDelete,
} from "../../api/pokemonApi.js";

let allPokemon = [];
let filteredPokemon = [];
let myPocketMons = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

export async function initPokedex() {
  try {
    const res = await fetch("/pokemon_full_ko.json");
    if (!res.ok) throw new Error("포켓몬 데이터 로드 실패");
    allPokemon = await res.json();
  } catch (error) {
    console.error("포켓몬 JSON 로드 에러:", error);
    allPokemon = [];
    return;
  }

  filteredPokemon = [...allPokemon];
  const isLoggedIn = localStorage.getItem("token");
  if (isLoggedIn) {
    myPocketMons = await loadPoketmons();
  } else {
    myPocketMons = [];
  }

  // 포켓몬 정보 모달 닫기
  document
    .getElementById("pokemon-modal-close")
    ?.addEventListener("click", () => {
      const m = document.getElementById("pokemon-modal");
      m?.classList.add("hidden"); m?.classList.remove("flex");
    });
  document
    .getElementById("pokemon-modal-overlay")
    ?.addEventListener("click", () => {
      const m = document.getElementById("pokemon-modal");
      m?.classList.add("hidden"); m?.classList.remove("flex");
    });

  setupSearch();
  renderSidebar();
  await renderGrid(1);

  // 이벤트 위임: 그리드 + 사이드바 각 컨테이너에 한 번만 등록
  bindGridEvents();
  bindSidebarEvents();
}

function setupSearch() {
  const searchInput = document.getElementById("sidebarSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    filteredPokemon = allPokemon.filter(
      (p) => p.name.includes(keyword) || String(p.no).includes(keyword),
    );
    currentPage = 1;
    renderSidebar();
    renderGrid(1);
  });
}

function renderSidebar() {
  const list = document.getElementById("sidebarList");
  if (!list) return;
  list.innerHTML = filteredPokemon.map((p) => SidebarItem(p)).join("");
}

async function renderGrid(page) {
  const grid = document.getElementById("pokemonGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredPokemon.slice(start, start + ITEMS_PER_PAGE);

  const promises = pageItems.map((p) => fetchPokemonDetail(p.no));
  const details = await Promise.allSettled(promises);

  details.forEach((result, idx) => {
    if (result.status === "fulfilled" && result.value) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = PokemonCard(
        result.value,
        pageItems[idx].name,
        myPocketMons,
      );
      grid.appendChild(wrapper.firstElementChild);
    }
  });

  renderPagination();
}

function renderPagination() {
  const pag = document.getElementById("pokedexPagination");
  const total = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  if (!pag) return;
  if (total <= 1) {
    pag.innerHTML = "";
    return;
  }

  pag.innerHTML = Pagination(currentPage, total);
  pag.onclick = (e) => {
    const btn = e.target.closest(".page-btn") || e.target.closest("#jumpBtn");
    if (btn) {
      movePage(btn.dataset?.page || pag.querySelector("#jumpIn").value);
    }
  };

  pag.querySelector("#jumpIn")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") movePage(e.target.value);
  });
}

async function movePage(p) {
  const total = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const page = Math.max(1, Math.min(total, parseInt(p) || 1));

  currentPage = page;
  await renderGrid(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── 이벤트 위임 ────────────────────────────────────────────
function bindGridEvents() {
  const grid = document.getElementById("pokemonGrid");
  if (!grid) return;

  grid.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === "select-pokemon") {
      await openPokemonModal(id);
    } else if (action === "poketmon-reg") {
      e.stopPropagation();
      await registerPokemon(id);
    } else if (action === "poketmon-delete") {
      e.stopPropagation();
      await deletePokemonBookmark(id);
    }
  });
}

function bindSidebarEvents() {
  const sidebar = document.getElementById("sidebarList");
  if (!sidebar) return;

  sidebar.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action='select-pokemon']");
    if (!target) return;
    await openPokemonModal(Number(target.dataset.id));
  });
}

// ─── 로컬 액션 함수 ──────────────────────────────────────────
async function openPokemonModal(no) {
  const modal = document.getElementById("pokemon-modal");
  const content = document.getElementById("pokemon-modal-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  `;
  modal.classList.remove("hidden"); modal.classList.add("flex");

  try {
    const p = allPokemon.find((item) => item.no === no);
    if (!p) throw new Error("해당 포켓몬 데이터를 찾을 수 없습니다.");

    const [data, species] = await Promise.all([
      fetchPokemonDetail(no),
      fetchPokemonSpecies(no),
    ]);

    if (!data) throw new Error("포켓몬 정보를 불러올 수 없습니다.");

    content.innerHTML = PokemonModalContent(data, p.name, species);
  } catch (error) {
    console.error("모달 로드 실패:", error);
    content.innerHTML = `
      <div class="text-center py-10 text-white">
        <p class="font-bold">정보를 불러오지 못했습니다.</p>
      </div>
    `;
  }
}

async function registerPokemon(id) {
  await poketmonReg(id);
  myPocketMons.push(id);
  renderGrid(currentPage);
}

async function deletePokemonBookmark(id) {
  await poketmonDelete(id);
  myPocketMons = myPocketMons.filter((item) => item !== id);
  renderGrid(currentPage);
}
