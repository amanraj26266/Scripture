# 🚀 Your Next Steps — Quick Reference

You've now built the **complete scaffold** for Scripture AI with React, Supabase, and RAG.

## What's Done ✅

- React + Vite + TypeScript app with chat UI
- Supabase Edge Function for RAG (embeddings + retrieval + LLM)
- SQL migrations for pgvector schema
- Ingestion script for Bhagavad Gita
- Full documentation
- GitHub Actions CI/CD

## What You Need to Do Now 👇

### 1. Install Deno (Windows PowerShell)
```powershell
iwr https://deno.land/install.ps1 -useb | iex
# Restart terminal and verify:
deno --version
```

### 2. Install Supabase CLI
```bash
npm install -g supabase
supabase --version
```

### 3. Link Your Supabase Project
Find your **Project Ref** in Supabase Dashboard → Settings → General
```bash
supabase link --project-ref YOUR_PROJECT_REF
# It will prompt for SUPABASE_SERVICE_ROLE_KEY (from Dashboard → Settings → API)
```

### 4. Create Database Schema
Go to **Supabase Dashboard → SQL Editor → New Query**, then run:

**Query 1** – Enable pgvector:
```sql
create extension if not exists vector;
```

**Query 2** – Copy & paste from [migrations/create_tables.sql](../migrations/create_tables.sql)

**Query 3** – Copy & paste from [migrations/create_match_function.sql](../migrations/create_match_function.sql)

### 5. Prepare Bhagavad Gita Data
```bash
# Create folder
mkdir data

# Add plaintext file to:
data/bhagavad_gita.txt
# (Find public domain or Licensed version online)
```

### 6. Ingest Scripture & Create Embeddings
```bash
npm install
node scripts/ingest_bhagavad_gita.js
# This takes 5-15 min. Watch Supabase Dashboard → Table Editor → chunks to see rows inserted.
```

### 7. Deploy the RAG Edge Function
```bash
supabase functions deploy rag_chat
# You'll see: Endpoint: https://YOUR_PROJECT_ID.supabase.co/functions/v1/rag_chat
```

### 8. Run & Test Locally
```bash
npm run dev
# Open http://localhost:5173
# Type: "What is dharma?"
```

## If You Get Errors 🐛

| Error | Fix |
|-------|-----|
| "Failed to resolve import ./lib/supabase" | Already fixed! Use `../lib/supabase` ✓ |
| "OPENAI_API_KEY missing" | Add to `.env.local` |
| Edge Function 404 | Run `supabase functions deploy rag_chat` |
| No chunks in DB | Check ingestion script output; verify OpenAI API key |
| Chat doesn't work | Browser console → check Supabase env vars are set |

## Reference Docs

- **Full Setup:** [docs/SETUP.md](../docs/SETUP.md)
- **Ingestion:** [docs/INGEST.md](../docs/INGEST.md)
- **RAG API:** [docs/RAG_EDGE_FUNCTION.md](../docs/RAG_EDGE_FUNCTION.md)

## Once Everything Works 🎉

**Optional next steps:**
- Add more scriptures (Ramayana, Mahabharata, Vedas) using similar ingestion scripts
- Set up user auth (Supabase Auth)
- Add moderation & feedback
- Deploy to Vercel/Netlify

Good luck! 🙏
