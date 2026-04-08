//이건 저희가 피그마에서 TYPE_COLOR를 정해놓은것
export const TYPE_COLORS = {
  grass: 'bg-[#7AC74C]',
  poison: 'bg-[#A33EA1]',
  fire: 'bg-[#EE8130]',
  water: 'bg-[#6390F0]',
  bug: 'bg-[#A6B91A]',
  normal: 'bg-[#A8A77A]',
  electric: 'bg-[#F8D030]',
  fairy: 'bg-[#D685AD]',
  ground: 'bg-[#E2BF65]',
  psychic: 'bg-[#F95587]',
  rock: 'bg-[#B6A136]',
  ghost: 'bg-[#735797]',
  ice: 'bg-[#96D9D6]',
  dragon: 'bg-[#6F35FC]',
  flying: 'bg-[#A98FF3]',
  fighting: 'bg-[#C22E28]',
  steel: 'bg-[#B7B7CE]',
  dark: 'bg-[#705746]',
};

//JSON에 있는 한글 이름 포켓몬을 꺼내와서 목록을 보여주는? 컴포넌트
export const SidebarItem = (p) => `
  <div onclick="selectPokemon(${p.no})" 
       style="display: flex; align-items: center; min-height: 48px; padding: 0 0 0 24px; cursor: pointer;" 
       class="p-3 text-sm text-gray-400 rounded-xl hover:bg-[#E8F5E9] hover:text-[#05B29F] transition-all">
      No.${p.no} ${p.name}
  </div>
`;

const K_TYPE = {
  NORMAL: '노말',
  FIRE: '불꽃',
  WATER: '물',
  GRASS: '풀',
  ELECTRIC: '전기',
  FIGHTING: '격투',
  FLYING: '비행',
  POISON: '독',
  GROUND: '땅',
  ROCK: '바위',
  BUG: '벌레',
  GHOST: '고스트',
  STEEL: '강철',
  PSYCHIC: '에스퍼',
  ICE: '얼음',
  DRAGON: '드래곤',
  DARK: '악',
  FAIRY: '페어리',
};

// 포켓몬 카드 재활용되는 곳은 도감
export const PokemonCard = (data, koName, myPocketMons = []) => {
  if (!data || !data.types) {
    console.warn('PokemonCard: 데이터 없음', data);
    return '';
  }
  const types = data.types.map((t) => t.type.name);

  //ai 안에 보면 고화질 이미지가 이거임 이거 앞모습 가져오는거임
  const img = data.sprites.other['official-artwork'].front_default;
  // const apiUrl = process.env.BASE_URL;
  const isLoggedIn = localStorage.getItem('token');

  return `
    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-fit w-full">
      <div class="relative h-44 flex items-center justify-center bg-[#F7F9F8] group-hover:bg-[#E8F5E9] transition-colors shrink-0">
          <img src="${img}" class="w-28 h-28 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110">
      </div>
      <div class="p-6 flex flex-col gap-4" style="padding: 10px;">
          <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-black text-gray-300 tracking-wider leading-none" style="padding: 5px">
                  No.${String(data.id).padStart(3, '0')}
              </span>
              <div class="flex justify-between items-center" style="padding: 5px">
                  <h3 class="text-xl font-black text-gray-800 leading-tight">${koName}</h3>
                  ${
                    isLoggedIn
                      ? myPocketMons.includes(data.id)
                        ? `<div class="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110" id="poketmonDelete" onclick="poketmonDelete(event,${data.id})">${pokeBallOn}</div>`
                        : `<div class="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110" id="poketmonReg" onclick="poketmonReg(event,${data.id})">${pokeBallOff}</div>`
                      : ''
                  }
              </div>
          </div>
          <div class="flex flex-wrap gap-2" style="padding: 5px">
              ${types
                .map(
                  (t) => `
                <span class="flex items-center justify-center px-3 py-1 h-6 rounded-full text-white text-md uppercase tracking-tight ${TYPE_COLORS[t] || 'bg-gray-400'} shadow-sm min-w-[60px]">
                  ${K_TYPE[t.toUpperCase()] || t}
                </span>
              `,
                )
                .join('')}
          </div>
      </div>
    </div>
  `;
};

