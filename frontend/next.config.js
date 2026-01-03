/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: [],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/lottery-pool',
}

module.exports = nextConfig

