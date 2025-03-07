/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }] 
  },
  compiler: {
    styledComponents: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      type: 'asset/source'
    })
    return config
  },
}

export default config
