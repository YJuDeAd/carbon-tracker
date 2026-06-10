from pydantic import BaseModel, ConfigDict
from datetime import datetime, date

class InsightResponse(BaseModel):
    id: str
    user_id: str
    week_start: date
    tips_json: list[str]
    generated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
