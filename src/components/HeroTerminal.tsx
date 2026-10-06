import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';

const SUGGESTIONS = ['What has he shipped?', 'Show me the XR work', 'How does he work?'];

/**
 * The assistant as the Studio screen's terminal: ask in plain words, the
 * answer streams in from the same verified corpus as the floating chat. Only
 * the latest exchange is shown (it is a small screen); the floating "Ask
 * about me" chat keeps a full conversation. The answer region is a polite
 * live region, so screen readers hear it when it finishes.
 */
export default function HeroTerminal() {
  const { messages, busy, send } = useChat();
  const [input, setInput] = useState('');
  const outRef = useRef<HTMLDivElement>(null);

  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user');
  const lastAnswer = messages.length > 0 && messages[messages.length - 1].role === 'assistant' ? messages[messages.length - 1] : null;

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ask = (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    void send(text);
  };

  return (
    // Two rows at rest (suggestions, prompt) so the film keeps most of the
    // screen; the identity a title bar would carry lives in the prompt.
    <div className="t-terminal absolute inset-x-[4%] bottom-[4%] rounded-lg border border-white/10 bg-black/70 font-mono text-[12px] leading-relaxed text-white/85 backdrop-blur-md">
      <div ref={outRef} className="max-h-[6rem] overflow-y-auto px-3 pt-2 sm:max-h-[7.5rem]" aria-live="polite" aria-busy={busy}>
        {lastQuestion ? (
          <>
            <p className="text-white/60">
              <span className="text-lime-400">$</span> ask "{lastQuestion.content}"
            </p>
            <p className="mt-1 whitespace-pre-wrap text-white/90">
              {lastAnswer?.content || (busy ? <span className="t-typing" aria-label="Thinking"><span /><span /><span /></span> : null)}
            </p>
          </>
        ) : (
          <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="shrink-0 rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/75 transition-colors hover:border-lime-400/60 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-2 px-3 pb-2 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <span aria-hidden="true" className="shrink-0">
          <span className="hidden text-white/55 sm:inline">murci@portfolio:</span>
          <span className="text-lime-400">~$</span>
        </span>
        <label htmlFor="hero-ask" className="sr-only">
          Ask the portfolio assistant about Murci
        </label>
        <input
          id="hero-ask"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask anything about my work"
          autoComplete="off"
          maxLength={500}
          className="min-w-0 flex-1 bg-transparent text-white placeholder-white/55 caret-lime-400 focus:outline-none"
        />
        <button type="submit" disabled={busy} className="text-[11px] text-white/60 transition-colors hover:text-lime-400 disabled:opacity-40">
          enter ↵
        </button>
      </form>
    </div>
  );
}
