/** @type {import('next').NextConfig} */
// validate env vars
import "./src/env.server.mjs";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.AZURE_STORAGE_ACCOUNT_NAME + ".blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
