#!/usr/bin/env node

import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  return map[ext] ?? "application/octet-stream";
}

const rootDir = path.resolve(process.cwd(), readArg("dir", "out-local"));
const port = Number.parseInt(readArg("port", "3000"), 10);
const basePath = normalizeBasePath(readArg("basePath", ""));

function isInsideRoot(resolvedPath) {
  return resolvedPath === rootDir || resolvedPath.startsWith(`${rootDir}${path.sep}`);
}

async function fileExists(filePath) {
  try {
    const stat = await fsp.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function resolveFilePath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const relativePath = decodedPath.replace(/^\/+/, "");

  const candidates = [];

  if (!relativePath) {
    candidates.push(path.join(rootDir, "index.html"));
  } else {
    candidates.push(path.join(rootDir, relativePath));

    if (!path.extname(relativePath)) {
      candidates.push(path.join(rootDir, relativePath, "index.html"));
    }
  }

  for (const candidate of candidates) {
    const resolvedCandidate = path.resolve(candidate);
    if (!isInsideRoot(resolvedCandidate)) {
      continue;
    }

    if (await fileExists(resolvedCandidate)) {
      return resolvedCandidate;
    }
  }

  return null;
}

async function sendFile(response, filePath, method) {
  response.writeHead(200, {
    "Content-Type": getContentType(filePath),
    "Cache-Control": "no-cache",
  });

  if (method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
}

async function sendNotFound(response, method) {
  const notFoundPage = path.join(rootDir, "404.html");

  if (await fileExists(notFoundPage)) {
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });

    if (method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(notFoundPage).pipe(response);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not Found");
}

const server = http.createServer(async (request, response) => {
  const method = request.method ?? "GET";
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `127.0.0.1:${port}`}`);
  const pathname = url.pathname;

  if (!["GET", "HEAD"].includes(method)) {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method Not Allowed");
    return;
  }

  let effectivePath = pathname;

  if (basePath) {
    if (pathname === "/" || pathname === basePath) {
      response.writeHead(302, { Location: `${basePath}/` });
      response.end();
      return;
    }

    if (!pathname.startsWith(`${basePath}/`)) {
      await sendNotFound(response, method);
      return;
    }

    effectivePath = pathname.slice(basePath.length) || "/";
  }

  const filePath = await resolveFilePath(effectivePath);

  if (!filePath) {
    await sendNotFound(response, method);
    return;
  }

  await sendFile(response, filePath, method);
});

server.listen(port, () => {
  const displayBase = basePath ? `${basePath}/` : "/";
  console.log(`Serving ${rootDir} at http://127.0.0.1:${port}${displayBase}`);
});
