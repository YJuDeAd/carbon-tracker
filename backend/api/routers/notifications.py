from fastapi import APIRouter, Depends, HTTPException, status
from core.database import get_supabase_client
from supabase import Client
from core.security import get_current_user_id
from models.notification import NotificationReminder
from datetime import date
from services.gamification_service import calculate_streak

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/reminders", response_model=NotificationReminder)
def get_daily_reminder(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Returns data for a daily reminder push notification.
    Personalizes the message based on current streak and if an activity was already logged today.
    """
    try:
        # Check if user has logged today
        today_str = date.today().isoformat()
        resp = supabase.table("activities").select("id").eq("user_id", user_id).eq("date", today_str).execute()
        has_logged_today = len(resp.data) > 0

        # Get user streak
        current_streak = calculate_streak(user_id, supabase)

        if has_logged_today:
            return NotificationReminder(
                title="Great job today! 🌿",
                body=f"You've already logged your activities. Your {current_streak}-day streak is safe!",
                streak_active=True
            )
        else:
            if current_streak > 0:
                return NotificationReminder(
                    title="Keep your streak alive! 🔥",
                    body=f"You're on a {current_streak}-day streak. Log an activity today to keep it going!",
                    streak_active=True
                )
            else:
                return NotificationReminder(
                    title="Time to track your impact! 🌍",
                    body="Log your first activity today and start building a new streak.",
                    streak_active=False
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate reminder: {str(e)}")
