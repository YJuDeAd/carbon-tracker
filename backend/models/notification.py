from pydantic import BaseModel

class NotificationReminder(BaseModel):
    title: str
    body: str
    streak_active: bool
