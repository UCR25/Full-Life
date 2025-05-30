from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EventNode(BaseModel):
    user_ID: str = Field(..., description="Google Auth-service user ID")
    event_list_ID: str = Field(..., description="Unique event list ID")
    user_date_time: Optional[datetime] = Field(None, description="The day that the user wants to attend the event")
    name: str = Field(..., description="Name of the event")
    address: str = Field(..., description="Address where the event will take place")
    description: str = Field(..., description="Description of the event")
    startTime: datetime = Field(..., description="Start time of the event")
    endTime: datetime = Field(..., description="End time of the event")
    categories: List[str] = Field(default_factory=list, description="Categories associated with the event")


class EventNodeCreate(EventNode):
    """
    Payload for creating an event node.
    """

class EventNodeOut(EventNode):
    """
    Payload for updating an event node.
    """
    class Config:
        orm_mode = True


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

