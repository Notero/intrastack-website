import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["cybersecurity"].name} · Intrastack`,
  description: SERVICES["cybersecurity"].lede,
  alternates: { canonical: "/services/cybersecurity" },
  openGraph: {
    title: SERVICES["cybersecurity"].name,
    description: SERVICES["cybersecurity"].lede,
    url: "/services/cybersecurity",
    images: [SERVICES["cybersecurity"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["cybersecurity"]} />;
}
