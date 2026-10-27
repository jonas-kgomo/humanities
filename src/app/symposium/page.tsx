import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { symposiumActivities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Symposium",
  description:
    "The Humanities and Technology Symposium — an international gathering for research, collaboration, and field priorities.",
};

export default function SymposiumPage() {
  return (
    <>
      <PageHero
        eyebrow="Symposium"
        title="Humanities and Technology Symposium."
        lead="A focused international gathering for fellows, invited scholars, designers, archivists, technical collaborators, and philanthropic organisations — distinct from the residency itself."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="prose-cdm max-w-3xl">
          <p>
            Where the fellowship is a residency for a cohort, the symposium is
            the field&apos;s public room: presenting work from the three
            strands, testing it across disciplines, and naming what still needs
            to be built or refused.
          </p>
          <p>
            It typically follows the residency calendar so fellows can bring
            work-in-progress into conversation with a wider community — but the
            symposium stands on its own as an annual convening of the
            lab and its collaborators.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Programme"
        title="What happens at the symposium."
        className="border-t border-line"
      >
        <ol className="grid gap-0 sm:grid-cols-2">
          {symposiumActivities.map((item, i) => (
            <li
              key={item}
              className="flex gap-4 border-t border-line py-6 pr-6"
            >
              <span className="font-mono text-[0.7rem] text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl text-ink">{item}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Audience"
        title="Who the symposium is for."
        className="border-t border-line bg-paper-deep/30"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div className="prose-cdm">
            <p>
              Scholars presenting historical, literary, linguistic, artistic,
              and social work alongside technical design; researchers from
              computer science and the humanities; funders and institutions
              shaping how digital methods enter scholarly practice.
            </p>
          </div>
          <div className="prose-cdm">
            <p>
              Looking for the cohort residency instead? See the{" "}
              <Link href="/fellowship">Humanities and Technology Fellowship</Link> — our
              annual programme for early-career researchers and practitioners.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
