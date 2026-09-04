/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Mock third-party image host (e.g. an S3 bucket / CDN). Swap for your
    // real bucket domain when you wire up real uploads.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shitty-ai-apps-assets.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
