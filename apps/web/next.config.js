/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
