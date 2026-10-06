/**
 * What the Studio screen shows until the "Prompt to People" film arrives: a
 * dark desk-at-night mood with soft city bokeh and faint glyph streams. It is
 * decoration (aria-hidden), CSS-only, transform/opacity, and static under
 * reduced motion. Swapping in the film is one component change in Hero.
 */
const COLUMNS = [8, 19, 31, 44, 58, 71, 83, 92];

export default function ScreenPlaceholder() {
  return (
    <div className="t-screen-ph absolute inset-0" aria-hidden="true">
      <span className="t-bokeh" style={{ left: '12%', top: '18%', width: 46, height: 46 }} />
      <span className="t-bokeh t-bokeh--lime" style={{ left: '74%', top: '12%', width: 58, height: 58 }} />
      <span className="t-bokeh" style={{ left: '56%', top: '38%', width: 24, height: 24 }} />
      <span className="t-bokeh t-bokeh--lime" style={{ left: '28%', top: '46%', width: 18, height: 18 }} />
      {COLUMNS.map((left, i) => (
        <span key={left} className="t-glyphs" style={{ left: `${left}%`, animationDelay: `${-i * 1.7}s` }} />
      ))}
    </div>
  );
}
