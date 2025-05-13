/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Optional: Enable additional optimizations if needed
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig; 