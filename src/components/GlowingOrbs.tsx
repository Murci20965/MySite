export default function GlowingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/3 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-white/2 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}
