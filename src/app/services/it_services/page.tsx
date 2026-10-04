import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["it_services"].name} · Intrastack`,
  description: SERVICES["it_services"].lede,
  alternates: { canonical: "/services/it_services" },
  openGraph: {
    title: SERVICES["it_services"].name,
    description: SERVICES["it_services"].lede,
    url: "/services/it_services",
    images: [SERVICES["it_services"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["it_services"]} />;
}
