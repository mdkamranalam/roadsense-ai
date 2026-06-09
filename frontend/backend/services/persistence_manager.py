import json
import os
from typing import Dict, Any, Optional

class PersistenceManager:
    def __init__(self, storage_dir: str = "backend/outputs/results"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def _get_file_path(self, file_path: str) -> str:
        """
        Generates a unique filename for the analysis result based on the input video path.
        """
        # Sanitize the file_path to be used as a filename
        # In a real app, we'd use a hash of the file content or a database ID.
        safe_name = file_path.replace("/", "_").replace("\\", "_")
        return os.path.join(self.storage_dir, f"{safe_name}.json")

    def save_analysis(self, file_path: str, report: Dict[str, Any]) -> None:
        """
        Saves the analysis report to a JSON file.
        """
        result_path = self._get_file_path(file_path)
        with open(result_path, "w") as f:
            json.dump(report, f, indent=4)

    def load_analysis(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Loads the analysis report from a JSON file if it exists.
        """
        result_path = self._get_file_path(file_path)
        if os.path.exists(result_path):
            with open(result_path, "r") as f:
                return json.load(f)
        return None

# Singleton instance
persistence_manager = PersistenceManager()
