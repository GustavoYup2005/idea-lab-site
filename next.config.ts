import type { NextConfig } from "next";
import path from "path";

const nauExport = process.env.NAU_EXPORT === "1";
const basePath = nauExport ? "/me/idealab" : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(nauExport
    ? {
        output: "export" as const,
        basePath,
        // IIS serves each folder's index.html. Without a trailing slash, /gallery is emitted as gallery.html and the share 404s.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
