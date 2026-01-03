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
}

module.exports = nextConfig

