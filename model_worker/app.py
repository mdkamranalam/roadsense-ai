from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from typing import Any, Dict, List

app = FastAPI(title="RoadSense AI Model Worker")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "yolov8n.pt"

model = YOLO(MODEL_PATH)

target_classes = {
    0: "pedestrians",
    2: "cars",
    3: "bikes",
    5: "buses",
    7: "trucks",
    15: "animals",
    16: "animals",
    17: "animals",
    18: "animals",
    19: "animals",
    20: "animals",
    21: "animals",
    22: "animals",
    23: "animals",
    24: "animals",
}


@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy", "component": "model_worker"}


@app.post("/detect")
async def detect_image(image: UploadFile = File(...)) -> Dict[str, Any]:
    if image.content_type not in {"image/jpeg", "image/jpg", "image/png"}:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are supported for detection.")

    image_bytes = await image.read()
    frame_array = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=422, detail="Unable to decode uploaded image for detection.")

    results = model(frame, verbose=False)[0]

    counts = {label: 0 for label in set(target_classes.values())}
    detections: List[Dict[str, Any]] = []

    for box in results.boxes:
        cls_id = int(box.cls[0])
        if cls_id in target_classes:
            label = target_classes[cls_id]
            counts[label] += 1
            coords = [int(coord) for coord in box.xyxy[0].tolist()]
            confidence = float(box.conf[0])
            detections.append({
                "label": label,
                "bbox": coords,
                "confidence": confidence,
            })

    return {"counts": counts, "detections": detections}
