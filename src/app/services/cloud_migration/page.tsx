import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["cloud_migration"].name} · Intrastack`,
  description: SERVICES["cloud_migration"].lede,
  alternates: { canonical: "/services/cloud_migration" },
  openGraph: {
    title: SERVICES["cloud_migration"].name,
    description: SERVICES["cloud_migration"].lede,
    url: "/services/cloud_migration",
    images: [SERVICES["cloud_migration"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["cloud_migration"]} />;
}
