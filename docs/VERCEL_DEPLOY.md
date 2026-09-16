# Vercel deployment for 72X sub-apps

This file explains how to deploy the current static builds for the sub-apps (CRM, Finance, TenderlyAI) to Vercel. Each sub-app has a Vercel local config in the repository so you can deploy quickly with the Vercel CLI, or configure the project in the Vercel dashboard.

Files in this repo
------------------
- `vercel.crm.json` — local config to deploy the CRM site (serves `dist-crm`).
- `vercel.finance.json` — local config to deploy the Finance Manager site (serves `dist-finance`).
- `vercel.tenderlyai.json` — local config to deploy the TenderlyAI site (serves `dist-tenderlyai`).

Dashboard (preferred)
---------------------
1. Create a new Project → Import Git repository.
2. For each subapp create a separate Vercel project (you may import the same repo multiple times):
   - CRM: set **Build Command** to `npm run build:crm`, **Output Directory** to `dist-crm`.
   - Finance: **Build Command** `npm run build:finance`, **Output Directory** `dist-finance`.
   - TenderlyAI: **Build Command** `npm run build:tenderlyai`, **Output Directory** `dist-tenderlyai`.
3. Add environment variables in Project Settings → Environment Variables (see `docs/SSO.md` and below).
4. Deploy (via dashboard or by pushing to the configured branch).

Vercel CLI (quick deploy using local configs)
-------------------------------------------
Install and login:
```bash
npm i -g vercel
vercel login
```

Deploy CRM (uses `vercel.crm.json` locally):
```bash
vercel --local-config vercel.crm.json --prod --confirm
```

Deploy Finance:
```bash
vercel --local-config vercel.finance.json --prod --confirm
```

Deploy TenderlyAI:
```bash
vercel --local-config vercel.tenderlyai.json --prod --confirm
```

Notes
-----
- These configs use `@vercel/static-build` and assume the repo `package.json` scripts perform the Vite builds (see `package.json`): `build:crm`, `build:finance`, `build:tenderlyai`.
- You still need to set environment variables in the Vercel dashboard for each project (they are not read from the repo `.env`). Set production `VITE_*` vars as needed.
- If you prefer Vercel to run a custom build root, set the Project Root in the Vercel import UI and use the same Build Command / Output Directory values.

Example (frontend envs to add in Vercel Project Settings)
```text
VITE_BACKEND_URL=https://api.your-backend.example
VITE_PRODUCTION_URL=https://api.your-backend.example
VITE_MAIN_APP_URL=https://app.your-frontend.example
VITE_CRM_URL=https://crm.your-frontend.example
VITE_FINANCE_URL=https://finance.your-frontend.example
VITE_TENDERLYAI_URL=https://tenderlyai.your-frontend.example
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_pk_test_here
VITE_PUBLIC_SITE_URL=https://www.your-frontend.example
```

If you want, I can also add `npm` scripts like `vercel:deploy:crm` to `package.json` to make CLI deploys a single `npm run` command.
