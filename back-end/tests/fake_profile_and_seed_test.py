import os
import json
import pytest
from databases.profile_repository import ProfileRepository

# --- In-memory fake collection to avoid real MongoDB ---
class FakeCollection:
    def __init__(self):
        self._docs = []
        self._id_counter = 1

    async def insert_one(self, data):
        # Simulate Mongo's insert_one behavior
        doc = data.copy()
        doc["_id"] = self._id_counter
        self._id_counter += 1
        self._docs.append(doc)
        class Result:
            inserted_id = doc["_id"]
        return Result()

    async def find_one(self, query):
        # Support lookup by _id
        if "_id" in query:
            return next((d for d in self._docs if d["_id"] == query["_id"]), None)
        # Support lookup by google_auth_id
        if "google_auth_id" in query:
            return next((d for d in self._docs if d.get("google_auth_id") == query["google_auth_id"]), None)
        return None

# Fixture for fake collection
@pytest.fixture
def fake_collection():
    return FakeCollection()

# Fixture to override SEEDS_FILE to a temp path
@pytest.fixture
def tmp_seeds_file(tmp_path, monkeypatch):
    fake = tmp_path / "profile_seeds.json"
    monkeypatch.setattr(
        "databases.profile_repository.SEEDS_FILE",
        str(fake),
    )
    return str(fake)

# Test create without a real MongoDB server
@pytest.mark.asyncio
async def test_create_profile_writes_db_and_seeds(fake_collection, tmp_seeds_file):
    # Prepare repository with fake collection
    repo = ProfileRepository(fake_collection)

    # Payload matching ProfileCreate
    new_data = {
        "google_auth_id": "user123",
        "username":        "alice",
        "email":           "alice@example.com",
        "hobbies":        ["reading", "gaming"],
        "picture":        "http://example.com/alice.png",
    }

    # Run create()
    created = await repo.create(new_data)

    # Visual confirmation in test output
    print("Created profile object:", json.dumps(created, indent=2))
    print("Fake DB state:", json.dumps(fake_collection._docs, indent=2))

    # Assert serialization matches expected out model
    assert created == {
        "user_id":  "user123",
        "username": "alice",
        "email":    "alice@example.com",
        "hobbies":  ["reading", "gaming"],
        "picture":  "http://example.com/alice.png",
    }

    # Assert the fake collection stored the raw document
    assert fake_collection._docs[0]["username"] == "alice"

    # Assert the seed file was written correctly
    with open(tmp_seeds_file, "r", encoding="utf-8") as f:
        seeds = json.load(f)
    print("Seeds file contents:", json.dumps(seeds, indent=2))
    assert isinstance(seeds, list)
    assert seeds[-1] == created

    # Example curl command for a running FastAPI service:
    print(f"curl http://localhost:8000/profiles/by-user/{created['user_id']}")
