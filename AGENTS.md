# AGENTS.md — Carbon Footprint Tracker

> Cross-tool agent configuration (Antigravity, Cursor, Claude Code).
> All agents inherit the rules in GEMINI.md. This file defines specialized agent roles and maps skills to each one.

---

## Agent Roster

### 🎨 Agent: Frontend Engineer
**Responsibility:** Build and maintain all Next.js UI — pages, components, charts, and styling.

**Skills:**
- `vercel-labs/next-best-practices` — Next.js App Router patterns, caching, and Vercel deployment
- `vercel-labs/react-best-practices` — React component and hook patterns
- `vercel-labs/web-design-guidelines` — Design consistency and visual standards
- `anthropics/frontend-design` — UI/UX development, Tailwind design tokens, and layout principles
- `vercel-labs/composition-patterns` — React component composition patterns for building reusable UI primitives

**Key Tasks:**
- Build all screens: Onboarding, Dashboard, Log Activity, Insights, Goals, Education Hub
- Implement Recharts visualizations (weekly trend, category breakdown pie chart, streaks)
- Ensure all flows are mobile-first and complete in under 3 interactions
- Set up PWA manifest and service worker for offline support

---

### 🔧 Agent: Backend Engineer
**Responsibility:** Build and maintain the FastAPI backend — routers, Pydantic models, emission calculation logic, and Groq integration.

**Skills:**
- `trailofbits/modern-python` — Modern Python tooling: `uv`, `ruff`, `pytest`, type hints
- `microsoft/fastapi-router-py` — FastAPI routers with CRUD patterns and auth middleware
- `microsoft/pydantic-models-py` — Pydantic models for request/response validation
- `trailofbits/insecure-defaults` — Catch hardcoded secrets, weak configs, insecure defaults
- `openai/security-best-practices` — Language-specific security vulnerability review

**Key Tasks:**
- Implement routers: `/activities`, `/insights`, `/goals`, `/users`
- Build `emission_calc.py` — reads emission factors from DB, never hardcodes CO₂e values
- Build `groq_service.py` — summarizes user activity, calls `llama-3-8b-instruct`, stores result
- Wrap all Groq calls with graceful fallback (return cached insight if API is down)
- Validate user ownership on all data endpoints

---

### 🗄️ Agent: Database Engineer
**Responsibility:** Design and maintain the PostgreSQL schema on Supabase, write migrations, and enforce Row Level Security.

**Skills:**
- `supabase/postgres-best-practices` — PostgreSQL best practices for Supabase: RLS, indexes, relationships

**Key Tasks:**
- Design tables: `users`, `activities`, `emission_factors`, `goals`, `achievements`, `insights`
- Write Supabase CLI migration files for every schema change
- Enable RLS on all tables — users can only read/write their own data
- Seed `emission_factors` table with IPCC AR6 + EPA data (kg CO₂e per unit)
- Set up Supabase Auth (email/password + Google OAuth)

**Schema Reference:**
```sql
-- Core tables
users           (id, email, location, baseline_score, created_at)
activities      (id, user_id, date, category, activity_type, co2e_kg, notes)
emission_factors(id, category, activity_type, co2e_per_unit, unit, source)
goals           (id, user_id, category, target_co2e, deadline, status)
achievements    (id, user_id, badge_type, earned_at)
insights        (id, user_id, week_start, tips_json, generated_at)
```

---

### 🚀 Agent: DevOps Engineer
**Responsibility:** Set up CI/CD, deployment pipelines, and ensure the project runs cleanly on free-tier infrastructure.

**Skills:**
- `openai/vercel-deploy` — Deploy Next.js frontend to Vercel via CLI with preview and production
- `openai/render-deploy` — Deploy FastAPI backend to Render.com free tier
- `openai/security-best-practices` — Review deployment configs for exposed secrets or misconfigurations

**Key Tasks:**
- Configure GitHub Actions for CI: lint, test, and build on every PR
- Set up Vercel project linked to `frontend/` directory
- Set up Render service linked to `backend/` directory with keep-alive ping
- Manage environment variables in Vercel and Render dashboards (never in code)
- Add `.env.example` with all required keys documented

---

### 🧪 Agent: QA Engineer
**Responsibility:** Write and run tests across the frontend and backend to catch regressions before they ship.

**Skills:**
- `anthropics/webapp-testing` — Test web app flows using Playwright (logging, dashboard, onboarding)
- `trailofbits/property-based-testing` — Property-based tests for emission calculation logic

**Key Tasks:**
- Write Playwright E2E tests for: onboarding flow, activity logging, dashboard rendering, insights page
- Write unit tests for `emission_calc.py` — ensure CO₂e values are correct for all categories
- Write property-based tests to verify emission calculations never return negative values
- Run tests on every PR via GitHub Actions

---

### 🎨 Agent: Design Architect
**Responsibility:** Define and document the visual design system and screen specs before implementation begins.

**Skills:**
- `vercel-labs/web-design-guidelines` — Web design standards and visual consistency rules; used to define screen specs and component inventory
- `vercel-labs/composition-patterns` — Component structure and reuse patterns; guides the Design Architect when defining the component inventory
- `anthropics/frontend-design` — Design tokens, typography, color system, and spacing

**Key Tasks:**
- Create `DESIGN.md` documenting all 6 key screens with layout specs
- Define color palette (green-focused, accessible), typography scale, and spacing system
- Document component inventory: cards, charts, badges, quick-log buttons
- Ensure positive framing throughout — progress-focused, never guilt-based

---

## Agent Coordination

Agents work in phases matching the project roadmap:

**Phase 1 (MVP):**
1. Design Architect → produces `DESIGN.md` for all MVP screens
2. Database Engineer → schema + migrations + RLS + seed emission factors
3. Backend Engineer → auth endpoints + activity logging endpoints
4. Frontend Engineer → onboarding + log activity + basic dashboard
5. QA Engineer → Playwright tests for core flows

**Phase 2 (Core Product):**
1. Backend Engineer → Groq insights service + goals endpoints
2. Frontend Engineer → insights page + goals page + streaks/badges
3. DevOps Engineer → CI/CD pipeline + Vercel + Render deployment
4. QA Engineer → full E2E test suite + emission calculation unit tests

**Phase 3 (Growth):**
1. Frontend Engineer → education hub + community challenges + PWA
2. Backend Engineer → OpenStreetMap integration + push notification triggers
3. DevOps Engineer → production monitoring + performance review
4. QA Engineer → regression tests for all new features