# 🚗 RoadSense AI - Setup & User Guide

RoadSense AI is an intelligent software layer designed for Adaptive Advanced Driver Assistance Systems (ADAS), specifically optimized for the unique and diverse driving conditions of Indian roads.

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **YOLOv8** (Weights will be downloaded automatically on first run)

### 🛠 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python app.py
   ```
   The server will be available at `http://localhost:8000`.

### 💻 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The dashboard will be available at `http://localhost:5173`.

---

## 📖 User Guide

### 1. Uploading a Video
- Open the RoadSense AI dashboard.
- Click on **"Select Video File"** and choose a road recording (MP4, AVI, MOV).
- Click **"Start Analysis"**.
- The system will upload the video, run the AI pipeline (Object Detection $\rightarrow$ Context $\rightarrow$ Density $\rightarrow$ Behavior $\rightarrow$ Risk), and generate adaptive alerts.

### 2. Understanding the Results
- **Summary Cards**: Quick view of the detected Road Type, Risk Score, and Driver Profile.
- **Adaptive Alerts**: Context-specific warnings. For example, if a "Market Area" is detected with a high risk, you'll see "Pedestrians likely to cross. Slow down immediately."
- **Risk Profile Trend**: A visual graph showing how risk fluctuated throughout the video duration.
- **Object Distribution**: Total counts of vehicles and pedestrians identified during the trip.
- **Voice Alerts**: For critical warnings, the system will automatically announce the alert via the browser's voice assistant.

---

## 🛠 Technical Architecture

- **Perception**: YOLOv8 for real-time object and hazard detection.
- **Intelligence**: 
    - Rule-based environment classifier.
    - Weighted risk scoring engine.
    - Behavior profiling based on hazard proximity.
- **Interface**: React + TypeScript + Tailwind CSS + Recharts for data visualization.
- **Communication**: REST API via FastAPI.

## 📜 License
This project is licensed under the MIT License.
