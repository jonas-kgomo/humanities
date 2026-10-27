import Link from "next/link";
import { Section } from "@/components/Section";
import { people, researchStrands, site, teachings } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="animate-drift absolute -right-8 top-16 h-64 w-56 rotate-12 bg-shape-a/55 sm:h-80 sm:w-72" />
          <div className="animate-drift-slow absolute right-28 top-40 h-48 w-44 -rotate-6 bg-shape-c/45 sm:h-64 sm:w-56" />
          <div className="animate-drift absolute bottom-8 left-[8%] h-40 w-52 rotate-[-8deg] bg-shape-b/35 sm:h-52 sm:w-64" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
          <p className="animate-fade-up font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
            {site.name}
          </p>
          <h1 className="animate-fade-up-delay-1 mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.08] tracking-[-0.025em] text-ink">
            Who can act, interpret,{" "}
            <em>and decide</em>
          </h1>
          <p className="animate-fade-up-delay-2 mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-ink-soft">
            {site.missionLead}
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
            >
              The research programme
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
            >
              The problem and the method
            </Link>
          </div>
          <p className="animate-fade-up-delay-3 mt-10 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
            {site.tagline}
          </p>
        </div>
      </section>

      <Section
        eyebrow="Research programme"
        title="Three strands. One problem."
        lead="Digital systems redistribute the ability to organise, to read cultural material, and to say what counts as knowledge. Each strand names a part of that problem and the method for working on it."
      >
        <ol className="grid gap-px bg-line md:grid-cols-3">
          {researchStrands.map((strand, i) => (
            <li key={strand.slug} className="bg-paper px-6 py-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl text-ink">
                {strand.title}
              </h3>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
                {strand.summary}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link
            href="/research"
            className="font-sans text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:decoration-ink"
          >
            Questions, methods, and outputs ↗
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Method"
        title="Start from the collision. Then test alternatives."
        lead="Humanities researchers formulate the question, select the method, and decide what would count as success. Technical collaborators state what a system can and cannot reliably deliver."
        className="border-t border-line"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div className="prose-cdm">
            <p>
              We do not start from a canon and apply it outward. We start from
              places where platforms already mediate group decisions, where
              models already classify and translate, and where libraries,
              universities, and cultural organisations already decide which
              claims to trust.
            </p>
          </div>
          <div className="prose-cdm">
            <p>
              Projects stay bounded: a collection, a partner, a setting that
              can be evaluated. Language work follows expertise, community
              priorities, and permissions. A system is judged by its effects on
              participation, interpretation, and authority — not by adoption
              alone.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="People"
        title="A small lab, not a campus network."
        className="border-t border-line"
      >
        <ul className="divide-y divide-line border-y border-line">
          {people.map((person) => (
            <li
              key={person.name}
              className="grid gap-2 py-6 sm:grid-cols-[1.1fr_1fr] sm:gap-8"
            >
              <div>
                <p className="font-sans text-lg font-semibold tracking-[-0.01em] text-ink">
                  {person.name}
                </p>
                <p className="mt-1 text-sm text-mute">{person.role}</p>
                <p className="mt-1 text-sm text-mute">{person.institution}</p>
              </div>
              <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                {person.focus}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href="/people"
            className="font-sans text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:decoration-ink"
          >
            Meet the lab ↗
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Teaching"
        title="Seminars that carry the programme."
        lead="Agency and contestation; ethics at Loyola; privacy and cross-border data; public finance and southern African institutions."
        className="border-t border-line"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {teachings.slice(0, 2).map((course) => (
            <article key={course.title} className="border-t border-line pt-6">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                {course.lead}
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">
                {course.title}
              </h3>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-soft">
                {course.description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/teaching"
            className="font-sans text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:decoration-ink"
          >
            See teaching & seminars ↗
          </Link>
        </div>
      </Section>
    </>
  );
}
