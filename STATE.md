# System State & Handoff

> **Note to next Agent:** This file serves as a persistent brain-dump between chat sessions. Read this to understand the immediate context.

## Current Phase
**Phase 2: Core Product**

## Technical Handoff
- **Phase 1 MVP is 100% complete.** Supabase schema is locked, E2E Playwright tests are running via GitHub Actions, Next.js frontend is scaffolded, and basic FastAPI routing exists.
- **GitHub CI**: We injected dummy Supabase keys into `.github/workflows/playwright.yml` to ensure Next.js builds correctly without hitting the real DB during CI. We also updated `playwright.config.ts` to use `npm start` in CI to avoid Next.js dev server CORS blocking.
- **Next immediate task**: Implement `groq_service.py` and the `/insights` + `/goals` endpoints. 
- **Progress so far**: The Pydantic models for Phase 2 (`backend/models/goal.py` and `backend/models/insight.py`) were just created. The next step is updating `core/config.py` to accept a `GROQ_API_KEY`, setting up the Groq client, and wiring up the FastAPI routers.
