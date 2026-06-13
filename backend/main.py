from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users, activities, insights, goals, notifications

app = FastAPI(
    title="Carbon Footprint Tracker API",
    description="FastAPI backend for tracking and calculating carbon footprints",
    version="1.0.0"
)

from core.config import settings

origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

# Configure CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://carbon-tracker.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(activities.router)
app.include_router(insights.router)
app.include_router(goals.router)
app.include_router(notifications.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
