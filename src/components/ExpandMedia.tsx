import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

// Film 10.2-11.2 s: through the warm glow, the city appears below a wide, open night sky. Both
// steps sit centred in the sky (storyboard v1).
const TITLE: Place = { wide: { x: 0.5, y: 0.07, w: 0.62, align: 'center' }, tall: { y: 0.1 } };
const COPY: Place = { wide: { x: 0.5, y: 0.12, w: 0.5, align: 'center' }, tall: { y: 0.12 } };

/** Chapter 06, Vision: the mission, as two steps: the line, then why. */
export default function ExpandMedia() {
  return (
    <Scene id="vision" n="06" name="Vision" stepVh={90}>
      <Step place={TITLE}>
        <div className="flex flex-col items-center text-center">
          <StepLabel n="06" name="Vision" i={0} of={2} />
          <p className="mt-5 font-display text-[clamp(3.2rem,12vw,5rem)] font-medium leading-none tracking-[-0.03em] text-fg lg:text-[clamp(5rem,7.5vw,7.5rem)]">
            Learning,
            <br />
            <span className="font-normal italic">made spatial</span>
          </p>
        </div>
      </Step>
      <Step place={COPY}>
        <div className="flex flex-col items-center text-center">
          <StepLabel n="06" name="Vision" i={1} of={2} />
          <p className="mt-5 font-sans text-lg leading-relaxed text-fg sm:text-xl lg:text-2xl">
            Traditional education gates real skills behind resources and rigid methods. I&rsquo;m building toward
            XR learning where anyone, anywhere, can practise real skills: interactively, spatially, without the
            gatekeeping.
          </p>
        </div>
      </Step>
    </Scene>
  );
}
