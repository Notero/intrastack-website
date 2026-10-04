import SolutionPage from "@/components/public/templates/solutionPage";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata = {
  title: `${SOLUTIONS["security_compliance"].name} · Intrastack`,
  description: SOLUTIONS["security_compliance"].lede,
  alternates: { canonical: "/solutions/security_compliance" },
  openGraph: {
    title: SOLUTIONS["security_compliance"].name,
    description: SOLUTIONS["security_compliance"].lede,
    url: "/solutions/security_compliance",
    images: [SOLUTIONS["security_compliance"].heroImage],
  },
};

export default function Page() {
  return <SolutionPage c={SOLUTIONS["security_compliance"]} />;
}
