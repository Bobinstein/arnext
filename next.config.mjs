// next.config.mjs
import webpack from 'webpack';

const isArweave = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "arweave";
let env = {};
for (const k in process.env) {
  if (/^NEXT_PUBLIC_/.test(k)) env[k] = process.env[k];
}

const nextConfig = {
  reactStrictMode: true,
  ...(isArweave ? { output: "export", publicRuntimeConfig: env } : {}),
  images: { unoptimized: isArweave },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      process: 'process/browser',
      buffer: 'buffer/',
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};

export default nextConfig;

