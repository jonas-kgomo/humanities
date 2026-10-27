import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { researchStrands, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the lab"
        title="The problem, then the approach."
        lead="Digital systems now sit inside how people organise, how cultural material is read, and how institutions decide what to trust. Existing arrangements already decide who may act, whose reading counts, and which claims become official."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="prose-cdm grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p>
              That is the problem. Platforms mediate group discussion.
              Institutions depend on them for work that used to be their own.
              Models classify, translate, summarise, and omit — and those
              operations change what a text, an archive, or a language is taken
              to mean.
            </p>
            <p>
              Libraries, universities, and cultural organisations are already
              changing how they search, teach, and keep collections. Access to
              information is not the same as understanding it, and neither is
              the same as the authority to act on it.
            </p>
          </div>
          <div>
            <p>
              The approach is a research programme in three strands: social and
              collective agency; culture, language, and interpretation;
              knowledge institutions and technological change.
            </p>
            <p>
              Each strand names questions, methods, and what would count as a
              useful output. Humanities researchers formulate the question and
              decide what success would mean. Technical collaborators implement,
              measure, and state what a system can and cannot reliably deliver.
              Adoption is not treated as improvement.
            </p>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Research programme"
        title="Three ways into the same collision."
        className="border-t border-line"
      >
        <ul className="grid gap-px bg-line md:grid-cols-3">
          {researchStrands.map((strand) => (
            <li key={strand.slug} className="bg-paper px-6 py-8">
              <p className="font-display text-2xl text-ink">{strand.title}</p>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                {strand.summary}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/research"
            className="font-sans text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong transition-colors hover:decoration-ink"
          >
            Full programme — questions, methods, outputs ↗
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="How the lab works"
        title="Bounded projects. Contestable results."
        className="border-t border-line"
      >
        <div className="prose-cdm">
          <p>
            Work begins with a setting that can be evaluated: an organisation,
            a collection with a committed partner, an institution changing its
            practice. Language selection follows available expertise, community
            priorities, and permissions.
          </p>
          <p>
            We do not start from a European canon and apply it outward. Texts
            enter as claims to test. Southern African and other institutional
            cases keep the work honest about whose contributions become visible
            and whose claims have counted in practice.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/people"
            className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
          >
            Meet the lab
          </Link>
          <Link
            href="/research"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Research programme
          </Link>
        </div>
      </Section>
    </>
  );
}
