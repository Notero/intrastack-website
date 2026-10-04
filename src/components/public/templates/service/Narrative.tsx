import EditorialNarrative from "@/components/public/narrative/EditorialNarrative";
import { accentClasses, type ServiceContent } from "./_shared";

export default function Narrative({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];
  return (
    <EditorialNarrative
      eyebrow={c.narrative.tagline}
      title={c.narrative.sectionTitle}
      kicker={c.narrative.sectionLede}
      lede={c.narrative.intro}
      pillars={c.narrative.pillars}
      closing={c.narrative.closing}
      accentClass={`italic font-serif ${a.emph}`}
      bg="bg-paper-2"
    />
  );
}
