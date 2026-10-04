import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["software_development"].name} · Intrastack`,
  description: SERVICES["software_development"].lede,
  alternates: { canonical: "/services/software_development" },
  openGraph: {
    title: SERVICES["software_development"].name,
    description: SERVICES["software_development"].lede,
    url: "/services/software_development",
    images: [SERVICES["software_development"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["software_development"]} />;
}
