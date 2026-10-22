import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Old single-workspace routes now live in three separate dashboards.
  redirects() {
    return [
      { source: "/demo/events", destination: "/dashboard/events", permanent: false },
      { source: "/demo/interview", destination: "/dashboard/interview", permanent: false },
      { source: "/operations", destination: "/dashboard/operations", permanent: false },
      { source: "/portfolio", destination: "/dashboard/portfolio", permanent: false },
      { source: "/compare", destination: "/dashboard/simulator", permanent: false },
    ];
  },
};

export default nextConfig;
