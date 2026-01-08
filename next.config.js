/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow YouTube and Google avatar hosts
    domains: [
      'i.ytimg.com',
      'yt3.ggpht.com',
      'yt3.googleusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },
}

export default nextConfig
