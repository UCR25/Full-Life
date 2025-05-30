# profile_manager.py

from typing import Dict, Optional, List
from databases.profile_repository import ProfileRepository
from databases.mongo_client import profiles_collection

# single repo instance
_repo = ProfileRepository(profiles_collection)

async def create_profile(data: dict) -> dict:
    """
    Business-logic hook for creating a profile.
    """
    return await _repo.create(data)

async def get_profile_by_id(profile_id: str) -> Optional[dict]:
    """
    Fetch a profile by its MongoDB _id.
    """
    return await _repo.get_by_id(profile_id)

async def get_profile_by_user_id(user_id: str) -> Optional[dict]:
    """
    Fetch a profile by the auth-service user_id.
    """
    return await _repo.get_by_user_id(user_id)

async def update_profile_by_id(profile_id: str, update_data: dict) -> Optional[dict]:
    """
    Update a profile’s fields by its MongoDB _id.
    """
    return await _repo.update_by_id(profile_id, update_data)

async def update_profile_by_user_id(user_id: str, update_data: dict) -> Optional[dict]:
    """
    Update a profile’s fields by auth-service user_id.
    """
    return await _repo.update_by_user_id(user_id, update_data)

async def delete_profile_by_id(profile_id: str) -> bool:
    """
    Delete a profile by its MongoDB _id.
    """
    return await _repo.delete_by_id(profile_id)

async def delete_profile_by_user_id(user_id: str) -> bool:
    """
    Delete a profile by auth-service user_id.
    """
    return await _repo.delete_by_user_id(user_id)

async def list_profiles() -> List[dict]:
    """
    List all profiles.
    """
    return await _repo.list_all()
