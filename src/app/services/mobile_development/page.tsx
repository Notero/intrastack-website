import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["mobile_development"].name} · Intrastack`,
  description: SERVICES["mobile_development"].lede,
  alternates: { canonical: "/services/mobile_development" },
  openGraph: {
    title: SERVICES["mobile_development"].name,
    description: SERVICES["mobile_development"].lede,
    url: "/services/mobile_development",
    images: [SERVICES["mobile_development"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["mobile_development"]} />;
}
