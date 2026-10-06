import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useChat } from '../hooks/useChat';

/* "Ask about me" — the site's own AI assistant, answering from Murci's
 * verified facts via /api/chat (Groq). The streaming client and its error
 * handling live in hooks/useChat.ts, shared with the hero terminal; offline
 * (no /api locally, or Groq down) it degrades to an honest email nudge.
 */

const STARTERS = [
  'What has he shipped in production?',
  'Does he know XR and 3D?',
  'How does he work with a team?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, busy, send: ask } = useChat();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // One assistant on screen at a time: while the hero's terminal is visible
  // the launcher steps aside (on phones it would sit on top of it).
  const [heroAsk, setHeroAsk] = useState(false);

  useEffect(() => {
    const terminal = document.querySelector('#hero .t-terminal');
    if (!terminal || !('IntersectionObserver' in window)) return;
    // A fast scroll can batch several entries; the last one is current.
    const io = new IntersectionObserver((entries) => setHeroAsk(entries[entries.length - 1].isIntersecting));
    io.observe(terminal);
    return () => io.disconnect();
  }, []);
  const stowed = heroAsk && !open;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    void ask(text);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Ask the assistant about Murci"
        aria-hidden={stowed || undefined}
        tabIndex={stowed ? -1 : undefined}
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-fg/20 bg-bg/80 px-5 py-3 backdrop-blur-md transition-[opacity,transform,border-color] duration-300 hover:border-fg/40 ${
          stowed ? 'pointer-events-none translate-y-3 opacity-0' : ''
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80">
          Ask about me
        </span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-fg/15 bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-fg/10 px-5 py-4">
            <div>
              <div className="font-display text-base font-medium text-fg">Ask about Murci</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40">
                Answers from verified facts only
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-fg/50 transition-colors hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <div className="space-y-2.5">
                <p className="font-sans text-sm leading-relaxed text-fg/60">
                  I answer questions about Nhlanhla&rsquo;s work, skills and projects, grounded in
                  his real record, nothing invented.
                </p>
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-fg/10 px-4 py-2.5 text-left font-sans text-sm text-fg/70 transition-colors hover:border-fg/30 hover:text-fg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-fg/10 px-4 py-2.5 font-sans text-sm leading-relaxed text-fg'
                      : 'max-w-[92%] font-sans text-sm leading-relaxed text-fg/80'
                  }
                >
                  {m.content ||
                    (busy && i === messages.length - 1 ? (
                      <span className="t-typing" role="status" aria-label="Assistant is typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      m.content
                    ))}
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-fg/10 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Ask anything about his work"
              className="t-input min-w-0 flex-1 rounded-full border border-fg/15 bg-fg/[0.03] px-4 py-2.5 font-sans text-sm text-fg placeholder-fg/30 transition-colors focus:border-fg/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fg text-bg transition duration-300 hover:bg-fg/85 active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowUpRight className="t-nudge h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
