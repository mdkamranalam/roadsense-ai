import os
import cv2
import httpx
import numpy as np
from typing import Any, Dict

class DetectionClient:
    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or os.getenv("MODEL_WORKER_URL", "http://model-worker:8001")
        self.client = httpx.AsyncClient(timeout=60.0)

    async def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        _, buffer = cv2.imencode(".jpg", frame)
        response = await self.client.post(
            f"{self.base_url}/detect",
            files={"image": ("frame.jpg", buffer.tobytes(), "image/jpeg")},
        )
        response.raise_for_status()
        return response.json()

# Singleton instance for the backend service
model_worker_client = DetectionClient()
