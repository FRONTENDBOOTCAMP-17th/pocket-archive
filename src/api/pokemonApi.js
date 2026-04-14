// ─── 나만의 파티 만들기에서 가져왓습니당. 여기에넣는게 맞지요..? ─────────────────────────────────────────────
// ─── 한국어 이름 ─────────────────────────────────────────────
export async function fetchKoNames(ids) {
  try {
    const res = await fetch("/pokemon_full_ko.json");
    if (!res.ok) throw new Error("한국어 이름 파일 로드 실패");
    const json = await res.json();
    return json.filter((p) => ids.includes(p.no));
  } catch (e) {
    console.warn("한국어 이름 파일 로드 실패:", e);
    return [];
  }
}

// ─── 포켓몬 상세 데이터 ──────────────────────────────────────
export async function fetchPokemonsByIds(ids) {
  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
    ),
  );
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => ({ ...r.value }));
}