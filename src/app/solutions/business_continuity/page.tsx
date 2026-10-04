import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["business_continuity"].name} · Intrastack`,
  description: SOLUTIONS["business_continuity"].lede,
  alternates: { canonical: "/solutions/business_continuity" },
  openGraph: {
    title: SOLUTIONS["business_continuity"].name,
    description: SOLUTIONS["business_continuity"].lede,
    url: "/solutions/business_continuity",
    images: [SOLUTIONS["business_continuity"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["business_continuity"]} />;
}
