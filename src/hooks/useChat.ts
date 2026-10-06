import { useCallback, useEffect, useRef, useState } from 'react';

/* The site assistant's client: POST /api/chat and read the OpenAI-style SSE
 * stream with fetch + TextDecoder (no SDK). Shared by the floating chat and
 * the hero terminal, so both answer from the same verified corpus with the
 * same error handling. Contract and triage: .claude/docs/chatbot.md.
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const OFFLINE_NOTE =
  'The assistant is offline right now. The human version replies within 24 hours: nhlanhla18mokoena@gmail.com';
export const BUSY_NOTE =
  'Easy there, that is a few too many questions in a row. Try again in a couple of minutes, or email nhlanhla18mokoena@gmail.com.';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  // Latest values for the async sender, without re-creating it every render.
  const messagesRef = useRef<ChatMessage[]>([]);
  const busyRef = useRef(false);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || busyRef.current) return;
    const history: ChatMessage[] = [...messagesRef.current, { role: 'user', content }];
    busyRef.current = true;
    setBusy(true);
    setMessages([...history, { role: 'assistant', content: '' }]);

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
        patchLast(() => BUSY_NOTE);
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
            const delta: string = JSON.parse(payload)?.choices?.[0]?.delta?.content ?? '';
            if (delta) patchLast((prev) => prev + delta);
          } catch {
            /* partial frame, ignored */
          }
        }
      }
    } catch {
      patchLast(() => OFFLINE_NOTE);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  return { messages, busy, send };
}
