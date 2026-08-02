/* Abstract system diagrams — each project card shows the IDEA of its
 * pipeline rather than a screenshot. Inline SVG: a few hundred bytes,
 * sharp at any size, and it inherits the site's palette. On hover a lime
 * pulse travels the flow path, so the pipeline appears to run.
 */

export type DiagramVariant =
  | 'avatar'
  | 'orbit'
  | 'regression'
  | 'transfer'
  | 'match'
  | 'spend';

const LINE = '#3a3a3a';
const LIME = '#a3e635';
const LIME_DIM = '#4d5a1e';
const LABEL = '#8a8a8a';
const MUTED = '#5a5a5a';

const box = {
  fill: '#141414',
  stroke: LINE,
  rx: 4,
} as const;

function Pulse({ d }: { d: string }) {
  return <path className="t-diagram-pulse" d={d} fill="none" stroke={LIME} strokeWidth="1.5" />;
}

function Avatar() {
  return (
    <>
      <line x1="74" y1="88" x2="106" y2="88" stroke={LINE} />
      <line x1="154" y1="88" x2="186" y2="88" stroke={LINE} />
      <line x1="234" y1="88" x2="258" y2="88" stroke={LIME_DIM} />
      <rect x="30" y="74" width="44" height="28" {...box} />
      <rect x="110" y="74" width="44" height="28" {...box} />
      <rect x="190" y="74" width="44" height="28" fill={box.fill} stroke={LIME} rx="4" />
      <text x="52" y="92" textAnchor="middle" fill={LABEL} className="t-diagram-t">NL</text>
      <text x="132" y="92" textAnchor="middle" fill={LABEL} className="t-diagram-t">LLM</text>
      <text x="212" y="92" textAnchor="middle" fill={LIME} className="t-diagram-t">JSON</text>
      <g stroke="#6f6f6f" strokeWidth="2">
        <line x1="262" y1="70" x2="262" y2="106" />
        <line x1="267" y1="74" x2="267" y2="102" />
        <line x1="272" y1="68" x2="272" y2="108" />
        <line x1="277" y1="76" x2="277" y2="100" />
        <line x1="282" y1="72" x2="282" y2="104" />
        <line x1="287" y1="78" x2="287" y2="98" />
      </g>
      <text x="132" y="130" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        schema-gated
      </text>
      <text x="274" y="130" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        14
      </text>
      <Pulse d="M52 88 H286" />
    </>
  );
}

function Orbit() {
  return (
    <>
      <line x1="66" y1="70" x2="96" y2="86" stroke={LINE} />
      <line x1="66" y1="108" x2="96" y2="90" stroke={LINE} />
      <line x1="140" y1="88" x2="172" y2="88" stroke={LINE} />
      <line x1="220" y1="88" x2="252" y2="88" stroke={LIME_DIM} />
      <rect x="26" y="58" width="40" height="24" {...box} />
      <rect x="26" y="96" width="40" height="24" {...box} />
      <rect x="96" y="74" width="44" height="28" {...box} />
      <rect x="176" y="74" width="44" height="28" fill={box.fill} stroke={LIME} rx="4" />
      <text x="46" y="75" textAnchor="middle" fill={LABEL} className="t-diagram-t">txt</text>
      <text x="46" y="113" textAnchor="middle" fill={LABEL} className="t-diagram-t">img</text>
      <text x="118" y="92" textAnchor="middle" fill={LABEL} className="t-diagram-t">GEN</text>
      <text x="198" y="92" textAnchor="middle" fill={LIME} className="t-diagram-t">NORM</text>
      <g fill="none" stroke="#6f6f6f" strokeWidth="1.5">
        <path d="M258 78 L274 70 L290 78 L290 98 L274 106 L258 98 Z" />
        <path d="M258 78 L274 86 L290 78" />
        <path d="M274 86 L274 106" />
      </g>
      <text x="198" y="130" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        headless blender
      </text>
      <Pulse d="M46 70 L96 88 H274" />
    </>
  );
}

function Regression() {
  return (
    <>
      <line x1="34" y1="140" x2="290" y2="140" stroke="#2c2c2c" />
      <line x1="34" y1="40" x2="34" y2="140" stroke="#2c2c2c" />
      <g fill="#4a4a4a">
        <circle cx="70" cy="126" r="2.5" />
        <circle cx="104" cy="104" r="2.5" />
        <circle cx="132" cy="108" r="2.5" />
        <circle cx="166" cy="80" r="2.5" />
        <circle cx="196" cy="86" r="2.5" />
        <circle cx="228" cy="60" r="2.5" />
        <circle cx="258" cy="56" r="2.5" />
      </g>
      <path
        d="M50 132 C110 116, 150 92, 200 76 S258 56, 282 48"
        fill="none"
        stroke={LIME}
        strokeWidth="2"
      />
      <text x="160" y="164" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        gradient boosting
      </text>
      <Pulse d="M50 132 C110 116, 150 92, 200 76 S258 56, 282 48" />
    </>
  );
}

