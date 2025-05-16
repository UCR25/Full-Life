# profile_repository.py

from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection

class ProfileRepository:
    """
    Repository for CRUD operations on the 'profiles' collection,
    keyed by the auth-service user_id.
    """
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        """
        Convert a MongoDB document into a JSON-serializable dict,
        matching ProfileOut (user_id, username, email, hobbies).
        """
        return {
            "user_id": doc.get("user_id"),
            "username": doc.get("username"),
            "email":    doc.get("email"),
            "hobbies":  doc.get("hobbies", []),
        }

    async def create(self, data: dict) -> dict:
        """
        Insert a new profile and return the created document.
        """
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(doc)

    async def get_by_user_id(self, user_id: str) -> Optional[dict]:
        """
        Retrieve a profile by its auth-service user_id.
        """
        doc = await self.collection.find_one({"user_id": user_id})
        return self._serialize(doc) if doc else None

    async def update_by_user_id(self, user_id: str, update_data: dict) -> Optional[dict]:
        """
        Update an existing profile (matched by user_id) and return the updated document.
        """
        result = await self.collection.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        if not result.matched_count:
            return None
        doc = await self.collection.find_one({"user_id": user_id})
        return self._serialize(doc)

    async def delete_by_user_id(self, user_id: str) -> bool:
        """
        Delete a profile by its user_id.
        """
        result = await self.collection.delete_one({"user_id": user_id})
        return result.deleted_count == 1

    async def list_all(self) -> List[dict]:
        """
        Retrieve all profiles.
        """
        profiles: List[dict] = []
        cursor = self.collection.find({})
        async for doc in cursor:
            profiles.append(self._serialize(doc))
        return profiles
