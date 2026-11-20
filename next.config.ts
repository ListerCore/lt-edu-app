import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output: minimal server.js + traced deps for the Docker image
  output: 'standalone',
  // gRPC client of lt-edu-api (lib/api/grpc): native HTTP/2 code that must load from node_modules, not the bundle
  serverExternalPackages: ['@grpc/grpc-js'],
  experimental: {
    agentFeedback: true,
    serverActions: {
      // Announcements carry up to 40 MB of images and PDFs (lt-edu-api's limit) plus the multipart overhead
      bodySizeLimit: '45mb',
    },
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
