import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    additionalData: `@use "@shared/styles/_prelude.scss" as *;`,
  },
};

export default nextConfig;
