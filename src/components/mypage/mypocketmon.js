import { getMyPocketmons } from "../../api/user.js";
import {
  PokemonViewCard,
  MyPocketmonLayout,
  MyPocketmonEmpty,
} from "./mypocketmonUI.js";
import { PokemonModalContent } from "../pokedex/pokedexUI.js";

const pokemonCache = new Map();
let allPokemon = [];
let myPocketmons = [];

async function fetchPokemonDetail(no) {
  if (pokemonCache.has(no)) return pokemonCache.get(no);
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${no}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    pokemonCache.set(no, data);
    return data;
  } catch {
    return null;
  }
}

export async function initMyPocketmon() {
  const content = document.getElementById("mypage-content");
  content.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">불러오는 중...</p>`;

  // 모달 닫기 이벤트
  document.getElementById("pokemon-modal-close")?.addEventListener("click", () => {
    document.getElementById("pokemon-modal")?.classList.add("hidden");
  });
  document.getElementById("pokemon-modal-overlay")?.addEventListener("click", () => {
    document.getElementById("pokemon-modal")?.classList.add("hidden");
  });

  try {
    const [pocketResult, jsonRes] = await Promise.all([
      getMyPocketmons(),
      fetch("/pokemon_full_ko.json"),
    ]);

    myPocketmons = (pocketResult.data.myPocketmons ?? []).sort((a, b) => a - b);
    if (jsonRes.ok) allPokemon = await jsonRes.json();
  } catch (e) {
    console.error(e);
    content.innerHTML = `<p style="text-align:center; padding:40px; color:red;">포켓몬 정보를 불러오지 못했습니다.</p>`;
    return;
  }

  if (myPocketmons.length === 0) {
    content.innerHTML = MyPocketmonEmpty();
    return;
  }

  content.innerHTML = MyPocketmonLayout(myPocketmons.length);

  const grid = document.getElementById("my-pokemon-grid");
  const details = await Promise.allSettled(
    myPocketmons.map((id) => fetchPokemonDetail(id)),
  );

  details.forEach((result, idx) => {
    if (result.status === "fulfilled" && result.value) {
      const data = result.value;
      const koEntry = allPokemon.find((p) => p.no === myPocketmons[idx]);
      const koName = koEntry?.name ?? data.name;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = PokemonViewCard(data, koName);
      grid.appendChild(wrapper.firstElementChild);
    }
  });

  // 이벤트 위임: 그리드 컨테이너에 한 번만 등록
  bindGridEvents(grid);
}

function bindGridEvents(grid) {
  if (!grid) return;
  grid.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action='select-pokemon']");
    if (!target) return;
    await openPokemonModal(Number(target.dataset.id));
  });
}

async function openPokemonModal(no) {
  const modal = document.getElementById("pokemon-modal");
  const content = document.getElementById("pokemon-modal-content");
  if (!modal || !content) return;

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
