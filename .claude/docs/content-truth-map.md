# Content Truth Map

## Current source: Sep 2026 CV sync (2026-10-06)

**Reference:** Murci's Sep 2026 CV export (`public/resume.pdf`), which he named as the CV to
keep referencing. Dates, titles, bullets, skills, education and certifications on the site
follow it, by his decision. The August map below stays as the record of the first truth pass;
where the two differ, this section wins.

**Rule:** a CV claim is published as written unless evidence contradicts it. Where evidence
contradicts it, the site shows what the evidence supports and the CV is flagged for a fix.
Employer internals beyond what the CV itself discloses never appear on the site (public repo).

### Where the site deliberately differs from the CV

| CV says | Site shows | Evidence |
|---|---|---|
| Avatar-3D: "24-dimensional kinematic skeletal animations" | 14 deterministic animation states | `avatar-pipeline` `backend/app/models/schemas.py` (14-name Literal); README |
| Orbit-3D: "event-driven task system with FastAPI and Redis queues" | asyncio orchestration | `orbit-3d-pipeline` `backend/app/api/routes.py` (`asyncio.gather`); no redis/rq/celery/arq in code or requirements |
| Real Estate: "RMSE of 1,141" | RMSE 0.1341, on log1p sale prices | `real_estate_price_predictor` README; `src/preprocessing.py` (`np.log1p`) |
| Nudle: a named video-generation model | text-to-video, no model named | the named model is contradicted by the work itself |
| Nudle: "sub-second cold starts" | omitted | not supportable for the GPU serving setup described |

