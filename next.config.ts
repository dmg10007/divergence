import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "100.98.42.35",
    "100.*.*.*",
    "**.ts.net",
    "*.ts.net",
    "dalton-precision-3551",
    "dalton-precision-3551.taila7fb53.ts.net",
    "**.local",
    "*.local",
    "192.168.*.*",
    "localhost",
    "127.0.0.1",
  ],
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
