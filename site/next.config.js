/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    name: 'vTech Academy Registry',
    description: 'List of vTech Academy workspaces.',
    icon: 'https://cdn-icons-png.freepik.com/512/4345/4345040.png',
    listUrl: 'https://borsatto.github.io/kasm-registry/',
    contactUrl: 'https://borsatto.github.io/kasm-registry/issues',
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
