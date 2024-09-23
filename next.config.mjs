import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

// validate env vars
import "./src/env.server.mjs";

/** @type {import('next').NextConfig} */
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

export default withNextIntl(nextConfig);
