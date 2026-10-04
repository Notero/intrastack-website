import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["devops_automation"].name} · Intrastack`,
  description: SERVICES["devops_automation"].lede,
  alternates: { canonical: "/services/devops_automation" },
  openGraph: {
    title: SERVICES["devops_automation"].name,
    description: SERVICES["devops_automation"].lede,
    url: "/services/devops_automation",
    images: [SERVICES["devops_automation"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["devops_automation"]} />;
}
