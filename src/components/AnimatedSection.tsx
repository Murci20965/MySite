import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
  delay?: boolean;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-in',
  delay = false,
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  const animationClass = delay ? `${animation} fade-in-delayed` : animation;

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}
