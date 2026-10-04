export type IndustryContent = {
  slug: string;
  name: string;
  noun: string;
  heroImage: string;
  headline: string;
  lede: string;
  pills: string[];
  stats?: { value: string; label: string }[];
  narrative?: {
    eyebrow: string;
    title: string;
    kicker?: string;
    lede: string;
    pillars: { title: string; body: string }[];
    closing?: string;
  };
  challenges: { letter: string; title: string; body: string }[];
  approach: { title: string; body: string }[];
  diagramLabel: string;
  related: { kind: "Service" | "Solution"; name: string; href: string }[];
};
