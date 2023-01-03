import { spawnSync } from "child_process";
import { mkdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function exec(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(typeof result.status);
  }
}

try {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const targets = ["nodejs", "web", "deno"];
  const artifactsDir = resolve(rootDir, "../../dist/wasm");
  const crates = ["lyra-utils-wasm"];
  const wasmTarget = "wasm32-unknown-unknown";

  const originalCwd = process.cwd();

  process.chdir(resolve(rootDir, ".."));

  console.log("\x1b[33m--- Compiling Rust ---\x1b[0m");
  for (const crate of crates) {
    exec("cargo", ["build", "-p", crate, "--profile", "release", "--target", wasmTarget]);

    const wasmFile = resolve(rootDir, "../target", wasmTarget, "release", `${crate.replaceAll("-", "_")}.wasm`);
    console.log("\x1b[33m--- Optimizing Wasm artifact ---\x1b[0m");
    exec("wasm-opt", [wasmFile, "-o", wasmFile, "-O2", "--precompute"]);
  }

  for (const target of targets) {
    const outDir = resolve(artifactsDir, target);

    console.log(`\x1b[33m--- Building for target ${target} ---\x1b[0m`);
    console.log(`    Creating output directory ${relative(originalCwd, outDir)} ...`);
    await mkdir(outDir, { recursive: true });

    for (const crate of crates) {
      const wasmFile = resolve(rootDir, "../target", wasmTarget, "release", `${crate.replaceAll("-", "_")}.wasm`);

      if (process.env.OPTIMIZE === "true") {
        const watFile = resolve(outDir, `${crate}.wat`);
        const optimizedWat = resolve(outDir, `${crate}_optimized.wat`);

        console.log("    Generating textual version of the original Wasm artifact...");
        exec("wasm-opt", [wasmFile, "-o", watFile, "-O0", "--emit-text"]);

        console.log("    Generating textual version of the optimized Wasm artifact...");
        exec("wasm-opt", [wasmFile, "-o", optimizedWat, "-O0", "--emit-text"]);
      }

      console.log("    Generating Javascript file ...");
      exec("wasm-bindgen", ["--target", target, "--out-dir", outDir, wasmFile]);
    }
  }

  console.log(`\x1b[32m--- WASM built successfully! ---\x1b[0m`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
