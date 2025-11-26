// Custom loader to bypass Next.js optimization for these domains
module.exports = function imageLoader({ src, width, quality }) {
  if (
    src.includes("sofascore.com") ||
    src.includes("soccerethiopia.net")
  ) {
    return src;
  }

  // Default Next.js optimization for other images
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
};
