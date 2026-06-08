from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.services.video_processor import video_processor
from backend.models.object_detector import detector
from backend.models.road_context import road_context_engine
from backend.services.traffic_analyzer import traffic_analyzer
from backend.models.hazard_detector import hazard_detector
from backend.models.driver_behavior import driver_behavior_ai
from backend.models.risk_predictor import risk_predictor
from backend.services.alert_engine import alert_engine
import os

app = FastAPI(title="RoadSense AI Backend")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allowed video extensions
ALLOWED_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv'}
MAX_FILE_SIZE = 50 * 1024 * 1024 # 50 MB

@app.get("/")
async def root():
    return {"message": "Welcome to RoadSense AI Backend API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # 1. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    # 2. Validate file size (approximation)
    # Note: FastAPI's UploadFile is already spooled to disk for large files

    try:
        file_path = await video_processor.save_upload(file)
        return {"message": "Video uploaded successfully", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/analyze")
async def analyze_video(file_path: str):
    if not file_path:
        raise HTTPException(status_code=400, detail="file_path is required")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    try:
        all_frames_results = []
        total_hazards = 0

        # 1. Process frames and perform basic object detection
        # We use the default sample_rate from video_processor
        for frame_idx, frame in video_processor.extract_frames(file_path):
            detection_result = detector.detect(frame)

            # Identify hazards in this frame
            frame_hazards = hazard_detector.detect_hazards(detection_result["detections"])
            total_hazards += len(frame_hazards)

            all_frames_results.append({
                "frame": frame_idx,
                "counts": detection_result["counts"],
                "detections": detection_result["detections"],
                "hazards": frame_hazards
            })

        # Edge Case: Empty or unreadable video
        if not all_frames_results:
            raise HTTPException(status_code=422, detail="Could not extract any frames from the video. The file may be empty or corrupted.")

        # 2. Aggregate data for intelligence modules
        # Driver Behavior needs the whole sequence
        behavior = driver_behavior_ai.estimate_behavior(all_frames_results)
        driver_type = behavior["driver_type"]

        # Road Context (based on average or last frame)
        last_frame_counts = all_frames_results[-1]["counts"] if all_frames_results else {}
        context = road_context_engine.predict_context({"counts": last_frame_counts})

        # Traffic Density (overall average for summary)
        avg_counts = {k: sum(f["counts"].get(k, 0) for f in all_frames_results) // len(all_frames_results)
                      for k in last_frame_counts.keys()}
        density = traffic_analyzer.analyze_density(avg_counts)

        # Calculate per-frame risk for the trend chart
        frame_risks = []
        for f in all_frames_results:
            f_counts = f["counts"]
            f_hazards_count = len(f["hazards"])
            f_density_score = sum(f_counts.values())

            risk_input = {
                "counts": f_counts,
                "density_score": f_density_score,
                "hazards_count": f_hazards_count,
                "driver_type": driver_type
            }
            frame_risks.append(risk_predictor.calculate_risk(risk_input)["risk_score"])

        # Overall risk (average of all frames)
        overall_risk_score = sum(frame_risks) / len(frame_risks) if frame_risks else 0
        overall_risk_level = risk_predictor.calculate_risk({
            "counts": last_frame_counts,
            "density_score": density["density_score"],
            "hazards_count": total_hazards,
            "driver_type": driver_type
        })["risk_level"]

        # 3. Generate Adaptive Alerts
        analysis_report = {
            "summary": {
                "road_type": context["road_type"],
                "context_confidence": context["confidence"],
                "traffic_density": density["category"],
                "density_score": density["density_score"],
                "driver_profile": driver_type,
                "risk_score": round(overall_risk_score, 2),
                "risk_level": overall_risk_level,
                "total_hazards_detected": total_hazards
            },
            "detailed_analysis": [
                {**f, "risk_score": r} for f, r in zip(all_frames_results, frame_risks)
            ]
        }

        alerts = alert_engine.generate_alerts(analysis_report)

        return {
            **analysis_report,
            "alerts": alerts
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
