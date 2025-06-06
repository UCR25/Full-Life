import os, json
from datetime import datetime
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from openai import OpenAI
from serpapi import GoogleSearch
import requests
from bson import ObjectId
from models.query import QueryInput
from models.event_node import EventNodeCreate
from managers.event_node_manager import save_event_nodes_and_get_grouped

# API keys
OPEN_API_KEY = os.getenv("OPEN_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPEN_WEATHER_API_TOKEN")
SERPAPI_API_KEY = os.getenv("SERP_API_KEY")
client = OpenAI(api_key=OPEN_API_KEY)

def make_json_safe(doc):
    if isinstance(doc, dict):
        return {k: make_json_safe(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [make_json_safe(i) for i in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    return doc

def normalize_title(title):
    return title.lower().replace("’", "'").strip()

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

    # ─ SerpAPI Events ─
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

    # ─ GPT Category Tags ─
    try:
        tag_prompt = (
            "Return only JSON list like [{\"title\": ..., \"tags\": [...]}] for these events:\n\n"
            + json.dumps([{
                "title": e.get("title", "Untitled"),
                "description": e.get("description", "")
            } for e in events])
        )

        tag_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You're a helpful event tagging assistant. Return only valid JSON."},
                {"role": "user", "content": tag_prompt}
            ]
        )
        content = tag_response.choices[0].message.content.strip()

        # Strip code block if present
        if content.startswith("```"):
            content = content.split("```")[1].strip()
            if content.startswith("json"):
                content = content[4:].strip()

        tag_data = json.loads(content)

    except Exception as e:
        print(f"[✖] GPT tagging failed: {e}")
        print(f"[🧪] GPT raw response:\n{repr(content)}")
        tag_data = []

    tag_map = {
        normalize_title(i["title"]): i.get("tags", [])
        for i in tag_data if isinstance(i, dict)
    }

    # ─ Convert to EventNodeCreate list ─
    event_nodes = []
    for e in events:
        addr = e.get("venue", {}).get("address") or e.get("address") or e.get("location", "No Address")
        if isinstance(addr, list): addr = ", ".join(addr)
        dt = e.get("when") or e.get("date") or datetime.utcnow().isoformat()
        if isinstance(dt, dict): dt = dt.get("start_date") or dt.get("when") or datetime.utcnow().isoformat()
        try:
            start_dt = datetime.fromisoformat(dt)
        except:
            start_dt = datetime.utcnow()
        title = e.get("title", "Untitled Event")
        tags = tag_map.get(normalize_title(title), [])
        event_nodes.append(EventNodeCreate(
            user_ID=query.user_ID,
            event_list_ID="",  # manager will generate
            user_date_time=query.user_date_time,
            name=title,
            address=addr,
            description=e.get("description", ""),
            startTime=start_dt,
            endTime=start_dt,
            categories=tags
        ))

    # ─ Save to DB and Get Grouped ─
    grouped = await save_event_nodes_and_get_grouped(query.user_ID, event_nodes)

    # ─ GPT Summary ─
    try:
        summary_prompt = (
            f"Hello from {loc_str}. The weather is {temp_f:.0f}°F and {desc}. "
            "Here are events:\n\n" +
            "\n".join(f"{i+1}. {e.get('title', 'Untitled')} | {e.get('venue', {}).get('address', '')}" for i, e in enumerate(events))
        )
        chat = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Summarize these events clearly."},
                {"role": "user", "content": summary_prompt}
            ]
        )
        summary = chat.choices[0].message.content
    except Exception as e:
        raise HTTPException(502, detail=f"OpenAI summary error: {e}")

    return JSONResponse({
        "summary": summary,
        "event_lists": [make_json_safe(doc) for doc in grouped]
    })
