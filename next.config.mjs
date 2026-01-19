/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Base path for GitHub Pages project site
  basePath: process.env.NODE_ENV === 'production' ? '/apex' : '',
  input: {
    // filesystem cache for build performance
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://192.168.18.113:3000',
    'http://192.168.18.113',
  ],
}

export default nextConfig
