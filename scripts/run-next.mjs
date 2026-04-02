#!/usr/bin/env node

import { spawn } from "node:child_process";

const [, , command = "dev", target = "local", ...extraArgs] = process.argv;
const packageName = process.env.npm_package_name ?? "site";

const env = { ...process.env, BUILD_TARGET: target };

if (target === "pages") {
  env.PAGES_BASE_PATH ??= `/${packageName}`;
} else {
  delete env.PAGES_BASE_PATH;
}

const runner = process.platform === "win32" ? "npx.cmd" : "npx";

console.log(
  `[next:${command}] target=${target} basePath=${target === "pages" ? env.PAGES_BASE_PATH : "/"}`,
);

const child = spawn(runner, ["next", command, ...extraArgs], {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
