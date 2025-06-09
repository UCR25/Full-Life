# tests/fake_event_node_and_seed_test.py

import pytest
from databases.event_node_repository import EventRepository
import json
from datetime import datetime

SAMPLE_EVENTS = [
    {
        "user_ID": "105013398891910779346",
        "event_list_ID": "000001",
        "user_date_time": "2025-05-25T14:30:00Z",
        "name": "Marathon Run",
        "address": "123 man street",
        "description": "you just be running",
        "startTime": "2025-05-25T14:30:00Z",
        "endTime": "2025-05-25T16:00:00Z",
        "categories": ["hiking", "photography"]
    },
    {
        "user_ID": "105013398891910779346",
        "event_list_ID": "000001",
        "user_date_time": "2025-05-25T14:30:00Z",
        "name": "Walking",
        "address": "Some Adress",
        "description": "Does it need one?",
        "startTime": "2025-05-25T14:30:00Z",
        "endTime": "2025-05-25T16:00:00Z",
        "categories": ["guitar", "sleeping"]
    },
    {
        "user_ID": "105013398891910779346",
        "event_list_ID": "105013398891910779346",
        "user_date_time": "2025-05-25T14:30:00Z",
        "name": "STUFF",
        "address": "STUFF street",
        "description": "Boredom",
        "startTime": "2025-05-25T14:30:00Z",
        "endTime": "2025-05-25T16:00:00Z",
        "categories": ["stuff", "this sucks"]
    },
    {
        "user_ID": "123456789",
        "event_list_ID": "000003",
        "user_date_time": "2025-05-06T14:30:00Z",
        "name": "Scotty's backyard cookout",
        "address": "bear bear go away street",
        "description": "cooking and eating",
        "startTime": "2025-05-06T14:30:00Z",
        "endTime": "2025-05-08T16:00:00Z",
        "categories": ["cooking", "nearby"]
    }
]

class FakeCursor:
    def __init__(self, docs):
        self._docs = docs

    def sort(self, key, direction):
        reverse = direction == -1
        self._docs.sort(key=lambda d: d.get(key), reverse=reverse)
        return self

    def __aiter__(self):
        return self._aiter()

    async def _aiter(self):
        for doc in self._docs:
            yield doc

class FakeCollection:
    def __init__(self):
        self._docs = [
            {**evt, "_id": i + 1}
            for i, evt in enumerate(SAMPLE_EVENTS)
        ]

    async def find_one(self, query):
        if "_id" in query:
            return next((d for d in self._docs if d["_id"] == query["_id"]), None)
        return None

    def find(self, query):
        matches = [
            d for d in self._docs
            if all(d.get(k) == v for k, v in query.items())
        ]
        return FakeCursor(matches)

    async def insert_one(self, data):
        new_id = len(self._docs) + 1
        doc = {**data, "_id": new_id}
        self._docs.append(doc)
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertOneResult(inserted_id=new_id)

@pytest.fixture
def fake_collection():
    return FakeCollection()

@pytest.mark.asyncio
async def test_get_by_user_id_filters_correctly(fake_collection):
    repo = EventRepository(fake_collection)
    results = await repo.get_by_user_id("105013398891910779346")

    assert isinstance(results, list)
    assert len(results) == 3
    names = {e["name"] for e in results}
    assert names == {"Marathon Run", "Walking", "STUFF"}

@pytest.mark.asyncio
async def test_get_by_user_and_event_list_id_filters_correctly(fake_collection):
    repo = EventRepository(fake_collection)
    results = await repo.get_by_user_and_event_list_id("105013398891910779346", "000001")

    assert isinstance(results, list)
    assert len(results) == 2
    names = {e["name"] for e in results}
    assert names == {"Marathon Run", "Walking"}

@pytest.mark.asyncio
async def test_create_event_assigns_new_id_and_serializes(fake_collection):
    repo = EventRepository(fake_collection)
    new_event = {
        "user_ID": "999",
        "event_list_ID": "listX",
        "user_date_time": datetime.fromisoformat("2025-05-30T10:00:00+00:00"),
        "name": "Test Event",
        "address": "123 Test Blvd",
        "description": "Ensure create works",
        "startTime": datetime.fromisoformat("2025-05-30T10:00:00+00:00"),
        "endTime": datetime.fromisoformat("2025-05-30T12:00:00+00:00"),
        "categories": ["test", "unit"]
    }

    result = await repo.create(new_event)

    assert "user_ID" in result
    assert result["user_ID"] == "999"

    # Ensure _id was added in the internal fake collection
    inserted = next((doc for doc in fake_collection._docs if doc["name"] == "Test Event"), None)
    assert inserted is not None
    assert "_id" in inserted

@pytest.mark.asyncio
async def test_create_appends_to_seed_file(fake_collection, tmp_path, monkeypatch):
    import databases.event_node_repository as repo_mod
    temp_seed = tmp_path / "temp_event_seeds.json"
    monkeypatch.setattr(repo_mod, "SEEDS_FILE", str(temp_seed))

    repo = EventRepository(fake_collection)
    new_event = {
        "user_ID": "999",
        "event_list_ID": "listX",
        "user_date_time": datetime.fromisoformat("2025-05-30T10:00:00+00:00"),
        "name": "Seed Test",
        "address": "456 Seed St",
        "description": "Check seed file",
        "startTime": datetime.fromisoformat("2025-05-30T14:00:00+00:00"),
        "endTime": datetime.fromisoformat("2025-05-30T16:00:00+00:00"),
        "categories": ["seed", "file"]
    }

    result = await repo.create(new_event)

    with open(temp_seed, "r", encoding="utf-8") as f:
        seeds = json.load(f)

    assert isinstance(seeds, list)
    assert seeds[-1]["name"] == "Seed Test"
    assert "_id" not in seeds[-1]
