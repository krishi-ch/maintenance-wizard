import pandas as pd
import os
from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from rag_engine import RAGEngine

class MaintenanceWizardAgent:
    def __init__(self, model_name: str = "gpt-4-turbo-preview"):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.llm = ChatOpenAI(model_name=model_name, temperature=0)
            self.rag_engine = RAGEngine()
        else:
            print("WARNING: OPENAI_API_KEY not found. Running in MOCK mode.")
            self.llm = None
            self.rag_engine = None
        
    def load_data(self):
        logs_df = pd.read_csv("data/logs/sensor_logs.csv")
        history_df = pd.read_csv("data/logs/maintenance_history.csv")
        return logs_df, history_df

    def analyze_issue(self, query: str) -> Dict[str, Any]:
        if not self.llm:
            return self._mock_analysis(query)
            
        # 1. Retrieve relevant knowledge from manuals
        knowledge_docs = self.rag_engine.query(query)
        knowledge_context = "\n".join([doc.page_content for doc in knowledge_docs])

        # 2. Load and filter relevant logs/history
        logs_df, history_df = self.load_data()
        # Simple heuristic: last 5 log entries
        recent_logs = logs_df.tail(10).to_string()
        past_incidents = history_df.to_string()

        # 3. Prompt for diagnosis
        prompt = ChatPromptTemplate.from_template("""
        You are the Maintenance Wizard for an industrial steel plant. 
        Your goal is to diagnose equipment issues and provide actionable recommendations.

        User Query: {query}

        Relevant Technical Manuals/SOPs:
        {knowledge_context}

        Recent Sensor Logs:
        {recent_logs}

        Historical Maintenance Records:
        {past_incidents}

        Please provide a detailed report including:
        1. **Current Status Assessment**: What is happening right now?
        2. **Root Cause Analysis**: Why is this happening? (Compare logs with SOPs and history)
        3. **Risk Assessment**: What happens if not fixed?
        4. **Actionable Recommendations**: Step-by-step instructions.
        5. **Prioritization**: How urgent is this? (Low/Medium/High/Critical)
        """)

        chain = prompt | self.llm
        response = chain.invoke({
            "query": query,
            "knowledge_context": knowledge_context,
            "recent_logs": recent_logs,
            "past_incidents": past_incidents
        })

        return {
            "analysis": response.content,
            "status": "completed"
        }

    def _mock_analysis(self, query: str) -> Dict[str, Any]:
        return {
            "analysis": f"""
            ### [MOCK MODE] Analysis for: "{query}"

            **1. Current Status Assessment**
            Based on recent logs, BF-01 is showing a critical decline in flow rate (from 55.2 to 38.2 m3/h) and a sharp increase in Delta T (from 6.5 to 12.4°C). This indicates a severe cooling system efficiency loss.

            **2. Root Cause Analysis**
            Historical records (REC-101, REC-102) suggest that similar patterns were caused by filter blockages or scale buildup. Given the rapid onset, a filter blockage or a sudden valve malfunction is highly likely.

            **3. Risk Assessment**
            - **Structural Integrity**: High risk of furnace shell overheating.
            - **Production Loss**: Immediate shutdown may be required if Delta T exceeds 15°C.

            **4. Actionable Recommendations**
            - Check primary filters for BF-01 immediately.
            - Inspect pump P-202 for efficiency drop.
            - If flow doesn't recover, initiate chemical descaling as per SOP Section 2.

            **5. Prioritization**
            **CRITICAL**. Immediate intervention required.
            """,
            "status": "completed (mock)"
        }

if __name__ == "__main__":
    agent = MaintenanceWizardAgent()
    result = agent.analyze_issue("The flow rate is dropping and Delta T is rising on BF-01. What should I do?")
    print(result["analysis"])
