# Configuration & Required Secrets

This file lists the GitHub and Supabase keys (and other environment variables) you should configure before we continue.

IMPORTANT: Do NOT share secret values in chat. Set them in GitHub repo secrets and in Supabase project settings as described.

## Where to set them

- Supabase Dashboard → Project → Settings → API
  - Copy the `Project URL` and the `anon` and `service_role` keys.
- GitHub Repository → Settings → Secrets and variables → Actions
  - Add the secrets listed below so CI/workflows and deployments can access them.

## Recommended secret names (GitHub Actions)

- SUPABASE_URL: Supabase project URL (Project URL)
- SUPABASE_ANON_KEY: Supabase anon/public API key (safe for client use)
- SUPABASE_SERVICE_ROLE_KEY: Supabase service_role key (server-only — keep secret)
- SUPABASE_DB_URL: (Optional) Postgres connection string if needed for server jobs
- NEXT_PUBLIC_SUPABASE_URL: same as `SUPABASE_URL` for frontend (prefix `NEXT_PUBLIC_` makes it available to client)
- NEXT_PUBLIC_SUPABASE_ANON_KEY: same as `SUPABASE_ANON_KEY` for frontend
- OPENAI_API_KEY (or LLM_API_KEY): Your LLM provider API key for embeddings & generation
- EMBEDDING_MODEL: (Optional) embedding model id, e.g., `text-embedding-3-small`
- LLM_MODEL: (Optional) completion model id, e.g., `gpt-4o-mini` or equivalent
- GH_PAT: (Optional) GitHub Personal Access Token if we need to run repo automation from scripts
- VERCEL_TOKEN / NETLIFY_AUTH_TOKEN: (Optional) for deployments if using those platforms

## Supabase-specific notes

- Use `SUPABASE_SERVICE_ROLE_KEY` only on server-side code (Edge Functions, serverless functions). Never expose it in the browser.
- For vector embeddings stored in Postgres, we may need a DB connection string with pgvector enabled. If so, set `SUPABASE_DB_URL` or `PG_CONNECTION_STRING` with your Postgres connection URL (found under Database connection in Supabase).

## Local development (.env.local)

Create a `.env.local` file for local testing (do NOT commit it):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_or_llm_key
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini
```

## Minimal set to get started (MVP)

If you want to configure only the bare minimum for the first prototype, set these three secrets in GitHub Actions:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- OPENAI_API_KEY (or LLM_API_KEY)

And in Supabase Dashboard keep the `service_role` key handy for server-side ingestion tasks.

## After you've configured secrets

Reply here once you have added the listed secrets to your GitHub repo and Supabase project. I will then:

- Add a GitHub Actions workflow (if you want) that uses these secrets for CI and deployment, and
- Create a starter React + Supabase scaffold that reads these env variables and boots a minimal app.

If you'd like, I can also generate the GitHub Actions YAML now (you'll need to add it to the repo), or a `.env.example` file.
