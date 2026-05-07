import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/dist/shared/lib/constants";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isBuild = phase === PHASE_PRODUCTION_BUILD;

  return {
    ...(isDev
      ? {
          async rewrites() {
            return [
              {
                source: "/solution/:path*",
                destination: `${process.env.NEXT_PUBLIC_WEB_ROOT}/solution/:path*`,
              },
              {
                source: "/webponent-press/:path*",
                destination: `${process.env.NEXT_PUBLIC_WEB_ROOT}/webponent-press/:path*`,
              },
              {
                source: "/press-common/:path*",
                destination: `${process.env.NEXT_PUBLIC_WEB_ROOT}/press-common/:path*`,
              },
            ];
          },
        }
      : {}),
    ...(isBuild && {
      // build 시에만 적용
      basePath: "",
      output: "export",
      trailingSlash: true,
    }),
  };
};

export default nextConfig;
