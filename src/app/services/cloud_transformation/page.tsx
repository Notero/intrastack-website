import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["cloud_transformation"].name} · Intrastack`,
  description: SERVICES["cloud_transformation"].lede,
  alternates: { canonical: "/services/cloud_transformation" },
  openGraph: {
    title: SERVICES["cloud_transformation"].name,
    description: SERVICES["cloud_transformation"].lede,
    url: "/services/cloud_transformation",
    images: [SERVICES["cloud_transformation"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["cloud_transformation"]} />;
}
