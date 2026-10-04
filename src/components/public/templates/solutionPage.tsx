import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schemas";
import SectionSeam from "@/components/public/sectionSeam";
import Hero from "@/components/public/templates/solution/Hero";
import Narrative from "@/components/public/templates/solution/Narrative";
import Why from "@/components/public/templates/solution/Why";
import Capabilities from "@/components/public/templates/solution/Capabilities";
import Stack from "@/components/public/templates/solution/Stack";
import Compare from "@/components/public/templates/solution/Compare";
import RelatedNews from "@/components/public/templates/shared/RelatedNews";
import FinalCTA from "@/components/public/templates/solution/FinalCTA";
import { accentClasses, type SolutionContent } from "@/components/public/templates/solution/_shared";

export type { SolutionContent, SolutionAccent } from "@/components/public/templates/solution/_shared";

export default function SolutionPage({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <main className="flex flex-col flex-1 pt-30">
      <SchemaScript
        data={[
          serviceSchema({
            name: c.name,
            path: `/solutions/${c.slug}`,
            description: c.lede,
            image: c.heroImage,
            serviceType: c.name,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Solutions", url: "/solutions" },
            { name: c.name, url: `/solutions/${c.slug}` },
          ]),
        ]}
      />

      <Hero c={c} />
      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-2)" />
      <Narrative c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-2)" bottomColor="var(--paper-3)" />
      <Why c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--paper)" />
      <Capabilities c={c} />
      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-5)" />
      <Stack c={c} />
      <SectionSeam variant="wave" topColor="var(--paper-5)" bottomColor="var(--paper-3)" />
      <Compare c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--paper-2)" />
      <RelatedNews
        terms={[c.name, c.slug, ...c.accentPills, ...c.name.split(/[\s&]+/).filter((w) => w.length > 2)]}
        heading={`${c.name} in the [[field.]]`}
        kicker={`Posts, trends, and client stories tied to ${c.name}.`}
        accentClass={`italic font-serif ${a.emph}`}
        bg="bg-paper-2"
      />

      <FinalCTA c={c} />
    </main>
  );
}
