/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export', // Important: make it static
  images: { unoptimized: true }, // we’re using <img>, but keep this safe
  assetPrefix: isProd ? '/grandma-cookbook' : '', // replace with your repo name
  basePath: isProd ? '/grandma-cookbook' : '',
};

export default nextConfig;
