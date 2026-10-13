import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-5xl text-brand-purple">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">页面不存在</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">
        这个地址没有对应内容。回到首页继续浏览趣味测评吧。
      </p>
      <Button asChild className="mt-6" variant="soft">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
