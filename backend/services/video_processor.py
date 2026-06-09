import cv2
import os
import uuid
from fastapi import UploadFile, File
from typing import List, Tuple, Generator
import numpy as np

class VideoProcessor:
    def __init__(self, upload_dir: str = "backend/uploads", output_dir: str = "backend/outputs"):
        self.upload_dir = upload_dir
        self.output_dir = output_dir
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)

    async def save_upload(self, file: UploadFile) -> str:
        """
        Saves the uploaded video file to the upload directory using chunks.
        """
        file_ext = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(self.upload_dir, file_name)

        # Read the entire file into memory first
        contents = await file.read()
        
        # Write to disk
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Verify the file was written
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            raise Exception(f"Failed to save video file. File size: {os.path.getsize(file_path)}")
        
        return file_path

    def extract_frames(self, video_path: str, sample_rate: int = 10) -> Generator[Tuple[int, np.ndarray], None, None]:
        """
        Extracts frames from the video at a specified sample rate.
        Args:
            video_path: Path to the video file.
            sample_rate: Process every Nth frame. Higher value = faster processing, lower accuracy.
        Yields:
            Tuple of (frame_index, frame_image).
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % sample_rate == 0:
                yield frame_count, frame

            frame_count += 1

        cap.release()

# Singleton instance
video_processor = VideoProcessor()
