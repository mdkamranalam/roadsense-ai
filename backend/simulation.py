import time
import json
from backend.app import app
from fastapi.testclient import TestClient

client = TestClient(app)

def simulate_e2e_pipeline():
    print("🚀 Starting E2E Pipeline Simulation...")

    # 1. Simulate Health Check
    health = client.get("/health")
    print(f"Health Check: {health.status_code} - {health.json()['status']}")

    # 2. Simulate Video Upload (Mocked)
    # In a real test, we would use a small sample video.
    # Here we simulate the upload response.
    mock_file_path = "backend/uploads/mock_video.mp4"
    print(f"Simulating upload to: {mock_file_path}")

    # 3. Simulate Analysis (using the mock path)
    # Since we don't have a real video file, we'll mock the video_processor for this script
    # by temporarily creating a dummy file.
    with open(mock_file_path, "w") as f:
        f.write("dummy content")

    print("Triggering Analysis...")
    response = client.post("/analyze", params={"file_path": mock_file_path})

    # Note: This will likely fail if the video_processor can't actually open the dummy file
    # but we want to see if the API logic holds.
    if response.status_code == 200:
        print("✅ Analysis Successful!")
        print(json.dumps(response.json()["summary"], indent=2))
    else:
        print(f"❌ Analysis Failed: {response.status_code} - {response.text}")

    # Cleanup
    import os
    if os.path.exists(mock_file_path):
        os.remove(mock_file_path)

if __name__ == "__main__":
    simulate_e2e_pipeline()
