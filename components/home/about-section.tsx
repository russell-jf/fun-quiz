export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-brand-purple/10 bg-white/60 px-6 py-8 shadow-soft sm:px-8 sm:py-10">
        <p className="text-xs font-medium tracking-[0.18em] text-brand-purple/70">
          ABOUT
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          关于本站
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 sm:text-base">
          「趣味测评」是一个面向移动端用户的测评网站，内容以轻松、可读、可分享为原则。
          当前首推「卖老公：多少分合格」，也可在线完成人格、恋爱与心理年龄等测评。题库暂存于本地 JSON，后续可接入云端。所有测试仅供娱乐，不构成专业建议。
        </p>
        <ul className="mt-6 grid gap-3 text-sm text-ink/70 sm:grid-cols-3">
          <li className="rounded-2xl bg-cream-deep/80 px-4 py-3">
            手机优先排版，单手也能顺畅浏览
          </li>
          <li className="rounded-2xl bg-cream-deep/80 px-4 py-3">
            分类清晰：人格 / 恋爱 / 心理年龄
          </li>
          <li className="rounded-2xl bg-cream-deep/80 px-4 py-3">
            支持在线答题出结果，题库后续可接云端
          </li>
        </ul>
      </div>
    </section>
  );
}
