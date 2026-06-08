from typing import Dict, Any

class TrafficAnalyzer:
    def __init__(self):
        self.thresholds = {
            "low": 15,
            "medium": 40
        }

    def analyze_density(self, counts: Dict[str, int]) -> Dict[str, Any]:
        """
        Calculate traffic density based on object counts.
        Args:
            counts: Dictionary of detected object counts.
        Returns:
            Dictionary with 'density_score' and 'category'.
        """
        # Calculate overall density score
        density_score = sum(counts.values())

        if density_score <= self.thresholds["low"]:
            category = "low"
        elif density_score <= self.thresholds["medium"]:
            category = "medium"
        else:
            category = "high"

        return {
            "density_score": density_score,
            "category": category
        }

# Singleton instance
traffic_analyzer = TrafficAnalyzer()
