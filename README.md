# 🌍 Carbon Footprint Tracker

A full-stack, mobile-first web application designed to help individuals **understand, track, and reduce** their carbon footprint through simple daily logging and AI-powered personalized insights.

Built with a modern tech stack focused on performance, accessibility, and positive reinforcement.

---

## ✨ Features

### Phase 1: MVP (Completed)
- **Baseline Calculator:** An intuitive onboarding wizard capturing diet, commute distance, and home energy source to establish a starting footprint.
- **Activity Logging:** Categorized logging flows (Food, Transport, Energy, Shopping, Travel) optimized for fast mobile data entry.
- **Home Dashboard:** A centralized view featuring the user's weekly footprint metric and an interactive Recharts trend graph.
- **Secure Authentication:** Fully integrated Supabase Auth with Server-Side Rendering middleware protecting private routes.

### Phase 2: Core Product (Up Next)
- **AI Insights Engine:** Integration with Groq (`llama-3-8b-instruct`) to generate hyper-personalized, actionable reduction tips based on logging history.
- **Goal Setting & Streaks:** Gamification elements focusing on positive reinforcement and consistency.
- **Full CI/CD Deployment:** Automated deployments to Vercel (Frontend) and Render (Backend).

### Phase 3: Growth (Planned)
- **Community Challenges:** Collaborative reduction goals.
- **Education Hub:** Micro-lessons on sustainability.
- **PWA Capabilities:** Offline support and push notifications.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom Emerald Green design tokens
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (powered by Base UI)
- **Charts:** Recharts

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
- **Package Manager:** `uv`
- **Validation:** Pydantic
- **AI Integration:** Groq API (Planned)

### Database & Auth
- **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
- **Authentication:** Supabase Auth (Email/Password)
- **Security:** Strict Row Level Security (RLS) ensuring users can only access their own data.

### QA & CI/CD
- **E2E Testing:** [Playwright](https://playwright.dev/)
- **Pipelines:** GitHub Actions (running tests against production builds)

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v20+)
- Python 3.11 & `uv` package manager
- Docker (for local Supabase instance)

### 1. Database (Supabase Local)
```bash
npx supabase start
npx supabase status
```
*Note the local API URL and anon keys provided by the status command.*

### 2. Backend (FastAPI)
```bash
cd backend
uv venv --python 3.11
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uv run uvicorn main:app --reload
```
*Backend runs on http://127.0.0.1:8000*

### 3. Frontend (Next.js)
Ensure you have created a `.env.local` file in the `frontend/` directory with your local Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
```

Then start the development server:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:3000*

### 4. Running Tests
To verify the E2E flows work correctly:
```bash
cd frontend
npx playwright test
```

---

## 🎨 Design Philosophy
- **Aesthetic:** Clean, glassmorphic interfaces utilizing a custom Emerald Green palette.
- **Framing:** Progress-focused, never guilt-based. We celebrate every small reduction!
- **Simplicity:** All core logging flows are completable in under 3 interactions.