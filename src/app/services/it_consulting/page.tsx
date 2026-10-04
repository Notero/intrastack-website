import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["it_consulting"].name} · Intrastack`,
  description: SERVICES["it_consulting"].lede,
  alternates: { canonical: "/services/it_consulting" },
  openGraph: {
    title: SERVICES["it_consulting"].name,
    description: SERVICES["it_consulting"].lede,
    url: "/services/it_consulting",
    images: [SERVICES["it_consulting"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["it_consulting"]} />;
}
