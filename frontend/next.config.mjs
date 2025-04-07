/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "authjs.dev",
      "raw.githubusercontent.com",
      "i.pravatar.cc",
      "lh3.googleusercontent.com",
      "replicate.delivery",
      "example.com", // Added this line
    ],
  },
};

export default nextConfig;
