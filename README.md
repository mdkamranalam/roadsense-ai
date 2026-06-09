# 🚗 RoadSense AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

**RoadSense AI** is a professional full-stack safety analytics system designed to analyze road-view videos and identify potential hazards. By leveraging computer vision and adaptive intelligence, it transforms raw video footage into actionable safety insights, risk scores, and context-aware alerts.

---

## ✨ Key Features

- **🔍 Intelligent Hazard Detection**: Automatic identification of road hazards using YOLO-based object detection.
- **📈 Risk Trend Analysis**: Per-frame risk calculation to visualize how safety levels fluctuate throughout a video segment.
- **🚦 Traffic Density Mapping**: Analysis of vehicle and pedestrian density to categorize traffic flow (Low, Medium, High).
- **🧠 Adaptive Alert System**: Context-aware warnings that change based on the detected environment (e.g., *School Zones*, *Market Areas*, *Highways*).
- **👤 Driver Profiling**: Estimation of driver behavior patterns to refine risk assessment.
- **🖥️ Modern Dashboard**: A sleek React-based interface for video uploads and comprehensive analysis visualization.
- **🐳 Production-Ready**: Fully containerized with Docker and Nginx for seamless deployment.

---

## 🏗️ System Architecture

RoadSense AI follows a modular pipeline to process video data:

### 1. The AI Pipeline
`Video Upload` $\rightarrow$ `Frame Extraction` $\rightarrow$ `Object Detection (YOLO)` $\rightarrow$ `Hazard Analysis` $\rightarrow$ `Context Prediction` $\rightarrow$ `Risk Scoring` $\rightarrow$ `Adaptive Alerts`

### 2. Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend**: FastAPI (Python), Uvicorn.
- **AI/ML**: YOLO (Object Detection), Custom Heuristic Engines for Risk & Behavior.
- **DevOps**: Docker, Docker Compose, Nginx.

---

## 🚀 Getting Started

### Option 1: Quick Start with Docker (Recommended)

The fastest way to get the entire system running locally.

```bash
# Clone the repository
git clone https://github.com/your-username/roadsense-ai.git
cd roadsense-ai

# Build and launch the full stack
docker compose up --build
```

**Access the app:**
- 🌐 Frontend: `http://localhost:5173`
- ⚙️ Backend: `http://localhost:8000`

### Option 2: Production-Style Local Run
Serves the frontend as static assets through Nginx for a production-like experience.

```bash
docker compose -f docker-compose.prod.yml up --build
```
- 🌐 Frontend: `http://localhost:80`
- ⚙️ Backend: `http://localhost:8000`

### Option 3: Manual Local Development

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/` | `GET` | System root and status check |
| `/health` | `GET` | Health check for monitoring |
| `/api/upload` | `POST` | Upload a video file (MP4, AVI, MOV, MKV) |
| `/api/analyze` | `POST` | Analyze a previously uploaded video by path |
| `/api/analysis/{id}` | `GET` | Retrieve a specific analysis report |
| `/api/dashboard` | `GET` | Get the most recent analysis summary |

---

## ☁️ Deployment

### Recommended: Fly.io
Fly.io is recommended for its native Docker support and generous free tier.

1. **Deploy Backend**:
   ```bash
   flyctl launch --name roadsense-backend --dockerfile Dockerfile.backend
   flyctl deploy
   ```
2. **Deploy Frontend**:
   ```bash
   # Build with the production API URL
   docker build --build-arg VITE_API_URL=https://roadsense-backend.fly.dev/api -t roadsense-frontend -f Dockerfile.frontend .
   flyctl launch --name roadsense-frontend --dockerfile Dockerfile.frontend
   flyctl deploy
   ```

**Alternative Hosts**: Railway, Render.

---

## 📁 Project Structure

```text
roadsense-ai/
├── backend/                # FastAPI server and AI logic
│   ├── app.py              # Main API entry point
│   ├── services/           # Core business logic (Traffic, Alerts, Video)
│   └── models/             # AI model wrappers (YOLO, Risk, Behavior)
├── frontend/               # React application
│   ├── src/                # Frontend source code
│   └── public/             # Static assets
├── Dockerfile.backend      # Backend container definition
├── Dockerfile.frontend     # Frontend multi-stage build (Nginx)
└── docker-compose.yml      # Local orchestration
```

---

## 📜 License
This project is licensed under the MIT License.
