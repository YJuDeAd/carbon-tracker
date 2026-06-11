from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Literal

Category = Literal["food", "transport", "energy", "shopping", "travel"]

class ActivityCreate(BaseModel):
    date: date
    category: Category
    activity_type: str = Field(..., description="E.g., 'beef_meal', 'car_gasoline', 'electricity'")
    quantity: float = Field(..., gt=0, description="Quantity of the activity (e.g. miles, kWh, meals)")
    notes: str | None = None

class ActivityResponse(BaseModel):
    id: str
    user_id: str
    date: date
    category: Category
    activity_type: str
    co2e_kg: float
    notes: str | None = None
    
    model_config = ConfigDict(from_attributes=True)
