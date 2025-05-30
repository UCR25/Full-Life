# backend/main.py
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from typing import List

from models.profile import ProfileCreate, ProfileOut
from models.event_node import EventNodeCreate, EventNodeOut

# ─── SETUP LOGGER ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


from managers.profile_manager import (
    create_profile,
    get_profile_by_user_id,
    update_profile_by_user_id,
    delete_profile_by_user_id,
    list_profiles,
)

from managers.event_node_manager import (
    create_event,
    get_event_by_user_id,
    get_event_by_user_and_event_list_ID,
    get_event_by_name,
    get_event_by_categories,
    update_event_by_id,
    update_event_by_user_id,
)


app = FastAPI()

# Allow your front-end origin (or * in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80", "http://localhost:5173", "http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/profiles", response_model=ProfileOut)
async def api_create_profile(payload: ProfileCreate):
    try:
        result = await create_profile(payload.dict())
        return result
    except Exception as e:
        logger.error(f"Error in create_profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error that is special!")


@app.get("/profiles", response_model=List[ProfileOut])
async def api_list_profiles():
    return await list_profiles()


@app.get("/profiles/by-user/{user_id}", response_model=ProfileOut)
async def api_get_profile_by_user(user_id: str):
    profile = await get_profile_by_user_id(user_id)

    # LOG IT:
    logger.info(f"[DEBUG] /profiles/by-user/{user_id} -> {profile!r}")

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.put("/profiles/by-user/{user_id}", response_model=ProfileOut)
async def api_update_profile_by_user(user_id: str, payload: ProfileCreate):
    updated = await update_profile_by_user_id(user_id, payload.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated


@app.delete("/profiles/by-user/{user_id}", status_code=204)
async def api_delete_profile_by_user(user_id: str):
    success = await delete_profile_by_user_id(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Profile not found")


#event stuff

@app.post("/events", response_model=EventNodeOut)
async def api_create_event(payload: EventNodeCreate):
    return await create_event(payload.dict())

@app.get("/events", response_model=List[EventNodeOut])
async def api_list_events():
    return await list_events()

@app.get("/events/by-user/{user_id}", response_model=List[EventNodeOut])
async def api_get_event_by_user(user_id: str):
    events = await get_event_by_user_id(user_id)
    if not events:
        raise HTTPException(404, "Events not found")
    return events

@app.get("/events/by-user-and-event/{user_id}/{event_list_ID}", response_model=List[EventNodeOut])
async def api_get_event_by_user_and_event_list_id(user_id: str, event_list_ID: str):
    event = await get_event_by_user_and_event_list_ID(user_id, event_list_ID)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.get("/events/by-name/{name}", response_model=List[EventNodeOut])
async def api_get_event_by_name(name: str):
    events = await get_event_by_name(name)
    if not events:
        raise HTTPException(status_code=404, detail="Events not found")
    return events

@app.get("/events/by-categories", response_model=List[EventNodeOut])
async def api_get_event_by_categories(categories: List[str]):
    events = await get_event_by_categories(categories)
    if not events:
        raise HTTPException(status_code=404, detail = "Events Not Found")
    return events

@app.put("/events/{event_id}", response_model=EventNodeOut)
async def api_update_event(event_id: str, payLoad: EventNodeCreate):
    updated = await update_event_by_id(event_id, payLoad.dict())
    if not updated:
        raise HTTPException(status_code = 404, detail = "Event not found")
    return updated

@app.put("/events/by-user/{user_id}", response_model=EventNodeOut)
async def api_update_event_by_user(user_id: str, payload: EventNodeCreate):
    updated = await update_event_by_user_id(user_id, payload.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated
    
