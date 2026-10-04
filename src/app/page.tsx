import type { Metadata } from "next";
import { SITE } from "@/lib/seo/site";
import HeroCarousel from "@/components/landing_page/heroCarousel";
import ContractsStrip from "@/components/landing_page/contractsStrip";
import About from "@/components/landing_page/about";
import ByTheNumbers from "@/components/landing_page/byTheNumbers";
import Services from "@/components/landing_page/services";
import Solutions from "@/components/landing_page/solutions";
import Expertise from "@/components/landing_page/expertise";
import Industries from "@/components/landing_page/industries";
import TechStack from "@/components/landing_page/techStack";
import Testimonial from "@/components/landing_page/testimonial";
import News from "@/components/landing_page/news";
import CTA from "@/components/landing_page/cta";
import SectionSeam from "@/components/public/sectionSeam";
import TrustBar from "@/components/landing_page/trustBar";
import { Section } from "lucide-react";

export const metadata: Metadata = {
  title: "Cloud Transformation, DevOps Automation & AI Engineering",
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="flex flex-col flex-1 pt-26">
    
      <HeroCarousel />
      <ContractsStrip />
      <SectionSeam variant="wave" topColor="var(--paper-5)" bottomColor="var(--paper-3)" flip />

      <About />
      {/* about (paper-3) → byTheNumbers (var(--dark-warm)) */}
      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--dark-warm)" flip />
      <ByTheNumbers />
      {/* byTheNumbers (var(--dark-warm)) → services (paper-4) */}
      <SectionSeam variant="wave" topColor="var(--dark-warm)" bottomColor="var(--paper-4)" />

      <Services />
      {/* services (paper-4) → techStack (paper-2) */}
      <SectionSeam variant="wave" topColor="var(--paper-4)" bottomColor="var(--paper-2)" />

      <TechStack />
      {/* techStack (paper-2) → solutions (paper-5) */}
      <SectionSeam variant="wave" topColor="var(--paper-2)" bottomColor="var(--paper-5)" />

      <Solutions />
      {/* solutions (paper-5) → expertise (paper-4) */}
      <SectionSeam variant="wave" topColor="var(--paper-5)" bottomColor="var(--dark-warm)" flip />

      <Expertise />

      <TrustBar />

      <Industries />
      {/* industries (paper-3) → testimonial (dark ink) */}
      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--dark-warm)" flip />

      <Testimonial />
      {/* testimonial (dark ink) → news (paper-2) */}
      <SectionSeam variant="wave" topColor="var(--dark-warm)" bottomColor="var(--paper-2)" flip />

      <News />
      {/* news (paper-2) → cta (paper-3) */}
      <SectionSeam variant="wave" topColor="var(--paper-2)" bottomColor="var(--paper-3)" flip />

      <CTA />
    </main>
  );
}
