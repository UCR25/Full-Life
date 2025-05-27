from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

class EventRepository:
    """
    CRUD operations on the 'events' collection.
    Serializes Mongo documents into the shape of EventNodeOut.
    """
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    @staticmethod
    def _serialize(doc: dict) -> dict:
        return {
            "_id": str(doc.get("_id")),
            "user_ID": str(doc.get("user_ID")),
            "event_list_ID": doc.get("event_list_ID"),
            "user_date_time": doc.get("user_date_time"),
            "index": doc.get("index"),
            "name": doc.get("name"),
            "address": doc.get("address"),
            "description": doc.get("description"),
            "startTime": doc.get("startTime"),
            "endTime": doc.get("endTime"),
            "categories": doc.get("categories", []),
        }

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(doc)

    async def get_by_user_id(self, user_ID: str) -> List[dict]:
        cursor = self.collection.find({"user_ID": user_ID})
        return [self._serialize(doc) async for doc in cursor]

    async def get_by_user_and_event_list_id(self, user_ID: str, event_list_ID: str) -> List[dict]:
        cursor = self.collection.find({
            "user_ID": user_ID,
            "event_list_ID": event_list_ID
        })
        return [self._serialize(doc) async for doc in cursor]

    async def get_by_name(self, name: str) -> Optional[List[dict]]:
        cursor = self.collection.find({"name": name})
        results = [self._serialize(doc) async for doc in cursor]
        return results if results else None

    async def get_by_categories(self, categories: List[str]) -> Optional[List[dict]]:
        cursor = self.collection.find({"categories": {"$in": categories}})
        results = [self._serialize(doc) async for doc in cursor]
        return results if results else None

    async def get_by_time_range(self, start_time: datetime, end_time: datetime) -> Optional[List[dict]]:
        cursor = self.collection.find({
            "startTime": {"$gte": start_time},
            "endTime": {"$lte": end_time}
        })
        results = [self._serialize(doc) async for doc in cursor]
        return results if results else None

    async def update_by_event_list_ID(self, id: str, update_data: dict) -> Optional[dict]:
        res = await self.collection.update_one(
            {"event_list_ID": id},
            {"$set": update_data}
        )
        if not res.matched_count:
            return None
        doc = await self.collection.find_one({"event_list_ID": id})
        return self._serialize(doc) if doc else None

    async def delete_event_by_event_list_ID(self, id: str) -> bool:
        res = await self.collection.delete_one({"event_list_ID": id})
        return res.deleted_count == 1

    async def delete_by_user_id(self, user_id: str) -> bool:
        res = await self.collection.delete_many({"user_ID": user_id})
        return res.deleted_count > 0

    async def list_all(self) -> List[dict]:
        cursor = self.collection.find({})
        return [self._serialize(doc) async for doc in cursor]
