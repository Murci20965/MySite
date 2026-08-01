import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface RevealHeadingProps {
  text: string;
  className?: string;
}

// Per-character heading reveal: characters rise out of a blur when the
// heading scrolls into view. Words are wrapped in nowrap spans so lines
// never break mid-word; screen readers get the plain string via aria-label.
export default function RevealHeading({ text, className = '' }: RevealHeadingProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.4, triggerOnce: true });

  let charIndex = 0;
  const words = text.split(' ');

  return (
    <h2
      ref={elementRef as React.RefObject<HTMLHeadingElement>}
      className={`t-chars ${isVisible ? 'is-shown' : ''} ${className}`}
      aria-label={text}
    >
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((char, c) => (
            <span
              key={c}
              className="t-char"
              style={{ '--char-i': charIndex++ } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
          {w < words.length - 1 && (
            <span className="t-char" style={{ '--char-i': charIndex++ } as React.CSSProperties}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </h2>
  );
}
