/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hallowed-possum-290.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },

};

export default nextConfig;
