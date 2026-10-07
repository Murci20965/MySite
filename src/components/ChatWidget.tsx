import { useEffect, useRef, useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { useChat } from '../hooks/useChat';

/* "Ask Murci": the site's own AI assistant, answering from Murci's verified
 * facts via /api/chat (Groq). The streaming client and its error handling live
 * in hooks/useChat.ts; offline (no /api locally, or Groq down) it degrades to
 * an honest email nudge.
 *
 * Its face is the film's point of light: the small lime light that forms on
 * the laptop screen in chapter 02, the film's symbol for the person behind the
 * work. It is the launcher, and the avatar beside every answer. On phones the
 * panel is a bottom sheet.
 */

const STARTERS = [
  'What has he shipped in production?',
  'Does he know XR and 3D?',
  'How does he work with a team?',
];

/** The point of light: a lime core with a soft static halo (no animated glow). */
function Light({ size = 10, ping = false }: { size?: number; ping?: boolean }) {
  return (
    <span aria-hidden="true" className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {ping && <span className="t-light-ping absolute inset-0 rounded-full bg-accent" />}
      <span
        className="relative inline-block h-full w-full rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #f4ffd6 0, #c8f26b 45%, #a3e635 70%)',
          boxShadow: '0 0 0 3px rgb(163 230 53 / 0.16), 0 0 14px 2px rgb(163 230 53 / 0.45)',
        }}
      />
    </span>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, busy, send: ask } = useChat();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Escape closes the chat and hands focus back to the launcher.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    void ask(text);
  };
  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  return (
    <>
      <button
        ref={launcherRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ask-murci"
        aria-label={open ? 'Close the assistant' : 'Ask the assistant about Murci'}
        className={`t-ink fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-fg/20 bg-black/50 py-2.5 pl-3.5 pr-5 transition-[opacity,transform,border-color] duration-300 hover:border-accent/60 ${
          open ? 'pointer-events-none translate-y-2 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100' : ''
        }`}
      >
        <Light size={10} ping={!open} />
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg">Ask Murci</span>
      </button>

      {open && (
        <div
          id="ask-murci"
          role="dialog"
          aria-label="Ask Murci, the portfolio assistant"
          className="fixed inset-x-0 bottom-0 z-40 flex max-h-[82svh] flex-col overflow-hidden rounded-t-2xl border border-fg/15 bg-[rgb(10_10_10/0.96)] sm:inset-x-auto sm:bottom-20 sm:right-5 sm:max-h-[70vh] sm:w-[25rem] sm:rounded-2xl"
        >
          <div className="flex items-center justify-between gap-4 border-b border-fg/15 px-5 py-4">
            <div className="flex items-center gap-3">
              <Light size={14} />
              <div>
                <div className="font-display text-lg font-medium leading-tight text-fg">Ask Murci</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg/80">
                  Answers from his verified record
                </div>
              </div>
            </div>
            <button onClick={close} aria-label="Close the assistant" className="text-fg/80 transition-colors hover:text-fg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div>
                <p className="font-sans text-[15px] leading-relaxed text-fg/90">
                  I answer questions about Nhlanhla&rsquo;s work, skills and projects, grounded in his real record.
                  Nothing invented.
                </p>
                <ul className="mt-4 border-t border-fg/15">
                  {STARTERS.map((s) => (
                    <li key={s} className="border-b border-fg/15">
                      <button
                        onClick={() => send(s)}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left font-sans text-[15px] text-fg transition-colors hover:text-accent"
                      >
                        {s}
                        <span aria-hidden="true" className="text-accent">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-fg/10 px-4 py-2.5 font-sans text-[15px] leading-relaxed text-fg">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <span className="pt-1.5">
                    <Light size={8} />
                  </span>
                  <div className="min-w-0 flex-1 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-fg/90">
                    {m.content ||
                      (busy && i === messages.length - 1 ? (
                        <span className="t-typing" role="status" aria-label="Assistant is typing">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : null)}
                  </div>
                </div>
              ),
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-fg/15 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="ask-murci-input" className="sr-only">
              Ask a question about Murci&rsquo;s work
            </label>
            {/* 16 px text: iOS zooms into any field smaller than that. */}
            <input
              id="ask-murci-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              autoComplete="off"
              placeholder="Ask anything about his work"
              className="t-input min-w-0 flex-1 rounded-full border border-fg/30 bg-black/40 px-4 py-2.5 font-sans text-base text-fg placeholder-fg/50 transition-colors focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send question"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-black transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
