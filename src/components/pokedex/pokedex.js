import { SidebarItem, PokemonCard, Pagination } from "./pokedexUi";

let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

export async function initPokedex() {
  //포켓몬 json 불러와서 쓰기
  const res = await fetch("/pokemon_full_ko.json");
  allPokemon = await res.json();
  //얕복해서 쓰기
  filteredPokemon = [...allPokemon];

  setupSearch();
  renderSidebar();
  renderGrid(1);
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

  const promises = pageItems.map((p) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${p.no}`).then((r) => r.json()),
  );

  const details = await Promise.all(promises);

  details.forEach((data, idx) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = PokemonCard(data, pageItems[idx].name);
    grid.appendChild(wrapper.firstElementChild);
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
  const grid = document.getElementById("pokemonGrid");
  const pag = document.getElementById("pokedexPagination");

  if (!grid) {
    return;
  }

  try {
    const p = allPokemon.find((item) => item.no === no);
    if (!p) {
      throw new Error("해당 포켓몬 데이터를 찾을 수 없습니다.");
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${no}`);

    if (!res.ok) {
      throw new Error("네트워크 응답이 올바르지 않습니다.");
    }

    const data = await res.json();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = PokemonCard(data, p.name);

    grid.innerHTML = "";
    grid.appendChild(wrapper.firstElementChild);

    if (pag) pag.innerHTML = "";
    // 왼쪽에 있는 사이드바 클릭시 위로 이동 즉 밑에서 클릭해도 맨 위로 가짐
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("포켓몬 상세 정보 로드 실패:", error);
    //에러 뜨면 이런 화면 보여줄거임
    grid.innerHTML = `
      <div class="col-span-full text-center py-20">
        <p class="text-red-500 font-bold">정보를 불러오지 못했습니다.</p>
        <button onclick="location.reload()" class="mt-4 text-sm text-gray-500 underline">새로고침</button>
      </div>
    `;
  }
};
