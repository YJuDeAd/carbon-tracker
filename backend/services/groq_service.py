import json
from datetime import datetime, timedelta, date, timezone
from groq import Groq
from core.config import settings
from supabase import Client
from models.insight import InsightResponse

groq_client = Groq(api_key=settings.GROQ_API_KEY)

def get_weekly_insights(user_id: str, supabase: Client) -> InsightResponse:
    # 1. Check cache
    insights_resp = supabase.table("insights").select("*").eq("user_id", user_id).order("generated_at", desc=True).limit(1).execute()
    latest_insight = insights_resp.data[0] if insights_resp.data else None
    
    now_utc = datetime.now(timezone.utc)
    
    if latest_insight:
        # Handle Supabase timestamp string with 'Z' or '+00:00'
        ts_str = latest_insight["generated_at"].replace("Z", "+00:00")
        try:
            generated_at = datetime.fromisoformat(ts_str)
            if (now_utc - generated_at).days < 7:
                return InsightResponse(**latest_insight)
        except ValueError:
            pass # Ignore parsing errors and generate a new one
            
    # 2. Summarize activity
    seven_days_ago_date = date.today() - timedelta(days=7)
    
    summary_resp = supabase.rpc("get_user_category_summary", {
        "p_user_id": user_id, 
        "p_start_date": seven_days_ago_date.isoformat()
    }).execute()
    
    summary = {}
    if summary_resp.data:
        for row in summary_resp.data:
            summary[row["category"]] = float(row["total_co2e"])
        
    if summary:
        summary_text = ", ".join([f"{cat}: {co2e:.2f} kg CO2e" for cat, co2e in summary.items()])
    else:
        summary_text = "No activities logged in the past 7 days."
        
    prompt = f"""
You are an expert sustainability coach. Based on the following weekly carbon footprint summary, provide exactly 3 short, actionable, and personalized tips to help reduce emissions.
Make them encouraging and positive. 
Return ONLY a valid JSON array of 3 strings. Do not include markdown code blocks or any other text.
Summary: {summary_text}
"""

    tips = []
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3-8b-instruct",
            temperature=0.7,
        )
        content = chat_completion.choices[0].message.content.strip()
        # Clean up in case the model returned code blocks anyway
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        tips = json.loads(content)
        if not isinstance(tips, list) or len(tips) != 3:
            raise ValueError("Invalid response format")
    except Exception as e:
        # Fallback to cached insight even if it's older than 7 days
        if latest_insight:
            tips = latest_insight["tips_json"]
        else:
            tips = [
                "Try incorporating one more plant-based meal into your diet this week.",
                "Consider carpooling, biking, or taking public transit for your next commute.",
                "Unplug electronics when not in use to save energy and reduce your footprint."
            ]

    # 3. Save to DB
    week_start = date.today() - timedelta(days=date.today().weekday())
    
    insert_data = {
        "user_id": user_id,
        "week_start": week_start.isoformat(),
        "tips_json": tips,
        "generated_at": now_utc.isoformat()
    }
    
    insert_resp = supabase.table("insights").insert(insert_data).execute()
    
    if not insert_resp.data:
        # Fallback if DB insert fails
        insert_data["id"] = "temp-" + str(now_utc.timestamp())
        return InsightResponse(**insert_data)
        
    return InsightResponse(**insert_resp.data[0])
