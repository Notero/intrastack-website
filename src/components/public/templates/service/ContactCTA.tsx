import Reveal from "@/components/public/reveal";
import SplitContactForm from "@/components/public/splitContactForm";
import { accentClasses, type ServiceContent } from "./_shared";

const SERVICE_TO_INTEREST: Record<string, string> = {
  ai_engineering: "AI & Machine Learning",
  cloud_transformation: "Cloud Transformation",
  cloud_migration: "Cloud Migration",
  cybersecurity: "Security & Compliance",
  devops_automation: "DevOps & Automation",
  software_development: "Software Development",
  staff_augmentation: "Staff Augmentation",
  it_consulting: "IT Consulting",
  it_services: "IT Consulting",
  mobile_development: "Software Development",
};

export default function ContactCTA({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];
  return (
    <section className="w-full bg-background py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="left" className="mb-10 max-w-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Tell us what you <span className={`italic font-serif ${a.emph}`}>need.</span>
          </h3>
          <p className="mt-3 text-muted-foreground">
            Drop a line — a senior engineer replies the same business day. No SDRs, no decks.
          </p>
        </Reveal>
        <Reveal direction="up" delay={150}>
          <SplitContactForm
            title={`Talk to us about ${c.name}.`}
            subtitle="A senior engineer replies the same business day. No SDRs, no decks."
            defaultInterest={SERVICE_TO_INTEREST[c.slug]}
          />
        </Reveal>
      </div>
    </section>
  );
}
