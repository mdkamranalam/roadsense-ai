# 🚗 RoadSense AI - Democratizing ADAS Adoption in India

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![YOLOv8](https://img.shields.io/badge/YOLO-v8-orange.svg)](https://ultralytics.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

> **🏆 Built for ET AutoTech Hackathon 2026**  
> **Theme:** AI for ADAS Adoption in India  
> **Team:** DevMasters (Md. Kamran Alam & Ankur Verma)

**RoadSense AI** is an advanced, edge-ready Advanced Driver Assistance System (ADAS) platform designed to accelerate ADAS adoption across India. 

Traditional ADAS systems face two major hurdles in the Indian market: the prohibitive cost of luxury vehicles equipped with these systems, and the failure of Western AI models to interpret chaotic Indian road conditions (e.g., mixed traffic, animals, unique vehicle types). 

RoadSense AI solves this by providing a hyper-localized, affordable intelligence layer that can upgrade any vehicle with context-driven safety alerts using just a standard dashcam.

---

## ✨ Key Features

- **🔍 Hyper-Localized Hazard Detection**: Real-time identification of complex Indian road hazards using state-of-the-art YOLOv8 object detection trained on localized data.
- **🚦 Traffic Density Mapping**: Continuous analysis of vehicle and pedestrian density to categorize traffic flow and adapt driving recommendations.
- **🧠 Adaptive Context Engine**: Context-aware intelligence that understands its environment (e.g., _School Zones_, _Market Areas_, _Highways_, _Village Roads_) and alters risk thresholds accordingly.
- **📈 Real-Time Risk Profiling**: Calculates a dynamic, per-frame risk score by combining hazard presence, environmental context, and traffic density.
- **👤 Driver Profiling**: Estimates driver behavior patterns (Aggressive, Normal, Defensive) to refine risk assessments.
- **🖥️ Modern Safety Dashboard**: A sleek, interactive React-based interface for visualizing video uploads, risk trends, and comprehensive safety intelligence.
- **🐳 Edge & Cloud Ready**: Fully containerized microservices (Docker) allowing for scalable cloud processing or efficient edge deployment directly inside the vehicle.

---

## 🏗️ System Architecture

RoadSense AI uses a robust microservice architecture designed to handle intensive video processing asynchronously, making it highly responsive.

```mermaid
graph LR
    A[React Dashboard] -->|Uploads Video| B(FastAPI Orchestrator)
    B -->|Frames| C{YOLOv8 Model Worker}
    C -->|Detections| B
    B -->|Context + Hazards| D[Intelligence Engines]
    D -->|Adaptive Alerts| A
    
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#009688,stroke:#333,stroke-width:2px,color:#fff;
    classDef ai fill:#ff9800,stroke:#333,stroke-width:2px,color:#000;
    
    class A frontend;
    class B,D backend;
    class C ai;
```

### 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend Orchestrator**: FastAPI (Python), Uvicorn
- **AI/ML Worker**: Dedicated FastAPI service running Ultralytics YOLOv8 for heavy inference
- **Intelligence Layer**: Custom Python-based heuristic risk, context, and driver behavior engines
- **DevOps**: Docker, Docker Compose, Nginx

---

## 📁 Project Structure

```text
roadsense-ai/
├── backend/        # FastAPI Orchestrator & Intelligence Engines
├── frontend/       # React 18 Dashboard UI
├── model_worker/   # Dedicated YOLOv8 Inference Service
├── docs/           # Documentation and assets
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites
- **Docker & Docker Compose** (Recommended for easiest setup)
- **Node.js 18+** & **Python 3.10+** (If running natively without Docker)

### Option A: Quick Start with Docker (Recommended)

The fastest way to get the entire system running locally. This provisions the Frontend, Backend, and AI Model Worker together.

```bash
# Clone the repository
git clone https://github.com/your-username/roadsense-ai.git
cd roadsense-ai

# Build and launch the full stack
docker compose up --build
```

**Access the Application:**
- 🌐 **Dashboard (Frontend)**: `http://localhost:5173`
- ⚙️ **API Documentation (Backend)**: `http://localhost:8000/docs`

#### Production-Style Deployment
Serves the frontend as static assets through Nginx for a production-like experience.
```bash
docker compose -f docker-compose.prod.yml up --build
```

### Option B: Native Local Setup (Without Docker)

For active development, you can run the services natively on your host machine.

```bash
# 1. Start the Model Worker (Port 8001)
cd model_worker
pip install -r requirements.txt
uvicorn app:app --port 8001

# 2. Start the Backend Orchestrator (Port 8000)
# Open a new terminal
cd backend
pip install -r requirements.txt
uvicorn app:app --port 8000

# 3. Start the Frontend UI (Port 5173)
# Open a new terminal
cd frontend
npm install
npm run dev
```

*(Alternatively, you can use the provided `./start.sh` script to launch the python backend services together in the background).*

---

## 🧠 The Intelligence Engines

RoadSense AI is powered by multiple AI and rule-based engines working in harmony:

1. **Object Detector:** Processes frames to detect vehicles, pedestrians, animals, and traffic signs.
2. **Context Engine:** Determines the road environment (e.g., Urban Congested, Highway) based on detection density and object types.
3. **Hazard Engine:** Flags critical dangers (e.g., pedestrian crossing, animal hazard, sudden braking).
4. **Driver Behavior Engine:** Estimates driving style based on movement speed, acceleration, and hazard encounters.
5. **Risk Predictor:** Aggregates inputs to calculate a global Risk Score (0-100) and Level (Safe, Moderate, High, Critical).

---

## 🔮 Future Roadmap

- [ ] **Live RTSP Stream Integration**: Support direct ingestion from IP dashcams.
- [ ] **OTA Model Updates**: Dynamically push region-specific YOLO weights (e.g., "Himalayan Roads" vs "Mumbai Traffic").
- [ ] **Mobile Companion App**: Provide post-trip analytics and risk reports directly to drivers.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
