import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["healthcare"].name} · Intrastack`,
  description: INDUSTRIES["healthcare"].lede,
  alternates: { canonical: "/industries/healthcare" },
  openGraph: {
    title: INDUSTRIES["healthcare"].name,
    description: INDUSTRIES["healthcare"].lede,
    url: "/industries/healthcare",
    images: [INDUSTRIES["healthcare"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["healthcare"]} />;
}
