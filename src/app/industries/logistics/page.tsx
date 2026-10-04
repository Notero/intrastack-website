import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["logistics"].name} · Intrastack`,
  description: INDUSTRIES["logistics"].lede,
  alternates: { canonical: "/industries/logistics" },
  openGraph: {
    title: INDUSTRIES["logistics"].name,
    description: INDUSTRIES["logistics"].lede,
    url: "/industries/logistics",
    images: [INDUSTRIES["logistics"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["logistics"]} />;
}
