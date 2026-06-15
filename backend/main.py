from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from diagnostic_agent import MaintenanceWizardAgent
from predictive_engine import PredictiveEngine
from agents import MaintenanceOrchestrator
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Maintenance Wizard API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = MaintenanceWizardAgent()
orchestrator = MaintenanceOrchestrator()
predictive_engine = PredictiveEngine()

class QueryRequest(BaseModel):
    query: str
    equipment_id: Optional[str] = "BF-01"

class ResolveRequest(BaseModel):
    equipment_id: str
    issue: str
    root_cause: str
    action_taken: str

class AnalysisResponse(BaseModel):
    analysis: str
    status: str
    prediction: Optional[dict] = None
    thought_process: Optional[List[str]] = None
    sources: Optional[List[str]] = None
    debate: Optional[List[dict]] = None

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_equipment(request: QueryRequest):
    try:
        # Use provided equipment ID
        eq_id = request.equipment_id or "BF-01"
        
        # Use the new Multi-Agent Orchestrator
        result = orchestrator.run_workflow(request.query)
        prediction = predictive_engine.predict_failures(eq_id)
        
        return {
            "analysis": result["analysis"],
            "status": "completed (agentic)",
            "prediction": prediction,
            "thought_process": result["thought_process"],
            "sources": result["sources"],
            "debate": result.get("debate")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/resolve")
async def resolve_issue(request: ResolveRequest):
    try:
        import pandas as pd
        history_path = "data/logs/maintenance_history.csv"
        df = pd.read_csv(history_path)
        
        new_record = {
            "record_id": f"REC-{len(df) + 101}",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "equipment_id": request.equipment_id,
            "issue": request.issue,
            "root_cause": request.root_cause,
            "action_taken": request.action_taken,
            "outcome": "Resolved"
        }
        
        df = pd.concat([df, pd.DataFrame([new_record])], ignore_index=True)
        df.to_csv(history_path, index=False)
        
        return {"status": "success", "record_id": new_record["record_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
