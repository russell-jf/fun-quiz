import attachmentLightCheck from "@/data/quizzes/attachment-light-check.json";
import husbandScoreCheck from "@/data/quizzes/husband-score-check.json";
import mentalAgeSpark from "@/data/quizzes/mental-age-spark.json";
import partnerVibeIndex from "@/data/quizzes/partner-vibe-index.json";
import socialBatteryType from "@/data/quizzes/social-battery-type.json";
import softPowerPersonality from "@/data/quizzes/soft-power-personality.json";
import type { QuizContent } from "@/lib/types";

const quizMap: Record<string, QuizContent> = {
  [husbandScoreCheck.slug]: husbandScoreCheck as QuizContent,
  [partnerVibeIndex.slug]: partnerVibeIndex as QuizContent,
  [softPowerPersonality.slug]: softPowerPersonality as QuizContent,
  [mentalAgeSpark.slug]: mentalAgeSpark as QuizContent,
  [attachmentLightCheck.slug]: attachmentLightCheck as QuizContent,
  [socialBatteryType.slug]: socialBatteryType as QuizContent,
};

export function getQuizBySlug(slug: string): QuizContent | undefined {
  return quizMap[slug];
}

export function getAvailableQuizSlugs(): string[] {
  return Object.keys(quizMap);
}

export function hasQuizContent(slug: string): boolean {
  return Boolean(quizMap[slug]);
}
