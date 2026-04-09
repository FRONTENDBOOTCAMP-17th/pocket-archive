import { getMyPocketmons } from '../../api/user.js';
import { PokemonViewCard, MyPocketmonLayout, MyPocketmonEmpty } from './mypocketmonUI.js';

const pokemonCache = new Map();

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
  const content = document.getElementById('mypage-content');
  content.innerHTML = `<p style="text-align:center; padding:40px; color:#4a7a72;">불러오는 중...</p>`;

  let myPocketmons = [];
  let allPokemon = [];

  try {
    const [pocketResult, jsonRes] = await Promise.all([
      getMyPocketmons(),
      fetch('/pokemon_full_ko.json'),
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

  const grid = document.getElementById('my-pokemon-grid');
  const details = await Promise.allSettled(myPocketmons.map((id) => fetchPokemonDetail(id)));

  details.forEach((result, idx) => {
    if (result.status === 'fulfilled' && result.value) {
      const data = result.value;
      const koEntry = allPokemon.find((p) => p.no === myPocketmons[idx]);
      const koName = koEntry?.name ?? data.name;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = PokemonViewCard(data, koName);
      grid.appendChild(wrapper.firstElementChild);
    }
  });
}
