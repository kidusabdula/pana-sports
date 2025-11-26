/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.soccerethiopia.net',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.sofascore.com',
        // Remove pathname to allow all paths from this domain
      },
    ],
  },
};

export default nextConfig;