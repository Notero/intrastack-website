import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schemas";
import SectionSeam from "@/components/public/sectionSeam";
import PricingSection from "@/components/public/templates/pricingSection";
import Hero from "@/components/public/templates/service/Hero";
import Narrative from "@/components/public/templates/service/Narrative";
import Deliverables from "@/components/public/templates/service/Deliverables";
import Process from "@/components/public/templates/service/Process";
import RelatedNews from "@/components/public/templates/shared/RelatedNews";
import ContactCTA from "@/components/public/templates/service/ContactCTA";
import { accentClasses, type ServiceContent } from "@/components/public/templates/service/_shared";

export type { ServiceContent, ServiceAccent } from "@/components/public/templates/service/_shared";

export default function ServicePage({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];

  return (
    <main className="flex flex-col flex-1 pt-30">
      <SchemaScript
        data={[
          serviceSchema({
            name: c.name,
            path: `/services/${c.slug}`,
            description: c.lede,
            image: c.heroImage,
            serviceType: c.name,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: c.name, url: `/services/${c.slug}` },
          ]),
        ]}
      />

      <Hero c={c} />
      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-2)"/>
      <Narrative c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-2)" bottomColor="var(--paper-3)" />
      <Deliverables c={c} />

      <SectionSeam variant="wave" topColor="var(--paper-3)" bottomColor="var(--paper)" />
      <Process c={c} />

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-4)" />
      <PricingSection emphClass={a.emph} />

      <SectionSeam variant="wave" topColor="var(--paper-4)" bottomColor="var(--paper-2)" />
      <RelatedNews
        terms={[c.name, c.slug, ...c.name.split(/[\s&]+/).filter((w) => w.length > 2)]}
        heading={`${c.name} in the [[field.]]`}
        kicker={`Posts, trends, and client stories tied to ${c.name}.`}
        accentClass={`italic font-serif ${a.emph}`}
        bg="bg-paper-2"
      />

      <ContactCTA c={c} />
    </main>
  );
}
