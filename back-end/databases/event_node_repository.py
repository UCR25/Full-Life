import os
import json
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from models.event_node import EventNode, EventNodeCreate

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
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        serialized = self._serialize(doc)

        # Write to seeds file (excluding _id)
        try:
            with open(SEEDS_FILE, "r", encoding="utf-8") as f:
                seeds = json.load(f)
                if not isinstance(seeds, list):
                    seeds = []
        except (FileNotFoundError, json.JSONDecodeError):
            seeds = []

        seed_copy = serialized.copy()
        seed_copy.pop("_id", None)
        seeds.append(seed_copy)

        os.makedirs(os.path.dirname(SEEDS_FILE), exist_ok=True)
        with open(SEEDS_FILE, "w", encoding="utf-8") as f:
            json.dump(seeds, f, indent=2, default=str)

        return serialized

    async def get_by_user_id(self, user_id: str) -> List[dict]:
        cursor = self.collection.find({"user_ID": user_id}).sort("event_list_ID", -1)
        return [doc async for doc in cursor]

    async def get_by_user_and_event_list_id(self, user_id: str, event_list_ID: str) -> List[dict]:
        cursor = self.collection.find({"user_ID": user_id, "event_list_ID": event_list_ID})
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
        events = await self.get_by_user_id(user_id)
        existing_ids = {e["event_list_ID"] for e in events}
        nums = [int(eid) for eid in existing_ids if eid.isdigit()]
        return str(max(nums) + 1) if nums else "1"

    async def get_all_event_lists_grouped_by_user(self, user_id: str) -> List[dict]:
        cursor = self.collection.aggregate([
            {
                "$match": {
                    "user_ID": user_id,
                    "event_list_ID": {"$ne": "0"}  # exclude "0"
                }
            },
            {"$sort": {"event_list_ID": -1}},
            {
                "$group": {
                    "_id": "$event_list_ID",
                    "events": {"$push": "$$ROOT"}
                }
            },
            {"$sort": {"_id": -1}}
        ])
        results = []
        async for doc in cursor:
            if isinstance(doc["_id"], ObjectId):
                doc["_id"] = str(doc["_id"])
            for event in doc.get("events", []):
                if "_id" in event and isinstance(event["_id"], ObjectId):
                    event["_id"] = str(event["_id"])
            results.append(doc)
        return results


    async def save_event_nodes_and_get_grouped(self, user_id: str, nodes: List[EventNodeCreate]) -> List[dict]:
        new_id = await self.generate_new_event_list_id(user_id)
        for node in nodes:
            node.event_list_ID = new_id
            await self.create(node.dict())
        return await self.get_all_event_lists_grouped_by_user(user_id)

