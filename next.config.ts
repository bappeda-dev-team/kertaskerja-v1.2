import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['logo.kertaskerja.cc'],
  },
  experimental: {
    // Aktifkan fitur forbidden()
    authInterrupts: true,
  },
  output: "standalone",
};

export default nextConfig;
