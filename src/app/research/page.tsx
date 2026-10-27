import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { researchStrands, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description: site.description,
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research programme"
        title="Three strands of work."
        lead="The problem is that digital systems redistribute who can act, how cultural material is interpreted, and which institutions get to decide what counts as knowledge. The method is to work that problem in three bounded strands — each with questions, methods, and a test of success."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <ol className="divide-y divide-line border-y border-line">
          {researchStrands.map((strand, i) => (
            <li
              key={strand.slug}
              id={strand.slug}
              className="scroll-mt-28 py-14 md:py-16"
            >
              <div className="grid gap-8 lg:grid-cols-[7rem_1fr] lg:gap-12">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="max-w-3xl">
                  <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-ink">
                    {strand.title}
                  </h2>
                  <p className="mt-5 text-[1.1rem] leading-relaxed text-ink-soft">
                    {strand.problem}
                  </p>

                  <div className="mt-10">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                      Core questions
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {strand.questions.map((question) => (
                        <li
                          key={question}
                          className="border-l border-line pl-4 text-[1.02rem] leading-relaxed text-ink-soft"
                        >
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                        Methods
                      </p>
                      <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">
                        {strand.methods}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                        Outputs
                      </p>
                      <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">
                        {strand.outputs}
                      </p>
                    </div>
                  </div>

                  <p className="mt-10 border-t border-line pt-6 text-[1.05rem] leading-relaxed text-ink">
                    {strand.test}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Section
        eyebrow="How we judge work"
        title="Participation and power, not only performance."
        className="border-t border-line"
      >
        <div className="prose-cdm max-w-3xl">
          <p>
            Across the programme, a system is assessed for its effects on who
            can participate, how interpretation is held open, and who has
            authority to act — as well as for technical performance. Community
            contributors are compensated, attributed, and given a role in
            decisions about access and reuse.
          </p>
          <p>
            Historical comparison is used to tell recurring institutional
            problems from new technical conditions. We do not assume that
            installing a tool constitutes improvement.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/teaching"
            className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
          >
            Teaching & seminars
          </Link>
          <Link
            href="/fellowship"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Fellowship projects
          </Link>
        </div>
      </Section>
    </>
  );
}
