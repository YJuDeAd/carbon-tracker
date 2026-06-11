from fastapi import APIRouter, Depends, HTTPException, status
from core.database import supabase
from core.security import get_current_user_id
from models.activity import ActivityCreate, ActivityResponse

router = APIRouter(prefix="/activities", tags=["activities"])

@router.post("", response_model=ActivityResponse)
def log_activity(activity: ActivityCreate, user_id: str = Depends(get_current_user_id)):
    """
    Log a new activity. The CO2e footprint is calculated on the backend
    by looking up the emission factor for the given category/activity_type.
    """
    # 1. Fetch the emission factor
    factor_resp = supabase.table("emission_factors").select("*") \
        .eq("category", activity.category.title()) \
        .eq("activity_type", activity.activity_type) \
        .execute()
        
    if not factor_resp.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No emission factor found for category '{activity.category}' and type '{activity.activity_type}'"
        )
        
    factor = factor_resp.data[0]
    co2e_per_unit = factor["co2e_per_unit"]
    
    # 2. Calculate footprint
    calculated_co2e_kg = activity.quantity * co2e_per_unit
    
    # 3. Insert activity
    insert_data = {
        "user_id": user_id,
        "date": activity.date.isoformat(),
        "category": activity.category,
        "activity_type": activity.activity_type,
        "co2e_kg": calculated_co2e_kg,
        "notes": activity.notes
    }
    
    insert_resp = supabase.table("activities").insert(insert_data).execute()
    if not insert_resp.data:
        raise HTTPException(status_code=500, detail="Failed to insert activity")
        
    return insert_resp.data[0]

@router.get("", response_model=list[ActivityResponse])
def get_activities(user_id: str = Depends(get_current_user_id)):
    """
    Fetch all logged activities for the current user.
    """
    response = supabase.table("activities").select("*").eq("user_id", user_id).order("date", desc=True).execute()
    return response.data