// 게시판 , 도감 등등에 쓰일 pagenation 함수
export const Pagination = (currentPage, total) => {
  //얕복 하기
  const range = [...new Set([1, total, currentPage - 1, currentPage, currentPage + 1])].filter((p) => p > 0 && p <= total).sort((a, b) => a - b);

  let html = '';
  // 너무 길면 ... 처리
  range.forEach((p, i) => {
    if (i > 0 && p - range[i - 1] > 1) {
      html += `<span class="px-2 text-gray-400">...</span>`;
    }

    const isCurrent = p === currentPage;
    const btnClass = isCurrent
      ? 'bg-[#22A9DA] bg-opacity-40 text-white border-[#22A9DA]'
      : 'bg-transparent text-gray-400 border-gray-200 hover:border-[#22A9DA]';

    html += `
      <button data-page="${p}" class="page-btn w-10 h-10 rounded-xl font-bold border transition-all ${btnClass}">
        ${p}
      </button>`;
  });

  html += `
    <div class="flex items-center gap-2 ml-4 border-l pl-4 border-gray-100">
      <input type="number" id="jumpIn" 
             class="w-12 h-10 bg-transparent border border-gray-200 rounded-lg text-center text-sm focus:border-[#22A9DA] focus:outline-none" 
             placeholder="${currentPage}">
      <button id="jumpBtn" class="px-3 h-10 border border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
        이동
      </button>
    </div>`;

  return html;
};

window.toggleSidebar = function () {
  // PC 버전(1024px 이상)일 때는 클릭 무시
  if (window.innerWidth >= 1024) return;

  const content = document.getElementById('sidebarContent');
  const arrow = document.getElementById('sidebarArrow');

  if (!content) return;

  const isOpening = content.classList.contains('hidden');

  if (isOpening) {
    content.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
};

window.addEventListener('resize', () => {
  const content = document.getElementById('sidebarContent');
  const arrow = document.getElementById('sidebarArrow');

  if (window.innerWidth >= 1024) {
    if (content) content.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
});
// 북마크(도감에서 좋아요? 누르는 투명 포켓몬볼) SVG 아이콘 로그인이 안되어있으면 안보여줄거임
export const pokeBallOff = `
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_405_18)">
      <path d="M15 28.5C22.4558 28.5 28.5 22.4558 28.5 15C28.5 7.54416 22.4558 1.5 15 1.5C7.54416 1.5 1.5 7.54416 1.5 15C1.5 22.4558 7.54416 28.5 15 28.5Z" stroke="#B8B8B8" stroke-width="3"/>
      <path d="M1.5 15H9.75" stroke="#B8B8B8" stroke-width="3"/>
      <path d="M20.25 15H28.5" stroke="#B8B8B8" stroke-width="3"/>
      <path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="#B8B8B8" stroke-width="3"/>
    </g>
  </svg>
`;
//이것도 똑같음 근데 이건 색상있는 SVG 아이콘임 좀 따 삼항연산자 쓰면서 쓸거
export const pokeBallOn = `
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_405_24)">
<path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="#121212" stroke-width="3"/>
<path d="M15 1C16.7728 1 18.5283 1.36212 20.1662 2.06569C21.8041 2.76925 23.2924 3.80048 24.5459 5.1005C25.7995 6.40053 26.7939 7.94387 27.4724 9.64243C28.1508 11.341 28.5 13.1615 28.5 15H19.9737C19.9737 13.632 19.4497 12.3201 18.5169 11.3528C17.5842 10.3855 16.3191 9.8421 15 9.8421C13.6809 9.8421 12.4158 10.3855 11.4831 11.3528C10.5503 12.3201 10.0263 13.632 10.0263 15H1.5C1.5 11.287 2.92232 7.72601 5.45406 5.1005C7.9858 2.475 11.4196 1 15 1Z" fill="#FF3333"/>
<path d="M1 15H9.52632C9.52632 16.368 10.0503 17.6799 10.9831 18.6472C11.9158 19.6145 13.1809 20.1579 14.5 20.1579C15.8191 20.1579 17.0842 19.6145 18.0169 18.6472C18.9497 17.6799 19.4737 16.368 19.4737 15H28C28 16.8385 27.6508 18.659 26.9724 20.3576C26.2939 22.0561 25.2995 23.5995 24.0459 24.8995C22.7924 26.1995 21.3041 27.2307 19.6662 27.9343C18.0283 28.6379 16.2728 29 14.5 29C10.9196 29 7.4858 27.525 4.95406 24.8995C2.42232 22.274 1 18.713 1 15Z" fill="url(#paint0_linear_405_24)"/>
<path d="M15 28.5C22.4558 28.5 28.5 22.4558 28.5 15C28.5 7.54416 22.4558 1.5 15 1.5C7.54416 1.5 1.5 7.54416 1.5 15C1.5 22.4558 7.54416 28.5 15 28.5Z" stroke="#121212" stroke-width="3"/>
<path d="M20.25 15H28.5" stroke="#121212" stroke-width="3"/>
<path d="M1.5 15H9.75" stroke="#121212" stroke-width="3"/>
</g>
<defs>
<linearGradient id="paint0_linear_405_24" x1="2701.5" y1="1412" x2="2701.5" y2="2742" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="#E0E0E0" stop-opacity="0.5"/>
</linearGradient>
<clipPath id="clip0_405_24">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`;
