FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY ai/ ./ai/

ENV PYTHONPATH=/app
ENV FLASK_APP=backend/app.py

EXPOSE 5000

CMD ["python", "backend/app.py"]
