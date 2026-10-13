import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { QuizResultGate } from "@/components/quiz/quiz-result-gate";
import { TestIntroLoadingSkeleton } from "@/components/shared/loading-skeleton";
import { getAvailableQuizSlugs, getQuizBySlug } from "@/lib/quizzes";
import { getRelatedTests, getTestBySlug } from "@/lib/tests";

type ResultPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAvailableQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    return { title: "结果未找到" };
  }

  return {
    title: `测评结果 · ${test.title}`,
    description: `查看「${test.title}」的趣味测评结果，并可分享给你的朋友。`,
  };
}

export default async function QuizResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  const quiz = getQuizBySlug(slug);

  if (!test || test.status !== "available" || !quiz) {
    notFound();
  }

  const related = getRelatedTests(test.slug);

  return (
    <Suspense fallback={<TestIntroLoadingSkeleton />}>
      <QuizResultGate test={test} quiz={quiz} related={related} />
    </Suspense>
  );
}
