import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // Article .html → clean URL (preserve SEO)
      { source: "/articles/:slug.html", destination: "/articles/:slug", permanent: true },
      // Static pages
      { source: "/about.html",   destination: "/about",   permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html",   destination: "/terms",   permanent: true },
      { source: "/index.html",   destination: "/",        permanent: true },
    ];
  },
};

export default nextConfig;
