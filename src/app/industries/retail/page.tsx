import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["retail"].name} · Intrastack`,
  description: INDUSTRIES["retail"].lede,
  alternates: { canonical: "/industries/retail" },
  openGraph: {
    title: INDUSTRIES["retail"].name,
    description: INDUSTRIES["retail"].lede,
    url: "/industries/retail",
    images: [INDUSTRIES["retail"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["retail"]} />;
}
