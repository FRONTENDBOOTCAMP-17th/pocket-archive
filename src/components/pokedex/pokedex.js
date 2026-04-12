import {
  SidebarItem,
  PokemonCard,
  Pagination,
  PokemonModalContent,
} from "./pokedexUI.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

let allPokemon = [];
let filteredPokemon = [];
let myPocketMons = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// PokeAPI 데이터 캐시
const pokemonCache = new Map();

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
  // 로그인이 되어있으면 실행
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
      document.getElementById("pokemon-modal")?.classList.add("hidden");
    });
  document
    .getElementById("pokemon-modal-overlay")
    ?.addEventListener("click", () => {
      document.getElementById("pokemon-modal")?.classList.add("hidden");
    });

  setupSearch();
  renderSidebar();
  renderGrid(1);
}

// 나중에 api에 쑤셔 박을것
export async function loadPoketmons() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/pocketmons`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("불러오기 실패");
    }
    const result = await res.json();
    return result.data.myPocketmons;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// PokeAPI에서 포켓몬 상세 정보 가져오기 (캐싱 포함)
export async function fetchPokemonDetail(no) {
  if (pokemonCache.has(no)) {
    return pokemonCache.get(no);
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${no}`);
    if (!res.ok) throw new Error(`API 오류: ${res.status}`);
    const data = await res.json();
    pokemonCache.set(no, data);
    return data;
  } catch (error) {
    console.error(`포켓몬 ${no} 데이터 로드 실패:`, error);
    return null;
  }
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
  //아이디값을 못불러오면 함수 리턴 해버림
  if (!pag) {
    return;
  }
  // 나누기값이 1이거나 그 밑값이면 pagenation 빈값
  if (total <= 1) {
    return (pag.innerHTML = "");
  }

  pag.innerHTML = Pagination(currentPage, total);
  //클릭 이벤트
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

// 비동기로 해야함 이거 비동기로 안하면 저희 페이지네이션 움직일때마다 데이터 받아오는거 생각해야함
async function movePage(p) {
  const total = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const page = Math.max(1, Math.min(total, parseInt(p) || 1));

  currentPage = page;
  await renderGrid(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 전역 윈도우 함수 (왼쪽에 포켓몬 사이드바안에 있는 포켓몬 no. 어쩌고 클릭하면 실행되는 함수임)
window.selectPokemon = async function (no) {
  const modal = document.getElementById("pokemon-modal");
  const content = document.getElementById("pokemon-modal-content");
  if (!modal || !content) return;

  // 로딩 표시 후 모달 열기
  content.innerHTML = `
    <div class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  `;
  modal.classList.remove("hidden");

  try {
    const p = allPokemon.find((item) => item.no === no);
    if (!p) throw new Error("해당 포켓몬 데이터를 찾을 수 없습니다.");

    const [data, species] = await Promise.all([
      fetchPokemonDetail(no),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${no}`).then((r) =>
        r.json(),
      ),
    ]);

    if (!data) throw new Error("포켓몬 정보를 불러올 수 없습니다.");

    const isBookmarked = myPocketMons.includes(no);
    content.innerHTML = PokemonModalContent(
      data,
      p.name,
      species,
      isBookmarked,
    );
  } catch (error) {
    console.error("모달 로드 실패:", error);
    content.innerHTML = `
      <div class="text-center py-10 text-white">
        <p class="font-bold">정보를 불러오지 못했습니다.</p>
      </div>
    `;
  }
};

// 등록 api
export async function poketmonReg(poketmonId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/pocketmons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pocketmonId: Number(poketmonId),
      }),
    });
    if (!res.ok) {
      throw new Error(`등록 실패: ${res.status}`);
    }
    return true;
  } catch (error) {
    console.error("포켓몬 등록 에러:", error);
    return false;
  }
}

export async function poketmonDelete(poketmonId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/pocketmons/${poketmonId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`삭제 실패: ${res.status}`);
    }
    return true;
  } catch (error) {
    console.error("포켓몬 삭제 에러:", error);
    return false;
  }
}
window.poketmonReg = async function (event, id) {
  event.stopPropagation(); // 카드 클릭 이벤트 전파 방지
  await poketmonReg(id);

  myPocketMons.push(id);
  renderGrid(currentPage);
};
window.poketmonDelete = async function (event, id) {
  event.stopPropagation(); // 카드 클릭 이벤트 전파 방지
  await poketmonDelete(id);

  myPocketMons = myPocketMons.filter((item) => item !== id);
  renderGrid(currentPage);
};
