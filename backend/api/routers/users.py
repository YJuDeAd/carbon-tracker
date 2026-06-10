from fastapi import APIRouter, Depends, HTTPException, status
from core.database import supabase
from core.security import get_current_user_id
from models.user import UserResponse

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
