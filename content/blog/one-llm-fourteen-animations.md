# One LLM, Fourteen Animations: Structured Outputs as an API Contract

*Nhlanhla "Murci" Mokoena · August 2026 · From the [Avatar-3D Pipeline](https://github.com/Murci20965/avatar-pipeline) project ([live demo](https://avatar-pipeline.vercel.app))*

---

Large language models are probabilistic. 3D animation systems are not. If you ask an LLM to
"make the avatar wave" and pass its free-text answer to your renderer, you have built a machine
that fails creatively. The Avatar-3D Pipeline is my answer to that mismatch: a **"Director &
Marionette"** architecture where the LLM is allowed to *decide*, but never allowed to *improvise
the format of its decision*.

## The core idea

The system knows exactly **14 deterministic skeletal animation states**. The LLM's only job is to
map natural language onto one of them — plus a small set of validated parameters. The contract is
enforced with strict Pydantic models on the FastAPI backend:

- The model (Groq-accelerated Llama-3.3-70b) is invoked with structured-output tool calling, so
  the response *must* conform to a JSON schema.
- Pydantic validates the payload again server-side. Anything malformed is rejected before it
  touches the render loop — the schema is the API contract, and the LLM is just another client
  that has to honour it.
- The frontend (Next.js 16 + React Three Fiber) receives only known state names. It cannot be
  surprised.

The lesson that generalises: **treat LLM output as untrusted user input.** Validate it with the
same rigour you'd apply to a public form. "Structured outputs" aren't a convenience feature —
they're the boundary between a demo and a system.

## Why deterministic states beat generated motion

I could have asked the model to emit joint rotations directly. It would have demoed brilliantly
and failed constantly. Fixed states mean:

1. **Every reachable output is tested.** Fourteen states is a finite test matrix; generated
   motion is an infinite one.
2. **Failures are legible.** A wrong state is obvious; a subtly wrong quaternion is not.
3. **Latency is predictable.** The LLM call decides; the GPU just plays a clip it already has.

Between states, a **0.5s crossfade** blends the skeletal poses so transitions read as intentional
rather than teleporting. Small touch, disproportionate effect on perceived quality.

## The deployment shape

The Python backend is Dockerised and deployed immutably on HuggingFace Spaces; the frontend lives
on Vercel. Two free-tier platforms, one contract between them. The interesting failure mode was
**WebGL colliding with server-side rendering** — Next.js wants to render on the server, and a
WebGL canvas emphatically does not. The fix is disciplined dynamic importing of every
Three.js-touching component with SSR disabled, so the 3D layer only ever mounts in the browser.

## What I'd tell past me

Start from the contract, not the model. The schema took an afternoon; it's the part that lets
everything else — model swaps, prompt changes, frontend rewrites — happen safely.

**Plain-language version:** I built a system where an AI listens to what you say and picks the
right pre-made animation for a 3D character, like a director calling cues from a fixed playbook.
Keeping the playbook fixed — and forcing the AI to fill in a strict form instead of talking
freely — is what makes it reliable enough to ship.
