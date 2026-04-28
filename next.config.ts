import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  sassOptions: {
    additionalData: `@use "@shared/styles/_prelude.scss" as *;`,
  },
};

export default nextConfig;
