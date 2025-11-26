/** @type {import('next').NextConfig} */
const nextConfig = {
  dangerouslyAllowSVG: true,

  contentDispositionType: "attachment",
  contentSecurityPolicy:
    "default-src 'self'; script-src 'none'; sandbox;",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
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

    // Enable your custom loader
    loader: "custom",
    loaderFile: "./imageLoader.js",
  },
};

export default nextConfig;
