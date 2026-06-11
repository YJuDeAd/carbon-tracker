from fastapi import APIRouter, Depends, HTTPException, status
from core.database import supabase
from core.security import get_current_user_id
from models.user import UserResponse, GamificationResponse

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
