/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    name: 'vTech Academy Registry',
    description: 'List of vTech Academy workspaces.',
    icon: 'https://cdn-icons-png.freepik.com/512/4345/4345040.png',
    listUrl: 'https://github.com/borsatto/kasm-registry/',
    contactUrl: 'https://github.com/borsatto/kasm-registry/issues',
  },
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/kasm-registry/1.0',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
