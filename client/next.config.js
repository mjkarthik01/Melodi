/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
  env: {
    REACT_APP_API:
      process.env.NEXT_PUBLIC_API ||
      process.env.REACT_APP_API ||
      "http://localhost:8080",
  },
};

module.exports = nextConfig;
