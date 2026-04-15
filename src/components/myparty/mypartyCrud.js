import { fetchKoNames, fetchPokemonsByIds } from "/src/api/pokemonApi.js";
import {
  fetchBookmarkedPokemons,
  fetchPartyPresets,
  postPartyPreset,
  putPartyPreset,
  deletePartyPreset,
} from "/src/api/user.js";

// ─── 북마크 포켓몬 로드 (포켓몬 배열 반환) ──────────────────
export async function loadBookmarkedPokemons() {
  const ids = await fetchBookmarkedPokemons();
  const [pokemonDetails, koList] = await Promise.all([
    fetchPokemonsByIds(ids),
    fetchKoNames(ids),
  ]);
  const koMap = {};
  koList.forEach((p) => { koMap[p.no] = p.name; });
  return pokemonDetails.map((p) => ({ ...p, koName: koMap[p.id] || p.name }));
}

// ─── 파티 프리셋 로드 (프리셋 배열 반환) ────────────────────
export async function loadPartyPresets(pokemons) {
  const list = await fetchPartyPresets();
  return list.map((p) => ({
    apiId:      p.partyId,
    name:       p.deckname,
    gender:     "man",
    pokemonIds: p.pocketmons,
    party:      p.pocketmons.map((id) => pokemons.find((pk) => pk.id === id) || null),
  }));
}

// ─── 프리셋 API ──────────────────────────────────────────────
export async function createPreset(name, gender, pokemonIds) {
  return postPartyPreset(name, gender, pokemonIds);
}

export async function updatePreset(apiId, name, pokemonIds, gender) {
  return putPartyPreset(apiId, name, pokemonIds, gender);
}

export async function deletePreset(apiId) {
  return deletePartyPreset(apiId);
}
