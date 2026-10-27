import Link from "next/link";
import { nav, people, site } from "@/lib/content";
import { Mark, Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-12 flex justify-center">
          <Mark size={56} />
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-sm font-display text-xl leading-snug text-ink-soft">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-mute">
              A research programme on agency, interpretation, and knowledge
              institutions under technological change.
            </p>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
              Lab
            </p>
            <ul className="mt-4 space-y-3">
              {people.map((p) => (
                <li key={p.name} className="text-[0.95rem] text-ink-soft">
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mute">
            © {new Date().getFullYear()} Centre for Humanities and Technology
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mute">
            Fieldbuilding & Research
          </p>
        </div>
      </div>
    </footer>
  );
}
