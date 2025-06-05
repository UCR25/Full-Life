# back-end/databases/event_node_repository.py

import os
import json
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from models.event_node import EventNode  

# Always load/write event_node_seeds.json sitting next to this .py file 
SEEDS_FILE = os.path.join(os.path.dirname(__file__), "event_node_seeds.json")


class EventRepository:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return EventNode(**doc).dict()

    async def create(self, data: dict) -> dict:
        # 1) Insert into MongoDB
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        serialized = self._serialize(doc)
        serialized["_id"] = str(doc["_id"])  # Ensure ID is string for testing compatibility

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
            json.dump(seeds, f, indent=2, default=str)

        return serialized


    async def get_by_user_id(self, user_id: str) -> List[dict]:
        cursor = self.collection.find({"user_ID": user_id}).sort("event_list_ID", -1)
        return [doc async for doc in cursor]

    async def get_by_user_and_event_list_id(self, user_id: str, event_list_ID: str) -> List[dict]:
        cursor = self.collection.find({
            "user_ID": user_id,
            "event_list_ID": event_list_ID
        })
        return [doc async for doc in cursor]

    async def get_by_name(self, name: str) -> Optional[List[dict]]:
        cursor = self.collection.find({"name": name})
        return [doc async for doc in cursor]

    async def get_by_categories(self, categories: List[str]) -> Optional[List[dict]]:
        cursor = self.collection.find({"categories": {"$in": categories}})
        return [doc async for doc in cursor]

    async def update_by_id(self, event_id: str, update_data: dict) -> Optional[dict]:
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(event_id)},
            {"$set": update_data},
            return_document=True
        )
        return result

    async def update_by_user_id(self, user_id: str, update_data: dict) -> Optional[dict]:
        result = await self.collection.find_one_and_update(
            {"user_ID": user_id},
            {"$set": update_data},
            return_document=True
        )
        return result

    async def update_by_event_id(self, event_list_ID: str, update_data: dict) -> Optional[dict]:
        result = await self.collection.find_one_and_update(
            {"event_list_ID": event_list_ID},
            {"$set": update_data},
            return_document=True
        )
        return result

    async def generate_new_event_list_id(self, user_id: str) -> str:
        """
        Generate a new incremented event_list_ID based on the user's existing events.
        """
        events = await self.get_by_user_id(user_id)
        existing_ids = {e["event_list_ID"] for e in events}
        nums = [int(eid) for eid in existing_ids if eid.isdigit()]
        return str(max(nums) + 1) if nums else "1"

    from bson import ObjectId

    async def get_all_event_lists_grouped_by_user(self, user_id: str) -> List[dict]:
        cursor = self.collection.aggregate([
            {"$match": {"user_ID": user_id}},
            {"$sort": {"event_list_ID": -1}},
            {"$group": {
                "_id": "$event_list_ID",
                "events": {"$push": "$$ROOT"}
            }},
            {"$sort": {"_id": -1}}  # Ensures the event_list_IDs are ordered newest to oldest
        ])
        results = []
        async for doc in cursor:
            # Convert group _id to string if necessary
            if isinstance(doc["_id"], ObjectId):
                doc["_id"] = str(doc["_id"])
            # Convert all event _id fields to strings
            for event in doc.get("events", []):
                if "_id" in event and isinstance(event["_id"], ObjectId):
                    event["_id"] = str(event["_id"])
            results.append(doc)
        return results

