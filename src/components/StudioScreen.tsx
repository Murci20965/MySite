import type { ReactNode } from 'react';

type Props = {
  /** What plays on the screen: the film once it exists, a placeholder until then. */
  media: ReactNode;
  /** Overlay on the screen's lower third (the hero terminal). */
  children?: ReactNode;
  /** Under the laptop: the film's timeline. */
  caption?: ReactNode;
  className?: string;
};

/**
 * The Studio laptop: a bezel, a screen and a keyboard deck. The screen is
 * always dark (it is a screen in both themes); the bezel and deck follow the
 * theme tokens, graphite on black and warm stone on paper.
 */
export default function StudioScreen({ media, children, caption, className = '' }: Props) {
  return (
    <figure className={`t-studio ${className}`}>
      <div className="t-studio-bezel">
        <div className="t-studio-screen bg-screen">
          {media}
          {children}
        </div>
      </div>
      <div className="t-studio-deck" aria-hidden="true" />
      {caption}
    </figure>
  );
}
