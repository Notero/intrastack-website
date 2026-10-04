import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["ai_automation"].name} · Intrastack`,
  description: SOLUTIONS["ai_automation"].lede,
  alternates: { canonical: "/solutions/ai_automation" },
  openGraph: {
    title: SOLUTIONS["ai_automation"].name,
    description: SOLUTIONS["ai_automation"].lede,
    url: "/solutions/ai_automation",
    images: [SOLUTIONS["ai_automation"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["ai_automation"]} />;
}