function Transfer() {
  return (
    <>
      <g fill={box.fill} stroke={LINE}>
        <rect x="34" y="66" width="40" height="46" rx="3" />
        <rect x="88" y="66" width="40" height="46" rx="3" />
        <rect x="142" y="66" width="40" height="46" rx="3" />
      </g>
      <rect x="216" y="66" width="46" height="46" rx="3" fill={box.fill} stroke={LIME} />
      <line x1="74" y1="89" x2="88" y2="89" stroke={LINE} />
      <line x1="128" y1="89" x2="142" y2="89" stroke={LINE} />
      <line x1="182" y1="89" x2="216" y2="89" stroke={LIME_DIM} />
      <text x="239" y="93" textAnchor="middle" fill={LIME} className="t-diagram-t">fit</text>
      <text x="108" y="140" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        frozen backbone
      </text>
      <text x="239" y="140" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        head
      </text>
      <Pulse d="M54 89 H239" />
    </>
  );
}

function Match() {
  return (
    <>
      <rect x="40" y="58" width="52" height="66" {...box} rx="3" />
      <rect x="64" y="72" width="52" height="66" rx="3" fill="#101010" stroke={LINE} />
      <g stroke="#3f3f3f">
        <line x1="74" y1="88" x2="106" y2="88" />
        <line x1="74" y1="100" x2="106" y2="100" />
        <line x1="74" y1="112" x2="98" y2="112" />
      </g>
      <line x1="124" y1="98" x2="168" y2="98" stroke={LIME_DIM} />
      <circle cx="212" cy="98" r="34" fill="none" stroke="#2c2c2c" strokeWidth="4" />
      <circle
        cx="212"
        cy="98"
        r="34"
        fill="none"
        stroke={LIME}
        strokeWidth="4"
        strokeDasharray="160 214"
        strokeLinecap="round"
        transform="rotate(-90 212 98)"
      />
      <text x="212" y="103" textAnchor="middle" fill={LIME} className="t-diagram-t">
        fit
      </text>
      <text x="90" y="160" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        resume × posting
      </text>
      <Pulse d="M90 98 H168" />
    </>
  );
}

function Spend() {
  return (
    <>
      <g fill="#242424">
        <rect x="30" y="52" width="46" height="7" rx="2" />
        <rect x="30" y="68" width="46" height="7" rx="2" />
        <rect x="30" y="84" width="46" height="7" rx="2" />
        <rect x="30" y="100" width="46" height="7" rx="2" />
        <rect x="30" y="116" width="46" height="7" rx="2" />
      </g>
      <g stroke={LINE} fill="none">
        <path d="M80 88 C110 88, 110 62, 140 62" />
        <path d="M80 88 H140" />
      </g>
      <path d="M80 88 C110 88, 110 116, 140 116" fill="none" stroke={LIME_DIM} />
      <g fill={box.fill} stroke={LINE}>
        <rect x="140" y="48" width="54" height="28" rx="4" />
        <rect x="140" y="74" width="54" height="28" rx="4" />
      </g>
      <rect x="140" y="102" width="54" height="28" rx="4" fill={box.fill} stroke={LIME} />
      <line x1="194" y1="88" x2="228" y2="88" stroke={LINE} />
      <rect x="228" y="62" width="56" height="52" {...box} />
      <text x="256" y="93" textAnchor="middle" fill={LABEL} className="t-diagram-t">
        budget
      </text>
      <text x="112" y="160" textAnchor="middle" fill={MUTED} className="t-diagram-t">
        auto-categorised
      </text>
      <Pulse d="M80 88 C110 88, 110 116, 167 116" />
    </>
  );
}

const VARIANTS: Record<DiagramVariant, () => JSX.Element> = {
  avatar: Avatar,
  orbit: Orbit,
  regression: Regression,
  transfer: Transfer,
  match: Match,
  spend: Spend,
};

export default function ProjectDiagram({ variant }: { variant: DiagramVariant }) {
  const Shape = VARIANTS[variant];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e]">
      <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
        <Shape />
      </svg>
    </div>
  );
}
