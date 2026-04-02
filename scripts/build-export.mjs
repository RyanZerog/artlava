#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const [, , target = "local"] = process.argv;

if (!["local", "pages"].includes(target)) {
  console.error(`Unsupported build target: ${target}`);
  process.exit(1);
}

const cwd = process.cwd();
const packageName = process.env.npm_package_name ?? "site";
const outputDir = path.join(cwd, target === "pages" ? ".next-pages" : ".next-local");

const env = { ...process.env, BUILD_TARGET: target };

if (target === "pages") {
  env.PAGES_BASE_PATH ??= `/${packageName}`;
} else {
  delete env.PAGES_BASE_PATH;
}

const runner = process.platform === "win32" ? "npx.cmd" : "npx";

console.log(
  `[build:${target}] basePath=${target === "pages" ? env.PAGES_BASE_PATH : "/"} output=${path.basename(outputDir)}`,
);

await fs.rm(path.join(cwd, "out"), { recursive: true, force: true });
await fs.rm(outputDir, { recursive: true, force: true });
await fs.rm(path.join(cwd, "out-local"), { recursive: true, force: true });
await fs.rm(path.join(cwd, "out-pages"), { recursive: true, force: true });

const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(runner, ["next", "build"], {
    stdio: "inherit",
    env,
  });

  child.on("error", reject);
  child.on("exit", (code, signal) => {
    if (signal) {
      reject(new Error(`Build terminated with signal: ${signal}`));
      return;
    }

    resolve(code ?? 1);
  });
});

if (exitCode !== 0) {
  process.exit(exitCode);
}

console.log(`[build:${target}] done -> ${path.basename(outputDir)}`);
