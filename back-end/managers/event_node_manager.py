# back-end/event_node_manager.py

from typing import Optional, List, Dict
from databases.event_node_repository import EventRepository
from databases.mongo_client import event_nodes_collection

# single repo instance
_repo = EventRepository(event_nodes_collection)

async def create_event(data: dict) -> dict:
    """
    Business-logic hook for creating an event.
    """
    return await _repo.create(data)

async def get_event_by_user_id(user_id: str) -> List[dict]:
    """
    Business-logic hook for fetching events by user ID.
    """
    return await _repo.get_by_user_id(user_id)

async def get_event_by_user_and_event_list_ID(user_id: str, event_list_ID: str) -> List[dict]:
    """
    Business-logic hook for fetching events by user ID and event-list ID.
    """
    return await _repo.get_by_user_and_event_list_id(user_id, event_list_ID)

async def get_event_by_name(name: str) -> Optional[List[dict]]:
    """
    Business-logic hook for fetching events by name.
    """
    return await _repo.get_by_name(name)

async def get_event_by_categories(categories: List[str]) -> Optional[List[dict]]:
    """
    Business-logic hook for fetching events by one or more categories.
    """
    return await _repo.get_by_categories(categories)

async def update_event_by_id(event_id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event by its _id.
    """
    return await _repo.update_by_id(event_id, update_data)

async def update_event_by_user_id(user_id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event by user_ID.
    """
    return await _repo.update_by_user_id(user_id, update_data)

async def update_event_by_event_id(event_id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event by its event_list_ID.
    """
    return await _repo.update_by_event_id(event_id, update_data)
