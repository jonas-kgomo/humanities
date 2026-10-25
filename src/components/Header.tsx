"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { Wordmark } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="relative z-50 focus-visible:outline-offset-4">
          <Wordmark showPartners />
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-6" aria-label="Primary">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-sans text-[0.9rem] tracking-[-0.01em] transition-colors duration-200 ${
                  active ? "text-ink font-semibold" : "text-mute hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="relative z-50 lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink transition-transform duration-150 active:scale-[0.97]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-[5px]" aria-hidden="true">
            <span
              className={`block h-px w-full bg-ink transition-transform duration-200 ease-out ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-ink transition-transform duration-200 ease-out ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[4.25rem] z-40 bg-paper lg:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 sm:px-8"
            aria-label="Mobile"
          >
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="animate-fade-up border-b border-line py-4 font-display text-3xl text-ink"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
