/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ML_API_URL: process.env.ML_API_URL,
  }
}
module.exports = nextConfig
