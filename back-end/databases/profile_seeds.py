# back-end/databases/profile_seeds.py

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
    coll    = db.get_collection("profiles")

    # 1) Count before deletion
    before = await coll.count_documents({})
    print(f"🔍 before wipe: {before} documents in profiles")

    # 2) Wipe the collection
    result = await coll.delete_many({})
    print(f"🗑 wiped {result.deleted_count} documents")

    # 3) Count after deletion
    after = await coll.count_documents({})
    print(f"🔍 after wipe: {after} documents in profiles")

    # 4) Load seed JSON
    seed_path = "databases/profile_seeds.json"
    if not os.path.exists(seed_path):
        print(f"❌ Seed file not found at {seed_path}")
        client.close()
        return

    with open(seed_path) as f:
        docs = json.load(f)

    # 5) Insert each document
    for doc in docs:
        # normalize id field if JSON uses "id" instead of "user_id"
        if "id" in doc and "user_id" not in doc:
            doc["user_id"] = doc.pop("id")

        uid = doc.get("user_id")
        if not uid:
            print("⚠ skipping entry with no user_id:", doc)
            continue

        doc["google_auth_id"] = uid
        await coll.insert_one(doc)
        print(f"✔ inserted google_auth_id={uid}")

    # 6) Final count
    final = await coll.count_documents({})
    print(f"✅ final count: {final} documents in profiles")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
