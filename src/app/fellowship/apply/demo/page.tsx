import type { Metadata } from "next";
import Link from "next/link";
import { DemoApplyForm } from "@/components/DemoApplyForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Apply demo · Fellowship",
  description:
    "Demo fellowship application — decision scenarios, aptitude and continuity prompts, synthesis follow-ups, and audio clarifiers.",
};

export default function FellowshipApplyDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Fellowship · apply demo"
        title="Can you think under pressure — and stay with it?"
        lead="Pick a decision scenario and judge under pressure. Then — separately — name a paper and a claim you support, and why a fellowship cohort (and when you would leave). Hard AI follow-ups test thinking, not slogans."
      >
        <p className="text-sm text-mute">
          Production form stays at{" "}
          <Link
            href="/fellowship/apply"
            className="text-ink underline underline-offset-3"
          >
            /fellowship/apply
          </Link>
          .
        </p>
      </PageHero>

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <DemoApplyForm />
      </section>
    </>
  );
}
