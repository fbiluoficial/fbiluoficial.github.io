/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/aposta-data-vs',
  assetPrefix: '/aposta-data-vs/',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
