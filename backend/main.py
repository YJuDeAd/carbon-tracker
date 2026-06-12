from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users, activities, insights, goals

app = FastAPI(
    title="Carbon Footprint Tracker API",
    description="FastAPI backend for tracking and calculating carbon footprints",
    version="1.0.0"
)

import os

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://carbon-tracker-hazel.vercel.app"
]
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url and frontend_url not in origins:
    origins.append(frontend_url)

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

@app.get("/health")
def health_check():
    return {"status": "ok"}
