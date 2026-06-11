from datetime import date, timedelta
from core.database import supabase

def calculate_streak(user_id: str) -> int:
    # Fetch unique dates of activities
    resp = supabase.table("activities").select("date").eq("user_id", user_id).order("date", desc=True).execute()
    if not resp.data:
        return 0
        
    dates = sorted(list(set(r["date"] for r in resp.data)), reverse=True)
    
    current_date = date.today()
    streak = 0
    
    # if latest activity is not today or yesterday, streak is 0
    latest_date = date.fromisoformat(dates[0])
    if (current_date - latest_date).days > 1:
        return 0
        
    # count backwards
    expected_date = latest_date
    for d_str in dates:
        d = date.fromisoformat(d_str)
        if d == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        else:
            break
            
    return streak

def check_and_award_badges(user_id: str):
    # Fetch all activities
    resp = supabase.table("activities").select("category").eq("user_id", user_id).execute()
    activities = resp.data or []
    total_logs = len(activities)
    
    # Calculate streak
    streak = calculate_streak(user_id)
    
    # Determine which badges should be unlocked
    unlocked = set()
    if total_logs >= 1:
        unlocked.add("First Step")
    if total_logs >= 5:
        unlocked.add("Forest Guard")
    if total_logs >= 10:
        unlocked.add("Champion")
    if streak >= 3:
        unlocked.add("Eco Star")
        
    categories = set(a["category"].lower() for a in activities)
    if "energy" in categories:
        unlocked.add("Energy Saver")
    if "transport" in categories:
        unlocked.add("Green Ride")
        
    # Fetch existing achievements
    ach_resp = supabase.table("achievements").select("badge_type").eq("user_id", user_id).execute()
    existing = set(a["badge_type"] for a in (ach_resp.data or []))
    
    # Award new ones
    new_badges = unlocked - existing
    if new_badges:
        inserts = [{"user_id": user_id, "badge_type": b} for b in new_badges]
        supabase.table("achievements").insert(inserts).execute()
