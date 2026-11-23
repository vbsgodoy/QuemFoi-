import type { NextConfig } from "next";

// Site 100% estático, publicado no GitHub Pages.
// No Pages o site fica em /<nome-do-repositório>, então o workflow define NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
