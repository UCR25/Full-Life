# back-end/databases/profile_repository.py

import os
import json
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from models.profile import ProfileBase

# Always load/write profile_seeds.json sitting next to this .py file
SEEDS_FILE = os.path.join(os.path.dirname(__file__), "profile_seeds.json")

class ProfileRepository:
    """
    CRUD operations on the 'profiles' collection.
    Serializes Mongo documents into the shape of ProfileOut.
    Also appends new profiles to the local profile_seeds.json on creation.
    """
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        if "_id" in doc and isinstance(doc["_id"], ObjectId):
            doc["_id"] = str(doc["_id"])
        # Convert to Pydantic ProfileBase and serialize to dict
        return ProfileBase(**doc).model_dump()

    async def create(self, data: dict) -> dict:
        # 1) Insert into MongoDB
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        serialized = self._serialize(doc)

        # 2) Append to local seeds file
        try:
            with open(SEEDS_FILE, "r", encoding="utf-8") as f:
                seeds = json.load(f)
                if not isinstance(seeds, list):
                    seeds = []
        except (FileNotFoundError, json.JSONDecodeError):
            seeds = []

        seeds.append(serialized)

        # Ensure the directory exists and write updated seeds
        os.makedirs(os.path.dirname(SEEDS_FILE), exist_ok=True)
        with open(SEEDS_FILE, "w", encoding="utf-8") as f:
            json.dump(seeds, f, indent=2)

        return serialized

    async def get_by_user_id(self, user_id: str) -> Optional[dict]:
        doc = await self.collection.find_one({"user_id": user_id})
        return self._serialize(doc) if doc else None

    async def update_by_user_id(self, user_id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        if not res.matched_count:
            return None
        doc = await self.collection.find_one({"user_id": user_id})
        return self._serialize(doc)

    async def delete_by_user_id(self, user_id: str) -> bool:
        res = await self.collection.delete_one({"user_id": user_id})
        return res.deleted_count == 1

    async def list_all(self) -> List[dict]:
        cursor = self.collection.find({})
        return [self._serialize(doc) async for doc in cursor]
