import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

/* "Ask about me" — the site's own AI assistant, answering from Murci's
 * verified facts via /api/chat (Groq). The widget itself is dependency-free:
 * it reads the OpenAI-style SSE stream with fetch + a TextDecoder. Until the
 * site is deployed (no /api locally), it degrades to an honest email nudge.
 */

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const STARTERS = [
  'What has he shipped in production?',
  'Does he know XR and 3D?',
  'How does he work with a team?',
];

const OFFLINE_NOTE =
  'The assistant comes online with the live deployment. Meanwhile, the human version replies within 24 hours: nhlanhla18mokoena@gmail.com';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const history: Msg[] = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);

    const patchLast = (updater: (prev: string) => string) => {
      setMessages((cur) => {
        const next = [...cur];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: updater(last.content) };
        return next;
      });
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (res.status === 429) {
        patchLast(() => 'Easy there, that is a few too many questions in a row. Try again in a couple of minutes, or just email nhlanhla18mokoena@gmail.com.');
        return;
      }
      if (!res.ok || !res.body) {
        patchLast(() => OFFLINE_NOTE);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith('data:')) continue;
          const payload = data.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const delta: string =
              JSON.parse(payload)?.choices?.[0]?.delta?.content ?? '';
            if (delta) patchLast((prev) => prev + delta);
          } catch {
            /* partial frame — ignored */
          }
        }
      }
    } catch {
      patchLast(() => OFFLINE_NOTE);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Ask the assistant about Murci"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/20 bg-black/80 px-5 py-3 backdrop-blur-md transition-colors hover:border-white/40"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
          Ask about me
        </span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e0e] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="font-display text-base font-medium text-white">Ask about Murci</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                Answers from verified facts only
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/50 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <div className="space-y-2.5">
                <p className="font-sans text-sm leading-relaxed text-white/60">
                  I answer questions about Nhlanhla&rsquo;s work, skills and projects, grounded in
                  his real record, nothing invented.
                </p>
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-white/10 px-4 py-2.5 text-left font-sans text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
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
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 font-sans text-sm leading-relaxed text-white'
                      : 'max-w-[92%] font-sans text-sm leading-relaxed text-white/80'
                  }
                >
                  {m.content || (busy && i === messages.length - 1 ? '…' : m.content)}
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
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
              className="t-input min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-sans text-sm text-white placeholder-white/30 transition-colors focus:border-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition duration-300 hover:bg-white/85 active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
