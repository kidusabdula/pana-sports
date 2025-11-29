/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.soccerethiopia.net",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.sofascore.com",
      },
    ],
    unoptimized: true,
    loader: "custom",
    loaderFile: "./imageLoader.js",
  },
};

export default nextConfig;
