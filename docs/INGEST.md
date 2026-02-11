# Ingestion guide

This guide explains how to run the Bhagavad Gita ingestion script and prepare your Supabase schema.

1. Enable pgvector (recommended)
   - In Supabase SQL editor run:

```sql
create extension if not exists vector;
```

2. Run the migration `migrations/create_tables.sql` in the Supabase SQL editor.

3. Add your Bhagavad Gita plaintext file at `data/bhagavad_gita.txt`.
   - Create the `data/` folder and place a UTF-8 plaintext file.

4. Create `.env.local` (copy from `.env.example`) and ensure it contains:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
EMBEDDING_MODEL=text-embedding-3-small
```

5. Install dependencies and run the ingestion script:

```bash
npm install
node scripts/ingest_bhagavad_gita.js
```

6. After ingestion, verify rows in `works`, `documents`, and `chunks` tables in Supabase.

Notes:
- If `vector` extension is enabled, the migration will create `embedding` as `vector(1536)`.
- If `vector` is not available, it uses `float8[]`. Querying similarity will be less efficient without vector indexes.
- The script uses the OpenAI Embeddings API. Monitor usage and costs.

If you'd like, I can: create a Supabase Edge Function that queries nearest chunks and builds a RAG prompt, or add a minimal chat UI wired to that function. Reply which next step to implement.
