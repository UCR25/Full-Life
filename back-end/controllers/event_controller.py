import os
from datetime import datetime
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from openai import OpenAI
from serpapi import GoogleSearch
import requests
from bson import ObjectId
from models.query import QueryInput
from models.event_node import EventNodeCreate
from managers.event_node_manager import (
    create_event,
    generate_new_event_list_id,
    get_grouped_event_lists_by_user,
)

# API keys
OPEN_API_KEY = os.getenv("OPEN_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPEN_WEATHER_API_TOKEN")
SERPAPI_API_KEY = os.getenv("SERP_API_KEY")

client = OpenAI(api_key=OPEN_API_KEY)

# Helper to serialize ObjectId and datetime
def make_json_safe(doc):
    if isinstance(doc, dict):
        return {k: make_json_safe(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [make_json_safe(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    return doc

async def process_query(query: QueryInput):
    # ─ Weather Data ─
    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": query.lat, "lon": query.lon, "appid": OPENWEATHER_API_KEY, "units": "imperial"},
            timeout=5
        )
        r.raise_for_status()
        w = r.json()
    except Exception as e:
        raise HTTPException(502, detail=f"Weather error: {e}")

    temp_f = w["main"]["temp"]
    desc = w["weather"][0]["description"]
    loc_str = f"{w.get('name', query.lat)},{w.get('sys', {}).get('country', query.lon)}"

    # ─ Events from SerpAPI ─
    try:
        search = GoogleSearch({
            "engine": "google_events",
            "q": f"Events near {loc_str}",
            "api_key": SERPAPI_API_KEY
        })
        serp_data = search.get_dict()
        events = serp_data.get("events_results", [])[:5]
    except Exception as e:
        raise HTTPException(502, detail=f"SerpAPI error: {e}")

    if not events:
        raise HTTPException(404, detail="No events found.")

    # ─ Event List ID ─
    new_list_id = await generate_new_event_list_id(query.user_ID)

    # ─ Store Events ─
    for e in events:
        addr = e.get("venue", {}).get("address") or e.get("address") or e.get("location", "No Address")
        if isinstance(addr, list):
            addr = ", ".join(addr)
        dt = e.get("when") or e.get("date") or datetime.utcnow().isoformat()
        if isinstance(dt, dict):
            dt = dt.get("start_date") or dt.get("when") or datetime.utcnow().isoformat()

        try:
            start_dt = datetime.fromisoformat(dt)
        except Exception:
            start_dt = datetime.utcnow()

        new_event = EventNodeCreate(
            user_ID=query.user_ID,
            event_list_ID=new_list_id,
            user_date_time=query.user_date_time,
            name=e.get("title", "Untitled Event"),
            address=addr,
            description=e.get("description", ""),
            startTime=start_dt,
            endTime=start_dt,
            categories=[]
        )
        await create_event(new_event.dict())

    # ─ Format with OpenAI ─
    try:
        prompt = (
            f"Hello from {loc_str}. The weather is {temp_f:.0f}°F and {desc}. "
            "Here are events you might like:\n\n"
            + "\n".join(
                f"{i+1}. {e.get('title', 'Untitled')} | Address: {e.get('venue', {}).get('address', '') or e.get('address', '')} | Time: {e.get('when') or e.get('date')}"
                for i, e in enumerate(events)
            )
        )

        chat = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Summarize these events clearly and concisely."},
                {"role": "user", "content": prompt}
            ]
        )
        formatted = chat.choices[0].message.content
    except Exception as e:
        raise HTTPException(502, detail=f"OpenAI error: {e}")

    raw_lists = await get_grouped_event_lists_by_user(query.user_ID)
    safe_lists = [make_json_safe(doc) for doc in raw_lists]

    return JSONResponse({
        "summary": formatted,
        "event_lists": safe_lists
    })