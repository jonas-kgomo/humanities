import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { curriculumModules, teachings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Teaching",
  description:
    "Shared curriculum modules, unit outlines, readings, and partner seminars across the Centre for Digital Humanities consortium.",
};

export default function TeachingPage() {
  return (
    <>
      <PageHero
        eyebrow="Teaching & Research"
        title="A shared curriculum for digital humanities."
        lead="Five modules structure both teaching and research — historical, philosophical, literary and linguistic, artistic, and social inquiry with technical design and evaluation. The full outline and readings sit on this page."
      />

      <nav
        aria-label="Curriculum modules"
        className="mx-auto max-w-6xl border-b border-line px-5 pb-10 sm:px-8"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
          On this page
        </p>
        <ol className="mt-4 space-y-2">
          {curriculumModules.map((module) => (
            <li key={module.slug}>
              <a
                href={`#${module.slug}`}
                className="font-sans text-[1.02rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                <span className="font-mono text-[0.7rem] text-mute">
                  {String(module.number).padStart(2, "0")}
                </span>
                <span className="ml-3">{module.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <ol className="divide-y divide-line border-b border-line">
          {curriculumModules.map((module) => (
            <li
              key={module.slug}
              id={module.slug}
              className="scroll-mt-28 py-14 md:py-16"
            >
              <div className="grid gap-8 lg:grid-cols-[7rem_1fr] lg:gap-12">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                  Module {String(module.number).padStart(2, "0")}
                </p>
                <div className="max-w-3xl">
                  <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-ink">
                    {module.title}
                  </h2>
                  <p className="mt-5 text-[1.1rem] leading-relaxed text-ink-soft">
                    {module.summary}
                  </p>

                  <div className="mt-12 space-y-12">
                    {module.units.map((unit) => (
                      <div key={unit.id} id={unit.id} className="scroll-mt-28">
                        <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                          Unit {unit.id}
                        </p>
                        <h3 className="mt-2 font-sans text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">
                          {unit.title}
                        </h3>
                        <ul className="mt-5 space-y-2.5">
                          {unit.topics.map((topic) => (
                            <li
                              key={topic}
                              className="border-l border-line pl-4 text-[1.02rem] leading-relaxed text-ink-soft"
                            >
                              {topic}
                            </li>
                          ))}
                        </ul>
                        {unit.readings.length > 0 && (
                          <div className="mt-6">
                            <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                              Readings
                            </p>
                            <ul className="mt-3 space-y-2">
                              {unit.readings.map((reading) => (
                                <li
                                  key={`${reading.author ?? ""}-${reading.title}`}
                                  className="text-[0.95rem] leading-relaxed text-ink-soft"
                                >
                                  <span className="text-ink">
                                    {reading.author
                                      ? `${reading.author}, `
                                      : ""}
                                    <em className="font-display italic">
                                      {reading.title}
                                    </em>
                                  </span>
                                  {reading.note ? (
                                    <span className="text-mute">
                                      {" "}
                                      · {reading.note}
                                    </span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Section
        eyebrow="Partner seminars"
        title="Courses that travel across institutions."
        lead="Consortium partners teach graduate seminars and reading groups that feed into the shared curriculum."
        className="border-t border-line"
      >
        <div className="divide-y divide-line border-y border-line">
          {teachings.map((course) => (
            <article
              key={course.title}
              className="grid gap-6 py-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
            >
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                  {course.institution}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.4rem,2vw,1.85rem)] leading-tight text-ink">
                  {course.title}
                </h3>
                <p className="mt-4 text-sm text-ink-soft">{course.programme}</p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {course.lead}
                </p>
              </div>
              <p className="text-[1.08rem] leading-relaxed text-ink-soft lg:pt-6">
                {course.description}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="For students"
        title="How to get involved."
        lead="If you are a postgraduate researcher, early-career scholar, or practitioner interested in digital humanities, start with our readings and fellowship programme."
        className="border-t border-line"
      >
        <div className="flex flex-wrap gap-4">
          <Link
            href="/readings"
            className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
          >
            Browse readings
          </Link>
          <Link
            href="/fellowship"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Fellowship details
          </Link>
        </div>
      </Section>
    </>
  );
}
