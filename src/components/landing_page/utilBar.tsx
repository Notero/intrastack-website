export default function UtilBar() {
  return (
    <div className="w-full bg-accent border-b border-base-300 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            1048 East Highway 50, Clermont, FL 34711
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Mon–Fri · 09:00–18:00
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:info@intrastack.com" className="hover:text-primary transition-colors">
            info@intrastack.com
          </a>
          <span className="h-3 w-px bg-base-300" />
          <a href="tel:8889597868" className="hover:text-primary transition-colors">
            888-959-7868
          </a>
          <span className="h-3 w-px bg-base-300" />
          <a href="/login" className="hover:text-primary transition-colors">
            Client portal
          </a>
        </div>
      </div>
    </div>
  );
}
