# backend/main.py
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from typing import List

from models.profile import ProfileCreate, ProfileOut

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

app = FastAPI()

# Allow your front-end origin (or * in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/profiles", response_model=ProfileOut)
async def api_create_profile(payload: ProfileCreate):
    return await create_profile(payload.dict())


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
