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
  <div data-action="select-pokemon" data-id="${p.no}"
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

  return `
  <div 
     class="group bg-white rounded-2xl shadow-sm hover:shadow-xl max-w-71 hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-fit w-full">
      <div data-action="select-pokemon" data-id="${data.id}"
      class="relative h-44 flex items-center justify-center bg-[#F7F9F8] group-hover:bg-[#E8F5E9] transition-colors shrink-0 cursor-pointer">
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
                    localStorage.getItem('token')
                      ? myPocketMons.includes(data.id)
                        ? `<div data-action="poketmon-delete" data-id="${data.id}" class="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110">${pokeBallOn}</div>`
                        : `<div data-action="poketmon-reg" data-id="${data.id}" class="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110">${pokeBallOff}</div>`
                      : ''
                  }
              </div>
          </div>
          <div class="flex flex-wrap gap-2" style="padding: 5px">
              ${types
                .map(
                  (t) => `
                <span class="flex items-center justify-center px-3 py-1 h-6 rounded-full text-white text-md uppercase tracking-tight ${TYPE_COLORS[t] || 'bg-gray-400'} shadow-sm min-w-15" style="padding: 5px">
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

//포켓몬 상세 모달
export const PokemonModalContent = (data, koName, species) => {
  const types = data.types.map((t) => t.type.name);
  const img = data.sprites.other['official-artwork'].front_default;
  const isLoggedIn = localStorage.getItem('token');

  // 설명 (한국어 우선, 없으면 영어라도 넣)
  const flavorEntry =
    species.flavor_text_entries.find((e) => e.language.name === 'ko') || species.flavor_text_entries.find((e) => e.language.name === 'en');
  const flavor = flavorEntry ? flavorEntry.flavor_text.replace(/\f|\n/g, ' ') : '';

  // 분류
  const genus = species.genera?.find((g) => g.language.name === 'ko')?.genus || species.genera?.find((g) => g.language.name === 'en')?.genus || '';

  // 스탯
  const statMap = {
    hp: 'HP',
    attack: '공격',
    defense: '방어',
    speed: '스피드',
  };
  const statColors = {
    hp: '#FF6B6B',
    attack: '#FF8C42',
    defense: '#FFD166',
    speed: '#06D6A0',
  };
  const stats = data.stats
    .filter((s) => ['hp', 'attack', 'defense', 'speed'].includes(s.stat.name))
    .map((s) => ({
      name: statMap[s.stat.name],
      value: s.base_stat,
      color: statColors[s.stat.name],
    }));

  // 하단 이미지 슬롯
  const sprites = [
    { label: 'Front', src: data.sprites.front_default },
    { label: 'Back', src: data.sprites.back_default },
    { label: 'Shiny', src: data.sprites.front_shiny },
    { label: 'Shiny Back', src: data.sprites.back_shiny },
    { label: 'Home', src: data.sprites.other?.home?.front_default },
    { label: 'Dream', src: data.sprites.other?.['dream_world']?.front_default },
  ];

  // 스타일 head에 한 번만 쳐넣기.......
  if (!document.getElementById('pm-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'pm-modal-styles';
    style.textContent = `
      /* 데스크탑 (790px 이상): 기존 grid 유지 */
      @media (min-width: 790px) {
        .pm-bottom-grid   { display: grid !important; }
        .pm-bottom-slider { display: none !important; }
      }

      /* 슬라이더 공통 스타일 */
      .pm-bottom-slider {
        display: none;
        align-items: center;
        gap: 8px;
        flex: 2;
        padding: 8px 14px 14px 14px;
        box-sizing: border-box;
        min-height: 0;
        position: relative;
      }
      .pm-slider-track {
        flex: 1;
        overflow: hidden;
        border-radius: 12px;
        margin: 0 44px;
      }
      .pm-slider-inner {
        display: flex;
        gap: 8px;
        transition: transform 0.3s ease;
      }
      .pm-slide-item {
        flex: 0 0 100%;
        border-radius: 12px;
        border: 1.108px solid rgba(255,255,255,0.60);
        background: rgba(255,255,255,0.20);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 8px 4px;
        box-sizing: border-box;
      }
      .pm-arrow-btn {
        position: absolute; 
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        border: 1.5px solid rgba(255,255,255,0.6);
        color: #fff;
        font-size: 20px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.2s;
        user-select: none;
      }
        #pmPrev { left: 18px; }   
        #pmNext { right: 18px; }
      .pm-arrow-btn:hover    { background: rgba(255,255,255,0.45); }
      .pm-arrow-btn:disabled { opacity: 0.25; pointer-events: none; }

      /* 모바일 (789px 이하): 상하 배치 + 내부 스크롤 */
      @media (max-width: 789px) {
        .pm-modal-wrap {
          height: auto !important;
          max-height: 85vh !important;
          overflow-y: auto !important;   
          overflow-x: hidden !important;
        }
        .pm-inner {
          flex-direction: column !important;
          flex: none !important;
          height: auto !important;
        }
        .pm-left {
          width: 100% !important;
          min-width: unset !important;
        }
        .pm-right {
          overflow-y: visible !important;
          flex: none !important;
          height: auto !important;        /* 8px 제거 */
          margin-bottom: 8px !important;
        }
        .pm-bottom-grid   { display: none !important; }
        .pm-bottom-slider {
          display: flex !important;
          flex-shrink: 0;
          height: 110px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  let pmIdx = 0;
  const PM_TOTAL = 6;

  setTimeout(() => {
    const inner = document.getElementById('pmSliderInner');
    const prev = document.getElementById('pmPrev');
    const next = document.getElementById('pmNext');
    if (!inner || !prev || !next) return;

    function pmMove(dir) {
      pmIdx = Math.max(0, Math.min(pmIdx + dir, PM_TOTAL - 1));
      const slideW = inner.querySelector('.pm-slide-item')?.offsetWidth || 0;
      inner.style.transform = 'translateX(-' + pmIdx * (slideW + 8) + 'px)';
      prev.disabled = pmIdx === 0;
      next.disabled = pmIdx === PM_TOTAL - 1;
    }

    prev.addEventListener('click', () => pmMove(-1));
    next.addEventListener('click', () => pmMove(1));
  }, 0);

  return `
  <div class="pm-modal-wrap" style="
    width: 100%;
    max-width: 789px;
    height: 594px;
    border-radius: 26px;
    background: linear-gradient(121deg, #05B29F -1.1%, #22A9DA 98.38%);
    box-shadow: 0 0 0 4px rgba(5,178,159,0.40), 0 0 0 7px rgba(34,169,218,0.20), 0 24px 60px 0 rgba(0,0,0,0.35);
    display: flex;
    flex-direction: column;
    position: relative;
    /* overflow: hidden 제거 → 미디어쿼리로 제어 */
    box-sizing: border-box;
  ">

    <!-- 상단 -->
    <div class="pm-inner" style="
      flex: 8;
      display: flex;
      gap: 10px;
      padding: 14px 14px 8px 14px;
      min-height: 0;
      box-sizing: border-box;
    ">

      <!-- 왼쪽 흰 박스 -->
      <div class="pm-left" style="
        width: 300px;
        min-width: 220px;
        border-radius: 14px;
        border: 1.108px solid rgba(255,255,255,0.60);
        background: #FFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 12px 14px;
        text-align: center;
        box-sizing: border-box;
      ">
        <span style="font-size: 13px; color: #aaa; font-weight: 500;">No. ${String(data.id).padStart(3, '0')}</span>

        <div style="
          width: 120px; height: 120px;
          background: #f0fafa;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 4px 0;
        ">
          <img src="${img}" style="width: 90px; height: 90px; object-fit: contain;"/>
        </div>

        <h2 style="font-size: 25px; font-weight: 900; color: #1a1a1a; margin: 0;">${koName}</h2>
        <p style="font-size: 15px; color: #aaa; margin: 0;">${genus}</p>

        <div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin: 2px 0;">
          ${types
            .map(
              (t) => `
            <span class="${TYPE_COLORS[t] || 'bg-gray-400'}"
              style="padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: white; text-transform: uppercase;">
              ${K_TYPE[t.toUpperCase()] || t}
            </span>
          `,
            )
            .join('')}
        </div>

        <div style="
          font-size: 12px; color: #aaa;
          border: 1px solid #e5e5e5;
          border-radius: 20px;
          padding: 3px 14px;
          margin-top: 2px;
        ">
          ${(data.height / 10).toFixed(1)}m &nbsp; ${(data.weight / 10).toFixed(1)}kg
        </div>
      </div>

      <!-- 오른쪽 흰 박스 -->
      <div class="pm-right" style="
        flex: 1;
        border-radius: 14px;
        border: 1.108px solid rgba(255,255,255,0.60);
        background: #FFF;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 18px 20px;
        overflow-y: auto;
        box-sizing: border-box;
      ">
        <div>
          <p style="font-size: 15px; font-weight: 800; color: #333; letter-spacing: 0.1em; margin: 0 0 10px 0;">BASE STATS</p>
          ${stats
            .map(
              (s) => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 7px;">
              <span style="font-size: 12px; color: #777; width: 36px;">${s.name}</span>
              <span style="font-size: 12px; font-weight: 700; color: #222; width: 26px; text-align: right;">${s.value}</span>
              <div style="flex: 1; background: #e8f5f4; border-radius: 10px; height: 7px;">
                <div style="height: 7px; border-radius: 10px; width: ${Math.min((s.value / 255) * 100, 100)}%; background: ${s.color};"></div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 0;"/>

        <div>
          <p style="font-size: 15px; font-weight: 800; color: #333; letter-spacing: 0.1em; margin: 0 0 6px 0;">설명</p>
          <p style="font-size: 18px; color: #555; line-height: 1.7; margin: 0;">${flavor}</p>
        </div>
      </div>
    </div>

    <!-- 하단: 데스크탑 grid -->
    <div class="pm-bottom-grid" style="
      flex: 2;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
      padding: 8px 14px 14px 14px;
      box-sizing: border-box;
      min-height: 0;
    ">
      ${sprites
        .map(
          (s) => `
        <div style="
          border-radius: 12px;
          border: 1.108px solid rgba(255,255,255,0.60);
          background: rgba(255,255,255,0.20);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 8px 4px;
          box-sizing: border-box;
        ">
          ${
            s.src
              ? `<img src="${s.src}" style="width: 44px; height: 44px; object-fit: contain;"/>`
              : `<div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 8px;"></div>`
          }
          <span style="font-size: 10px; color: rgba(255,255,255,0.85); font-weight: 500;">${s.label}</span>
        </div>
      `,
        )
        .join('')}
    </div>

    <!-- 하단 모바일 전용 화살표 슬라이더 -->
<div class="pm-bottom-slider">
  <button class="pm-arrow-btn" id="pmPrev" disabled>&#8249;</button>
  <div class="pm-slider-track">
    <div class="pm-slider-inner" id="pmSliderInner">
      ${sprites
        .map(
          (s, i) => `
        <div class="pm-slide-item">
          ${
            s.src
              ? `<img src="${s.src}" style="width: 64px; height: 64px; object-fit: contain; image-rendering: pixelated;"/>`
              : `<div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 8px;"></div>`
          }
          <span style="font-size: 11px; color: rgba(255,255,255,0.9); font-weight: 500;">${s.label}</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);">${i + 1} / 6</span>
        </div>
      `,
        )
        .join('')}
    </div>
  </div>
  <button class="pm-arrow-btn" id="pmNext">&#8250;</button>
</div>

  </div>
`;
};
