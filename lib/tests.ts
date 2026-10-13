import categoriesData from "@/data/categories.json";
import testsData from "@/data/tests.json";
import type { QuizTest, TestCategory, TestCategoryId } from "@/lib/types";

const categories = categoriesData as TestCategory[];
const tests = testsData as QuizTest[];

export function getCategories(): TestCategory[] {
  return categories;
}

export function getCategoryById(id: TestCategoryId): TestCategory | undefined {
  return categories.find((category) => category.id === id);
}

export function getAllTests(): QuizTest[] {
  return [...tests].sort((a, b) => b.popularity - a.popularity);
}

export function getFeaturedTests(): QuizTest[] {
  return getAllTests().filter((test) => test.featured);
}

/** Homepage primary push — currently the viral husband-score quiz. */
export function getSpotlightTest(): QuizTest | undefined {
  return (
    getTestBySlug("husband-score-check") ??
    getFeaturedTests()[0] ??
    getAllTests()[0]
  );
}

export function getTestsByCategory(categoryId: TestCategoryId): QuizTest[] {
  return getAllTests().filter((test) => test.categoryId === categoryId);
}

export function getTestBySlug(slug: string): QuizTest | undefined {
  return tests.find((test) => test.slug === slug);
}

export function getAllTestSlugs(): string[] {
  return tests.map((test) => test.slug);
}

export function getRelatedTests(slug: string, limit = 3): QuizTest[] {
  const current = getTestBySlug(slug);
  if (!current) return getAllTests().slice(0, limit);

  return getAllTests()
    .filter(
      (test) =>
        test.slug !== slug &&
        (test.categoryId === current.categoryId || test.featured),
    )
    .slice(0, limit);
}
