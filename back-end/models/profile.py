from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class ProfileBase(BaseModel):
    user_id:    str             = Field(..., description="Google Auth-service user ID")
    username: str             = Field(..., description="Username")
    email:      EmailStr        = Field(..., description="Email address")
    hobbies:    List[str]       = Field(
        default_factory=list,
        description="List of user hobbies"
    )
    picture: str            = Field(..., description="Picture from google")

class ProfileCreate(ProfileBase):
    """Payload for POST /profiles"""

class ProfileOut(ProfileBase):
    """What we could return when exposing the full profile"""
    class Config:
        orm_mode = True
