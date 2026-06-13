# Carbon Footprint Tracker

A full-stack, mobile-first web application designed to help individuals **understand, track, and reduce** their carbon footprint through simple daily logging and AI-powered personalized insights.

Built with a modern tech stack focused on performance, accessibility, and positive reinforcement.

**Live Demo:** https://carbon-tracker-hazel.vercel.app/

---

## Chosen Vertical

**Climate Tech / Personal Sustainability**

The application targets individual consumers who want to adopt more sustainable habits but lack visibility into their personal environmental impact. Rather than top-down corporate carbon reporting, this tool focuses on the bottom-up approach -- empowering everyday people with the data and nudges they need to make meaningful changes to their own lifestyle.

---

## Approach & Logic

### The Core Problem
Most people genuinely want to live more sustainably but face three blockers:
1. **Understanding** -- they don't know which of their daily activities contribute most to their footprint
2. **Tracking** -- manually calculating emissions is tedious and hard to sustain
3. **Reducing** -- generic sustainability advice doesn't account for personal lifestyle and context

### The Design Philosophy
The solution is built around three principles:

- **Friction removal** -- every core logging flow is completable in under 3 interactions. If it takes longer than 10 seconds to log an activity, people stop doing it.
- **Positive framing** -- the app celebrates every small reduction. Progress-focused, never guilt-based. Streaks and badges reinforce consistency over perfection.
- **Personalization** -- generic tips ("eat less meat") have limited impact. The AI insights engine analyzes each user's actual logged data to surface their specific highest-impact changes.

### Why This Stack
The entire stack was deliberately chosen to be **100% free** -- no credit cards, no paid tiers required to run the full application:

- **Groq API** (free tier) over OpenAI -- same LLM quality at zero cost for the volume this app needs
- **Supabase** over a paid managed database -- gives PostgreSQL + Auth + RLS on a generous free tier
- **Vercel + Render** over AWS/GCP -- both have free tiers sufficient for an MVP and early growth
- **OpenStreetMap + Leaflet.js** over Google Maps -- fully open-source with no API key or billing

---

## How the Solution Works

### User Journey

**1. Onboarding -- Baseline Calculator**
New users complete a short wizard covering diet type, daily commute distance, and home energy source. The app calculates a personal baseline carbon score (kg CO2e/year) and benchmarks it against regional and global averages. This gives the user immediate context before they've logged a single activity.

**2. Daily Activity Logging**
Users log activities across 5 emission categories -- Food, Transport, Energy, Shopping, and Travel. Each log entry is matched against standardized emission factors sourced from **IPCC AR6 and EPA datasets** stored in the `emission_factors` table. The app never hardcodes CO2e values in application logic -- all calculations read from the database, making the data auditable and updatable without code changes.

**3. Home Dashboard**
The dashboard shows the user's current week's carbon metric, an interactive Recharts trend graph (weekly/monthly), a category breakdown, and their current logging streak. All data is scoped to the authenticated user via Supabase Row Level Security -- no user can ever access another's data.

**4. AI Insights Engine (Phase 2)**
Once a week, the FastAPI backend summarizes the user's logged activity data and sends it to the **Groq API** (`llama-3-8b-instruct`) with a prompt requesting exactly 3 short, personalized, actionable reduction tips. The result is stored in the `insights` table with a timestamp. If an insight is less than 7 days old, the cached version is returned -- avoiding unnecessary API calls and ensuring the free tier limit is never approached.

**5. Goals, Streaks & Badges**
Users set reduction goals by category with a target and deadline. The streak system tracks consecutive days of logging. Badges are awarded for milestones (first log, 7-day streak, 50% goal completion, etc.) -- all designed to build long-term habit loops.

### Data Flow
```
User Action -> Frontend (Next.js)
           -> FastAPI Backend (validates ownership, calculates CO2e)
           -> Supabase PostgreSQL (stores activity with RLS)
           -> Dashboard (reads aggregated data)
           -> Groq API (weekly, summarized -- never raw data)
           -> Insights stored & returned to user
```

### Security Model
- Supabase Auth handles all authentication (email/password)
- Row Level Security enforced on every table -- users only see their own data
- Groq API key lives exclusively on the FastAPI backend -- never exposed to the frontend
- All secrets managed via environment variables -- never committed to the repo

---

## Assumptions Made

1. **Emission factor granularity** -- CO2e values are sourced from IPCC AR6 and EPA averages. Regional variation (e.g., energy grid emissions differ by country) is supported by the schema but the MVP seeds with global averages. Users in high-renewable-energy regions may see slightly overstated energy emissions.

2. **User honesty** -- the app relies on self-reported activity data. There is no integration with external data sources (bank transactions, smart meters) in the MVP. Users are assumed to log their actual behaviour.

