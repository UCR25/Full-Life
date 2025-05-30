#!/usr/bin/env bash
set -eu

URL="http://localhost"

cleanup() {
  echo
  echo "Shutting down containers..."
  docker-compose down --remove-orphans
  exit
}

trap cleanup SIGINT SIGTERM

#Make sure it isn't still running from a previous run
docker-compose down --remove-orphans

#Run in detached mode so it doesn't show all those logs (Might have to reattach if we need to watch for timestamps later)
docker-compose up -d

#Wait till it can ping url
echo "Waiting for $URL to come up..."
while ! curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "^200$"; do
  sleep 1
done

#Open default browser
if command -v xdg-open >/dev/null; then
  xdg-open "$URL"
elif command -v open >/dev/null; then
  open "$URL"
else
  python3 -m webbrowser "$URL" || python -m webbrowser "$URL"
fi

#Keep script running until Ctrl+C
echo "Application is running. Press Ctrl+C here to stop everything."
while true; do
  sleep 1
done
