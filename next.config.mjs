/** @type {import('next').NextConfig} */

const config = {
  experimental: {
    optimizePackageImports: [
      '@react-three/drei',
      '@react-three/postprocessing',
      '@react-three/flex',
      '@react-three/fiber',
      'r3f-perf',
      'three',
      'postprocessing',
      'leva',
      'sanity',
      '@sanity/image-url',
      '@sanity/demo',
      '@sanity/vision',
      '@tailwindcss/typography',
    ]
  },
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      type: 'asset/source',
    })
    return config
  },
}

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(config)

// export default config
