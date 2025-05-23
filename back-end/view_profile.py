#!/usr/bin/env python3
import os
import sys
import asyncio
from urllib.parse import urlparse

from motor.motor_asyncio import AsyncIOMotorClient
from databases.profile_repository import ProfileRepository

async def main(google_auth_id: str):
    # Read URI (fall back to localhost)
    mongo_url = os.getenv(
        "MONGODB_URL",
        "mongodb://localhost:27017/Full-Life-Databases"
    )

    # Connect
    client = AsyncIOMotorClient(mongo_url)

    # Parse DB name
    db_name = urlparse(mongo_url).path.lstrip("/") or "test"
    db = client[db_name]

    # Repo
    repo = ProfileRepository(db.get_collection("profiles"))

    # Optional ping
    try:
        await client.admin.command("ping")
    except Exception as e:
        print(f"❌ Cannot reach MongoDB: {e}")
        client.close()
        sys.exit(1)

    # Fetch by Google Auth ID (sub)
    doc = await repo.collection.find_one({"google_auth_id": google_auth_id})
    if not doc:
        print(f"⚠️  No profile found for sub={google_auth_id}")
    else:
        profile = repo._serialize(doc)
        print("✅ Profile found:")
        for k, v in profile.items():
            print(f"  {k}: {v!r}")

    client.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python view_profile.py <google_auth_id>")
        sys.exit(1)
    sub = sys.argv[1]
    asyncio.run(main(sub))

