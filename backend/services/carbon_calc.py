from supabase import Client
from models.user import BaselineRequest

def calculate_weekly_baseline(req: BaselineRequest, supabase: Client) -> float:
    # Fetch heuristic baseline factors from DB
    factors_resp = supabase.table("emission_factors").select("category, activity_type, co2e_per_unit").in_(
        "category", ["Baseline Diet", "Baseline Energy", "Baseline Commute"]
    ).execute()
    
    factors = factors_resp.data or []
    
    diet_co2 = 38.5  # fallback
    energy_co2 = 70.0  # fallback
    commute_multiplier = 0.4  # fallback
    
    for f in factors:
        cat = f["category"]
        act = f["activity_type"]
        val = float(f["co2e_per_unit"])
        
        if cat == "Baseline Diet" and act == req.diet:
            diet_co2 = val
        elif cat == "Baseline Energy" and act == req.energy_source:
            energy_co2 = val
        elif cat == "Baseline Commute" and act == "Average Car":
            commute_multiplier = val
            
    commute_co2 = req.commute_miles * commute_multiplier
    return diet_co2 + commute_co2 + energy_co2
