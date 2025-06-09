from typing import Optional, List
from databases.event_node_repository import EventRepository
from databases.mongo_client import event_nodes_collection
from models.event_node import EventNodeCreate

# Single repo instance
_repo = EventRepository(event_nodes_collection)

# Thin manager functions — just call the repo

async def create_event(data: dict) -> dict:
    return await _repo.create(data)

async def get_event_by_user_id(user_id: str) -> List[dict]:
    return await _repo.get_by_user_id(user_id)

async def get_event_by_user_and_event_list_ID(user_id: str, event_list_ID: str) -> List[dict]:
    return await _repo.get_by_user_and_event_list_id(user_id, event_list_ID)

async def get_event_by_name(name: str) -> Optional[List[dict]]:
    return await _repo.get_by_name(name)

async def get_event_by_categories(categories: List[str]) -> Optional[List[dict]]:
    return await _repo.get_by_categories(categories)

async def update_event_by_id(event_id: str, update_data: dict) -> Optional[dict]:
    return await _repo.update_by_id(event_id, update_data)

async def update_event_by_user_id(user_id: str, update_data: dict) -> Optional[dict]:
    return await _repo.update_by_user_id(user_id, update_data)

async def update_event_by_event_id(event_id: str, update_data: dict) -> Optional[dict]:
    return await _repo.update_by_event_id(event_id, update_data)

async def generate_new_event_list_id(user_id: str) -> str:
    return await _repo.generate_new_event_list_id(user_id)

async def get_grouped_event_lists_by_user(user_id: str) -> List[dict]:
    return await _repo.get_all_event_lists_grouped_by_user(user_id)

async def save_event_nodes_and_get_grouped(user_id: str, nodes: List[EventNodeCreate]) -> List[dict]:
    return await _repo.save_event_nodes_and_get_grouped(user_id, nodes)
