import os
import logging
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.profile import ProfileCreate, ProfileOut
from models.event_node import EventNodeCreate, EventNodeOut
from models.query import QueryInput
from managers.profile_manager import (
    create_profile, get_profile_by_user_id, update_profile_by_user_id,
    delete_profile_by_user_id, list_profiles,
)
from managers.event_node_manager import (
    create_event, get_event_by_user_id, get_event_by_user_and_event_list_ID,
    get_event_by_name, get_event_by_categories, update_event_by_id,
    update_event_by_user_id, generate_new_event_list_id,
    get_grouped_event_lists_by_user,
)
import controllers.event_controller as event_controller

# ─── Logger Setup ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Profile Routes ─────────────────────────────────────────────────────────────
@app.post("/profiles", response_model=ProfileOut)
async def api_create_profile(payload: ProfileCreate):
    return await create_profile(payload.dict())

@app.get("/profiles", response_model=List[ProfileOut])
async def api_list_profiles():
    return await list_profiles()

@app.get("/profiles/by-user/{user_id}", response_model=ProfileOut)
async def api_get_profile_by_user(user_id: str):
    profile = await get_profile_by_user_id(user_id)
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile

@app.put("/profiles/by-user/{user_id}", response_model=ProfileOut)
async def api_update_profile_by_user(user_id: str, payload: ProfileCreate):
    updated = await update_profile_by_user_id(user_id, payload.dict())
    if not updated:
        raise HTTPException(404, "Profile not found")
    return updated

@app.delete("/profiles/by-user/{user_id}", status_code=204)
async def api_delete_profile_by_user(user_id: str):
    success = await delete_profile_by_user_id(user_id)
    if not success:
        raise HTTPException(404, "Profile not found")

# ─── Event Routes ───────────────────────────────────────────────────────────────
@app.post("/events", response_model=EventNodeOut)
async def api_create_event(payload: EventNodeCreate):
    return await create_event(payload.dict())

@app.get("/events/by-user/{user_id}", response_model=List[EventNodeOut])
async def api_get_event_by_user(user_id: str):
    events = await get_event_by_user_id(user_id)
    if not events:
        raise HTTPException(404, "Events not found")
    return events

@app.get("/events/by-user-and-event/{user_id}/{event_list_ID}", response_model=List[EventNodeOut])
async def api_get_event_by_user_and_event_list_id(user_id: str, event_list_ID: str):
    events = await get_event_by_user_and_event_list_ID(user_id, event_list_ID)
    if not events:
        raise HTTPException(404, "Event not found")
    return events

@app.get("/events/by-name/{name}", response_model=List[EventNodeOut])
async def api_get_event_by_name(name: str):
    events = await get_event_by_name(name)
    if not events:
        raise HTTPException(404, "Events not found")
    return events

@app.get("/events/by-categories", response_model=List[EventNodeOut])
async def api_get_event_by_categories(categories: List[str]):
    events = await get_event_by_categories(categories)
    if not events:
        raise HTTPException(404, "Events not found")
    return events

@app.put("/events/{event_id}", response_model=EventNodeOut)
async def api_update_event(event_id: str, payload: EventNodeCreate):
    updated = await update_event_by_id(event_id, payload.dict())
    if not updated:
        raise HTTPException(404, "Event not found")
    return updated

@app.put("/events/by-user/{user_id}", response_model=EventNodeOut)
async def api_update_event_by_user(user_id: str, payload: EventNodeCreate):
    updated = await update_event_by_user_id(user_id, payload.dict())
    if not updated:
        raise HTTPException(404, "Event not found")
    return updated

@app.get("/events/generate-list-id/{user_id}")
async def api_generate_event_list_id(user_id: str):
    new_id = await generate_new_event_list_id(user_id)
    return {"new_event_list_ID": new_id}

@app.get("/events/grouped/by-user/{user_id}")
async def api_get_grouped_event_lists_by_user(user_id: str):
    grouped = await get_grouped_event_lists_by_user(user_id)
    if not grouped:
        raise HTTPException(404, "No event lists found for this user")
    return grouped

# ─── Query Events with Prompt ────────────────────────────────────────────────────
@app.post("/query")
async def api_process_query(query: QueryInput):
    try:
        return await event_controller.process_query(query)
    except Exception as e:
        logger.error(f"Error in /query: {e}", exc_info=True)
        raise HTTPException(500, f"Query processing failed: {e}")
