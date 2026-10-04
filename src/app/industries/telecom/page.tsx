import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["telecom"].name} · Intrastack`,
  description: INDUSTRIES["telecom"].lede,
  alternates: { canonical: "/industries/telecom" },
  openGraph: {
    title: INDUSTRIES["telecom"].name,
    description: INDUSTRIES["telecom"].lede,
    url: "/industries/telecom",
    images: [INDUSTRIES["telecom"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["telecom"]} />;
}
