import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["aws"].name} · Intrastack`,
  description: SOLUTIONS["aws"].lede,
  alternates: { canonical: "/solutions/aws" },
  openGraph: {
    title: SOLUTIONS["aws"].name,
    description: SOLUTIONS["aws"].lede,
    url: "/solutions/aws",
    images: [SOLUTIONS["aws"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["aws"]} />;
}
