import Link from "next/link";
import { Section } from "@/components/Section";
import {
  curriculumModules,
  fellowshipHighlights,
  partners,
  people,
  site,
  teachings,
} from "@/lib/content";

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
            Who decides what a{" "}
            <em>successful system</em> should do?
          </h1>
          <p className="animate-fade-up-delay-2 mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-ink-soft">
            {site.missionLead} Technical collaborators contribute
            implementation, measurement, and an understanding of what systems
            can and cannot reliably deliver.
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/fellowship"
              className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
            >
              Fellowship & residency
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
            >
              About the Centre
            </Link>
          </div>
          <p className="animate-fade-up-delay-3 mt-10 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
            {site.tagline}
          </p>
        </div>
      </section>

      <Section
        eyebrow="Consortium"
        title="A network, not a single campus."
        lead="CDH links complementary expertise across the University of Johannesburg, Loyola University Chicago, Sciences Po, and the Equiano Institute — with Global South leadership at the centre."
      >
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="bg-paper px-5 py-7 transition-colors duration-200 hover:bg-paper-deep/50"
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                Partner
              </p>
              <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.01em] text-ink">
                {partner.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {partner.role}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Teaching & Research"
        title="Curriculum modules that carry the research."
        lead="Five modules structure both teaching and research. The full outlines and readings live on the Teaching page — as a curriculum document, not a gallery."
        className="border-t border-line"
      >
        <ol className="divide-y divide-line border-y border-line">
          {curriculumModules.map((module) => (
            <li key={module.slug}>
              <Link
                href={`/teaching#${module.slug}`}
                className="grid gap-2 py-6 transition-colors hover:bg-paper-deep/30 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                  {String(module.number).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-xl text-ink sm:text-2xl">
                    {module.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-[1rem] leading-relaxed text-ink-soft line-clamp-2">
                    {module.summary}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link
            href="/teaching"
            className="font-sans text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:decoration-ink"
          >
            Read the full curriculum ↗
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Programmes"
        title="Two distinct structures for field-building."
        lead="The fellowship is a residency for a cohort. The symposium is the field’s public gathering. Related in calendar — separate in purpose."
        className="border-t border-line bg-paper-deep/30"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="border border-line bg-paper px-6 py-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Residency
            </p>
            <h3 className="mt-3 font-display text-2xl text-ink">
              Digital Humanities Fellowship
            </h3>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
              An annual residency for early-career researchers, doctoral
              students, and practitioners — seminars, mentorship, and
              collaborative research, with emphasis on participation from
              underrepresented regions, especially Africa.
            </p>
            <ul className="mt-6 space-y-2">
              {fellowshipHighlights.slice(0, 3).map((item) => (
                <li key={item} className="text-sm text-mute">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/fellowship/apply"
                className="inline-flex text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                Apply ↗
              </Link>
              <Link
                href="/fellowship"
                className="inline-flex text-sm font-semibold text-mute underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                Programme details
              </Link>
            </div>
          </article>
          <article className="border border-line bg-paper px-6 py-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Convening
            </p>
            <h3 className="mt-3 font-display text-2xl text-ink">
              Digital Humanities Symposium
            </h3>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
              A focused international gathering for presenting research,
              strengthening collaborations, and setting priorities — open to
              fellows, invited scholars, technical collaborators, and funders.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="text-sm text-mute">Paper presentations</li>
              <li className="text-sm text-mute">Keynotes & panels</li>
              <li className="text-sm text-mute">Field-wide collaboration</li>
            </ul>
            <Link
              href="/symposium"
              className="mt-8 inline-flex text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              Symposium details ↗
            </Link>
          </article>
        </div>
      </Section>

      <Section
        eyebrow="Teaching"
        title="Curriculum that travels across institutions."
        lead="From graduate seminars to open reading groups, consortium partners build shared educational pathways for joining humanities inquiry to technical design."
        className="border-t border-line"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {teachings.slice(0, 2).map((course) => (
            <article
              key={course.title}
              className="border-t border-line pt-6"
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                {course.institution}
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

      <Section
        eyebrow="People"
        title="Scholars across the humanities, design, and education."
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
            Meet the consortium ↗
          </Link>
        </div>
      </Section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
              Readings
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-tight text-ink">
              Start with the questions that matter.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Key readings from each curriculum module, plus a core set on
              technology, interpretation, labour, and the geopolitics of digital
              methods.
            </p>
          </div>
          <Link
            href="/readings"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Browse readings
          </Link>
        </div>
      </section>
    </>
  );
}
