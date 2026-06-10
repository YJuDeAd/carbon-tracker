from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users, activities, insights, goals

app = FastAPI(
    title="Carbon Footprint Tracker API",
    description="FastAPI backend for tracking and calculating carbon footprints",
    version="1.0.0"
)

# Configure CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
