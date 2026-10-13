import { CategoryCard } from "@/components/tests/category-card";
import { getAllTests, getCategories } from "@/lib/tests";

export function CategorySection() {
  const categories = getCategories();
  const tests = getAllTests();

  return (
    <section id="categories" className="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.18em] text-brand-purple/70">
            CATEGORIES
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
            测试分类
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
            按主题快速找到你想测的方向，先看介绍，再决定要不要继续。
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              testCount={
                tests.filter((test) => test.categoryId === category.id).length
              }
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
