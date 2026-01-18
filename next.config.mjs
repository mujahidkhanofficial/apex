/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
