import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
};

export default nextConfig;