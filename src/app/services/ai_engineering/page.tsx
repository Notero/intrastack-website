import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["ai_engineering"].name} · Intrastack`,
  description: SERVICES["ai_engineering"].lede,
  alternates: { canonical: "/services/ai_engineering" },
  openGraph: {
    title: SERVICES["ai_engineering"].name,
    description: SERVICES["ai_engineering"].lede,
    url: "/services/ai_engineering",
    images: [SERVICES["ai_engineering"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["ai_engineering"]} />;
}
