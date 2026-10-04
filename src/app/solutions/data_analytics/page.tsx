import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["data_analytics"].name} · Intrastack`,
  description: SOLUTIONS["data_analytics"].lede,
  alternates: { canonical: "/solutions/data_analytics" },
  openGraph: {
    title: SOLUTIONS["data_analytics"].name,
    description: SOLUTIONS["data_analytics"].lede,
    url: "/solutions/data_analytics",
    images: [SOLUTIONS["data_analytics"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["data_analytics"]} />;
}
