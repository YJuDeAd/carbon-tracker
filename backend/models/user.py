from pydantic import BaseModel, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: str
    location: str | None = None
    baseline_score: float | None = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class GamificationResponse(BaseModel):
    current_streak: int
    total_logs: int
    unlocked_badges: list[str]

class BaselineRequest(BaseModel):
    diet: str
    commute_miles: float
    energy_source: str

class DailyTrend(BaseModel):
    date: str
    co2e_kg: float

class DashboardResponse(BaseModel):
    this_week_co2e: float
    baseline_score: float | None
    percent_diff: float | None
    weekly_trend: list[DailyTrend]

class LeaderboardEntry(BaseModel):
    name: str
    score: float
    rank: int
    is_current_user: bool
    color: str
