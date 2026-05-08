import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/dist/shared/lib/constants";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isBuild = phase === PHASE_PRODUCTION_BUILD;

  return {
    // 로컬 확인용 rewrite 설정 (개발 서버에서만 적용)
    // 개발 서버에서는 파일 경로를 로컬로 프록시하여 CORS 문제를 방지
    // 빌드 시에는 정적 파일로 export하기 위함
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
      basePath: "",
      output: "export",
      trailingSlash: true,
    }),
  };
};

export default nextConfig;
