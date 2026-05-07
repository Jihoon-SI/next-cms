"use client";
import { ShadowContent } from "@/components/shadow-content";
import { useCmsContents } from "@/hooks/useCmsContents";
import { useState } from "react";

export default function Home() {
  const [path, setPath] = useState("/solution/bizxpress-features.shtm");
  const {
    data: contents,
    isFetching,
    isLoading,
    isError,
  } = useCmsContents(path);

  return (
    <main>
      <div className="fixed z-1 w-50 h-20 top-1 left-1 bg-white/50 backdrop-blur-sm flex items-center justify-center gap-4 p-4">
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border-1 w-40 h-10 cursor-pointer"
        >
          <option value="/solution/dbridge-casestudy.shtm">casestudy</option>
          <option value="/solution/dbridge-certification.shtm">
            certification
          </option>
          <option value="/solution/dbridge-extensions.shtm">extensions</option>
          <option value="/solution/dbridge-features.shtm">features</option>
          <option value="/solution/dbridge-functions.shtm">functions</option>
          <option value="/solution/dbridge-usage.shtm">usage</option>
        </select>
      </div>
      {isError && <p>Error occurred while fetching CMS contents.</p>}
      {isLoading || (isFetching && <p>불러오는 중...</p>)}
      {contents && <ShadowContent html={contents} className="w-full" />}
    </main>
  );
}
