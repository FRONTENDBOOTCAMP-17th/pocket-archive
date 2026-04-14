import { BASE_URL } from './config.js';

const pokemonCache = new Map();
const token = localStorage.getItem("token");
//
export async function fetchPokemonDetail(no) {
  if (pokemonCache.has(no)) {
    return pokemonCache.get(no);
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${no}`);
    if (!res.ok) {
      throw new Error(`API 오류: ${res.status}`);
    }
    const data = await res.json();
    pokemonCache.set(no, data);
    return data;
  } catch (error) {
    console.error(`포켓몬 ${no} 데이터 로드 실패:`, error);
    return null;
  }
}
// 포켓몬 api에서 id 값으로 불러오는 함수 이건 좀
export async function fetchPokemonSpecies(no) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${no}`);
  return res.json();
}
// 자신이 포획한 포켓몬 불러오는 함수
export async function loadPoketmons() {
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

export async function poketmonReg(poketmonId) {
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

export async function fetchPokemonsByIds(ids) {
  const results = await Promise.all(ids.map((id) => fetchPokemonDetail(id)));
  return results.filter(Boolean);
}

export async function fetchKoNames(ids) {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const species = await fetchPokemonSpecies(id);
        const koEntry = species.names.find((n) => n.language.name === "ko");
        return { no: id, name: koEntry ? koEntry.name : species.name };
      } catch {
        return { no: id, name: String(id) };
      }
    }),
  );
  return results;
}

export async function poketmonDelete(poketmonId) {
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
