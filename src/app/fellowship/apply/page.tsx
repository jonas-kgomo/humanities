import type { Metadata } from "next";
import Link from "next/link";
import { FellowshipApplyForm } from "@/components/FellowshipApplyForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Apply · Fellowship",
  description:
    "Application for the Humanities and Technology Fellowship & Residency — written prompts designed for judgment, not polish.",
};

export default function FellowshipApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Fellowship application"
        title="Apply in your own words."
        lead="Five short prompts. We favour concrete scenes, named texts, and local stakes over fluent generalities."
      >
        <p className="text-sm text-mute">
          Prefer to read the programme first?{" "}
          <Link
            href="/fellowship"
            className="text-ink underline underline-offset-3"
          >
            Back to fellowship
          </Link>
          . Trying the new protocol?{" "}
          <Link
            href="/fellowship/apply/demo"
            className="text-ink underline underline-offset-3"
          >
            Open apply demo
          </Link>
          .
        </p>
      </PageHero>

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <FellowshipApplyForm />
      </section>
    </>
  );
}
