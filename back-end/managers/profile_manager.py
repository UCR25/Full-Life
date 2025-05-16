from bson import ObjectId
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection

from mongo_client import profiles_collection

def serialize_profile(doc: dict) -> dict:
    """
    Convert a MongoDB profile document into a JSON-serializable dict,
    matching ProfileOut (user_id, username, email, hobbies).
    """
    return {
        "user_id": doc.get("user_id"),
        "username": doc.get("username"),
        "email":    doc.get("email"),
        "hobbies":  doc.get("hobbies", []),
    }

async def create_profile(
    data: dict,
    collection: AsyncIOMotorCollection = profiles_collection
) -> dict:
    """
    Insert a new profile document and return the created profile.
    """
    result = await collection.insert_one(data)
    doc = await collection.find_one({ "_id": result.inserted_id })
    return serialize_profile(doc)

async def get_profile(
    profile_id: str,
    collection: AsyncIOMotorCollection = profiles_collection
) -> Optional[dict]:
    """
    Retrieve a single profile by its MongoDB ObjectId string.
    Returns None if not found.
    """
    doc = await collection.find_one({ "_id": ObjectId(profile_id) })
    return serialize_profile(doc) if doc else None

async def update_profile(
    profile_id: str,
    update_data: dict,
    collection: AsyncIOMotorCollection = profiles_collection
) -> Optional[dict]:
    """
    Update fields of a profile and return the updated document.
    Returns None if the profile does not exist.
    """
    result = await collection.update_one(
        { "_id": ObjectId(profile_id) },
        { "$set": update_data }
    )
    if result.matched_count:
        doc = await collection.find_one({ "_id": ObjectId(profile_id) })
        return serialize_profile(doc)
    return None

async def delete_profile(
    profile_id: str,
    collection: AsyncIOMotorCollection = profiles_collection
) -> bool:
    """
    Delete a profile by its ID.
    Returns True if a document was deleted.
    """
    result = await collection.delete_one({ "_id": ObjectId(profile_id) })
    return result.deleted_count == 1

async def list_profiles(
    collection: AsyncIOMotorCollection = profiles_collection
) -> List[dict]:
    """
    Retrieve all profiles.
    """
    profiles: List[dict] = []
    cursor = collection.find({})
    async for doc in cursor:
        profiles.append(serialize_profile(doc))
    return profiles
