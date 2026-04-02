import type { NextConfig } from "next";

const buildTarget = process.env.BUILD_TARGET ?? "local";
const basePath = buildTarget === "pages" ? process.env.PAGES_BASE_PATH ?? "" : "";
const distDir = buildTarget === "pages" ? ".next-pages" : ".next-local";

const nextConfig: NextConfig = {
  distDir,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
