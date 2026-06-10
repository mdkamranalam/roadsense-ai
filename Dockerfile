# Stage 1: Build the React Frontend
FROM node:22-alpine AS frontend-builder

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --include=dev
COPY frontend/ .
RUN npm run build

# Stage 2: Build the Python environment with Nginx
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
ENV MODEL_WORKER_URL=http://127.0.0.1:8001

WORKDIR /app

# Install system dependencies for video processing, headless OpenCV, and Nginx
RUN apt-get update && apt-get install -y \
    nginx \
    ffmpeg \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend and model_worker requirements
COPY backend/requirements.docker.txt /app/requirements.backend.txt
COPY model_worker/requirements.txt /app/requirements.model.txt

# Install python dependencies for both services
RUN pip install --no-cache-dir -r /app/requirements.backend.txt
RUN pip install --no-cache-dir -r /app/requirements.model.txt -f https://download.pytorch.org/whl/cpu/torch_stable.html

# Setup Nginx with the frontend build
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Modify the nginx config proxy_pass from http://backend:8000 to http://127.0.0.1:8000
RUN sed -i 's/http:\/\/backend:8000/http:\/\/127.0.0.1:8000/g' /etc/nginx/conf.d/default.conf

# Copy application files
COPY yolov8n.pt /app/yolov8n.pt
COPY backend /app/backend
COPY model_worker /app/model_worker

# Copy the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port 80 for the platform to map
EXPOSE 80

# Run the startup script
CMD ["/app/start.sh"]
