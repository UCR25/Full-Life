# event_node_manager.py

from typing import Optional, List, Dict
from databases.event_node_repository import EventRepository
from databases.mongo_client import event_nodes_collection


# single repo instance
_repo = EventRepository(event_nodes_collection)

def create_event(data: dict) -> dict:
    """
    Business-logic hook for creating an event.
    """
    return _repo.create_event(data)

def get_event_by_user_id(user_id: str) -> List[dict]:
    """
    Business-logic hook for fetching an event by user ID.
    """
    return _repo.get_by_user_id(user_id)
    
def get_event_by_user_and_event_list_ID(user_id: str, event_list_ID: str) -> List[dict]:
    """
    Business-logic hook for fetching an event by user ID and event ID.
    """
    return _repo.get_by_user_and_event_list_id(user_id, event_list_ID)
    
def get_event_by_name(name: str) -> Optional[List[dict]]:
    """
    Business-Logic hook for fetcing events by name.
    """
    return _repo.get_by_name(name)
    
def get_event_by_categories(categories: List[str]) -> Optional[List[dict]]:
    """
    Business-Logic hook for fetching events by categories.
    """
    return _repo.get_by_categories(categories)

def update_event_by_id(id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event bu its ID.
    """
    return _repo.update_by_id(id, update_date)

def update_event_by_user_id(user_id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event by user ID.
    """
    return _repo.update_by_user_id(user_id, update_data)
    
def update_event_by_event_id(event_id: str, update_data: dict) -> Optional[dict]:
    """
    Business-logic hook for updating an event by its event ID
    """
    return _repo.update_by_event_id(event_id, update_data)

# async def copy_node_user_id