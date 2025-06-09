# back-end/databases/event_node_seeds.py

import os
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    mongo_url = os.getenv(
        "MONGODB_URL",
        "mongodb://mongo:27017/Full-Life-Databases"
    )
    client = AsyncIOMotorClient(mongo_url)
    db_name = mongo_url.rsplit("/", 1)[-1] or "test"
    db      = client[db_name]
    coll    = db.get_collection("event_nodes")

    # 1) Count before deletion
    before = await coll.count_documents({})
    print(f"🔍 before wipe: {before} documents in events")

    # 2) Wipe the collection
    result = await coll.delete_many({})
    print(f"🗑 wiped {result.deleted_count} documents")

    # 3) Count after deletion
    after = await coll.count_documents({})
    print(f"🔍 after wipe: {after} documents in events")

    # 4) Load seed JSON
    seed_path = "databases/event_node_seeds.json"
    if not os.path.exists(seed_path):
        print(f"❌ Seed file not found at {seed_path}")
        client.close()
        return

    with open(seed_path) as f:
        docs = json.load(f)

    # 5) Insert each document
    for doc in docs:
        # Normalize 'user_ID' field if missing but 'user_id' present
        doc["user_ID"] = doc.get("user_ID") or doc.pop("user_id", None) or doc.pop("id", None)

            
        user_ID = doc.get("user_ID")
        if not user_ID:
            print("⚠ skipping entry with no owner:", doc)
            continue

        doc.pop("_id", None)  # Avoid extra fields
        print("📦 Sending doc to Pydantic:", doc)


        # Insert the document as is
        await coll.insert_one(doc)
        print(f"✔ inserted event for user={user_ID}")


    # 6) Final count
    final = await coll.count_documents({})
    print(f"✅ final count: {final} documents in events")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
