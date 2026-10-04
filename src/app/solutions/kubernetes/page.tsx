import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["kubernetes"].name} · Intrastack`,
  description: SOLUTIONS["kubernetes"].lede,
  alternates: { canonical: "/solutions/kubernetes" },
  openGraph: {
    title: SOLUTIONS["kubernetes"].name,
    description: SOLUTIONS["kubernetes"].lede,
    url: "/solutions/kubernetes",
    images: [SOLUTIONS["kubernetes"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["kubernetes"]} />;
}
