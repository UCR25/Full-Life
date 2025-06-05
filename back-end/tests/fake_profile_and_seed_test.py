

import os
import json
import pytest
from databases.profile_repository import ProfileRepository

class FakeCollection:
    def __init__(self):
        self._docs = []
        self._id_counter = 1

    async def insert_one(self, data):
        doc = data.copy()
        doc["_id"] = self._id_counter
        self._docs.append(doc)
        self._id_counter += 1
        class Result:
            inserted_id = doc["_id"]
        return Result()

    async def find_one(self, query):
        if "_id" in query:
            return next((d for d in self._docs if d["_id"] == query["_id"]), None)
        return None

@pytest.fixture
def fake_collection():
    return FakeCollection()

@pytest.fixture
def tmp_seeds_file(tmp_path, monkeypatch):
    fake = tmp_path / "profile_seeds.json"
    monkeypatch.setattr(
        "databases.profile_repository.SEEDS_FILE",
        str(fake),
    )
    return str(fake)

@pytest.mark.asyncio
async def test_create_profile_writes_db_and_seeds(fake_collection, tmp_seeds_file):
    repo = ProfileRepository(fake_collection)

    new_data = {
        "user_id": "user123",
        "username": "alice",
        "email": "alice@example.com",
        "hobbies": ["reading", "gaming"],
        "picture": "http://example.com/alice.png",
    }

    created = await repo.create(new_data)

    assert created == {
        "user_id": "user123",
        "username": "alice",
        "email": "alice@example.com",
        "hobbies": ["reading", "gaming"],
        "picture": "http://example.com/alice.png",
    }

    stored = fake_collection._docs[0]
    assert stored["user_id"] == "user123"

    with open(tmp_seeds_file, "r", encoding="utf-8") as f:
        seeds = json.load(f)
    assert isinstance(seeds, list)
    assert seeds[-1] == created
