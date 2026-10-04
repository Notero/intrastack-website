import { NewsPortalNav } from "@/components/public/news/NewsPortalNav";
import { NewsPortalFooter } from "@/components/public/news/NewsPortalFooter";

/**
 * News portal layout — replaces MarketingChrome for all /news/* routes.
 * MarketingChrome excludes /news via pathname check update, so this shell
 * provides the portal's own SiteNav + SiteFooter.
 */
export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NewsPortalNav />
      <main className="flex-1">{children}</main>
      <NewsPortalFooter />
    </div>
  );
}
