/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    name: 'vTech Academy Registry',
    description: 'List of vTech Academy workspaces.',
    icon: 'https://github.com/borsatto/kasm-registry/blob/1.0/site/public/vtechacademy-logo-icon.png',
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
