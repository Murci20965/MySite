import { SYSTEM_PROMPT } from './_corpus';

export const config = { runtime: 'edge' };

/* /api/chat — Groq-backed portfolio assistant.
 *
 * Contract: POST { messages: [{ role: 'user' | 'assistant', content: string }] }
 * → Groq's OpenAI-compatible SSE stream, forwarded verbatim (text/event-stream).
 * Errors: 405 wrong method, 400 bad payload, 429 rate limited, 503 when
 * GROQ_API_KEY is not configured, 502 upstream failure.
 *
 * Abuse posture (no paid infra): hard caps on message count/length +
 * max_tokens, plus a best-effort per-IP token bucket. Edge isolates don't
 * share memory, so the bucket is per-isolate — a soft brake, not a wall;
 * the hard protection is the caps and Groq's own account rate limits.
 */

const MODEL = 'llama-3.3-70b-versatile';
const MAX_MESSAGES = 12;
const MAX_CHARS = 600;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

const buckets = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 2000) buckets.clear();
  return hits.length > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'chat_not_configured' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: { messages?: Array<{ role: string; content: string }> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : null;
  if (
    !messages ||
    messages.length === 0 ||
    !messages.every(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0 &&
        m.content.length <= MAX_CHARS
    )
  ) {
    return Response.json({ error: 'invalid_messages' }, { status: 400 });
  }

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 400,
      temperature: 0.6,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return Response.json({ error: 'upstream_error' }, { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
