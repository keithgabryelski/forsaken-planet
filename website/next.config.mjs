/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'forsaken-planet.wordpress.com',
        port: '',
        pathname: '/**',
	search: '',
      },
      {
        protocol: 'https',
        hostname: 'forsaken-planet.files.wordpress.com',
        port: '',
        pathname: '/**',
	search: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/drop-rate-pie-chart',
        destination: '/drop-rate-sunburst',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
