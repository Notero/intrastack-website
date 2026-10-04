import IndustryPage from "@/components/public/templates/industryPage";
import { INDUSTRIES } from "@/lib/content/industries";

export const metadata = {
  title: `${INDUSTRIES["education"].name} · Intrastack`,
  description: INDUSTRIES["education"].lede,
  alternates: { canonical: "/industries/education" },
  openGraph: {
    title: INDUSTRIES["education"].name,
    description: INDUSTRIES["education"].lede,
    url: "/industries/education",
    images: [INDUSTRIES["education"].heroImage],
  },
};

export default function Page() {
  return <IndustryPage c={INDUSTRIES["education"]} />;
}
