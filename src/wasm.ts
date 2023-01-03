import { createRequire } from "module";
import type { IIntersectTokenScores, TokenScore } from "./types.js";

type Runtime = "deno" | "node" | "browser" | "unknown";

function getCurrentRuntime(): Runtime {
  /* c8 ignore next 11 */
  if (typeof process !== "undefined" && process.versions !== undefined) {
    return "node";

    // @ts-expect-error "Deno" global variable is defined in Deno only
  } else if (typeof Deno !== "undefined") {
    return "deno";
  } else if (typeof window !== "undefined") {
    return "browser";
  }

  return "unknown";
}

const currentRuntime = getCurrentRuntime();
let _intersectTokenScores: IIntersectTokenScores;

export async function intersectTokenScores(arrays: TokenScore[][]): Promise<TokenScore[]> {
  if (!_intersectTokenScores) {
    let runtimeWasm: { intersectTokenScores: IIntersectTokenScores };

    /* c8 ignore next 21 */
    switch (currentRuntime) {
      case "node": {
        const require = createRequire(import.meta.url);
        runtimeWasm = require("../dist/wasm/nodejs/lyra_utils_wasm.cjs");
        break;
      }
      case "browser": {
        const wasm = await import("../dist/wasm/web/lyra_utils_wasm.js");
        const wasmInterface = await wasm.default();
        runtimeWasm = wasmInterface as unknown as { intersectTokenScores: IIntersectTokenScores };
        break;
      }
      case "deno": {
        runtimeWasm = await import("../dist/wasm/deno/lyra_utils_wasm.js");
        break;
      }
      default: {
        runtimeWasm = await import("./algorithms.js");
      }
    }

    _intersectTokenScores = runtimeWasm.intersectTokenScores;
  }

  return _intersectTokenScores({ data: arrays }).data;
}
