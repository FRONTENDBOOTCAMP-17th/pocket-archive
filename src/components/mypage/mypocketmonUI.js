import { TYPE_COLORS } from "../pokedex/pokedexUI.js";

export const K_TYPE = {
  NORMAL: "노말",
  FIRE: "불꽃",
  WATER: "물",
  GRASS: "풀",
  ELECTRIC: "전기",
  FIGHTING: "격투",
  FLYING: "비행",
  POISON: "독",
  GROUND: "땅",
  ROCK: "바위",
  BUG: "벌레",
  GHOST: "고스트",
  STEEL: "강철",
  PSYCHIC: "에스퍼",
  ICE: "얼음",
  DRAGON: "드래곤",
  DARK: "악",
  FAIRY: "페어리",
};

export function PokemonViewCard(data, koName) {
  const types = data.types.map((t) => t.type.name);
  const img = data.sprites.other["official-artwork"].front_default;
  return `
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-fit w-full">
      <div onclick="selectPokemon(${data.id})" class="relative h-44 flex items-center justify-center bg-[#F7F9F8] transition-colors shrink-0" >
        <img src="${img}" class="w-28 h-28 object-contain drop-shadow-md">
      </div>
      <div class="flex flex-col gap-4" style="padding: 10px;">
        <div class="flex flex-col gap-1.5">
          <span class="text-[11px] font-black text-gray-300 tracking-wider leading-none" style="padding: 5px">
            No.${String(data.id).padStart(3, "0")}
          </span>
          <div style="padding: 5px">
            <h3 class="text-xl font-black text-gray-800 leading-tight">${koName}</h3>
          </div>
        </div>
        <div class="flex flex-wrap gap-2" style="padding: 5px">
          ${types
            .map(
              (t) => `
            <span class="flex items-center justify-center px-3 py-1 h-6 rounded-full text-white text-md uppercase tracking-tight ${TYPE_COLORS[t] || "bg-gray-400"} shadow-sm min-w-15" style="padding: 5px">
              ${K_TYPE[t.toUpperCase()] || t}
            </span>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

export function MyPocketmonLayout(count) {
  return `
    <div class="bg-white rounded-2xl" style="padding: 24px;">
      <h2 class="text-xl font-bold text-[#1a3a35]" style="margin-bottom: 24px;">
        내가 지닌 포켓몬 <span class="whitespace-nowrap"><span class="text-[#00bba7]">${count}</span>마리</span>
      </h2>
      <style>
        #my-pokemon-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
        }
        @media (min-width: 461px)  { #my-pokemon-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 672px)  { #my-pokemon-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (min-width: 1440px) { #my-pokemon-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        @media (min-width: 1920px) { #my-pokemon-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
        @media (min-width: 2560px) { #my-pokemon-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
      </style>
      <div class="overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#00bba7_transparent]" style="max-height: 70vh;">
        <div id="my-pokemon-grid"></div>
      </div>
    </div>
  `;
}

export function MyPocketmonEmpty() {
  return `
    <div class="bg-white rounded-2xl text-center text-gray-400" style="padding: 24px;">
      <p class="text-lg font-semibold">포획한 포켓몬이 없습니다.</p>
      <p class="text-sm mt-2">포켓몬 도감에서 포켓몬을 포획해보세요!</p>
    </div>
  `;
}
