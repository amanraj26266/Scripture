# 🔐 GitHub Secrets Setup - Step by Step

## ⚠️ IMPORTANT: Deploy is failing because secrets are missing!

The GitHub Actions workflow needs **6 secrets** to be manually added to your repository.

---

## Step 1: Get Your Project Ref

Your **SUPABASE_PROJECT_REF** is:
```
khmanubvvecuufhmhbay
```

(This is extracted from your `.env.local`: `https://khmanubvvecuufhmhbay.supabase.co`)

---

## Step 2: Add All 6 Secrets to GitHub

### Go to:
```
Your GitHub Repo → Settings → Secrets and variables → Actions
```

### Click "New repository secret" and add these 6 secrets:

#### 1️⃣ SUPABASE_PROJECT_REF
- **Name:** `SUPABASE_PROJECT_REF`
- **Value:** `khmanubvvecuufhmhbay`

#### 2️⃣ SUPABASE_URL
- **Name:** `SUPABASE_URL`
- **Value:** `https://khmanubvvecuufhmhbay.supabase.co`

#### 3️⃣ SUPABASE_ANON_KEY
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** (from your `.env.local` - the `NEXT_PUBLIC_SUPABASE_ANON_KEY` value)

#### 4️⃣ SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** (from your `.env.local` - the `SUPABASE_SERVICE_ROLE_KEY` value)

#### 5️⃣ SUPABASE_ACCESS_TOKEN
- **Name:** `SUPABASE_ACCESS_TOKEN`
- **Value:** Get from [Supabase Dashboard](https://app.supabase.com) → Settings → Access Tokens → Create new token (or use existing one)

#### 6️⃣ OPENAI_API_KEY
- **Name:** `OPENAI_API_KEY`
- **Value:** (from your `.env.local` - the `OPENAI_API_KEY` value)

---

## Step 3: Verify Secrets Are Added

Go to: Settings → Secrets and variables → Actions

You should see all 6 secrets listed:
- ✅ SUPABASE_PROJECT_REF
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SUPABASE_ACCESS_TOKEN
- ✅ OPENAI_API_KEY

---

## Step 4: Push Code Again

```powershell
git add .
git commit -m "fix: update Chat.tsx env vars"
git push origin main
```

This will trigger the GitHub Actions workflow again, and this time it should **SUCCEED** because all secrets are available!

---

## ✅ Verification Checklist

After pushing again:
1. Go to your GitHub repo → Actions tab
2. Click the latest workflow run
3. Check if all 3 jobs pass:
   - ✅ **build** (should pass)
   - ✅ **deploy** (should now pass with secrets)
   - ✅ **notify** (should show success message)

---

## 🆘 Troubleshooting

**Q: Where do I find SUPABASE_ACCESS_TOKEN?**
A: Go to [Supabase Dashboard](https://app.supabase.com) → Settings → Access Tokens → Create new token (give it a name like "GitHub Actions")

**Q: The secret values contain special characters, will it work?**
A: Yes! GitHub secrets handle special characters correctly. Just paste the entire value as-is.

**Q: I added the secrets but deploy still fails?**
A: Wait ~30 seconds after adding secrets, then trigger a new push.

---

## 📝 Current Values to Use

From your `.env.local`:

```
SUPABASE_PROJECT_REF=khmanubvvecuufhmhbay
SUPABASE_URL=https://khmanubvvecuufhmhbay.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=WIYjFJUPkXkHW9Bw03SCQw4GblTrwmHvqfnpKUGSM6M7...
SUPABASE_ACCESS_TOKEN=[Get from Supabase Dashboard]
```

---

## 🚀 What Happens After Secrets Are Added

1. GitHub Actions workflow runs automatically on every push to `main`
2. **Build job**: Compiles React app
3. **Deploy job**: Deploys Edge Function to Supabase
4. **Notify job**: Reports success/failure

No more manual `npm run functions:deploy` needed! 🎉
