import { TokenScore } from "./types.js";

// Adapted from https://github.com/lovasoa/fast_array_intersect
// MIT Licensed (https://github.com/lovasoa/fast_array_intersect/blob/master/LICENSE)
// while on tag https://github.com/lovasoa/fast_array_intersect/tree/v1.1.0
export function intersectTokenScores({ data: arrays }: { data: TokenScore[][] }): { data: TokenScore[] } {
  if (arrays.length === 0) return { data: [] };

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < arrays[0].length) {
      const tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }

  const set: Map<string, [number, number]> = new Map();
  for (const elem of arrays[0]) {
    set.set(elem[0], [1, elem[1]]);
  }

  const arrLength = arrays.length;
  for (let i = 1; i < arrLength; i++) {
    let found = 0;
    for (const elem of arrays[i]) {
      /* c8 ignore next */
      const key = elem[0] ?? "";

      const [count, score] = set.get(key) ?? [0, 0];
      if (count === i) {
        set.set(key, [count + 1, score + elem[1]]);
        found++;
      }
    }

    if (found === 0) {
      return { data: [] };
    }
  }

  const result: TokenScore[] = [];

  for (const [token, [count, score]] of set) {
    if (count === arrLength) {
      result.push([token, score]);
    }
  }

  return { data: result };
}
