const ROWS = [
  "            ····",
  "         ·········",
  "       ·············",
  "      ····  ·········",
  "     ····    ········",
  "     ····     ·······",
  "     ·····   ········",
  "      ··············",
  "       ············",
  "         ········",
  "          ······",
  "         ········",
  "        ··········",
  "       ············",
  "      ··············",
  "     ················",
  "    ······      ······",
];

export function AsciiThinker({ className = "" }: { className?: string }) {
  return (
    <pre
      aria-hidden="true"
      className={`select-none font-mono text-[10px] leading-[1.15] tracking-[0.08em] text-ink/25 md:text-[11px] ${className}`}
    >
      {ROWS.join("\n")}
    </pre>
  );
}
