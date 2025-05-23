#!/usr/bin/env python3
import os
import sys
import asyncio
from urllib.parse import urlparse

from motor.motor_asyncio import AsyncIOMotorClient
from databases.profile_repository import ProfileRepository

async def main():
    # 1. Grab your URL (e.g. "mongodb://mongo:27017/Full-Life-Databases")
    mongo_url = os.getenv(
        "MONGODB_URL",
        "mongodb://localhost:27017/Full-Life-Databases"
    )

    # 2. Connect
    client = AsyncIOMotorClient(mongo_url)

    # 3. Parse DB name from the URL path
    parsed = urlparse(mongo_url)
    db_name = parsed.path.lstrip("/") or "test"

    # 4. Quick ping to verify connectivity
    try:
        await client.admin.command("ping")
        print("✅ MongoDB is reachable")
    except Exception as e:
        print("❌ MongoDB ping failed:", e)
        sys.exit(1)

    # 5. Get the profiles collection
    db = client[db_name]
    profiles_collection = db.get_collection("profiles")

    # 6. Init your repository
    repo = ProfileRepository(profiles_collection)

    # 7. The user data you provided
    profile_data = {
        "google_auth_id": "105013398891910779346",
        "username":        "sneha_does_stuff",
        "email":           "snehagrg14@gmail.com",
        "picture":         "https://lh3.googleusercontent.com/a/ACg8ocJU6j5bLKF1aWVYr7Xd_KSGmtEyo-p0_fIQsNPa_rVJfi_Mwys=s96-c",
        "hobbies":         ["reading", "hiking", "sleeping", "coding"],
    }

    # 8. Create and print
    created = await repo.create(profile_data)
    print("✅ Created profile:", created)

    client.close()

if __name__ == "__main__":
    asyncio.run(main())
