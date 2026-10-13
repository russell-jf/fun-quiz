import { AboutSection } from "@/components/home/about-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <AboutSection />
    </>
  );
}
