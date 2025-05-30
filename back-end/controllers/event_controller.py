from dotenv import load_dotenv
import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import requests
from openai import OpenAI
from serpapi import GoogleSearch
import socket

# Load .env variables
load_dotenv()

# Assign your keys from the correct environment variables
OPEN_API_KEY           = os.getenv("OPEN_API_KEY")
OPENWEATHER_API_KEY    = os.getenv("OPEN_WEATHER_API_TOKEN")
SERPAPI_API_KEY        = os.getenv("SERP_API_KEY")

# Logging setup
logging.basicConfig(level=logging.WARNING)

# FastAPI app setup
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize OpenAI client
client = OpenAI(api_key=OPEN_API_KEY)

@app.on_event("startup")
async def show_startup_message():
    hostname = socket.gethostname()
    tailscale_ip = socket.gethostbyname(hostname)
    logging.warning(f"🚀 App is live at: http://{tailscale_ip}:8000")

@app.get("/", response_class=HTMLResponse)
def serve_index():
    return HTMLResponse(open("static/index.html", "r", encoding="utf-8").read())

@app.get("/recommend-events")
def recommend_events(lat: float, lon: float):
    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "imperial"},
            timeout=5
        )
        r.raise_for_status()
        w = r.json()
    except Exception as e:
        raise HTTPException(502, detail=f"Weather error: {e}")

    temp_f      = w["main"]["temp"]
    description = w["weather"][0]["description"]
    city        = w.get("name", "")
    country     = w.get("sys", {}).get("country", "")
    loc_str     = f"{city}, {country}" if city and country else f"{lat},{lon}"
    greeting    = f"Hello from {loc_str}. The weather is {temp_f:.0f}°F and {description}. This is a list of fun activities you can do:"

    try:
        data   = GoogleSearch({
            "engine":  "google_events",
            "q":       f"Events near {loc_str}",
            "api_key": SERPAPI_API_KEY
        }).get_dict()
        events = data.get("events_results", [])[:5]
    except Exception as e:
        raise HTTPException(502, detail=f"Events API error: {e}")

    if not events:
        raise HTTPException(404, detail="No events found near this location.")

    event_lines = []
    for idx, e in enumerate(events, start=1):
        title = e.get("title", "Untitled Event")
        addr  = e.get("venue", {}).get("address") or e.get("address") or e.get("location") or ""
        if isinstance(addr, list):
            addr = ", ".join(addr)
        dt = e.get("when", e.get("date", "Unknown Date/Time"))
        if isinstance(dt, dict):
            dt = dt.get("when", dt.get("start_date", "Unknown Date/Time"))
        if isinstance(dt, str) and dt.endswith((" PDT", " PST")):
            dt = dt.rsplit(" ", 1)[0]
        event_lines.append(f"{idx}. {title} | Address: {addr} | Date and Time: {dt}")

    prompt = (
        "For each event listed below, output exactly in this format:\n\n"
        "{n}. {Title}\n"
        "Summary:\n"
        "Address: <address>\n"
        "Date and Time: <date/time>\n"
        "\n"
        "Here are the events (one per line):\n"
        + "\n".join(event_lines)
    )

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Format event summaries exactly as instructed, without extra text."},
                {"role": "user",   "content": prompt}
            ]
        )
        formatted_events = resp.choices[0].message.content
    except Exception as e:
        raise HTTPException(502, detail=f"OpenAI error: {e}")

    final_output = greeting + "\n\n" + formatted_events
    return JSONResponse({"html": final_output})
