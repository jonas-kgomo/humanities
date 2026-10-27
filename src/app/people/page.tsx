import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { people } from "@/lib/content";

export const metadata: Metadata = {
  title: "People",
  description:
    "The lab: political theory, ethics, privacy law, public finance, and southern African institutions.",
};

export default function PeoplePage() {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="The lab."
        lead="A small group. Philosophy and ethics stay in the consortium; privacy law and public finance join as lab collaborators — each bringing a different way into who can act, interpret, and decide."
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <ul className="divide-y divide-line border-y border-line">
          {people.map((person) => (
            <li
              key={person.name}
              className="grid gap-8 py-14 sm:grid-cols-[14rem_1fr] sm:gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14"
            >
              <div className="relative aspect-[4/5] w-44 overflow-hidden bg-paper-deep sm:w-full">
                {person.image ? (
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 176px, 256px"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                  {person.role}
                </p>
                <h2 className="mt-3 font-display text-[clamp(1.85rem,3vw,2.5rem)] leading-tight text-ink">
                  {person.name}
                </h2>
                <p className="mt-3 text-lg text-ink-soft">{person.institution}</p>
                <p className="mt-8 max-w-2xl text-[1.25rem] leading-[1.7] text-ink-soft sm:text-[1.35rem]">
                  {person.focus}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
