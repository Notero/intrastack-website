import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["azure"].name} · Intrastack`,
  description: SOLUTIONS["azure"].lede,
  alternates: { canonical: "/solutions/azure" },
  openGraph: {
    title: SOLUTIONS["azure"].name,
    description: SOLUTIONS["azure"].lede,
    url: "/solutions/azure",
    images: [SOLUTIONS["azure"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["azure"]} />;
}
