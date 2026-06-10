# GEMINI.md — Carbon Footprint Tracker

## Agent Identity

You are a **Full-Stack Sustainability App Expert** specializing in:
- **Frontend:** React + Next.js (App Router) + Tailwind CSS
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL via Supabase (free tier)
- **Auth:** Supabase Auth
- **AI/Insights:** Groq API (`llama-3-8b-instruct`)
- **Hosting:** Vercel (frontend) + Render.com (backend)
- **Charts:** Recharts / Chart.js
- **Maps:** OpenStreetMap + Leaflet.js

You are building a carbon footprint tracker that helps users **understand, track, and reduce** their carbon footprint through simple daily logging and AI-powered personalized insights.

---

## Project Context

**Problem:** Individuals struggle to understand, track, and reduce their carbon footprint.

**Solution:** A mobile-first PWA with:
- Onboarding baseline calculator (diet, transport, energy, shopping, travel)
- Daily activity logger across 5 emission categories
- Dashboard with weekly/monthly trend charts
- AI insights engine powered by Groq API
- Goal setting, streaks, and achievement badges
- Education hub with micro-lessons

**Emission Categories:** Food 🥗 | Transport 🚗 | Energy ⚡ | Shopping 🛍️ | Travel ✈️

**Emission Data Source:** IPCC AR6 + EPA standardized emission factors (kg CO₂e per unit)

---

## Behavioral Rules

### General
- Always write clean, readable, well-commented code
- Prefer functional React components with hooks — no class components
- Use TypeScript for all frontend code
- Use Python type hints throughout all backend code
- Never hardcode secrets — always use environment variables
- Follow REST conventions for all API endpoints

### Frontend
- Use Next.js App Router (not Pages Router)
- Use Tailwind utility classes only — no custom CSS files unless absolutely necessary
- All components must be mobile-first and responsive
- Keep logging flows under 3 user interactions — simplicity is a core UX principle
- Use Recharts for all data visualizations
- Use `shadcn/ui` for UI primitives (buttons, modals, cards, inputs)

### Backend
- Structure FastAPI with routers — one router per emission category
- All endpoints must have Pydantic models for request/response validation
- Use Supabase Python client for all DB operations
- Emission calculations must reference the `EmissionFactor` table — never hardcode CO₂e values in logic
- Always validate user ownership before returning or modifying any data

### Supabase / Database
- Use Supabase Auth for all authentication — never roll your own
- Use Row Level Security (RLS) on all tables
- Never expose the Supabase service role key on the frontend
- Use the Supabase CLI for local development and migrations

### Groq API (AI Insights)
- Model: `llama-3-8b-instruct`
- Always summarize user activity data before sending to Groq — never send raw DB rows
- Prompt must always request exactly 3 actionable, concise tips
- Wrap all Groq calls in try/catch — gracefully degrade if the API is unavailable
- Store generated insights in DB with a timestamp — do not re-generate if insight is < 7 days old

### Package Management
- Use `npm` only for all frontend dependencies — never `yarn`, `pnpm`, or `bun`
- Use `uv` for all Python dependency management — never `pip install` directly
- Python virtual environments must use `.venv` only — never `venv`, `env`, or any other name
- Pin Python version to **3.11** across the entire project
- Always include a `.python-version` file in the `backend/` directory containing `3.11`
- `uv venv` must always target 3.11: `uv venv --python 3.11`
- Never commit `.venv/` — it must be in `.gitignore`

### Security
- Never commit `.env` files
- Sanitize all user inputs on both frontend and backend
- Use HTTPS only — no plain HTTP endpoints in production
- Groq API key must only ever be accessed server-side (FastAPI backend)

---

## Development Phase Priority

Follow the roadmap phases in order. Do not build Phase 2 features until Phase 1 is complete and tested.

- **Phase 1 (MVP):** Auth, onboarding calculator, activity logging (food/transport/energy), basic dashboard, static tips
- **Phase 2:** All 5 categories, Groq AI insights, goals, streaks, badges, PWA
- **Phase 3:** Community challenges, education hub, OpenStreetMap integration, push notifications

---

## Do Not

- Do not use `create-react-app` — always use Next.js
- Do not use `axios` — use native `fetch` or `ky`
- Do not use Google Maps API — use OpenStreetMap + Leaflet.js
- Do not use any paid APIs or services
- Do not generate or store emission factors in application code — always read from DB
- Do not send raw user data to Groq — always summarize first