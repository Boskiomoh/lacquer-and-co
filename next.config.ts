import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async rewrites() {
    // The legacy site is served as untouched static files (copied from /legacy
    // into /public/before by scripts/copy-legacy.mjs). Never run it through the
    // Next.js pipeline, or the defects it exists to demonstrate disappear.
    return [{ source: "/before", destination: "/before/index.html" }];
  },
};

export default nextConfig;
