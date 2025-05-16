# import logging
# from fastapi import FastAPI, HTTPException
# from fastapi.responses import HTMLResponse, JSONResponse
# from fastapi.staticfiles import StaticFiles
# import requests
# from openai import OpenAI
# from serpapi import GoogleSearch
# import socket

# #I want to add the tailscale ip instead but its being very anal
# logging.basicConfig(level=logging.WARNING)

# #Use Uvicorn to make a ASGI Server Which
# #1.Imports your weather_event_api.py file.
# #2. Grabs the app = FastAPI() object inside.
# #3. Opens an HTTP listener (by default on 127.0.0.1:8000).
# #4. Whenever a request comes in, it parses the HTTP, wraps it in an “ASGI scope,” and calls your FastAPI app’s async functions.

# app = FastAPI()
# app.mount("/static", StaticFiles(directory="static"), name="static")

# #KEYS 
# client              = OpenAI(api_key="")
# OPENWEATHER_API_KEY = ""
# SERPAPI_API_KEY     = ""

# #I WANT TO USE TAILSCALE TO CHEAT THE SYSTEM AND MAKE IT ACESSABLE GLOBALLY
# @app.on_event("startup")
# async def show_startup_message():
#     logging.warning("🚀 App is live at: http://100.109.128.110:8000 or your Tailscale IP")

# #Use Static Index Format Specified
# @app.get("/", response_class=HTMLResponse)
# def serve_index():
#     return HTMLResponse(open("static/index.html", "r", encoding="utf-8").read())

# #Check OpenWeather and get the Weather, City, and Country (Kind of Cool)
# @app.get("/recommend-events")
# def recommend_events(lat: float, lon: float):
#     try:
#         r = requests.get(
#             "https://api.openweathermap.org/data/2.5/weather",
#             params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "imperial"},
#             timeout=5
#         )
#         r.raise_for_status()
#         w = r.json()
#     except Exception as e:
#         raise HTTPException(502, detail=f"Weather error: {e}")

#     temp_f      = w["main"]["temp"]
#     description = w["weather"][0]["description"]
#     city        = w.get("name", "")
#     country     = w.get("sys", {}).get("country", "")
#     loc_str     = f"{city}, {country}" if city and country else f"{lat},{lon}"

#     greeting = f"Hello from {loc_str}. The weather is {temp_f:.0f}°F and {description}. This is a list of fun activities you can do:"

#     #Check that Location for Google Events
#     try:
#         data   = GoogleSearch({
#             "engine":  "google_events",
#             "q":       f"Events near {loc_str}",
#             "api_key": SERPAPI_API_KEY
#         }).get_dict()
#         events = data.get("events_results", [])[:5]
#     except Exception as e:
#         raise HTTPException(502, detail=f"Events API error: {e}")
#     if not events:
#         raise HTTPException(404, detail="No events found near this location.")


#     event_lines = []
#     for idx, e in enumerate(events, start=1):
#         title = e.get("title", "Untitled Event")
#         addr  = e.get("venue", {}).get("address") or e.get("address") or e.get("location") or ""
#         if isinstance(addr, list):
#             addr = ", ".join(addr)
#         dt = e.get("when", e.get("date", "Unknown Date/Time"))
#         if isinstance(dt, dict):
#             dt = dt.get("when", dt.get("start_date", "Unknown Date/Time"))
#         if isinstance(dt,  <one-sentence summary>str) and dt.endswith((" PDT", " PST")):
#             dt = dt.rsplit(" ", 1)[0]
#         event_lines.append(
#             f"{idx}. {title} | Address: {addr} | Date and Time: {dt}"
#         )

#     #Prompt for ChatGPT. Offloading the manual labor is king.
#     prompt = (
#         "For each event listed below, output exactly in this format:\n\n"
#         "{n}. {Title}\n"
#         "Summary:\n"
#         "Address: <address>\n"
#         "Date and Time: <date/time>\n"
#         "\n"
#         "Here are the events (one per line):\n"
#         + "\n".join(event_lines)
#     )
#     try:
#         resp = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": "Format event summaries exactly as instructed, without extra text."},
#                 {"role": "user",   "content": prompt}
#             ]
#         )
#         formatted_events = resp.choices[0].message.content
#     except Exception as e:
#         raise HTTPException(502, detail=f"OpenAI error: {e}")

#     final_output = greeting + "\n\n" + formatted_events
#     return JSONResponse({"html": final_output})

