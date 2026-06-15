# Maintenance Wizard for Industrial Equipment
**Tata Steel AI Hackathon 2026 - Agentic AI Challenge**

## Overview
The **Maintenance Wizard** is an intelligent decision-support system designed for steel manufacturing environments. It leverages Agentic AI to diagnose equipment issues, predict failures, and provide actionable recommendations by integrating diverse data sources.

### Key Features
- **Intelligent Diagnosis**: Combines real-time sensor logs with historical maintenance records and technical SOPs.
- **Predictive Analytics**: Trend-based anomaly detection and failure forecasting.
- **RAG-Powered Knowledge**: Instant retrieval of critical information from technical manuals.
- **Explainable Insights**: Provides reasoning for every recommendation, including risk assessment and prioritization.
- **Continuous Learning**: A feedback loop that incorporates resolution actions back into the system's knowledge base.

## Project Structure
- `backend/`: FastAPI server with LangChain agents and predictive logic.
- `frontend/`: React (Vite) dashboard with industrial UI.
- `data/`: Sample logs, manuals, and historical records.

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js & npm

### Setup
1. **Environment Variables**:
   Create a `backend/.env` file:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
   *Note: If no API key is provided, the system runs in **Mock Mode** for demonstration.*

2. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Run the Application**:
   From the root directory:
   ```bash
   python start.py
   ```

## Deployment & Demo
This project is designed to be easily deployed to the cloud for judge access.

### 1. Frontend (Vercel/Netlify)
- Set `VITE_API_URL` environment variable to your deployed backend URL.
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Backend (Render/Railway/Fly.io)
- Set `OPENAI_API_KEY` in environment variables.
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### 3. Live Demo Link
[Insert Your Deployed URL Here]

## Innovation & Scalability
- **Autonomous Multi-Agent Debate**: The system simulates a "consensus loop" between specialized agents (Analyst, Reliability, Safety) to resolve conflicts before finalizing a diagnosis.
- **Visual Digital Twin**: A real-time 3D-lite overlay of the industrial equipment that highlights failing components.
- **Stateful Agentic Memory**: The system maintains context across conversation turns using LangChain memory.
- **Explainable ReAct Engine**: Every decision is traced back to specific tools (RAG, Logs, History) with a visual "Thinking Process" feed.
