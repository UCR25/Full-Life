import os
from motor.motor_asyncio import AsyncIOMotorClient

# Read full connection string (including DB name) from .env
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/full_life")

# Create client
client = AsyncIOMotorClient(MONGODB_URL)

# Try to grab the default‐database from the URL (if present),
# otherwise fall back to MONGO_DB env var or a hardcoded default.
try:
    db = client.get_default_database()
except Exception:
    MONGO_DB = os.getenv("MONGO_DB", "full_life")
    db = client[MONGO_DB]

# Collections
profiles_collection     = db["profiles"]
event_nodes_collection  = db["event_nodes"]

def get_db():
    """
    Dependency for FastAPI routes:
        @app.get("/…")
        async def handler(db=Depends(get_db)):
            # use db.profiles, db.event_nodes
    """
    return db

async def close_connection():
    """
    Close the MongoDB connection on shutdown.
    """
    client.close()
