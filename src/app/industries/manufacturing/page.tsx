import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["manufacturing"].name} · Intrastack`,
  description: INDUSTRIES["manufacturing"].lede,
  alternates: { canonical: "/industries/manufacturing" },
  openGraph: {
    title: INDUSTRIES["manufacturing"].name,
    description: INDUSTRIES["manufacturing"].lede,
    url: "/industries/manufacturing",
    images: [INDUSTRIES["manufacturing"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["manufacturing"]} />;
}
