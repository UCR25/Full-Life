# back-end/profile_seed.py

import os
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    # pick up the same URL your FastAPI uses
    mongo_url = os.getenv("MONGODB_URL", "mongodb://mongo:27017/Full-Life-Databases")
    client = AsyncIOMotorClient(mongo_url)
    db_name = mongo_url.rsplit("/", 1)[-1] or "test"
    db = client[db_name]
    coll = db.get_collection("profiles")

    # load your JSON
    with open("profile_seed.json") as f:
        docs = json.load(f)

    # insert or upsert each profile
    for doc in docs:
        # if your JSON uses "id" instead of "user_id", rename:
        if "id" in doc and "user_id" not in doc:
            doc["user_id"] = doc.pop("id")

        await coll.update_one(
            {"user_id": doc["user_id"]},
            {"$set": doc},
            upsert=True
        )
        print(f"✔ seeded user_id={doc['user_id']}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(seed())
