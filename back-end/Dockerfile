FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# install curl (for healthchecks) and netcat-openbsd (for waiting on mongo)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      curl \
      netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN addgroup --system appgroup \
 && adduser --system --ingroup appgroup appuser

USER appuser

EXPOSE 8000

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]
