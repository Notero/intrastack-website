interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header className="mb-10 flex flex-wrap items-start gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-500">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-[var(--font-heading)] text-3xl font-bold leading-tight tracking-tight text-zinc-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
