import type { NextConfig } from "next";
import pkg from "./package.json" assert { type: "json" };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: `v${pkg.version}`,
  },
  // Silence Turbopack workspace root warning when multiple lockfiles exist
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
