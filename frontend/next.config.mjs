import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    disableStaticImages: false,
  },
  serverExternalPackages: [
    '@radix-ui/react-select',
    '@radix-ui/react-dialog',
    '@radix-ui/react-avatar'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/')
      };
    }
    
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Handle ESM packages
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Fixes npm packages that depend on `node:` protocol
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Silence noisy dynamic require warning from @supabase/realtime-js
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
  // Disable static file caching in development
  poweredByHeader: false,
  generateEtags: false,
  // Disable static file hashing in development
  devIndicators: {
    buildActivity: false,
  },
  // Disable static optimization for now
  output: 'standalone',
  // Disable static optimization for development
  // This will ensure all pages are server-rendered
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@radix-ui/react-dialog'],
  },
  // Disable image optimization in development
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
