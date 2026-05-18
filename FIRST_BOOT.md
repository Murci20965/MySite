# First Boot — What You Need to Configure

Everything compiles. This checklist is what stands between you and
`docker compose up`. Order matters — earlier items unblock later ones.

---

## 1. External services to provision

You need accounts on these. Free tiers are fine for dev.

| # | Service | What it gives you | Env vars it fills |
|---|---------|-------------------|-------------------|
| 1 | **Neon** (neon.tech) | Serverless Postgres with pgvector | `DATABASE_URL` |
| 2 | **Upstash** (upstash.com) | Serverless Redis | `REDIS_URL` |
| 3 | **Cloudflare R2** (cloudflare.com → R2) | S3-compatible object storage for 3D assets | `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` |
| 4 | **Deepgram** (deepgram.com) | Meeting transcription | `DEEPGRAM_API_KEY`, `DEEPGRAM_WEBHOOK_SECRET` |
| 5 | **Discord** (discord.com/developers) | Bot user + token | `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, all `DISCORD_*_CHANNEL_ID` |
| 6 | **Telegram BotFather** | Bot token for CEO_Agent | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_CEO_CHAT_ID`, `TELEGRAM_BK_CHAT_ID` |
| 7 | **GitHub PAT** (github.com → Settings → Developer settings → Tokens) | Repo access for Head_SE_Agent | `GITHUB_TOKEN`, `GITHUB_ORG`, `GITHUB_NEXERA_REPO`, `GITHUB_NEXA_REPO` |
| 8 | **Ollama** (ollama.ai — local install) | Local AI inference | `INFERENCE_ENDPOINT` (default works) |

`SETUP_GUIDE.md` has step-by-step screenshots for items 1–7.

---

## 2. Local tooling

Install once:

- **Node 20+** — `node --version`
- **Docker Desktop** — `docker --version` AND `docker compose version`
- **Ollama** — `ollama --version`
- **psql** is optional now (migrations run via `npm run db:migrate`, no shell needed)

---

## 3. Fill in `.env` files

`scripts/setup.sh` already created these from the `.example` files. Edit:

```
.env                          ← shared infra (DB, Redis, R2, Ollama, Discord, JWT)
.env.agent.ceo_agent          ← Telegram tokens
.env.agent.head_se_agent      ← GitHub PAT
.env.agent.bk_twin_agent      ← (empty for now; future K8s creds)
.env.agent.clo_agent          ← (empty for now)
.env.agent.cpo_agent          ← (empty for now)
.env.agent.culture_agent      ← (empty for now)
.env.agent.growth_agent       ← Firecrawl key (optional, when EWA wired up)
.env.agent.ops_agent          ← (empty for now)
.env.agent.rd_agent           ← (empty for now)
.env.agent.scout_agent        ← (empty for now)
```

> Telegram and GitHub tokens are deliberately split off the shared `.env`
> so they only live in the containers that need them. Don't migrate them
> back into `.env`.

---

## 4. Pull Ollama models

```bash
ollama pull gemma2:9b          # fast model — required
ollama pull nomic-embed-text   # embeddings for Nexa KB — required
ollama pull gemma4:27b         # complex model — 16GB+ RAM, optional for dev
```

If you skip `gemma4:27b`, set `INFERENCE_MODEL_COMPLEX=gemma2:9b` in `.env`
so CEO Filter and meeting summaries fall back to the fast model.

---

## 5. Run migrations

```bash
npm run db:migrate
```

This creates 16 tables + pgvector index + LISTEN/NOTIFY triggers and seeds
`team_members` with the 12 staff records. If `DATABASE_URL` is right, this
should take <5 seconds.

---

## 6. Boot the stack

```bash
docker compose up --build
```

You should see, in order:
1. `ollama` start (instant — model loads on first request)
2. `api` build + start (`healthcheck` shows healthy on `/health`)
3. `dashboard` build + start on `:3001`
4. 10 cabinet agents start, each becoming healthy when `pg` is loadable

If any container restarts repeatedly, `docker logs nexa_<service>` will
show why. The most likely cause is a missing env var.

---

## 7. Verify

| What | How |
|---|---|
| API up | `curl http://localhost:3000/health` returns 200 |
| Dashboard up | open `http://localhost:3001/login` |
| Migrations applied | `psql $DATABASE_URL -c '\dt'` lists 16 tables |
| Agents healthy | `docker ps` shows all 10 `nexa_*_agent` containers as `(healthy)` |
| Event bus alive | `psql $DATABASE_URL -c "INSERT INTO agent_events (source_agent, event_type, priority_tier) VALUES ('test', 'PING', 1)"` — CEO_Agent should log "received event" within 1 second |

---

## 8. First end-to-end happy path

Pick the easiest one to confirm everything is real:

1. Register the Telegram webhook (one-time): see `SETUP_GUIDE.md` step 6.
2. From Telegram, send `@your_bot Test message — can you hear me?`
3. CEO_Agent should classify it (Ollama call), reply via `notifyDuren()`.
4. The exchange appears in `agent_events` and `audit_log`.

If that round-trips, the rest of the system is just more of the same
pattern. If it doesn't, the failure point tells you which integration to
debug next.

---

## Known sharp edges

- **Build OOM on Windows when parallel** — `npm run build` is pinned to
  `--concurrency=1` because `tsc` running 4 wide on Windows exhausts VM
  page commits. CI on Linux is fine without it; if you remove the flag
  there, expect a 4× speedup.
- **`next.config.ts` not supported by Next 14.2** — already migrated to
  `next.config.mjs`. If you bump to Next 15, you can switch back.
- **Dashboard Next.js build** needs `NODE_OPTIONS=--max-old-space-size=4096`
  on Windows — already baked into its `build` script via `cross-env`.
- **`BK_Twin_Agent`'s docker.sock mount** doesn't work on Windows
  containers — that agent expects to run on Linux. For Windows dev,
  either run that one agent with WSL2 or stub out its EWA spawn calls
  with the `BK_TWIN_DRY_RUN=true` env var (if/when that's added).
- **Pgvector dimensions** are 768 (matching nomic-embed-text). If you swap
  the embedding model, change the migration and re-embed all
  `knowledge_articles`.

---

## When something breaks

- Check `docker logs nexa_<service>` — every agent logs its own startup
  errors clearly.
- `npm run agent:doctor` — verifies the registry, code, context, state
  dirs, compose, and env example files are all in sync.
- `docker compose config --quiet` — parses your compose file with all
  `env_file` substitutions; non-zero exit means a referenced file is
  missing.
- The Postgres `audit_log` and `agent_events` tables are the source of
  truth for what each agent did and when. Don't trust logs alone.
