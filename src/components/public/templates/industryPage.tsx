import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schemas";
import SectionSeam from "@/components/public/sectionSeam";
import Hero from "@/components/public/templates/industry/Hero";
import EditorialNarrative from "@/components/public/narrative/EditorialNarrative";
import Challenges from "@/components/public/templates/industry/Challenges";
import Approach from "@/components/public/templates/industry/Approach";
import RelatedNews from "@/components/public/templates/shared/RelatedNews";
import Related from "@/components/public/templates/industry/Related";
import FinalCTA from "@/components/public/templates/industry/FinalCTA";
import { type IndustryContent } from "@/components/public/templates/industry/_shared";

export type { IndustryContent } from "@/components/public/templates/industry/_shared";

export default function IndustryPage({ c }: { c: IndustryContent }) {
  return (
    <main className="flex flex-col flex-1 pt-30">
      <SchemaScript
        data={[
          serviceSchema({
            name: `${c.name} — Intrastack`,
            path: `/industries/${c.slug}`,
            description: c.lede,
            image: c.heroImage,
            serviceType: `${c.name} solutions`,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Industries", url: "/industries" },
            { name: c.name, url: `/industries/${c.slug}` },
          ]),
        ]}
      />

      <Hero c={c} />

      {c.narrative && (
        <>
          <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-2)" />
          <EditorialNarrative {...c.narrative} bg="bg-paper-2" />
        </>
      )}

      <SectionSeam variant="wave" topColor={c.narrative ? "var(--paper-2)" : "var(--paper)"} bottomColor="var(--paper-3)" />
      <Challenges c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--paper-2)" />
      <Approach c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-2)" bottomColor="var(--paper)" />
      <RelatedNews
        terms={[c.name, c.slug, c.noun]}
        heading={`From the ${c.name.toLowerCase()} [[desk.]]`}
        kicker={`What we are shipping, learning, and publishing for ${c.noun} clients.`}
        bg="bg-paper"
      />

      <SectionSeam variant="slant" topColor="var(--paper)" bottomColor="var(--paper-3)" flip />
      <Related c={c} />

      <FinalCTA c={c} />
    </main>
  );
}
