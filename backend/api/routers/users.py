from fastapi import APIRouter, Depends, HTTPException, status
from core.database import supabase
from core.security import get_current_user_id
from models.user import UserResponse, GamificationResponse, BaselineRequest, DashboardResponse, DailyTrend, LeaderboardEntry
from datetime import datetime, timedelta

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user_id: str = Depends(get_current_user_id)):
    """
    Fetch the current authenticated user's profile from the Supabase public.users table.
    """
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    return response.data[0]

from services.gamification_service import calculate_streak
@router.get("/me/gamification", response_model=GamificationResponse)
def get_user_gamification(user_id: str = Depends(get_current_user_id)):
    """
    Fetch the user's gamification stats (streak, total logs, unlocked badges).
    """
    
    # Total logs
    resp = supabase.table("activities").select("id").eq("user_id", user_id).execute()
    total_logs = len(resp.data or [])
    
    # Streak
    streak = calculate_streak(user_id)
    
    # Badges
    ach_resp = supabase.table("achievements").select("badge_type").eq("user_id", user_id).execute()
    unlocked_badges = [a["badge_type"] for a in (ach_resp.data or [])]
    
    return GamificationResponse(
        current_streak=streak,
        total_logs=total_logs,
        unlocked_badges=unlocked_badges
    )

@router.put("/me/baseline", response_model=UserResponse)
def calculate_and_save_baseline(req: BaselineRequest, user_id: str = Depends(get_current_user_id)):
    # Simple heuristic baseline calculator (kg CO2e per week)
    diet_map = {"Meat Lover": 57.7, "Average": 38.5, "Vegetarian": 19.2, "Vegan": 9.6}
    diet_co2 = diet_map.get(req.diet, 38.5)
    
    commute_co2 = req.commute_miles * 0.4
    
    energy_map = {"Grid Electricity": 80.0, "Solar Panels": 10.0, "Natural Gas": 60.0, "Mixed": 70.0}
    energy_co2 = energy_map.get(req.energy_source, 70.0)
    
    weekly_baseline = diet_co2 + commute_co2 + energy_co2
    
    resp = supabase.table("users").update({"baseline_score": weekly_baseline}).eq("id", user_id).execute()
    if not resp.data:
        raise HTTPException(status_code=400, detail="Failed to update baseline")
    return resp.data[0]

@router.get("/me/dashboard", response_model=DashboardResponse)
def get_dashboard_stats(user_id: str = Depends(get_current_user_id)):
    # Get user baseline
    user_resp = supabase.table("users").select("baseline_score").eq("id", user_id).execute()
    if not user_resp.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    raw_baseline = user_resp.data[0].get("baseline_score")
    baseline_score = float(raw_baseline) if raw_baseline is not None else 0.0
    
    # Get activities from the last 7 days
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    
    act_resp = supabase.table("activities").select("date, co2e_kg").eq("user_id", user_id).gte("date", seven_days_ago.isoformat()).execute()
    activities = act_resp.data or []
    
    this_week_co2e = sum(float(a["co2e_kg"]) for a in activities)
    
    percent_diff = None
    if baseline_score and baseline_score > 0:
        percent_diff = ((this_week_co2e - baseline_score) / baseline_score) * 100
        
    # Group by day for the trend chart
    # Initialize last 7 days
    trend_dict = {}
    for i in range(7):
        d = (now - timedelta(days=6-i)).strftime("%Y-%m-%d")
        trend_dict[d] = 0.0
        
    for a in activities:
        date_str = a["date"][:10]
        if date_str in trend_dict:
            trend_dict[date_str] += float(a["co2e_kg"])
            
    weekly_trend = [DailyTrend(date=k, co2e_kg=v) for k, v in trend_dict.items()]
    
    return DashboardResponse(
        this_week_co2e=this_week_co2e,
        baseline_score=baseline_score,
        percent_diff=percent_diff,
        weekly_trend=weekly_trend
    )

@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_community_leaderboard(user_id: str = Depends(get_current_user_id)):
    """
    Fetch the top 10 users ranked by lowest baseline score.
    """
    resp = supabase.table("users").select("id, email, baseline_score").not_.is_("baseline_score", "null").order("baseline_score").limit(10).execute()
    users = resp.data or []
    
    leaderboard = []
    for i, u in enumerate(users):
        rank = i + 1
        is_current = u["id"] == user_id
        
        if rank == 1:
            color = "text-yellow-500"
        elif is_current:
            color = "text-blue-500"
        else:
            color = "text-muted-foreground"
            
        if is_current:
            name = "Eco Warrior (You)"
        else:
            email = u.get("email", "")
            name = email.split("@")[0] if "@" in email else "Eco User"
            
        score = float(u["baseline_score"])
        
        leaderboard.append(LeaderboardEntry(
            name=name,
            score=round(score, 1),
            rank=rank,
            is_current_user=is_current,
            color=color
        ))
        
    return leaderboard

