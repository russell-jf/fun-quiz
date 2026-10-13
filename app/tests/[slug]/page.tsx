import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TestIntro } from "@/components/tests/test-intro";
import { hasQuizContent } from "@/lib/quizzes";
import {
  getAllTestSlugs,
  getCategoryById,
  getRelatedTests,
  getTestBySlug,
} from "@/lib/tests";

type TestPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllTestSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    return {
      title: "测评未找到",
    };
  }

  return {
    title: test.title,
    description: test.description,
    openGraph: {
      title: `${test.title}｜趣味测评`,
      description: test.subtitle,
    },
  };
}

export default async function TestIntroPage({ params }: TestPageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  const category = getCategoryById(test.categoryId);
  const related = getRelatedTests(test.slug);
  const playable = test.status === "available" && hasQuizContent(test.slug);

  return (
    <TestIntro
      test={test}
      category={category}
      related={related}
      playable={playable}
    />
  );
}
