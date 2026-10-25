type MarkProps = {
  className?: string;
  size?: number;
};

/**
 * Media Lab–style mark: a few hard-edged colour blocks on a tight grid.
 * Four blocks — one per consortium partner — meeting at the centre.
 */
export function Mark({ className = "", size = 28 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      className={className}
      aria-hidden="true"
    >
      {/* top-left */}
      <rect x="0" y="0" width="12" height="12" fill="var(--shape-c)" />
      {/* top-right */}
      <rect x="14" y="2" width="14" height="10" fill="var(--shape-b)" />
      {/* bottom-left */}
      <rect x="2" y="14" width="10" height="14" fill="var(--accent)" />
      {/* bottom-right */}
      <rect x="14" y="14" width="12" height="12" fill="var(--shape-a)" />
    </svg>
  );
}

export function Wordmark({
  className = "",
  showPartners = false,
}: {
  className?: string;
  showPartners?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Mark size={26} className="shrink-0" />
      <div className="flex items-end gap-3 min-w-0">
        <span className="inline-flex flex-col leading-none">
          <span className="font-sans text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-ink">
            Centre for
          </span>
          <span className="mt-[0.2em] font-sans text-[1.05rem] font-semibold tracking-[-0.03em] text-ink">
            Digital Humanities
          </span>
        </span>
        {showPartners && (
          <>
            <span
              className="hidden sm:block mb-0.5 h-3.5 w-px bg-line-strong"
              aria-hidden="true"
            />
            <span className="hidden sm:block mb-0.5 font-sans text-[0.7rem] font-medium tracking-[0.16em] uppercase text-mute leading-none">
              Consortium
            </span>
          </>
        )}
      </div>
    </div>
  );
}
