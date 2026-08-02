/* Capability marquee: a thin editorial divider of mono keywords in an
 * infinite loop (track duplicated once, translated -50%). Pauses on hover;
 * the global reduced-motion rule freezes it.
 */

const ITEMS = [
  'Agentic AI',
  'RAG pipelines',
  'MLOps',
  'WebXR',
  'Text-to-3D',
  'FastAPI',
  'LangChain',
  'React Three Fiber',
  'Docker & CI/CD',
  'Local LLMs',
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="t-marquee py-5" aria-hidden="true">
      <div className="t-marquee-track">
        {track.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 pr-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-lime-400/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
