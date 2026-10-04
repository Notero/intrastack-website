import ServicePage from "@/components/public/templates/servicePage";
import { SERVICES } from "@/lib/content/services";

export const metadata = {
  title: `${SERVICES["staff_augmentation"].name} · Intrastack`,
  description: SERVICES["staff_augmentation"].lede,
  alternates: { canonical: "/services/staff_augmentation" },
  openGraph: {
    title: SERVICES["staff_augmentation"].name,
    description: SERVICES["staff_augmentation"].lede,
    url: "/services/staff_augmentation",
    images: [SERVICES["staff_augmentation"].heroImage],
  },
};

export default function Page() {
  return <ServicePage c={SERVICES["staff_augmentation"]} />;
}
