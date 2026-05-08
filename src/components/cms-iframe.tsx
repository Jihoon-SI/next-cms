"use client";
import { useEffect, useRef } from "react";

export function CmsIframe({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const resize = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      iframe.style.height = doc.documentElement.scrollHeight + "px";
    };

    const onLoad = () => {
      resize();
      const doc = iframe.contentDocument;
      if (!doc) return;
      const observer = new ResizeObserver(resize);
      observer.observe(doc.documentElement);
      return () => observer.disconnect();
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [html]);

  return (
    <iframe
      ref={ref}
      srcDoc={html}
      className={className}
      style={{ border: "none", width: "100%", height: "0", overflow: "hidden" }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}
