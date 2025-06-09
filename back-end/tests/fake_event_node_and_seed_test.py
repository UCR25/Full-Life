# back-end/tests/test_event_node_filtering.py

import pytest
from databases.event_node_repository import EventRepository, SEEDS_FILE
import json

# Your four sample events
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

class FakeCollection:
    def __init__(self):
        self._docs = [
            {**evt, "_id": i + 1}
            for i, evt in enumerate(SAMPLE_EVENTS)
        ]

    async def find_one(self, query):
        target = query.get("_id")
        return next((d for d in self._docs if d["_id"] == target), None)

    def find(self, query):
        matches = [
            d for d in self._docs
            if all(d.get(k) == v for k, v in query.items())
        ]
        async def gen():
            for d in matches:
                yield d
        return gen()

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
    print("All sample events:", json.dumps(fake_collection._docs, indent=2))

    results = await repo.get_by_user_id("105013398891910779346")
    print("Filtered by user_ID:", json.dumps(results, indent=2))

    assert isinstance(results, list)
    assert len(results) == 3

    returned_names = {evt["name"] for evt in results}
    expected_names = {"Marathon Run", "Walking", "STUFF"}
    assert returned_names == expected_names

@pytest.mark.asyncio
async def test_get_by_user_and_event_list_id_filters_correctly(fake_collection):
    repo = EventRepository(fake_collection)
    print("All sample events:", json.dumps(fake_collection._docs, indent=2))

    results = await repo.get_by_user_and_event_list_id(
        "105013398891910779346",
        "000001"
    )
    print("Filtered by user_ID + event_list_ID:", json.dumps(results, indent=2))

    assert isinstance(results, list)
    assert len(results) == 2

    returned_names = {evt["name"] for evt in results}
    expected_names = {"Marathon Run", "Walking"}
    assert returned_names == expected_names

@pytest.mark.asyncio
async def test_create_event_assigns_new_id_and_serializes(fake_collection):
    repo = EventRepository(fake_collection)

    print("All sample events before create:", json.dumps(fake_collection._docs, indent=2))

    new_event = {
        "user_ID": "999",
        "event_list_ID": "listX",
        "user_date_time": "2025-05-30T10:00:00Z",
        "name": "Test Event",
        "address": "123 Test Blvd",
        "description": "Ensure create works",
        "startTime": "2025-05-30T10:00:00Z",
        "endTime": "2025-05-30T12:00:00Z",
        "categories": ["test", "unit"],
    }

    result = await repo.create(new_event)

    print("Result of create:", json.dumps(result, indent=2))
    print("All sample events after create:", json.dumps(fake_collection._docs, indent=2))

    assert "_id" in result
    assert isinstance(result["_id"], str)
    assert int(result["_id"]) == 5

    assert result["user_ID"] == new_event["user_ID"]
    assert result["event_list_ID"] == new_event["event_list_ID"]
    assert result["name"] == new_event["name"]
    assert result["address"] == new_event["address"]
    assert result["description"] == new_event["description"]
    assert result["startTime"] == new_event["startTime"]
    assert result["endTime"] == new_event["endTime"]
    assert result["categories"] == new_event["categories"]

    assert result["index"] is None

@pytest.mark.asyncio
async def test_create_appends_to_seed_file(fake_collection, tmp_path, monkeypatch):
    import databases.event_node_repository as repo_mod
    temp_seed = tmp_path / "temp_event_seeds.json"
    monkeypatch.setattr(repo_mod, "SEEDS_FILE", str(temp_seed))

    repo = EventRepository(fake_collection)

    new_event = {
        "user_ID": "999",
        "event_list_ID": "listX",
        "user_date_time": "2025-05-30T10:00:00Z",
        "name": "Seed Test",
        "address": "456 Seed St",
        "description": "Check seed file",
        "startTime": "2025-05-30T14:00:00Z",
        "endTime": "2025-05-30T16:00:00Z",
        "categories": ["seed", "file"],
    }

    print("Temp seed file path:", temp_seed)
    result = await repo.create(new_event)
    print("Create returned:", json.dumps(result, indent=2))

    with open(temp_seed, "r", encoding="utf-8") as f:
        seeds = json.load(f)
    print("Seeds file contents:", json.dumps(seeds, indent=2))

    assert isinstance(seeds, list)
    assert seeds[-1] == result
