import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["enterprise_security"].name} · Intrastack`,
  description: SOLUTIONS["enterprise_security"].lede,
  alternates: { canonical: "/solutions/enterprise_security" },
  openGraph: {
    title: SOLUTIONS["enterprise_security"].name,
    description: SOLUTIONS["enterprise_security"].lede,
    url: "/solutions/enterprise_security",
    images: [SOLUTIONS["enterprise_security"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["enterprise_security"]} />;
}
