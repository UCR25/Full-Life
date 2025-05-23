# profile_repository.py

from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

class ProfileRepository:
    """
    CRUD operations on the 'profiles' collection.
    Serializes Mongo documents into the shape of ProfileOut.
    """
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        return {
            "id":        str(doc.get("google_auth_id")),
            "username":  doc.get("username"),
            "email":     doc.get("email"),
            "hobbies":   doc.get("hobbies", []),
            "picture":   doc.get("picture"),
        }

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({ "_id": result.inserted_id })
        return self._serialize(doc)

    async def get_by_id(self, id: str) -> Optional[dict]:
        doc = await self.collection.find_one({ "_id": ObjectId(id) })
        return self._serialize(doc) if doc else None

    async def get_by_user_id(self, user_id: str) -> Optional[dict]:
        doc = await self.collection.find_one({ "user_id": user_id })
        return self._serialize(doc) if doc else None

    async def update_by_id(self, id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            { "_id": ObjectId(id) },
            { "$set": update_data }
        )
        if not res.matched_count:
            return None
        doc = await self.collection.find_one({ "_id": ObjectId(id) })
        return self._serialize(doc)

    async def update_by_user_id(self, user_id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            { "user_id": user_id },
            { "$set": update_data }
        )
        if not res.matched_count:
            return None
        doc = await self.collection.find_one({ "user_id": user_id })
        return self._serialize(doc)

    async def delete_by_id(self, id: str) -> bool:
        res = await self.collection.delete_one({ "_id": ObjectId(id) })
        return res.deleted_count == 1

    async def delete_by_user_id(self, user_id: str) -> bool:
        res = await self.collection.delete_one({ "user_id": user_id })
        return res.deleted_count == 1

    async def list_all(self) -> List[dict]:
        cursor = self.collection.find({})
        return [self._serialize(doc) async for doc in cursor]
