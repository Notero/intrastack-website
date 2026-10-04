import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["government"].name} · Intrastack`,
  description: INDUSTRIES["government"].lede,
  alternates: { canonical: "/industries/government" },
  openGraph: {
    title: INDUSTRIES["government"].name,
    description: INDUSTRIES["government"].lede,
    url: "/industries/government",
    images: [INDUSTRIES["government"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["government"]} />;
}
