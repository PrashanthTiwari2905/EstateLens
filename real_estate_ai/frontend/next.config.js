/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ML_API_URL: process.env.ML_API_URL, // Only expose the public ML URL
  }
}

module.exports = nextConfig
