/**
 * 비동기 함수의 중복 호출을 방지하는 guard 유틸리티
 */

/**
 * 단일 플래그 guard
 * 실행 중일 때 재호출을 무시한다.
 * @param {Function} fn
 * @returns {Function}
 */
export function guardFn(fn) {
  let inFlight = false;
  return async function (...args) {
    if (inFlight) return;
    inFlight = true;
    try {
      return await fn.apply(this, args);
    } finally {
      inFlight = false;
    }
  };
}

/**
 * 공유 플래그 guard 팩토리
 * 반환된 guard()로 래핑한 함수들은 하나의 lock을 공유한다.
 * 하나가 실행 중이면 나머지도 차단된다.
 * @returns {(fn: Function) => Function}
 *
 * @example
 * const guard = createSharedGuard();
 * btnA.addEventListener('click', guard(async () => { ... }));
 * btnB.addEventListener('click', guard(async () => { ... })); // A 실행 중엔 B도 차단
 */
export function createSharedGuard() {
  let inFlight = false;
  return function (fn) {
    return async function (...args) {
      if (inFlight) return;
      inFlight = true;
      try {
        return await fn.apply(this, args);
      } finally {
        inFlight = false;
      }
    };
  };
}

/**
 * 키별 플래그 guard
 * 같은 키(예: id)로 중복 호출만 차단하고, 다른 키는 동시에 실행 가능하다.
 * @param {Function} fn
 * @param {Function} [getKey] - 인자에서 키를 추출하는 함수 (기본값: 첫 번째 인자)
 * @returns {Function}
 *
 * @example
 * const guardedDelete = guardFnByKey(async (id) => { ... });
 * await guardedDelete(42); // id=42가 실행 중이면 재호출 무시
 */
export function guardFnByKey(fn, getKey = (...args) => args[0]) {
  const inFlight = new Set();
  return async function (...args) {
    const key = getKey(...args);
    if (inFlight.has(key)) return;
    inFlight.add(key);
    try {
      return await fn.apply(this, args);
    } finally {
      inFlight.delete(key);
    }
  };
}
