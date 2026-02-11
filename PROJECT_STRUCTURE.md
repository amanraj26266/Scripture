# 📂 Project Structure & File Inventory

## Complete File Tree

```
Scripture/
├── .env.example                          # Template for environment variables
├── .env.local.example                    # Alternative env template
├── .gitignore                            # Git ignore patterns
├── package.json                          # Node dependencies & npm scripts
├── tsconfig.json                         # TypeScript configuration
├── vite.config.ts                        # Vite bundler config
├── supabase.json                         # Supabase project config
├── QUICKSTART.md                         # Quick reference guide
├── QUICKSTART_COMMANDS.md                # Copy-paste commands
├── FINAL_SETUP.md                        # Detailed setup guide
├── DEPLOYMENT_ROADMAP.md                 # This file - complete roadmap
├── index.html                            # React root HTML
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # GitHub Actions CI/CD workflow
│
├── src/
│   ├── main.tsx                          # React entry point
│   ├── App.tsx                           # Main React component
│   ├── styles.css                        # Global styles (chat UI styling)
│   ├── components/
│   │   └── Chat.tsx                      # Chat component with RAG integration
│   └── lib/
│       └── supabase.ts                   # Supabase client helper
│
├── supabase/
│   ├── .env.local.example                # Edge Function env template
│   ├── functions/
│   │   ├── rag_chat/
│   │   │   └── index.ts                  # Retrieval-Augmented Generation function
│   │   └── _shared/
│   │       └── import_map.json           # Deno import map for dependencies
│   └── migrations/
│       ├── 001_complete_schema.sql       # Complete database schema
│       ├── create_tables.sql             # (deprecated - use 001_complete_schema.sql)
│       └── create_match_function.sql     # (deprecated - use 001_complete_schema.sql)
│
├── scripts/
│   ├── ingest_bhagavad_gita.js          # Ingest & embed Bhagavad Gita
│   ├── download_bhagavad_gita.js        # Download scripture text
│   └── validate_setup.js                 # Validate environment setup
│
├── data/
│   └── bhagavad_gita.txt                # Bhagavad Gita plaintext (~11K words)
│
├── migrations/
│   ├── 001_complete_schema.sql          # ✅ MAIN: Complete database schema
│   ├── create_tables.sql                # (legacy - included in 001_complete_schema.sql)
│   └── create_match_function.sql        # (legacy - included in 001_complete_schema.sql)
│
├── docs/
│   ├── SETUP.md                         # Complete setup reference
│   ├── INGEST.md                        # Ingestion guide
│   ├── RAG_EDGE_FUNCTION.md            # Edge Function API docs
│   ├── GITHUB_DEPLOYMENT.md            # GitHub Actions secrets guide
│   └── README_DEPLOYMENT.md             # Additional deployment notes
│
└── dist/                                # (generated on build)
    └── [compiled React app]
```

---

## 📊 What Each File Does

### Configuration Files
| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables (commit to git) |
| `.env.local` | Your actual API keys (DO NOT commit) |
| `package.json` | Node.js dependencies & npm scripts |
| `tsconfig.json` | TypeScript compiler settings |
| `vite.config.ts` | Vite bundler configuration |
| `supabase.json` | Supabase project settings |

### Frontend (React + Vite)
| File | Purpose |
|------|---------|
| `src/main.tsx` | React DOM mount point |
| `src/App.tsx` | Main app shell with header, chat, footer |
| `src/components/Chat.tsx` | Chat UI with message history & sources |
| `src/lib/supabase.ts` | Supabase client initialization |
| `src/styles.css` | Responsive chat UI styling |
| `index.html` | HTML skeleton |
| `vite.config.ts` | Dev server & build config |

### Backend (Supabase Edge Functions)
| File | Purpose |
|------|---------|
| `supabase/functions/rag_chat/index.ts` | RAG endpoint that: 1) Embeds query, 2) Retrieves chunks, 3) Calls LLM 4) Returns answer with citations |
| `supabase/functions/_shared/import_map.json` | Deno module imports (std, supabase-js) |
| `supabase/.env.local` | Edge Function secrets (OPENAI_API_KEY, etc.) |

### Database (Supabase Postgres + pgvector)
| File | Purpose |
|------|---------|
| `migrations/001_complete_schema.sql` | ✅ **MAIN MIGRATION**: Creates all tables, indexes, functions, and sample data |
| `migrations/create_tables.sql` | Legacy (included in 001_complete_schema.sql) |
| `migrations/create_match_function.sql` | Legacy (included in 001_complete_schema.sql) |

