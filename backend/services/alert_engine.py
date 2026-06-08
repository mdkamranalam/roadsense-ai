from typing import List, Dict, Any

class AlertEngine:
    def __init__(self):
        # Define alert levels
        self.levels = {
            "critical": "CRITICAL WARNING",
            "high": "HIGH ALERT",
            "medium": "CAUTION",
            "low": "SAFE"
        }
        
    def generate_alerts(self, analysis_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate adaptive alerts based on the risk score, road context, and detected hazards.
        Args:
            analysis_data: The summary report from the intelligence layer.
        Returns:
            List of alerts with priority and message.
        """
        summary = analysis_data.get("summary", {})
        risk_score = summary.get("risk_score", 0)
        road_type = summary.get("road_type", "urban_traffic")
        risk_level = summary.get("risk_level", "low")
        total_hazards = summary.get("total_hazards_detected", 0)

        alerts = []

        # 1. Risk-Based Alerts
        if risk_score > 80:
            alerts.append({
                "priority": "critical",
                "message": "EMERGENCY: Immediate danger detected! Slow down or stop.",
                "level": self.levels["critical"]
            })
        elif risk_score > 60:
            alerts.append({
                "priority": "high",
                "message": "High risk situation. Maintain maximum alertness.",
                "level": self.levels["high"]
            })
        elif risk_score > 40:
            alerts.append({
                "priority": "medium",
                "message": "Caution: Potential hazards ahead.",
                "level": self.levels["medium"]
            })
        else:
            alerts.append({
                "priority": "low",
                "message": "Road conditions are currently safe.",
                "level": self.levels["low"]
            })

        # 2. Context-Aware Adaptive Alerts
        # Same risk level but different message based on environment
        if risk_level == "high" or risk_level == "medium":
            if road_type == "market_area":
                alerts.append({
                    "priority": "high",
                    "message": "Market Area: Pedestrians likely to cross. Slow down immediately.",
                    "level": self.levels["high"]
                })
            elif road_type == "school_zone":
                alerts.append({
                    "priority": "high",
                    "message": "School Zone: Children may be nearby. Reduce speed.",
                    "level": self.levels["high"]
                })
            elif road_type == "highway":
                alerts.append({
                    "priority": "medium",
                    "message": "Highway: Maintain safe following distance.",
                    "level": self.levels["medium"]
                })
            elif road_type == "village_road":
                alerts.append({
                    "priority": "medium",
                    "message": "Village Road: Watch out for animals or livestock.",
                    "level": self.levels["medium"]
                })

        # 3. Hazard-Specific Alerts
        if total_hazards > 0:
            alerts.append({
                "priority": "medium",
                "message": f"Detected {total_hazards} potential road hazards in this segment.",
                "level": self.levels["medium"]
            })

        return alerts

# Singleton instance
alert_engine = AlertEngine()