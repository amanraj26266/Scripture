# ✅ SCRIPTURE AI - DEPLOYMENT CHECKLIST

## What's Already Done ✅

- ✅ React + Vite app (tested, builds successfully)
- ✅ Chat UI component (with source citations)
- ✅ RAG Edge Function (Deno, tested)
- ✅ Bhagavad Gita text (prepared in `data/bhagavad_gita.txt`)
- ✅ Ingestion script (ready to use)
- ✅ All env files configured:
  - ✅ `.env.local` (for React frontend)
  - ✅ `supabase/.env.local` (for Edge Function)
  - ✅ `.env` (server-side reference)
- ✅ All npm dependencies installed
- ✅ Build tested (0 errors)

## What YOU Need to Do Now 👇

### Phase 1: Database Setup (5 min) 🗄️

**Go to:** Supabase Dashboard → SQL Editor

**Run 3 SQL queries in order:**

1. **Enable pgvector:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

2. **Create tables** - Copy from [migrations/create_tables.sql](migrations/create_tables.sql)

3. **Create search function** - Copy from [migrations/create_match_function.sql](migrations/create_match_function.sql)

**Verify:** Database → Tables shows `works`, `documents`, `chunks`

---

### Phase 2: Ingest Data (10-15 min) 📚

**Run in PowerShell:**
```powershell
node scripts/ingest_bhagavad_gita.js
```

**Wait for:** "Ingestion complete" message

---

### Phase 3: Deploy Function (2 min) 🚀

**Run in PowerShell:**
```powershell
npx supabase functions deploy rag_chat
```

**Expect:** "Function deployed successfully" message

---

### Phase 4: Test the App (1 min) 🧪

**Run in PowerShell:**
```powershell
npm run dev
```

**Open:** http://localhost:5173

**Test:** Type "What is dharma?" and see AI answer with sources

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | ✅ React frontend credentials |
| `supabase/.env.local` | ✅ Edge Function credentials |
| `data/bhagavad_gita.txt` | ✅ Scripture text |
| `scripts/ingest_bhagavad_gita.js` | Script to ingest & embed |
| `migrations/create_tables.sql` | SQL to create schema |
| `migrations/create_match_function.sql` | SQL for vector search |
| `supabase/functions/rag_chat/index.ts` | RAG Edge Function |
| `src/components/Chat.tsx` | Chat UI |

---

## ⏱️ Total Time

- Phase 1 (Database): **5 minutes**
- Phase 2 (Ingest): **10-15 minutes**
- Phase 3 (Deploy): **2 minutes**
- Phase 4 (Test): **1 minute**

**Total: 20-30 minutes**

---

## 🔧 If Something Goes Wrong

| Error | Fix |
|-------|-----|
| "Could not find table 'public.works'" | Run SQL migrations first (Phase 1) |
| OpenAI embedding error | Check OPENAI_API_KEY is valid and has credits |
| Edge Function deploy fails | Run `npx supabase functions deploy rag_chat` again |
| Chat says "Failed to get response" | Check browser console (F12) for network errors |

---

## 🎯 Next Steps After MVP Works

1. Add Ramayana ingestion script
2. Add Mahabharata ingestion script
3. Add Vedas ingestion script
4. Add scripture browser UI
5. Deploy to production (Vercel + Supabase)

---

**Ready to deploy? Start with Phase 1 above!** 🙏
