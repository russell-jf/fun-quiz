import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { TestCard } from "@/components/tests/test-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllTests,
  getFeaturedTests,
  getSpotlightTest,
} from "@/lib/tests";

export function FeaturedSection() {
  const spotlight = getSpotlightTest();
  const featured = getFeaturedTests().filter(
    (test) => test.slug !== spotlight?.slug,
  );
  const allTests = getAllTests();
  const listedIds = new Set(
    [spotlight, ...featured].filter(Boolean).map((test) => test!.id),
  );

  return (
    <section id="featured" className="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.18em] text-brand-pink/80">
            FEATURED
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
            热门测评
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
            首推卖老公合格线，其余测评也可一键开测、分享结果。
          </p>
        </div>

        {spotlight ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-brand-purple/15 bg-white/80 shadow-lift">
            <div
              className={`bg-gradient-to-br px-5 py-7 sm:px-8 sm:py-8 ${spotlight.coverGradient}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="pink">本周首推</Badge>
                <Badge variant="cream">恋爱</Badge>
              </div>
              <h3 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
                {spotlight.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-ink/65 sm:text-base">
                {spotlight.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="soft" size="lg">
                  <Link href={`/tests/${spotlight.slug}`}>
                    查看介绍并开测
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href={`/tests/${spotlight.slug}/play`}>直接开始</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {featured.length === 0 && !spotlight ? (
          <EmptyState
            className="mt-8"
            title="暂时还没有测评"
            description="题库正在准备中，稍后再来看看吧。"
          />
        ) : featured.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {featured.map((test, index) => (
              <TestCard key={test.id} test={test} index={index} />
            ))}
          </div>
        ) : null}

        {allTests.some((test) => !listedIds.has(test.id)) ? (
          <div className="mt-10">
            <h3 className="font-display text-xl text-ink">更多测评</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allTests
                .filter((test) => !listedIds.has(test.id))
                .map((test, index) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    index={index}
                    compact
                  />
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
