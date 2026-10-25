type SectionProps = {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function Section({
  eyebrow,
  title,
  lead,
  children,
  className = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 ${className}`}
    >
      {(eyebrow || title || lead) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-tight tracking-[-0.02em] text-ink">
              {title}
            </h2>
          )}
          {lead && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
