# Setup & Deployment Guide

Follow these steps to get the Scripture AI app fully running with the Supabase Edge Function RAG backend.

## Step 1: Install Deno (for Supabase Edge Functions)

Deno is required by the Supabase CLI to deploy Edge Functions.

### Windows (PowerShell):
```powershell
iwr https://deno.land/install.ps1 -useb | iex
```

Then restart your terminal and verify:
```powershell
deno --version
```

### Mac/Linux:
```bash
curl -fsSL https://deno.land/install.sh | sh
```

## Step 2: Install Supabase CLI and Link Your Project

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

Link your Supabase project (find `project-ref` in Supabase Dashboard → Settings → General):
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You'll be prompted to enter your `SUPABASE_SERVICE_ROLE_KEY` (get from Dashboard → Settings → API).

## Step 3: Create Supabase Database Schema

1. Go to your **Supabase Dashboard** → **SQL Editor** → **New query**.
2. Enable pgvector extension:

```sql
create extension if not exists vector;
```

3. Run the migration SQL from [migrations/create_tables.sql](../migrations/create_tables.sql) in the same SQL Editor.
4. Run the second migration from [migrations/create_match_function.sql](../migrations/create_match_function.sql).

Verify tables exist: Dashboard → **Database** → **Tables** should show `works`, `documents`, `chunks`.

## Step 4: Prepare Bhagavad Gita Data

1. Download or prepare a plaintext version of the Bhagavad Gita.
2. Create folder `data/` in the project root:

```bash
mkdir data
```

3. Add the plaintext file:

```bash
# Place your Bhagavad Gita plaintext at:
data/bhagavad_gita.txt
```

## Step 5: Ingest the Bhagavad Gita

```bash
npm install
node scripts/ingest_bhagavad_gita.js
```

This will:
- Create embeddings for each chunk using OpenAI API
- Store chunks in the Supabase `chunks` table with embeddings
- This takes 5–15 min depending on text size and OpenAI API availability

Monitor in Supabase Dashboard → **Table Editor** → `chunks` to see rows being inserted.

## Step 6: Deploy the Supabase Edge Function

```bash
supabase functions deploy rag_chat
```

You should see:
```
✓ Function deployed successfully.
Endpoint: https://YOUR_PROJECT_ID.supabase.co/functions/v1/rag_chat
```

The Edge Function is now live and will:
1. Embed your question using OpenAI
2. Query the database for nearest-neighbor chunks
3. Build a RAG prompt and call LLM to generate an answer with citations

## Step 7: Run the React App Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

**Test the chat:**
- Type: "What is dharma?"
- The app will call the Edge Function, retrieve scripture chunks, and generate an answer.

## Environment Variables Summary

Your `.env.local` should have:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini
```

(Service role key is only used in the ingestion script; remove from `.env.local` after ingestion if desired.)

## Troubleshooting

### "Failed to resolve import ./lib/supabase"
→ Fixed! The import path was corrected to `../lib/supabase`.

### Ingestion script fails with "embedding API error"
→ Check `OPENAI_API_KEY` in `.env.local` and OpenAI account credit.

### Edge Function returns 404
→ Make sure you ran `supabase functions deploy rag_chat`.

### Chat doesn't work
→ Check browser console for errors. Verify:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- `chunks` table has rows with embeddings
- Edge Function is deployed and reachable

## Next Steps

Once everything is running:
1. Add more scriptures (Ramayana, Mahabharata, Vedas) using similar ingestion scripts
2. Set up user authentication (Supabase Auth)
3. Add moderation and quality feedback
4. Deploy to Vercel/Netlify

Questions? Check [RAG_EDGE_FUNCTION.md](./RAG_EDGE_FUNCTION.md) for API details or [INGEST.md](./INGEST.md) for ingestion.
