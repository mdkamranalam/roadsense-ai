#!/bin/bash

echo "Starting RoadSense AI Monolithic Container..."

# Start Nginx in the background
echo "Starting Nginx on port 80..."
nginx -g "daemon off;" &

# Start the Model Worker on port 8001 in the background
echo "Starting Model Worker on port 8001..."
uvicorn model_worker.app:app --host 127.0.0.1 --port 8001 &

# Give the model worker a moment to initialize before starting the backend
sleep 3

# Start the Backend on port 8000 in the foreground (blocks and keeps container alive)
echo "Starting Backend on port 8000..."
uvicorn backend.app:app --host 127.0.0.1 --port 8000
