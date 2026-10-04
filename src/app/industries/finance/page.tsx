import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["finance"].name} · Intrastack`,
  description: INDUSTRIES["finance"].lede,
  alternates: { canonical: "/industries/finance" },
  openGraph: {
    title: INDUSTRIES["finance"].name,
    description: INDUSTRIES["finance"].lede,
    url: "/industries/finance",
    images: [INDUSTRIES["finance"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["finance"]} />;
}
