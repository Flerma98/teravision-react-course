import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://localhost:8080/api/:path*'
            }
        ];
    },
};

module.exports = nextConfig;

export default nextConfig;
