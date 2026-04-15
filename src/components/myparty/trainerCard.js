export function TrainerCard({ gender = 'man', party = [] }) {
  const img = gender === 'woman' ? '/assets/trianercard_woman.png' : '/assets/trianercard_man.png';

  //이미지 위 슬롯 위치 설정
  const slotPositions = [
    { top: '35%', left: '4%' },
    { top: '35%', left: '25%' },
    { top: '35%', left: '46%' },
    { top: '54%', left: '4%' },
    { top: '54%', left: '25%' },
    { top: '54%', left: '46%' },
  ];

  return `
    <div class="w-full max-w-150">
      
      <!-- 성별 선택 -->
      <div class=" mb-3 flex justify-end">
        <select
          id="gender-select"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          style="padding:8px 20px; font-size:14px;"
        >
          <option value="man" ${gender === 'man' ? 'selected' : ''}>남자 트레이너</option>
          <option value="woman" ${gender === 'woman' ? 'selected' : ''}>여자 트레이너</option>
        </select>
      </div>

      <!-- 카드 -->
      <div class="relative w-full rounded-lg overflow-hidden">
        
        <!-- 트레이너 이미지 -->
        <img src="${img}" class="block w-full h-auto select-none" />

        <!-- 슬롯 -->
        ${slotPositions
          .map((pos, i) => {
            const pokemon = party[i];

            return `
              <button
                  type="button"
                  class="slot absolute transition-all ${
                    pokemon ? 'bg-white/20' : 'bg-white/10 border-2 border-dashed border-gray-300'
                  } hover:bg-white/40 hover:border-teal-400 rounded-lg backdrop-blur-sm"
                  style="
                    top:${pos.top};
                    left:${pos.left};
                    width:20%;
                    height:17%;
                  "
                  data-index="${i}"
                >
                ${
                  pokemon
                    ? `
                  <img
                    src="${pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || ''}"
                    alt="${pokemon.name}"
                    class="absolute inset-0 h-full w-full object-contain p-2 pointer-events-none"
                  />
                `
                    : `
                  <span class="absolute inset-0 flex items-center justify-center text-3xl text-gray-400 pointer-events-none">+</span>
                `
                }
              </button>
            `;
          })
          .join('')}

      </div>
    </div>
  `;
}
