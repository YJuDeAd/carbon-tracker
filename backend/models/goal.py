from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Literal

Category = Literal["food", "transport", "energy", "shopping", "travel"]
Status = Literal["active", "completed", "failed"]

class GoalCreate(BaseModel):
    category: Category
    target_co2e: float = Field(..., gt=0, description="Target CO2e reduction in kg")
    deadline: date
    status: Status = "active"

class GoalResponse(GoalCreate):
    id: str
    user_id: str
    
    model_config = ConfigDict(from_attributes=True)
