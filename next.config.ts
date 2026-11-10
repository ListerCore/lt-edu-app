import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output: minimal server.js + traced deps for the Docker image
  output: 'standalone',
  // gRPC client of joseph-api (lib/api/grpc): native HTTP/2 code that must load from node_modules, not the bundle
  serverExternalPackages: ['@grpc/grpc-js'],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
