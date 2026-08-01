# Taming AI-Generated 3D: A Headless Blender Pipeline for the Web

*Nhlanhla "Murci" Mokoena · August 2026 · From the [Orbit-3D Asset Pipeline](https://github.com/Murci20965/orbit-3d-pipeline) project ([live demo](https://orbit-3d-pipeline.vercel.app))*

---

Text-to-3D generation is genuinely magical right now — and the raw output is genuinely unusable.
Meshes arrive off-centre, wildly mis-scaled, and heavy enough to hurt a phone GPU. Orbit-3D is a
pipeline that accepts that reality: **generation is only step one; the engineering is in the
normalisation.**

## The pipeline

1. **Multimodal input.** A user supplies text *or* an image. Images are interpreted by Groq's
   Llama-4 Vision to produce a generation-ready description; text goes straight through. One
   pipeline, two front doors.
2. **Generation.** Tripo3D turns the prompt into a textured 3D model.
3. **Normalisation — the unglamorous heart of the system.** A **Dockerised headless Blender**
   engine opens every generated mesh and makes it web-ready: centres it at the origin, scales it
   to a consistent bounding volume, and exports a clean format for WebGL rendering.

That third step is the difference between "we generated a model" and "your browser can actually
show it." Every downstream consumer — the viewer, any future AR surface — gets assets with
identical conventions. Consistency is a feature you manufacture, not one you hope for.

## Blender as a server-side citizen

Blender is usually a desktop tool, but it runs beautifully headless in a container:
`blender --background --python process.py`. Dockerising it means the exact Blender version and
Python environment ship together — no "works on my machine" for a tool with this many moving
parts. The container boundary also isolates a heavyweight process from the FastAPI app that
orchestrates it.

## Latency: fight it with structure

Generation APIs are slow, and users notice. The orchestration layer uses **`asyncio.gather`** to
run independent stages concurrently instead of queuing them politely — everything that *can*
overlap, does. The end-to-end wait is dominated by the slowest single stage rather than the sum
of all of them.

## What this project taught me

AI generation shifts the engineering problem; it doesn't remove it. The model gives you raw
material with no guarantees. The value you add is the guarantee: normalised scale, predictable
format, bounded latency. That's a pipeline mindset, and it's the same mindset whether the asset
is a 3D mesh, an image, or a paragraph of generated text.

**Plain-language version:** AI can dream up a 3D object from a sentence or a photo, but what it
produces is like furniture delivered unassembled and in the wrong-sized box. I built an automated
workshop — a robot running Blender with no screen attached — that unpacks, straightens, resizes
and repackages every object so any web browser can display it instantly.
