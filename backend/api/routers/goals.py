from fastapi import APIRouter, Depends, HTTPException, status
from core.database import supabase
from core.security import get_current_user_id
from models.goal import GoalCreate, GoalResponse, GoalUpdate

router = APIRouter(prefix="/goals", tags=["goals"])

@router.post("", response_model=GoalResponse)
def create_goal(goal: GoalCreate, user_id: str = Depends(get_current_user_id)):
    insert_data = goal.model_dump()
    insert_data["user_id"] = user_id
    insert_data["deadline"] = insert_data["deadline"].isoformat()
    
    resp = supabase.table("goals").insert(insert_data).execute()
    if not resp.data:
        raise HTTPException(status_code=500, detail="Failed to create goal")
    return resp.data[0]

@router.get("", response_model=list[GoalResponse])
def get_goals(user_id: str = Depends(get_current_user_id)):
    resp = supabase.table("goals").select("*").eq("user_id", user_id).order("deadline", desc=False).execute()
    return resp.data

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: str, user_id: str = Depends(get_current_user_id)):
    resp = supabase.table("goals").select("*").eq("id", goal_id).eq("user_id", user_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Goal not found")
    return resp.data[0]

@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, updates: GoalUpdate, user_id: str = Depends(get_current_user_id)):
    resp = supabase.table("goals").select("*").eq("id", goal_id).eq("user_id", user_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    update_data = updates.model_dump(exclude_unset=True)
    if "deadline" in update_data and update_data["deadline"]:
        update_data["deadline"] = update_data["deadline"].isoformat()
        
    if not update_data:
        return resp.data[0]
        
    upd_resp = supabase.table("goals").update(update_data).eq("id", goal_id).eq("user_id", user_id).execute()
    if not upd_resp.data:
        raise HTTPException(status_code=500, detail="Failed to update goal")
    return upd_resp.data[0]

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: str, user_id: str = Depends(get_current_user_id)):
    resp = supabase.table("goals").select("id").eq("id", goal_id).eq("user_id", user_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    del_resp = supabase.table("goals").delete().eq("id", goal_id).eq("user_id", user_id).execute()
    if not hasattr(del_resp, 'data'):
        # Usually delete response might not have data depending on the PostgREST version,
        # but supabase-python usually sets data to the deleted row if requested, or empty list.
        pass
    return
