import unittest
from backend.models.risk_predictor import risk_predictor
from backend.services.alert_engine import alert_engine

class TestIntelligenceLayer(unittest.TestCase):
    def test_risk_prediction_low(self):
        """Test low risk scenario"""
        data = {
            "counts": {"cars": 1, "bikes": 0, "pedestrians": 0},
            "density_score": 5,
            "hazards_count": 0,
            "driver_type": "defensive"
        }
        result = risk_predictor.calculate_risk(data)
        self.assertLess(result["risk_score"], 30)
        self.assertEqual(result["risk_level"], "low")

    def test_risk_prediction_high(self):
        """Test high risk scenario"""
        data = {
            "counts": {"cars": 10, "bikes": 10, "pedestrians": 15},
            "density_score": 45,
            "hazards_count": 5,
            "driver_type": "aggressive"
        }
        result = risk_predictor.calculate_risk(data)
        self.assertGreater(result["risk_score"], 70)
        self.assertEqual(result["risk_level"], "high")

    def test_adaptive_alerts_market_area(self):
        """Test alerts for market area high risk"""
        analysis_data = {
            "summary": {
                "road_type": "market_area",
                "risk_score": 85,
                "risk_level": "high",
                "total_hazards_detected": 2
            }
        }
        alerts = alert_engine.generate_alerts(analysis_data)
        # Should contain a critical alert and a market-specific alert
        messages = [a["message"] for a in alerts]
        self.assertTrue(any("EMERGENCY" in m for m in messages))
        self.assertTrue(any("Market Area" in m for m in messages))

    def test_adaptive_alerts_safe(self):
        """Test alerts for safe conditions"""
        analysis_data = {
            "summary": {
                "road_type": "highway",
                "risk_score": 10,
                "risk_level": "low",
                "total_hazards_detected": 0
            }
        }
        alerts = alert_engine.generate_alerts(analysis_data)
        self.assertEqual(alerts[0]["level"], "SAFE")

if __name__ == "__main__":
    unittest.main()
