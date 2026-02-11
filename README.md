# Scripture AI — Starter

This repository is a starter scaffold for the Scripture AI application (React + Vite + Supabase).

## What I added

- `package.json`, `tsconfig.json`, `vite.config.ts`
- Basic React + Vite TypeScript app (`src/`)
- `src/lib/supabase.ts` — Supabase client helper
- `.env.example` (already present)
- GitHub Actions CI (`.github/workflows/ci.yml`)

## Quick start

1. Copy `.env.example` to `.env.local` and fill values (do not commit):

```bash
cp .env.example .env.local
# then edit .env.local and add your SUPABASE and OPENAI keys
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Open http://localhost:5173

## Next steps I can do for you

- Add ingestion script to import Bhagavad Gita and create embeddings
- Add RAG chat endpoint (Supabase Edge Function) that uses embeddings + LLM
- Add UI components for browsing texts and chat

Reply which next step to do and I will continue.
