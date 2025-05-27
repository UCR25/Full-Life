# back-end/tests/test_event_node_filtering.py

import pytest
from databases.event_node_repository import EventRepository
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
        "event_list_ID": "000002",
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
        # preload docs, simulating they already have Mongo _id's
        self._docs = [
            {**evt, "_id": i + 1}
            for i, evt in enumerate(SAMPLE_EVENTS)
        ]

    async def find_one(self, query):
        # not used here
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

@pytest.fixture
def fake_collection():
    return FakeCollection()

@pytest.mark.asyncio
async def test_get_by_user_id_filters_correctly(fake_collection):
    repo = EventRepository(fake_collection)
    # Log all docs
    print("All sample events:", json.dumps(fake_collection._docs, indent=2))

    results = await repo.get_by_user_id("105013398891910779346")
    # Log filtered results
    print("Filtered by user_ID:", json.dumps(results, indent=2))

    # Should return exactly the first three SAMPLE_EVENTS
    assert isinstance(results, list)
    assert len(results) == 3

    returned_names = {evt["name"] for evt in results}
    expected_names = {"Marathon Run", "Walking", "STUFF"}
    assert returned_names == expected_names

@pytest.mark.asyncio
async def test_get_by_user_and_event_list_id_filters_correctly(fake_collection):
    repo = EventRepository(fake_collection)
    # Log all docs again
    print("All sample events:", json.dumps(fake_collection._docs, indent=2))

    results = await repo.get_by_user_and_event_list_id(
        "105013398891910779346",
        "000001"
    )
    # Log filtered results
    print("Filtered by user_ID + event_list_ID:", json.dumps(results, indent=2))

    # Should return exactly the two events in list "000001"
    assert isinstance(results, list)
    assert len(results) == 2

    returned_names = {evt["name"] for evt in results}
    expected_names = {"Marathon Run", "Walking"}
    assert returned_names == expected_names
