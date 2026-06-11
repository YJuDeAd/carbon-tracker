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

class GoalUpdate(BaseModel):
    category: Category | None = None
    target_co2e: float | None = Field(None, gt=0, description="Target CO2e reduction in kg")
    deadline: date | None = None
    status: Status | None = None

class GoalResponse(GoalCreate):
    id: str
    user_id: str
    current_co2e: float = 0.0
    
    model_config = ConfigDict(from_attributes=True)
