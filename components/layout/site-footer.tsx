import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-purple/10 bg-white/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg text-ink">趣味测评</p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink/55">
            面向移动端的趣味测评站，首推卖老公合格线，另有人格、恋爱与心理年龄测试。内容仅供娱乐参考。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink/55">
          <Link href="/#categories" className="hover:text-brand-purple">
            测试分类
          </Link>
          <Link href="/#featured" className="hover:text-brand-purple">
            热门测评
          </Link>
          <Link href="/#about" className="hover:text-brand-purple">
            关于
          </Link>
        </div>
      </div>
      <div className="border-t border-brand-purple/8">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-ink/40 sm:px-6">
          © 2026 趣味测评 · 轻松自测，好玩能分享
        </p>
      </div>
    </footer>
  );
}
