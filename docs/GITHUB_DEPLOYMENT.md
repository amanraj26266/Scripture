# 🚀 GitHub Actions Deployment Guide

## What This Does

When you push code to `main` branch:
1. ✅ GitHub builds the React app
2. ✅ Deploys Supabase Edge Functions automatically  
3. ✅ Creates database schema on first run
4. ✅ Notifies you of deployment status

## Required GitHub Secrets

Add these secrets to your GitHub repository:  
**Settings → Secrets and variables → Actions → New repository secret**

### 1. Supabase Project Reference
**Name:** `SUPABASE_PROJECT_REF`  
**Value:** Your Supabase project ID (from Dashboard → Settings → General)  
Example: `xyzabc123def`

### 2. Supabase URL
**Name:** `SUPABASE_URL`  
**Value:** Your Supabase project URL  
Example: `https://xyzabc123def.supabase.co`

### 3. Supabase Anon Key
**Name:** `SUPABASE_ANON_KEY`  
**Value:** Safe for public/browser use (from Dashboard → Settings → API)  
Example: `eyJhbGc...` (long string)

### 4. Supabase Service Role Key
**Name:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:** KEEP SECRET — used for Edge Functions and database operations  
⚠️ Never commit this to git!  
(from Dashboard → Settings → API → Service Role Secret)

### 5. Supabase Access Token
**Name:** `SUPABASE_ACCESS_TOKEN`  
**Value:** For CLI authentication  
Generate at: https://app.supabase.com/account/tokens  
Click "Generate new token" → copy

### 6. OpenAI API Key
**Name:** `OPENAI_API_KEY`  
**Value:** From https://platform.openai.com/account/api-keys  
Example: `sk-proj-...`

## Step-by-Step Setup

### Step 1: Generate Supabase Access Token
1. Go to https://app.supabase.com/account/tokens
2. Click **Generate new token**
3. Give it a name: "Scripture AI Deployment"
4. Copy the token immediately (you can't see it again)

### Step 2: Add Secrets to GitHub
1. Go to your GitHub repo → **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below:

```
SUPABASE_PROJECT_REF = xyzabc123def
SUPABASE_URL = https://xyzabc123def.supabase.co
SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
SUPABASE_ACCESS_TOKEN = sbpat_...
OPENAI_API_KEY = sk-proj-...
```

### Step 3: Run Database Migration

Before first deployment, run the migration manually:

```powershell
# Link your local project
npx supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
npx supabase db push --schema-only
```

Or manually in Supabase Dashboard:
1. Go to **SQL Editor**
2. Create new query
3. Copy & paste entire content from [migrations/001_complete_schema.sql](migrations/001_complete_schema.sql)
4. Click **Run**

### Step 4: Push to Main to Deploy

```bash
git add .
git commit -m "feat: setup Scripture AI deployment"
git push origin main
```

Watch the deployment:
1. Go to GitHub repo → **Actions**
2. Click the running workflow
3. Check **Deploy Edge Functions** step

## What Gets Deployed

| Component | Location |
|-----------|----------|
| React UI | GitHub Pages or Vercel (optional) |
| RAG Edge Function | Supabase (`/functions/v1/rag_chat`) |
| Database | Supabase Postgres + pgvector |
| Migrations | Auto-applied on first deployment |

## Verify Deployment Success

After push to main:

1. Check GitHub Actions workflow (green checkmark)
2. Go to Supabase Dashboard → **Functions**
3. Should see `rag_chat` function listed
4. Try calling it:
   ```bash
   curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/rag_chat \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"question":"What is dharma?"}'
   ```

## Troubleshooting

### "Access token expired"
→ Generate a new Supabase token and update `SUPABASE_ACCESS_TOKEN`

### "Project ref not found"
→ Verify `SUPABASE_PROJECT_REF` matches your project ID (no `https://`)

### "Function deployment failed"
1. Check function syntax in `supabase/functions/rag_chat/index.ts`
2. Verify Deno imports are correct
3. Re-run: `npx supabase functions deploy rag_chat`

### "Database migration not applied"
→ Run migration manually in Supabase SQL Editor:
```sql
-- Copy entire content from migrations/001_complete_schema.sql
```

## Optional: Deploy Frontend to Vercel

To also deploy the React frontend to Vercel:

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add environment variables (same as secrets)
5. Deploy

The app will be live at `your-project.vercel.app`

## Security Notes

🔒 **Never commit secrets to git!**
- Keep `.env.local` in `.gitignore`
- Use GitHub Secrets for CI/CD
- Rotate keys quarterly
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side code

✅ **Good:** Secrets in GitHub Secrets  
✅ **Good:** `.env.local` in `.gitignore`  
❌ **Bad:** API keys in code or `.env` file  
❌ **Bad:** Secrets in commit messages  

## Next Steps

1. Add the 6 secrets above to GitHub
2. Run migration in Supabase
3. Push code to `main` branch
4. Watch GitHub Actions deploy automatically
5. Test the Edge Function with a curl request (see "Verify Deployment Success" above)

Let me know if you hit any errors! 🙏
