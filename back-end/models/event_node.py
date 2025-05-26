from pydantic import BaseModel, Field
from typing import Optional, List
from category import Category
from typing   import list
from datetime import datetime

class EventNode(BaseModel):
    user_ID: str # List of user IDs associated with the event
    event_list_num: int
    event_ID: str
    index: int
    name: str
    address: str
    description: str
    startTime: datetime
    endTime: datetime
    categories: List[str] = Field(default_factory=list)
    
class EventNodeBuilder:
    def __init__(self):
        self._event_data = {}

    def set_title(self, title: str):
        self._event_data["title"] = title
        return self

    def set_description(self, description: str):
        self._event_data["description"] = description
        return self

    #year, month, day, hour, minute
    def set_start_time(self, start_time: datetime):
        self._event_data["start_time"] = start_time
        return self

    def set_end_time(self, end_time: datetime):
        self._event_data["end_time"] = end_time
        return self

    def set_location(self, location: str):
        self._event_data["location"] = location
        return self

    def set_creator(self, created_by: str):
        self._event_data["created_by"] = created_by
        return self

    def build(self) -> EventNode:
        return EventNode(**self._event_data)

        
#event node manager makes nodes from the event node database
#back builder 