3. **Weekly insights cadence** -- AI insights are generated once per week per user. This is intentional (to stay within Groq's free tier and avoid insight fatigue) but assumes users check in at least weekly.

4. **Single-user household** -- the baseline calculator and logging model assumes one person per account. Shared household energy or transport costs are not split across users in the MVP.

5. **English language only** -- the MVP targets English-speaking users. The Groq prompt and all UI copy are in English. Localization is out of scope for Phases 1 and 2.

6. **Mobile-first but not native** -- the app is a PWA, not a native iOS/Android app. Push notifications and offline support are Phase 3 features. Phase 1 and 2 assume an internet connection.

---

## Features

### Phase 1: MVP 
- **Baseline Calculator:** An intuitive onboarding wizard capturing diet, commute distance, and home energy source to establish a starting footprint.
- **Activity Logging:** Categorized logging flows (Food, Transport, Energy, Shopping, Travel) optimized for fast mobile data entry.
- **Home Dashboard:** A centralized view featuring the user's weekly footprint metric and an interactive Recharts trend graph.
- **Secure Authentication:** Fully integrated Supabase Auth with Server-Side Rendering middleware protecting private routes.

### Phase 2: Core Product
- **AI Insights Engine:** Groq (`llama-3-8b-instruct`) generating hyper-personalized, actionable reduction tips based on logging history.
- **Goal Setting & Streaks:** Gamification elements focusing on positive reinforcement and consistency.
- **Full CI/CD Deployment:** Automated deployments to Vercel (frontend) and Render (backend).

### Phase 3: Growth
- **Community Challenges:** Collaborative reduction goals and leaderboards.
- **Education Hub:** Micro-lessons on carbon literacy and sustainability.
- **PWA Capabilities:** Offline support and push notifications.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom Emerald Green design tokens
- **Components:** shadcn/ui (powered by Base UI)
- **Charts:** Recharts

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Package Manager:** `uv`
- **Validation:** Pydantic
- **AI Integration:** Groq API (`llama-3-8b-instruct`)

### Database & Auth
- **Database:** PostgreSQL via Supabase (free tier)
- **Authentication:** Supabase Auth (Email/Password)
- **Security:** Row Level Security (RLS) on all tables

### QA & CI/CD
- **E2E Testing:** Playwright
- **Pipelines:** GitHub Actions

---

## Running Locally

### Prerequisites
- Node.js v20+
- Python 3.11 & `uv` package manager
- Docker (for local Supabase instance)

### 1. Database (Supabase Local)
```bash
npx supabase start
npx supabase status
```
*Note the local API URL and anon keys from the status output.*

### 2. Backend (FastAPI)
```bash
cd backend
uv venv --python 3.11
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uv run uvicorn main:app --reload
```
*Backend runs on http://127.0.0.1:8000*

### 3. Frontend (Next.js)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
```
Then:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:3000*

### 4. Running Tests
```bash
cd frontend
npx playwright test
```

---

## Design Philosophy
- **Aesthetic:** Clean, glassmorphic interfaces with a custom Emerald Green palette
- **Framing:** Progress-focused, never guilt-based -- every small reduction is celebrated
- **Simplicity:** All core logging flows completable in under 3 interactions

---

## Production Deployment

### Frontend -> Vercel
1. Push repo to GitHub
2. Go to vercel.com -> New Project -> Import repo
3. Set **Root Directory** to `frontend`
4. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`)
5. Deploy -- auto-deploys on every push to `main`

### Backend -> Render
1. Go to render.com -> New Web Service -> Connect repo
2. Set **Root Directory** to `backend`
3. Set **Start Command** to `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Add environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `FRONTEND_URL`)
5. Deploy

> Note: Render free tier spins down after 15 minutes of inactivity. Set up a free UptimeRobot monitor pinging `/health` every 5 minutes to keep the backend awake.

### Environment Variables
| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Supabase anon key (safe for frontend) |
| `NEXT_PUBLIC_API_URL` | Vercel | Your Render backend URL |
| `SUPABASE_URL` | Render | Supabase project URL |
| `SUPABASE_ANON_KEY` | Render | Supabase anon key (for per-request JWT RLS enforcement) |
| `SUPABASE_SERVICE_ROLE_KEY` | Render | Supabase service role key -- never expose on frontend |
| `GROQ_API_KEY` | Render | Groq API key -- never expose on frontend |
| `FRONTEND_URL` | Render | Your Vercel domain (for CORS) |

---

## Free Tier Limits

| Service | Limit | Notes |
|---|---|---|
| Supabase | 500MB DB, 50k MAUs | Sufficient through Phase 2 |
| Groq | ~14,400 requests/day | Cache insights weekly -- limit never approached |
| Vercel | 100GB bandwidth/month | More than enough for MVP |
| Render | 750 hours/month, spins down | Use UptimeRobot keep-alive |
| GitHub Actions | 2,000 min/month | Unlimited on public repos |
