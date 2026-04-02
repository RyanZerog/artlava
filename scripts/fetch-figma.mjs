#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index === -1) {
    return fallback;
  }
  return args[index + 1] ?? fallback;
}

const fileKey = readArg("fileKey", "GssPuizP22ainZynOX6fFm");
const nodeId = readArg("nodeId", "1:2");
const outDir = readArg("outDir", "figma-export");
const token = process.env.FIGMA_TOKEN;

if (!token) {
  console.error("Missing FIGMA_TOKEN environment variable.");
  console.error("PowerShell example:");
  console.error('$env:FIGMA_TOKEN="your_figma_pat"; npm run figma:fetch');
  process.exit(1);
}

function safeName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "-");
}

async function figmaGet(url) {
  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Figma API ${response.status}: ${text || response.statusText}`);
  }

  return response.json();
}

async function downloadFile(url, targetPath) {
  if (!url) {
    return false;
  }

  const response = await fetch(url);
  if (!response.ok) {
    return false;
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
  return true;
}

function collectImageRefs(node, refs) {
  if (!node || typeof node !== "object") {
    return;
  }

  if (Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill?.type === "IMAGE" && typeof fill.imageRef === "string") {
        refs.add(fill.imageRef);
      }
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      collectImageRefs(child, refs);
    }
  }
}

async function main() {
  const outputRoot = path.resolve(process.cwd(), outDir);
  const assetsDir = path.join(outputRoot, "assets");
  await fs.mkdir(assetsDir, { recursive: true });

  const encodedNodeId = encodeURIComponent(nodeId);
  const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodedNodeId}`;
  const nodePayload = await figmaGet(nodesUrl);

  await fs.writeFile(
    path.join(outputRoot, `node-${safeName(nodeId)}.json`),
    JSON.stringify(nodePayload, null, 2),
    "utf8",
  );

  const renderUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodedNodeId}&format=png&scale=2`;
  const renderPayload = await figmaGet(renderUrl);
  await fs.writeFile(
    path.join(outputRoot, `render-${safeName(nodeId)}.json`),
    JSON.stringify(renderPayload, null, 2),
    "utf8",
  );

  const imageUrl = renderPayload.images?.[nodeId];
  const framePngPath = path.join(outputRoot, `frame-${safeName(nodeId)}.png`);
  const frameDownloaded = await downloadFile(imageUrl, framePngPath);

  const nodeDocument = nodePayload.nodes?.[nodeId]?.document;
  const imageRefs = new Set();
  collectImageRefs(nodeDocument, imageRefs);

  let downloadedAssets = 0;
  if (imageRefs.size > 0) {
    const refs = [...imageRefs];
    const chunks = [];
    const chunkSize = 100;

    for (let i = 0; i < refs.length; i += chunkSize) {
      chunks.push(refs.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const refsQuery = encodeURIComponent(chunk.join(","));
      const assetUrl = `https://api.figma.com/v1/files/${fileKey}/images?ids=${refsQuery}`;
      const assetPayload = await figmaGet(assetUrl);

      for (const [ref, url] of Object.entries(assetPayload.meta?.images ?? {})) {
        const ok = await downloadFile(url, path.join(assetsDir, `${safeName(ref)}.png`));
        if (ok) {
          downloadedAssets += 1;
        }
      }
    }
  }

  console.log(`Done: ${outputRoot}`);
  console.log(`Node JSON: node-${safeName(nodeId)}.json`);
  console.log(`Render JSON: render-${safeName(nodeId)}.json`);
  console.log(`Frame PNG downloaded: ${frameDownloaded ? "yes" : "no"}`);
  console.log(`Image refs found: ${imageRefs.size}`);
  console.log(`Asset PNG downloaded: ${downloadedAssets}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
