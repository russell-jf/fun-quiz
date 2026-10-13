"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-10">
      <ErrorState
        className="w-full"
        title="页面加载失败"
        description="可能是临时网络或渲染问题，你可以尝试重新加载当前页面。"
        onRetry={reset}
      />
    </div>
  );
}
