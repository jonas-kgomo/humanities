import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { partners, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Centre"
        title="Connecting inquiry with design."
        lead="The Centre for Digital Humanities is a proposed international research consortium where humanities researchers and technical collaborators share one agenda — from the question to the evaluation."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="prose-cdm grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p>
              The Centre will connect historical, philosophical, literary,
              linguistic, artistic, and social inquiry with technical design
              and evaluation.
            </p>
            <p>
              Humanities researchers will help formulate the questions, select
              methods, interpret findings, and determine what a successful
              system should do.
            </p>
          </div>
          <div>
            <p>
              Technical collaborators will contribute implementation,
              measurement, and an understanding of what systems can and cannot
              reliably deliver.
            </p>
            <p>
              Rather than establishing a new institute within a single
              university, CDH serves as a collaborative network connecting
              researchers across the University of Johannesburg, Loyola
              University Chicago, Sciences Po, and the Equiano Institute.
            </p>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Why a consortium"
        title="Complementary expertise, shared agenda."
        lead="The consortium combines academic leadership, educational innovation, and experience building international collaborations around the humanities and technical design."
        className="border-t border-line"
      >
        <ul className="grid gap-px bg-line sm:grid-cols-2">
          {partners.map((partner) => (
            <li key={partner.name} className="bg-paper px-6 py-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                Equal partner
              </p>
              <p className="mt-3 font-display text-2xl text-ink">
                {partner.name}
              </p>
              <p className="mt-2 text-[1.05rem] text-ink-soft">{partner.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Long-term vision"
        title="A lasting international network."
        className="border-t border-line"
      >
        <div className="prose-cdm">
          <p>
            Beyond the inaugural fellowship and the annual symposium, the Centre
            intends to develop collaborative research projects, method
            workshops, visiting scholar programmes, educational resources, and
            partnerships with universities, research institutes, studios,
            libraries, and philanthropic organisations.
          </p>
          <p>
            The aim is to become a leading international network for digital
            humanities work in which interpretation is not an afterthought to
            implementation — and in which technical limits are stated plainly.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/teaching"
            className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98]"
          >
            Teaching & modules
          </Link>
          <Link
            href="/people"
            className="inline-flex items-center justify-center border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Meet the team
          </Link>
        </div>
      </Section>
    </>
  );
}
