import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  lead: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
      {eyebrow && (
        <p className="animate-fade-up font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
          {eyebrow}
        </p>
      )}
      <h1 className="animate-fade-up-delay-1 mt-4 max-w-3xl font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1.12] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="animate-fade-up-delay-2 mt-6 max-w-2xl font-display text-xl sm:text-2xl leading-relaxed text-ink-soft">
        {lead}
      </p>
      {children && (
        <div className="animate-fade-up-delay-3 mt-8">{children}</div>
      )}
    </section>
  );
}
