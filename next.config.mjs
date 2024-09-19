/** @type {import('next').NextConfig} */
const config = {
  images: { remotePatterns: [{ hostname: 'cdn.sanity.io' }] },
  compiler: {
    styledComponents: true
  }
}

export default config
