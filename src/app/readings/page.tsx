import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { philosophyCoreReadings, readings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Readings",
  description:
    "Curated reading paths across the Centre's core curriculum — historical, philosophical, literary, artistic, and social inquiry with technical design.",
};

export default function ReadingsPage() {
  const moduleReadings = readings.filter(
    (group) => group.category !== "Philosophy Core Readings",
  );

  return (
    <>
      <PageHero
        eyebrow="Readings"
        title="A careful path into the field."
        lead="Key readings from each curriculum module, plus a core set that frames technology, interpretation, labour, and the geopolitics of digital methods."
      />

      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="mb-16 border-y border-line py-12">
          <h2 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
            Philosophy Core Readings
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {philosophyCoreReadings.map((item) => (
              <li
                key={item.title}
                className="grid gap-3 py-7 sm:grid-cols-[1.2fr_1.4fr] sm:gap-10"
              >
                <div>
                  <p className="font-display text-xl sm:text-2xl text-ink">
                    {item.title}
                  </p>
                  {item.author && (
                    <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-mute">
                      {item.author}
                    </p>
                  )}
                </div>
                <p className="text-[1.05rem] leading-relaxed text-ink-soft sm:pt-1">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-16 pb-8">
          {moduleReadings.map((group) => (
            <div key={group.category}>
              <h2 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-ink">
                {group.category}
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <li
                    key={`${item.author ?? ""}-${item.title}`}
                    className="grid gap-3 py-7 sm:grid-cols-[1.2fr_1.4fr] sm:gap-10"
                  >
                    <div>
                      <p className="font-display text-xl sm:text-2xl text-ink">
                        {item.title}
                      </p>
                      {"author" in item && item.author && (
                        <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-mute">
                          {item.author}
                        </p>
                      )}
                    </div>
                    <p className="text-[1.05rem] leading-relaxed text-ink-soft sm:pt-1">
                      {item.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
