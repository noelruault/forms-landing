/** @type {import('next').NextConfig} */

const nextConfig = {
    output: "export", // Enables static output
    images: {
        unoptimized: true,
        // Enable Akamai Image Loader to fix Github Pages image loading issue
        loader: "akamai",
        path: "/",
    },
};

module.exports = nextConfig;