Tables created:
- `works`: Scripture metadata (Bhagavad Gita, etc.)
- `documents`: Editions and translations
- `chunks`: Text passages with embeddings (pgvector)
- `users`: User accounts
- `user_queries`: Query audit trail
- `bookmarks`: User bookmarks and notes

### Data/Scripts
| File | Purpose |
|------|---------|
| `data/bhagavad_gita.txt` | Bhagavad Gita plaintext (11,000+ words) |
| `scripts/ingest_bhagavad_gita.js` | Chunks text, creates embeddings, inserts to DB |
| `scripts/download_bhagavad_gita.js` | Downloads scripture text (fallback) |
| `scripts/validate_setup.js` | Checks environment configuration |

### CI/CD & Deployment
| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | GitHub Actions: builds, tests, deploys Edge Function |
| `docs/GITHUB_DEPLOYMENT.md` | Guide for adding GitHub secrets |
| `DEPLOYMENT_ROADMAP.md` | Complete deployment checklist |

### Documentation
| File | Purpose |
|------|---------|
| `docs/SETUP.md` | Complete setup & deployment guide |
| `docs/INGEST.md` | How to ingest new scriptures |
| `docs/RAG_EDGE_FUNCTION.md` | Edge Function API reference |
| `docs/GITHUB_DEPLOYMENT.md` | GitHub Actions secrets setup |
| `FINAL_SETUP.md` | Manual step-by-step guide |
| `QUICKSTART_COMMANDS.md` | Copy-paste bash commands |
| `QUICKSTART.md` | Quick reference |
| `DEPLOYMENT_ROADMAP.md` | This file |

---

## 🔄 Data Flow

```
User Question (Browser)
          ↓
React Chat Component
          ↓
POST /functions/v1/rag_chat
          ↓
Supabase Edge Function
    ├→ Call OpenAI Embeddings (embed query)
    ├→ Query pgvector (find 5 nearest chunks)
    ├→ Build RAG prompt
    └→ Call OpenAI Chat (generate answer)
          ↓
Return { answer, sources }
          ↓
React displays answer + sources
```

---

## 🎯 Key Npm Scripts

```bash
# Development
npm run dev                 # Start dev server (http://localhost:5173)
npm run build              # Build production bundle

# Database
npm run db:migrate         # Apply migrations
npm run db:reset           # Reset database (careful!)

# Deployment
npm run functions:deploy   # Deploy Edge Function to Supabase
npm run ingest             # Ingest Bhagavad Gita & create embeddings

# Utilities
npm run validate           # Check environment setup
npm run setup              # Full setup (migrate + ingest + deploy)
npm run format             # Format code with Prettier
```

---

## 📈 File Statistics

| Category | Count | Status |
|----------|-------|--------|
| Config files | 8 | ✅ Complete |
| Source code files | 10 | ✅ Complete |
| Scripts | 3 | ✅ Complete |
| Migrations | 3 | ✅ Complete |
| Documentation | 10 | ✅ Complete |
| Data files | 1 | ✅ Complete |
| **Total** | **35+** | **✅ 100% Complete** |

---

## ✅ Pre-Deployment Checklist

- [ ] All files above exist in your repo
- [ ] `package.json` has all scripts
- [ ] GitHub Actions workflow is in `.github/workflows/ci.yml`
- [ ] `.env.example` has all required variables
- [ ] `migrations/001_complete_schema.sql` contains full schema
- [ ] `supabase/functions/rag_chat/index.ts` has correct Deno imports
- [ ] `data/bhagavad_gita.txt` exists (~11K words)
- [ ] `docs/` folder has 4+ markdown guides

---

## 🚀 Quick Deployment Steps

```powershell
# 1. Create .env.local with your API keys
cp .env.example .env.local
# [edit .env.local]

# 2. Link Supabase
npx supabase link --project-ref YOUR_REF

# 3. Run migration
npm run db:migrate

# 4. Ingest scripture
npm run ingest

# 5. Deploy function
npm run functions:deploy

# 6. Start dev server
npm run dev

# 7. Test at http://localhost:5173
```

---

Everything is ready. You just need to add your API keys and run the deployment commands above!
