# 🚀 Complete Setup Instructions (Ready to Deploy)

Your project is **90% ready**! Follow these manual steps to complete the setup and start the app.

## ✅ Already Done

- ✅ Deno installed (v2.6.9)
- ✅ Supabase CLI available via `npx supabase`
- ✅ React + Vite scaffolded and configured
- ✅ Chat UI component created and wired
- ✅ Supabase Edge Function (RAG) created with proper Deno imports
- ✅ Bhagavad Gita text downloaded (`data/bhagavad_gita.txt`)
- ✅ Dependencies installed

## 📋 Your Next Steps (Manual)

### Step 1: Create Supabase Project (if not done)
1. Go to https://supabase.com
2. Create a new project
3. Copy your **Project URL** and **Project Ref** (Project ID)

### Step 2: Set Up `.env.local`

Create `.env.local` in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini
```

Find these values in **Supabase Dashboard → Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon/Public API key (safe for browser)
- `SUPABASE_SERVICE_ROLE_KEY` = Service Role Secret (server-only)

Get `OPENAI_API_KEY` from https://platform.openai.com/account/api-keys

### Step 3: Create Database Schema

1. Go to **Supabase Dashboard → SQL Editor**
2. Click **New Query**
3. **First query** — Enable pgvector:

```sql
create extension if not exists vector;
```

Click **Run**, then **Ctrl + Enter** to execute.

4. **Second query** — Copy the entire content from [migrations/create_tables.sql](migrations/create_tables.sql) into a new SQL query and execute.

5. **Third query** — Copy the entire content from [migrations/create_match_function.sql](migrations/create_match_function.sql) into a new SQL query and execute.

Verify: Go to **Database → Tables** and confirm you see:
- `works`
- `documents`
- `chunks`

### Step 4: Link Your Supabase Project to Local CLI

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
```

When prompted, paste your `SUPABASE_SERVICE_ROLE_KEY`.

### Step 5: Create Supabase `.env` for Edge Functions

Create `supabase/.env.local` with:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini
```

### Step 6: Deploy the RAG Chat Edge Function

```powershell
npx supabase functions deploy rag_chat
```

You should see:
```
✓ Function deployed successfully.
Endpoint: https://YOUR_PROJECT_ID.supabase.co/functions/v1/rag_chat
```

### Step 7: Ingest the Bhagavad Gita & Create Embeddings

```powershell
node scripts/ingest_bhagavad_gita.js
```

This script will:
1. Create an entry in the `works` table (Bhagavad Gita)
2. Create a `documents` entry
3. Split the text into ~500-word chunks with overlap
4. Generate OpenAI embeddings for each chunk
5. Insert chunks + embeddings into the `chunks` table

**Timing:** 5-15 minutes (depends on text size and OpenAI API rate)

**Monitor progress:**
- Watch console output for "Inserted chunk X/Y" messages
- Check Supabase Dashboard → **Table Editor → chunks** to see rows being inserted in real-time

### Step 8: Verify Everything in Supabase

1. Go to **Supabase Dashboard → Table Editor**
2. Click `works` → Should see 1 row: "Bhagavad Gita"
3. Click `documents` → Should see 1 row linked to the work
4. Click `chunks` → Should see many rows with embeddings (vector column populated)

### Step 9: Run the React App Locally

```powershell
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

### Step 10: Test the Chat!

1. Type a question like: **"What is dharma according to Krishna?"**
2. The app will:
   - Send your question to the Edge Function
   - Generate embeddings for your question
   - Search for 5 nearest-neighbor chunks from the Bhagavad Gita
   - Call OpenAI GPT to generate an answer based on those chunks
   - Return the answer with source citations

You should see:
- **Your question** (blue bubble, right side)
- **AI answer** (gray bubble, left side) with citations like `[[0]] [[1]]`
- **Expandable sources** showing the exact scripture passages used

## 🐛 Troubleshooting

| Error | Fix |
|-------|-----|
| "SUPABASE_SERVICE_ROLE_KEY missing" | Add it to `.env.local` |
| "OPENAI_API_KEY missing" | Add it to `.env.local` and `supabase/.env.local` |
| "Failed to deploy Edge Function" | Run `npx supabase functions deploy rag_chat` again |
| "No auth context" | Ignore — the app works without auth for MVP |
| "Chat doesn't respond" | Check browser console (F12) for errors; verify env vars are set |
| Ingestion hangs | Check OpenAI account has credits and API key is valid |
| "match_chunks not found" | Run the migrations again in Supabase SQL Editor |

## 🎉 Success Checklist

- [ ] `.env.local` created with all keys
- [ ] Supabase schema created (3 migrations applied)
- [ ] Data ingested (`chunks` table has rows)
- [ ] Edge Function deployed
- [ ] `npm run dev` running without errors
- [ ] Chat responds to questions with sources

## 📚 Next Steps (Optional)

After basic setup works:

1. **Add more scriptures**: Create similar ingestion scripts for Ramayana, Mahabharata, Vedas
2. **Add authentication**: Supabase Auth (email/OAuth)
3. **Add UI features**: Scripture browser, compare translations, bookmarks
4. **Deploy to production**: Vercel/Netlify for frontend, keep Edge Functions on Supabase
5. **Fine-tune model**: If licensing permits, create a custom model trained on scripture

## 📖 Documentation

- **Full details:** [docs/SETUP.md](docs/SETUP.md)
- **Ingestion guide:** [docs/INGEST.md](docs/INGEST.md)
- **RAG API:** [docs/RAG_EDGE_FUNCTION.md](docs/RAG_EDGE_FUNCTION.md)

Good luck! 🙏 Let me know how it goes or if you hit any errors.
