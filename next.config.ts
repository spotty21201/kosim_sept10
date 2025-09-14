import type { NextConfig } from "next";
import pkg from "./package.json" assert { type: "json" };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: `v${pkg.version}`,
  },
};

export default nextConfig;
