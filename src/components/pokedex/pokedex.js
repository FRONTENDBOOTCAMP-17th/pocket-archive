import { TYPE_COLORS } from "./pokedexUI.js";

export const PokemonCard = (data, koName) => {
  const types = data.types.map((t) => t.type.name);
  const img = data.sprites.other["official-artwork"].front_default;

  return `
    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-full w-full">
      <div class="relative h-44 flex items-center justify-center bg-[#F7F9F8] group-hover:bg-[#E8F5E9] transition-colors shrink-0">
          <img src="${img}" class="w-28 h-28 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110">
      </div>
      <div class="p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-black text-gray-300 tracking-wider leading-none" style="padding: 5px">
                  No.${String(data.id).padStart(3, "0")}
              </span>
              <div class="flex justify-between items-center" style="padding: 5px">
                  <h3 class="text-xl font-black text-gray-800 leading-tight">${koName}</h3>
              </div>
          </div>
          <div class="flex flex-wrap gap-2" style="padding: 5px">
              ${types
                .map(
                  (t) => `
                <span class="flex items-center justify-center px-3 py-1 h-6 rounded-full text-white font-bold text-[10px] uppercase tracking-tight ${TYPE_COLORS[t] || "bg-gray-400"} shadow-sm min-w-[60px]">
                  ${t}
                </span>
              `,
                )
                .join("")}
          </div>
      </div>
    </div>
  `;
}