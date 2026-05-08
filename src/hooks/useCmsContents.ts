"use client";
import { useQuery } from "@tanstack/react-query";

async function fetchCmsContents(path: string): Promise<string> {
  const normalizedPath = path.replace(/^\//, "");
  let url: string;
  if (process.env.NODE_ENV === "development") {
    // 상대 경로로 요청해 next.config.ts rewrites 프록시를 타도록 함 (CORS 방지)
    url = `/${normalizedPath}`;
  } else {
    const root = process.env.NEXT_PUBLIC_WEB_ROOT;
    if (!root) throw new Error("NEXT_PUBLIC_WEB_ROOT is not defined");
    url = `${root.replace(/\/$/, "")}/${normalizedPath}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

export function useCmsContents(path: string) {
  return useQuery({
    queryKey: ["cms-contents", path],
    queryFn: () => fetchCmsContents(path),
    enabled: !!path,
  });
}
