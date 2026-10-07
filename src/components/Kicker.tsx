type Props = {
  /** chapter number, two digits ("03") */
  n: string;
  /** section name ("Experience") */
  name: string;
  className?: string;
};

/**
 * The chapter mark that opens every section: a short lime rule and the chapter
 * number and name in mono capitals. Chapters run 01 (the hero) to 11 (Contact)
 * in page order, one numbering for the whole site.
 */
export default function Kicker({ n, name, className = '' }: Props) {
  // The pool needs a positioned box. Only add `relative` when the caller has not
  // positioned the kicker itself: Tailwind emits `relative` after `absolute`, so
  // both together silently put an absolutely placed kicker back in the flow.
  const positioned = /\b(absolute|fixed|sticky)\b/.test(className);
  return (
    // The pool: a feathered dark glow under the label (no edges, so it reads as
    // shade, not a box). Small lime type needs it over the film's bright frames.
    <div
      className={`${positioned ? '' : 'relative'} flex items-center gap-3 before:pointer-events-none before:absolute before:-inset-x-6 before:-inset-y-4 before:-z-10 before:bg-[radial-gradient(closest-side,rgb(0_0_0/0.55),transparent)] ${className}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {n} · {name}
      </span>
    </div>
  );
}
