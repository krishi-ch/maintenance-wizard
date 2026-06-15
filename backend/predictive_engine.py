import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class PredictiveEngine:
    def __init__(self, log_path: str = "data/logs/sensor_logs.csv"):
        self.log_path = log_path

    def predict_failures(self, equipment_id: str):
        df = pd.read_csv(self.log_path)
        df_eq = df[df['equipment_id'] == equipment_id]
        
        # Simple trend analysis
        # For Flow_Rate
        flow_data = df_eq[df_eq['sensor_type'] == 'Flow_Rate']
        if len(flow_data) < 2:
            return {"status": "insufficient_data"}
            
        current_flow = flow_data.iloc[-1]['value']
        prev_flow = flow_data.iloc[-2]['value']
        flow_trend = current_flow - prev_flow
        
        # For Delta_T
        temp_data = df_eq[df_eq['sensor_type'] == 'Delta_T']
        current_temp = temp_data.iloc[-1]['value']
        prev_temp = temp_data.iloc[-2]['value']
        temp_trend = current_temp - prev_temp
        
        # Prediction Logic (Heuristic)
        # If flow is decreasing and temp is increasing, predict failure
        risk_score = 0
        if flow_trend < 0:
            risk_score += abs(flow_trend) * 10
        if temp_trend > 0:
            risk_score += temp_trend * 15
            
        failure_eta_hours = 0
        if risk_score > 50:
            failure_eta_hours = max(1, 48 - (risk_score / 2))
            
        return {
            "equipment_id": equipment_id,
            "risk_score": round(risk_score, 2),
            "predicted_failure_eta": f"{round(failure_eta_hours, 1)} hours" if failure_eta_hours > 0 else "N/A",
            "confidence": "Medium",
            "anomalies_detected": [
                f"Flow rate decreasing at {abs(round(flow_trend, 2))} m3/h^2",
                f"Delta T increasing at {round(temp_trend, 2)} C/h"
            ]
        }

if __name__ == "__main__":
    engine = PredictiveEngine()
    print(engine.predict_failures("BF-01"))
