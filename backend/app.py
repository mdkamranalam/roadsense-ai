from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.services.video_processor import video_processor
from backend.models.object_detector import detector
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

@app.get("/")
async def root():
    return {"message": "Welcome to RoadSense AI Backend API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        file_path = await video_processor.save_upload(file)
        return {"message": "Video uploaded successfully", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/analyze")
async def analyze_video(file_path: str):
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    try:
        all_frames_results = []

        # Process frames
        for frame_idx, frame in video_processor.extract_frames(file_path):
            detection_result = detector.detect(frame)
            all_frames_results.append({
                "frame": frame_idx,
                "counts": detection_result["counts"],
                "detections": detection_result["detections"]
            })

        # Calculate aggregate counts across all processed frames
        aggregate_counts = {cls: 0 for cls in detector.target_classes.values()}
        for res in all_frames_results:
            for cls, count in res["counts"].items():
                aggregate_counts[cls] += count

        return {
            "total_frames_processed": len(all_frames_results),
            "aggregate_counts": aggregate_counts,
            "detailed_analysis": all_frames_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
