from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QueryInput(BaseModel):
    user_ID: str
    lat: float
    lon: float
    user_date_time: Optional[datetime] = None
