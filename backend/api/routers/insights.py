from fastapi import APIRouter, Depends
from core.security import get_current_user_id
from models.insight import InsightResponse
from services import groq_service

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("", response_model=InsightResponse)
def get_insights(user_id: str = Depends(get_current_user_id)):
    """
    Get weekly AI-generated insights based on user activity.
    Uses cached insights if less than 7 days old.
    """
    return groq_service.get_weekly_insights(user_id)
