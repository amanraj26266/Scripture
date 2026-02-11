# RAG Chat Edge Function

This Supabase Edge Function implements end-to-end RAG: embedding, retrieval, and LLM generation.

## Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your Supabase project:
```bash
supabase link --project-ref <project-ref>
```

3. Deploy the Edge Function:
```bash
supabase functions deploy rag_chat
```

## Environment variables (set in Supabase Dashboard)

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (auto-provided by Supabase)
- `OPENAI_API_KEY`: Your OpenAI API key
- `EMBEDDING_MODEL`: (default: `text-embedding-3-small`)
- `LLM_MODEL`: (default: `gpt-4o-mini`)

## Request

POST `/rest/v1/functions/v1/rag_chat`

Body:
```json
{
  "question": "What is dharma?",
  "top_k": 5
}
```

## Response

```json
{
  "answer": "Dharma refers to righteous duty... [[0]] [[1]]",
  "sources": [
    { "chunk_id": "...", "chunk_text": "...", "metadata": {...}, "distance": 0.45 }
  ]
}
```

The function returns the LLM-generated answer with citations and the source chunks used for retrieval.
