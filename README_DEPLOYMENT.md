# 🚀 SCRIPTURE AI - COMPLETE DEPLOYMENT GUIDE

**Status: ✅ Ready for Manual Deployment**

Your code is fully prepared. You now need to:
1. Create database tables in Supabase
2. Ingest the Bhagavad Gita
3. Deploy the Edge Function  
4. Test the app

---

## 📋 STEP-BY-STEP DEPLOYMENT

### STEP 1: Create Database Tables (Manual)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Run these queries in order:

#### Query 1: Enable pgvector
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### Query 2: Create tables (copy-paste entire block)
```sql
-- Create core tables for scripture ingestion
CREATE TABLE IF NOT EXISTS works (
  work_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  language text,
  description text,
  license text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  doc_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id uuid REFERENCES works(work_id) ON DELETE CASCADE,
  translator text,
  edition text,
  source_url text,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM pg_extension WHERE extname='vector') THEN
    CREATE TABLE IF NOT EXISTS chunks (
      chunk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id uuid REFERENCES documents(doc_id) ON DELETE CASCADE,
      chunk_text text,
      start_pos int,
      end_pos int,
      embedding vector(1536),
      metadata jsonb,
      created_at timestamptz DEFAULT now()
    );
  ELSE
    CREATE TABLE IF NOT EXISTS chunks (
      chunk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id uuid REFERENCES documents(doc_id) ON DELETE CASCADE,
      chunk_text text,
      start_pos int,
      end_pos int,
      embedding float8[],
      metadata jsonb,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END$$;
```

#### Query 3: Create vector search function (copy-paste entire block)
```sql
CREATE OR REPLACE FUNCTION match_chunks(query_embedding vector, limit_count int DEFAULT 5)
RETURNS TABLE(chunk_id uuid, chunk_text text, metadata jsonb, distance float) AS $$
  SELECT chunk_id, chunk_text, metadata, (embedding <-> query_embedding) AS distance
  FROM chunks
  ORDER BY embedding <-> query_embedding
  LIMIT limit_count;
$$ LANGUAGE SQL STABLE;
```

**Verify:** Go to Database → Tables and confirm you see:
- `works`
- `documents`  
- `chunks`

---

### STEP 2: Ingest Bhagavad Gita (Automated)

Once tables are created, run:

```powershell
node scripts/ingest_bhagavad_gita.js
```

**What it does:**
- Chunks the Bhagavad Gita text (~500 words per chunk)
- Calls OpenAI to create embeddings
- Inserts chunks into the database
- Takes 5-15 minutes

**Monitor progress:**
- Watch PowerShell for "Inserted chunk X/Y" messages
- Optional: Open Supabase Dashboard → Table Editor → `chunks` to watch rows appear in real-time

---

### STEP 3: Deploy RAG Edge Function (Automated)

```powershell
npx supabase functions deploy rag_chat
```

You should see:
```
✓ Function deployed successfully
Endpoint: https://khmanubvvecuufhmhbay.supabase.co/functions/v1/rag_chat
```

---

### STEP 4: Run the App (Automated)

```powershell
npm run dev
```

Open: **http://localhost:5173**

---

## 🧪 TEST THE CHAT

1. Type a question like: **"What is dharma?"**
2. You should see:
   - Your question (blue bubble, right)
   - AI answer (gray bubble, left) with citations
   - "📚 X source(s)" - click to expand and see which passages were used

---

## 📊 YOUR CURRENT SETUP STATUS

✅ **Done:**
- React + Vite app (builds successfully)
- Chat UI component with source citations
- Supabase Edge Function (RAG logic)
- Bhagavad Gita text prepared
- Environment files configured (.env.local, supabase/.env.local)
- Ingestion script ready
- All dependencies installed

⏳ **Needs you to do:**
1. Run 3 SQL queries in Supabase (5 min)
2. Run ingestion script (10-15 min)
3. Deploy Edge Function (2 min)
4. Test the app (1 min)

**Total time:** 20-30 minutes

---

## 🔗 YOUR CREDENTIALS (Already Configured)

Project: `khmanubvvecuufhmhbay`
Database: Supabase Postgres
URL: https://khmanubvvecuufhmhbay.supabase.co

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Could not find table 'public.works'" | Run the SQL migrations first (Step 1) |
| "Embedding API error" | Check OPENAI_API_KEY in .env.local is correct |
| Edge Function 404 | Run `npx supabase functions deploy rag_chat` again |
| Chat doesn't respond | Open browser F12 console, check for errors |

---

## 📚 NEXT: Add More Scriptures

After the Bhagavad Gita works, you can:

1. Create `data/ramayana.txt` and `scripts/ingest_ramayana.js`
2. Create `data/mahabharata.txt` and `scripts/ingest_mahabharata.js`
3. Create `data/vedas.txt` and `scripts/ingest_vedas.js`

The same ingestion pattern works for all scriptures!

---

## 🎯 SUMMARY

Everything is ready! You just need to:

```powershell
# 1. Create tables (manual, in Supabase SQL Editor - see above)
# 2. Ingest data
node scripts/ingest_bhagavad_gita.js

# 3. Deploy function
npx supabase functions deploy rag_chat

# 4. Run app
npm run dev
```

Then open **http://localhost:5173** and ask your scriptures questions!

Good luck! 🙏
