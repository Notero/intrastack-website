import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["hybrid_cloud"].name} · Intrastack`,
  description: SOLUTIONS["hybrid_cloud"].lede,
  alternates: { canonical: "/solutions/hybrid_cloud" },
  openGraph: {
    title: SOLUTIONS["hybrid_cloud"].name,
    description: SOLUTIONS["hybrid_cloud"].lede,
    url: "/solutions/hybrid_cloud",
    images: [SOLUTIONS["hybrid_cloud"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["hybrid_cloud"]} />;
}
