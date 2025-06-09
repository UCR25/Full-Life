# back-end/databases/event_node_repository.py

import os
import json
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

# Always load/write event_node_seeds.json sitting next to this .py file
SEEDS_FILE = os.path.join(os.path.dirname(__file__), "event_node_seeds.json")

class EventRepository:
    """
    CRUD operations on the 'event_nodes' collection.
    Serializes Mongo documents and appends new entries to the local seed file on creation.
    """
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        return {
            "_id":            str(doc.get("_id")),
            "user_ID":        str(doc.get("user_ID")),
            "event_list_ID":  doc.get("event_list_ID"),
            "user_date_time": doc.get("user_date_time"),
            "index":          doc.get("index"),
            "name":           doc.get("name"),
            "address":        doc.get("address"),
            "description":    doc.get("description"),
            "startTime":      doc.get("startTime"),
            "endTime":        doc.get("endTime"),
            "categories":     doc.get("categories", []),
        }

    async def create(self, data: dict) -> dict:
        # 1) Insert into MongoDB
        result = await self.collection.insert_one(data)
        doc    = await self.collection.find_one({"_id": result.inserted_id})
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

        os.makedirs(os.path.dirname(SEEDS_FILE), exist_ok=True)
        with open(SEEDS_FILE, "w", encoding="utf-8") as f:
            json.dump(seeds, f, ensure_ascii=False, indent=2)

        return serialized

    async def get_by_user_id(self, user_id: str) -> List[dict]:
        cursor = self.collection.find({"user_ID": user_id})
        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def get_by_user_and_event_list_id(self, user_id: str, event_list_id: str) -> List[dict]:
        cursor = self.collection.find({
            "user_ID":       user_id,
            "event_list_ID": event_list_id
        })
        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def get_by_name(self, name: str) -> List[dict]:
        cursor = self.collection.find({"name": name})
        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def get_by_categories(self, categories: List[str]) -> List[dict]:
        cursor = self.collection.find({"categories": {"$in": categories}})
        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def update_by_id(self, event_id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": update_data}
        )
        if res.modified_count == 0:
            return None
        doc = await self.collection.find_one({"_id": ObjectId(event_id)})
        return self._serialize(doc)

    async def update_by_user_id(self, user_id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            {"user_ID": user_id},
            {"$set": update_data}
        )
        if res.matched_count == 0:
            return None
        doc = await self.collection.find_one({"user_ID": user_id})
        return self._serialize(doc)

    async def update_by_event_id(self, event_list_id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            {"event_list_ID": event_list_id},
            {"$set": update_data}
        )
        if res.matched_count == 0:
            return None
        doc = await self.collection.find_one({"event_list_ID": event_list_id})
        return self._serialize(doc)
