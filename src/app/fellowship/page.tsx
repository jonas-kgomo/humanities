import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import {
  fellowshipCommunity,
  fellowshipProjects,
  fellowshipSeminarFormats,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Fellowship",
  description:
    "The Humanities and Technology Fellowship & Residency — guided research projects, seminars, and mentorship for early-career researchers.",
};

export default function FellowshipPage() {
  return (
    <>
      <PageHero
        eyebrow="7 · Fellowship Seminars & Research Projects"
        title="Hands-on application of conceptual frameworks."
        lead="An annual residency for an international cohort of early-career researchers, doctoral students, and practitioners — seminars, guided research, and mentorship built for sustained collaboration."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="prose-cdm max-w-3xl">
          <p>
            The fellowship combines seminars, reading groups, mentorship, and
            collaborative research groups, with cross-institutional supervision
            across the lab. Particular emphasis is placed on expanding
            participation from underrepresented regions, especially Africa,
            while fostering collaboration with leading international
            institutions.
          </p>
          <p>
            Fellows work inside the{" "}
            <Link
              href="/research"
              className="text-ink underline underline-offset-3"
            >
              research programme
            </Link>{" "}
            through guided projects — intellectual intensity, mutual
            mentorship, and the time required to start work that a single
            workshop cannot hold.
          </p>
        </div>
      </section>

      <Section
        eyebrow="7.1 Guided research projects"
        title="Choose two."
        lead="Each project sits inside one strand of the research programme."
        className="border-t border-line"
      >
        <ul className="divide-y divide-line border-y border-line">
          {fellowshipProjects.map((item) => (
            <li
              key={item.title}
              className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-10"
            >
              <h3 className="font-sans text-[1.05rem] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="7.2 Seminar-based learning"
        title="Weekly depth, monthly breadth."
        lead="Humanities foundations, technical constraints, and structured peer exchange across the residency."
        className="border-t border-line"
      >
        <ul className="grid gap-8 sm:grid-cols-2">
          {fellowshipSeminarFormats.map((item) => (
            <li key={item.title} className="border-t border-line pt-5">
              <h3 className="font-sans text-[1.05rem] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="7.3 Community & networking"
        title="A cohort that outlasts the residency."
        lead="Peer support, mentorship, and field connections that continue after the fellowship year."
        className="border-t border-line"
      >
        <ul className="grid gap-8 sm:grid-cols-2">
          {fellowshipCommunity.map((item) => (
            <li key={item.title} className="border-t border-line pt-5">
              <h3 className="font-sans text-[1.05rem] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Cohort"
        title="Who the fellowship is for."
        className="border-t border-line"
      >
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Early-career researchers",
              body: "Postdoctoral scholars and junior faculty building a research agenda at the intersection of humanities inquiry and technical design.",
            },
            {
              title: "Doctoral students",
              body: "PhD candidates seeking interdisciplinary mentorship and a cross-institutional intellectual community.",
            },
            {
              title: "Practitioners",
              body: "Policy and governance practitioners who need rigorous conceptual tools for institutional decision-making.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-line pt-5">
              <h3 className="font-sans text-[1.05rem] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/fellowship/apply"
            className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
          >
            Apply to the fellowship
          </Link>
          <Link
            href="/fellowship/apply/demo"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Try apply demo
          </Link>
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            The residency is distinct from the{" "}
            <Link
              href="/symposium"
              className="text-ink underline underline-offset-3"
            >
              Humanities and Technology Symposium
            </Link>
            . Applications use short prompts that are hard to answer well with
            a generic language model.
          </p>
        </div>
      </Section>
    </>
  );
}
