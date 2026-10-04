import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["cicd_transformation"].name} · Intrastack`,
  description: SOLUTIONS["cicd_transformation"].lede,
  alternates: { canonical: "/solutions/cicd_transformation" },
  openGraph: {
    title: SOLUTIONS["cicd_transformation"].name,
    description: SOLUTIONS["cicd_transformation"].lede,
    url: "/solutions/cicd_transformation",
    images: [SOLUTIONS["cicd_transformation"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["cicd_transformation"]} />;
}
