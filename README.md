# 🚗 RoadSense AI

RoadSense AI is a full-stack safety analytics system for road videos. It combines a FastAPI backend, YOLO-based object detection, and a React/Tailwind dashboard for video upload, analysis, and hazard insights.

## ✅ What’s Included

- Backend: `backend/` using FastAPI
- Frontend: `frontend/` with React + Vite + Tailwind
- Docker-ready production containers for frontend and backend
- Local development and production Docker Compose files
- Static frontend served by Nginx in production

## 📦 Docker Setup

### 1. Build and run locally using Docker Compose

This is the fastest way to test the full stack locally.

```bash
cd /path/to/roadsense-ai

docker compose up --build
```

Then open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

### 2. Production-style local run

The production compose file serves the frontend as static assets through Nginx.

```bash
docker compose -f docker-compose.prod.yml up --build
```

Then open:

- Frontend: `http://localhost:80`
- Backend: `http://localhost:8000`

### 3. Build containers individually

```bash
docker build -t roadsense-backend -f Dockerfile.backend .
docker build -t roadsense-frontend -f Dockerfile.frontend .
```

### 4. Run containers individually

```bash
docker run --rm -p 8000:8000 -v $(pwd)/backend/uploads:/app/backend/uploads -v $(pwd)/backend/outputs:/app/backend/outputs roadsense-backend

docker run --rm -p 80:80 roadsense-frontend
```

## 🔧 Production Readiness Improvements

- Backend now runs with `uvicorn` in a lightweight Python container
- Frontend is built and served by `nginx` for production
- Static frontend uses relative `/api` paths by default
- Added a `.dockerignore` to keep build contexts small
- Added `docker-compose.prod.yml` for staging/production local runs
- Fixed backend volume mounts for uploads and outputs in Docker Compose

## ⚙️ Deployment Recommendations (Best Free Docker Deployment)

### Best option: Fly.io

Fly.io is a great free option for containerized full-stack apps with two Docker images. It supports both backend and frontend deployment.

#### Prerequisites

- Docker installed
- `flyctl` installed from https://fly.io/docs/hands-on/install-flyctl/
- Fly.io account created

#### Deploy the backend

```bash
cd /path/to/roadsense-ai
flyctl auth login
flyctl launch --name roadsense-backend --region ord --dockerfile Dockerfile.backend --no-deploy
flyctl deploy --config fly.toml
```

#### Deploy the frontend

```bash
cd /path/to/roadsense-ai
flyctl launch --name roadsense-frontend --region ord --dockerfile Dockerfile.frontend --no-deploy
flyctl deploy --config fly.toml
```

> If the frontend and backend are deployed as separate Fly apps, set `VITE_API_URL` at build time when building the frontend. Example:

```bash
docker build --build-arg VITE_API_URL=https://your-backend-app.fly.dev/api -t roadsense-frontend -f Dockerfile.frontend .
```

### Alternative free Docker hosts

- **Railway**: Supports Docker deployments and a free tier for small apps.
- **Render**: Supports Docker containers, though free resources are limited.
- **Fly.io** is recommended because it is Docker-native and has a generous free tier for small services.

## 🧪 Verification

### Backend health check

```bash
curl http://localhost:8000/health
```

### Upload endpoint

```bash
curl -F "file=@test.mp4" http://localhost:8000/api/upload
```

## 📁 File Structure

- `backend/` — FastAPI server and AI modules
- `frontend/` — React app and frontend assets
- `Dockerfile.backend` — Backend production container
- `Dockerfile.frontend` — Frontend multi-stage build and Nginx container
- `docker-compose.yml` — Local development compose
- `docker-compose.prod.yml` — Local production-style compose
- `frontend/nginx.conf` — Nginx config for SPA routing and API proxying
- `.dockerignore` — Clean build context rules

## 🚀 Notes

- The backend stores uploaded videos under `backend/uploads` and analysis output under `backend/outputs`.
- In production, the frontend proxies `/api/` to the backend service for same-origin behavior.
- Use `docker compose down` to stop the local stack.

## 📜 License

This project is licensed under the MIT License.
