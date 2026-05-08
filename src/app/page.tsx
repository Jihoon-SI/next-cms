"use client";
import { CmsIframe } from "@/components/cms-iframe";
import { useCmsContents } from "@/hooks/useCmsContents";
import { useState } from "react";

// CMS에서 제공하는 페이지 경로 목록
// 경로 맨 앞 '/' 없이 작성 (fetchCmsContents에서 처리)
const PATH_LIST = [
  { label: "casestudy", value: "solution/dbridge-casestudy.shtm" },
  { label: "certification", value: "solution/dbridge-certification.shtm" },
  { label: "extensions", value: "solution/dbridge-extensions.shtm" },
  { label: "features", value: "solution/dbridge-features.shtm" },
  { label: "functions", value: "solution/dbridge-functions.shtm" },
  { label: "usage", value: "solution/dbridge-usage.shtm" },
  { label: "vkFunction", value: "solution/vkFunction.shtm" },
];

export default function Home() {
  const [path, setPath] = useState("");
  const {
    data: contents,
    isFetching,
    isLoading,
    isError,
  } = useCmsContents(path);

  return (
    <main>
      {path === "" && (
        <div className="flex flex-col items-center pt-10">
          <div>nextjs 환경에서 CMS 컨텐츠 로드 샘플입니다.</div>
          <div>좌상단 select 변경 시 해당 컨텐츠가 로드됩니다.</div>
        </div>
      )}
      <div className="fixed z-1 w-50 h-20 top-1 left-1 bg-white/50 backdrop-blur-sm flex items-center justify-center gap-4 p-4">
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border-1 w-40 h-10 cursor-pointer"
        >
          {PATH_LIST.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {isError && <p>Error occurred while fetching CMS contents.</p>}
      {isLoading || (isFetching && <p>불러오는 중...</p>)}
      {contents && <CmsIframe html={contents} className="w-full" />}
    </main>
  );
}