**One work section, no blog (2026-10-06).** Every project is open source, so "Selected work"
was removed and the open-source section became the single place for all seven repos. The Blog
section was removed too; its four posts stay in `content/blog/` (Murci's decisions). Two
more facts were corrected on the way: **Smart-Spend** is a Python app (FastAPI, PostgreSQL, Redis,
Hugging Face models per its README; GitHub reports ~90% Python), not "full-stack TS"; and the
**Cat vs Dog Classifier** card states only what its README does (FastAI CNN, Oxford-IIIT Pet,
FastAPI + Gradio, Docker), with no accuracy figure, because none is published.

Also corrected against the repos: the Medical Image Classifier UI is **Gradio** (not Streamlit),
and its pneumonia precision is **0.80** (the 0.91 in the repo README belongs to the NORMAL
class). Real Estate's workflow tests, builds to Amazon ECR and deploys to Elastic Beanstalk.

Published without independent evidence (CV claims, not contradicted): Nudle's "65%" cut in
manual 3D modelling overhead, and the Alignerr and Artintel bullets.

### `public/resume.pdf`

The Sep 2026 CV export with two changes Murci approved (2026-10-06):
- the phone number is **redacted** (removed from the text layer, not covered by a box);
- two project links pointed at `github.com/Murci20965/<name>.vercel.app` (404). They now go to
  `https://avatar-pipeline.vercel.app/` and `https://orbit-3d-pipeline.vercel.app/` (both 200).

### Owed in the master CV (Murci)

Fix the four contradicted claims above and the two broken links in the source document, then
re-export. Swapping the new export in is a single file replace, re-applying the phone redaction
if the number stays in the master.

### Where each fact lives

Page copy: `src/components/*.tsx`. Assistant: `api/_corpus.ts`, which must change in the same
commit as the page. Resume download: `public/resume.pdf`. Meta description: `index.html`.

---

# August 2026 truth pass (historical) — 2026-08-01

Replace every fabricated field in the site with verified truth. **The design does not change** —
only data, plus three tiny code guards the data swap forces (listed at the bottom). Sources:
CV `Nhlanhla_Mokoena_CV_ISB1501458.pdf` (anchor), GitHub (`gh api`), LinkedIn (Composio,
authenticated), Google Drive, Canva. Gmail connector was erroring on 2026-08-01 — not used.

## Verified identity facts

| Fact | Value | Source |
|---|---|---|
| Name | Nhlanhla "Murci" Mokoena | CV, GitHub, LinkedIn |
| Title | AI / Machine Learning Engineer — Agentic AI, RAG & MLOps | CV |
| LinkedIn headline | AI Engineering Intern at Nudle \| LLMs, RAG & MLOps for Production AI Systems \| Python, FastAPI, Next.js | LinkedIn API |
| Location | Johannesburg, Gauteng, South Africa | CV, GitHub |
| Public email | nhlanhla18mokoena@gmail.com | CV |
| GitHub | github.com/Murci20965 (18 public repos, joined Aug 2023) | GitHub API |
| **LinkedIn URL** | **linkedin.com/in/nhlanhla-mokoena-32b22b174** — the CV prints `linkedin.com/in/nhlanhla-mokoena`, which is NOT the real vanity URL. Site must use the real one; CV should be fixed too. | LinkedIn API |
| Twitter/X | twitter.com/960918mokoena (from GitHub profile README — confirm still wanted) | GitHub README |
| Old portfolio | datascienceportfol.io/nhlanhla18mokoena (GitHub `blog` field — update to new site after deploy) | GitHub API |

## Section-by-section mapping

### Hero (`Hero.tsx`)
- Eyebrow: `Data Scientist & AI Engineer` → **`AI Engineer — Agentic AI, RAG & MLOps`** (CV title).
- Name markup: plain two lines since the v3 Studio hero (the play-button "o" went with the modal).
- Bio (≤3 lines, `lg:line-clamp-3`): from CV profile — building production AI systems with LLM
  APIs, agentic workflows, RAG and end-to-end MLOps; currently applying it to XR simulation and
  assessment at Nudle.
- **Hero video: resolved 2026-10-06.** The Rickroll modal is gone. The Studio laptop's screen
  will play Murci's "Prompt to People" film (generated on OpenArt); a placeholder runs until
  then, and the screen's terminal is the live assistant.

### About (`About.tsx`)
- Rewrite lead + two columns from CV profile + mission (XR education access) — keeping the
  two-paragraph grid and the `text-white` emphasis-span pattern.
- Social links: GitHub → `https://github.com/Murci20965`; LinkedIn →
  `https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/`; **Kaggle → drop** (no known profile
  AND its icon glyph is actually the LinkedIn SVG — bug); Twitter → confirm or drop.
- "Available for new projects" pill — confirm truth with Murci.

### Experience (`Experience.tsx`) — replace both fake entries with the 3 real roles (CV)
1. **Junior AI Engineer · Nudle** · May 2026–Present · Johannesburg (Remote) — XR 3D pipelines
   (text/image → GLB, days→hours), NL → avatar actions, scenario generation, automated assessment.
   Tech: Python, FastAPI, Next.js, Docker, PostgreSQL. Metrics (3, short): `Days→hrs` asset
   turnaround · `GLB` text-to-3D pipeline · `0-touch` scenario setup — final numbers to confirm.
2. **AI Trainer (Freelance) · Alignerr** · Jan 2026–Present — model evaluation on reasoning,
   programming and agent tasks against strict rubrics.
3. **Junior AI Software Developer (Contract) · Artintel** · Jan–Jul 2025 — backend for a no-code
   LLM fine-tuning platform; consolidated ETL for training data.
- Footer availability line: reword honestly (open to AI/ML engineering roles).

### Projects (`Projects.tsx`) — replace all 8 fakes with real work (even count for the 2-col grid)
Anchor four (CV + live URLs), plus two from GitHub for six total:
1. **Avatar-3D Pipeline** — avatar-pipeline.vercel.app · github.com/Murci20965/avatar-pipeline —
   NL → 14 deterministic 3D animation states; FastAPI + Groq Llama-3.3-70b; Next.js 16 / R3F; HF Spaces.
2. **Orbit-3D Asset Pipeline** — orbit-3d-pipeline.vercel.app · github.com/Murci20965/orbit-3d-pipeline —
   multimodal text/image → optimized 3D (Tripo3D, Llama-4 Vision, headless Blender).
3. **Real Estate Price Predictor** — github.com/Murci20965/real_estate_price_predictor — XGBoost,
   R² 0.9037 / RMSE 0.1341, CI/CD + Docker.
4. **Medical Image Classifier** — github.com/Murci20965/medical_image_classifier — pneumonia
   detection, PyTorch, 82.85% acc / 0.91 precision / 0.96 recall, FastAPI + Streamlit.
5. **Resume-Match AI** — github.com/Murci20965/resume-match-ai — resume ↔ job-posting fit scoring.
6. **Smart-Spend** — github.com/Murci20965/smart-spend — AI personal-finance management.
- Filters renamed to real categories, every project reachable: `All · 3D & XR · MLOps ·
  Machineine Learning · AI Apps` (exact set TBC so no filter shows an empty grid).
- Metrics: the three hardcoded labels are Accuracy / Impact / Dataset — map real values per project.
- **Images: replace Pexels stock with real screenshots** — I screenshot the two live Vercel apps
  and the two Streamlit/Gradio UIs at 16:10 and put them in `/public`.

### Skills (`Skills.tsx`) — 6 categories × 5 skills (layout needs exactly 6), from the CV table
1. Agentic AI & GenAI — LangChain, LangGraph, RAG + Pinecone, Claude/OpenAI APIs, structured tool use
2. ML & Deep Learning — PyTorch, Scikit-learn, XGBoost, transfer learning (ResNet50), model evaluation
3. MLOps & Delivery — Docker, GitHub Actions CI/CD, HF Spaces, Render, Vercel
4. Backend & Data — Python, FastAPI, PostgreSQL, Redis, ETL/asyncio pipelines
5. Cloud & Web — AWS, Terraform, Next.js, React, TypeScript
6. XR & 3D — React Three Fiber, WebXR, GLB pipelines, Blender (headless), Three.js
- Certifications block (4): pick from the CV's real list (ALX/ExploreAI Data Science, etc.) —
  final four confirmed by Murci.
- Inline stats (3): replace `50+ Courses / 15+ Certificates / 1000+ Hours` with true counts from
  the CV's ~10 certifications — proposed `10 Certifications · 3 Roles · 18 Repos`.
- "Currently exploring": XR/WebXR, agentic systems, local model serving (true, per Nudle work).

### Stats (`Stats.tsx`) — exactly 3, all currently fabricated
Proposed (needs Murci's confirmation): `18` public repos · `R² .90` best regression model ·
`4` production AI apps shipped. (Values must stay ≤6 chars for PopNumber.)

### Blog (`Blog.tsx`) — all 6 posts are fake, dated 2024, and not clickable
**DECISION (Murci):** no real published writing found. Options: (a) write 2–4 real posts
(learning-in-public: XR pipelines, RAG, MLOps — fits the mission, strongest for hiring);
(b) point cards at LinkedIn posts if any; (c) leave section hidden until real posts exist.
Newsletter form is also non-functional — see functional gaps.

### OpenSource (`OpenSource.tsx`) — 5 fake repos with fake star counts
Replace with real repos + honest numbers (stars are 0–1 — honest beats inflated):
avatar-pipeline, orbit-3d-pipeline, resume-match-ai, smart-spend, cat-dog-classifier (roles:
Creator). The 4-stat block gets real GitHub numbers (18 repositories; contributions/PRs pulled
live before editing). "View full GitHub profile" → real profile URL. `lastUpdate` strings →
absolute months so they can't rot.
- NexaOS / nexera-3d-studio stay OUT (Nudle/Nexera work — employer property, and project-data
  separation applies).

### Education (`Education.tsx`) — Stanford/MIT entries are the riskiest fabrication on the site
Replace with the real record (CV): **ALX / ExploreAI Academy — Data Science** and
**DynamicDNA — System Development**. No GPA, no thesis → requires the conditional-render guard
(code guard #1). Courses list: real certifications from the CV. "Currently learning" (exactly 3):
XR & WebXR · Agentic AI systems · MLOps at scale.

### Testimonials (`Testimonials.tsx`) — 6 invented named people; reputational hazard #1
Cannot ship invented praise. **DECISION (Murci):** (a) collect 2–4 real quotes (Nudle colleagues,
Artintel, Alignerr — even-count layout); (b) use LinkedIn recommendations if any exist;
(c) hide the section until real quotes arrive. Recommendation: (a), ask this week.

### FAQ (`FAQ.tsx`)
Rewrite all 6 answers truthfully: Python/FastAPI/LangChain/Next.js stack; AWS coursework +
hands-on serverless (not "extensive experience with all major clouds"); industries = XR education,
fintech-adjacent ML projects, healthcare imaging (project), real estate (project); SA-based,
remote-friendly. First-open FAQ = strongest answer first.

### Contact (`Contact.tsx`)
- Email → `nhlanhla18mokoena@gmail.com` (real mailto; drop `target="_blank"` on mailto).
- LinkedIn/GitHub hrefs → real URLs (currently the displayed text lies about the destination).
- **DECISION (Murci): preferences block** — "From $150/hour" is a public pricing claim; confirm
  rate or replace with "Rate on request". Confirm "Availability: Immediate" (he's employed at Nudle
  — suggest "Open to select projects").
- Budget/timeline selects are `required` — a visitor can't write without declaring ≥$5k budget;
  propose making them optional (1-line change, not a design change).
- **Form is decorative** — submissions are discarded. Propose wiring Formspree (free tier) or a
  Vercel serverless + Resend. Needs Murci's pick before wiring (external service).

### Navigation / Footer
- `public/resume.pdf` ← copy of `Nhlanhla_Mokoena_CV_ISB1501458.pdf` (fixes the 404 Resume button).
- Footer socials `#` → real URLs; tagline → match new hero positioning.
- Footer Privacy/Terms buttons are inert — propose removing the two dead buttons (or a one-page
  privacy note later).

## Code guards forced by the data swap (not design changes)
1. `Education.tsx:124,133` — conditionally render GPA/Thesis rows (real education has neither).
2. `About.tsx:65` — Kaggle link removed (wrong SVG glyph anyway).
3. `Blog.tsx` — add `link` field + anchor IF real posts happen; otherwise per decision.

## Functional gaps flagged (decide separately, all small)
- Contact + newsletter forms discard input silently.
- ~~Hero video = Rickroll placeholder.~~ Removed with the v3 Studio hero (2026-10-06).
- 18 dead/placeholder links (all fixed by the mapping above).
- 14 Pexels stock images → real screenshots.

## After content lands
- Verify in browser (desktop + mobile) per standing rule; then Vercel deploy (Murci-gated).
- Update GitHub profile `blog` field + CV LinkedIn URL to close the loop.
