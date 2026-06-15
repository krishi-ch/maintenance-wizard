import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wrench, 
  AlertTriangle, 
  Activity, 
  History, 
  Send, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Thermometer,
  Droplets,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Plus,
  BarChart3,
  Calendar,
  MessageSquare,
  BookOpen,
  Download,
  ZapOff,
  Clock,
  BrainCircuit,
  TreePine,
  AlertOctagon,
  TrendingUp,
  Lightbulb,
  Play,
  Settings2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart, 
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [query, setQuery] = useState('');
  const [selectedEq, setSelectedEq] = useState('BF-01');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [isFaultMode, setIsFaultMode] = useState(false);
  const [showWorkOrder, setShowWorkOrder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [simulatingScenario, setSimulatingScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  // Mock fleet stats - now dynamic!
  const [fleetData, setFleetData] = useState({
    'BF-01': isFaultMode ? {
      flow: 32.1, temp: 16.8, status: 'EMERGENCY', flowTrend: '▼ 48%', tempTrend: '▲ 140%'
    } : {
      flow: 38.2, temp: 12.4, status: 'CRITICAL', flowTrend: '▼ 31%', tempTrend: '▲ 85%'
    },
    'BF-02': { flow: 59.8, temp: 4.7, status: 'NORMAL', flowTrend: '▼ 0.5%', tempTrend: '▲ 4%' },
    'BF-03': { flow: 65.2, temp: 3.2, status: 'OPTIMAL', flowTrend: '▲ 1.2%' },
    'BF-04': { flow: 62.5, temp: 3.8, status: 'NORMAL', flowTrend: '▲ 0.8%', tempTrend: '▼ 1.2%' },
    'BF-05': { flow: 57.3, temp: 5.1, status: 'WARNING', flowTrend: '▼ 8.3%', tempTrend: '▲ 12.5%' },
    'BF-06': { flow: 68.9, temp: 2.9, status: 'OPTIMAL', flowTrend: '▲ 2.1%', tempTrend: '▼ 0.5%' },
  });

  // Simulate real-time data updates!
  useEffect(() => {
    const interval = setInterval(() => {
      setFleetData(prev => {
        const newData = {...prev};
        Object.keys(newData).forEach(id => {
          // Randomly fluctuate flow and temp slightly
          const currentFlow = newData[id].flow;
          const currentTemp = newData[id].temp;
          
          // Keep changes within reasonable bounds
          const flowChange = (Math.random() - 0.5) * 2; // ±1 m³/h
          const tempChange = (Math.random() - 0.5) * 0.5; // ±0.25°C
          
          let newFlow = Math.max(20, Math.min(75, currentFlow + flowChange));
          let newTemp = Math.max(1, Math.min(25, currentTemp + tempChange));
          
          // Update status based on new values
          let newStatus = newData[id].status;
          if (newFlow < 40 || newTemp > 12) newStatus = 'CRITICAL';
          else if (newFlow < 50 || newTemp > 8) newStatus = 'WARNING';
          else if (newFlow > 60 && newTemp < 5) newStatus = 'OPTIMAL';
          else newStatus = 'NORMAL';
          
          newData[id] = {
            ...newData[id],
            flow: Math.round(newFlow * 10) / 10,
            temp: Math.round(newTemp * 10) / 10,
            status: newStatus
          };
        });
        return newData;
      });
    }, 2000); // Update every 2 seconds!
    
    return () => clearInterval(interval);
  }, []);
  const flowChartData = Object.entries(fleetData).map(([id, data]) => ({ name: id, flow: data.flow }));
  const tempChartData = Object.entries(fleetData).map(([id, data]) => ({ name: id, temp: data.temp }));

  // Maintenance logs mock data
  const maintenanceLogs = [
    { id: 1, equipment: 'BF-01', date: '2026-06-10', type: 'Emergency', status: 'Completed', technician: 'John Doe' },
    { id: 2, equipment: 'BF-02', date: '2026-06-08', type: 'Preventive', status: 'Scheduled', technician: 'Jane Smith' },
    { id: 3, equipment: 'BF-03', date: '2026-06-05', type: 'Routine', status: 'Completed', technician: 'Bob Johnson' },
    { id: 4, equipment: 'BF-01', date: '2026-06-01', type: 'Repair', status: 'Completed', technician: 'Alice Williams' },
  ];

  // Energy Consumption data (new feature!)
  const energyConsumptionData = [
    { time: '00:00', BF01: 1200, BF02: 950, BF03: 880 },
    { time: '04:00', BF01: 1250, BF02: 980, BF03: 890 },
    { time: '08:00', BF01: 1300, BF02: 1000, BF03: 900 },
    { time: '12:00', BF01: 1450, BF02: 1020, BF03: 910 },
    { time: '16:00', BF01: 1380, BF02: 1010, BF03: 905 },
    { time: '20:00', BF01: 1320, BF02: 990, BF03: 895 },
  ];

  // Predictive Maintenance Data (new feature!)
  const predictiveData = [
    { id: 1, equipment: 'BF-01', failureRisk: 92, failureType: 'Cooling System Blockage', daysToFailure: 3, lastInspection: '2026-06-10', status: 'critical' },
    { id: 2, equipment: 'BF-02', failureRisk: 24, failureType: 'Fan Vibration', daysToFailure: 28, lastInspection: '2026-06-08', status: 'low' },
    { id: 3, equipment: 'BF-03', failureRisk: 56, failureType: 'Bearing Wear', daysToFailure: 12, lastInspection: '2026-06-05', status: 'medium' },
    { id: 4, equipment: 'BF-04', failureRisk: 11, failureType: 'Sensor Drift', daysToFailure: 45, lastInspection: '2026-06-03', status: 'low' },
    { id: 5, equipment: 'BF-05', failureRisk: 78, failureType: 'Hydraulic Leak', daysToFailure: 7, lastInspection: '2026-06-01', status: 'high' },
    { id: 6, equipment: 'BF-06', failureRisk: 8, failureType: 'Filter Clog', daysToFailure: 60, lastInspection: '2026-05-30', status: 'low' },
  ];

  // Carbon Footprint Data (new feature!)
  const carbonData = [
    { month: 'Jan', emissions: 1250, target: 1300 },
    { month: 'Feb', emissions: 1180, target: 1250 },
    { month: 'Mar', emissions: 1320, target: 1250 },
    { month: 'Apr', emissions: 1100, target: 1200 },
    { month: 'May', emissions: 1050, target: 1150 },
    { month: 'Jun', emissions: 980, target: 1100 },
  ];

  const carbonStats = {
    totalToday: 32.5,
    reductionYTD: 18.2,
    intensity: 0.85,
    creditsEarned: 1250
  };

  // AI Suggestions data (new feature!)
  const aiSuggestions = [
    {
      id: 1,
      priority: 'high',
      category: 'Energy',
      title: 'Optimize BF-01 Cooling Flow',
      description: 'Increase cooling flow to BF-01 by 12% to reduce temperature spikes and save ~500 kWh/day',
      impact: 'High',
      savings: '₹12,500/day',
      timeToImplement: '5 mins'
    },
    {
      id: 2,
      priority: 'medium',
      category: 'Maintenance',
      title: 'Schedule BF-03 Filter Change',
      description: 'Filter pressure drop is increasing – replace within 48 hours to avoid efficiency loss',
      impact: 'Medium',
      savings: '₹8,200/week',
      timeToImplement: '1 hour'
    },
    {
      id: 3,
      priority: 'low',
      category: 'Carbon',
      title: 'Adjust Burner Settings',
      description: 'Fine-tune BF-02 burner air-fuel ratio to reduce CO₂ emissions by 3%',
      impact: 'Low',
      savings: '₹5,100/month',
      timeToImplement: '15 mins'
    }
  ];

  // Digital Twin parameters (new feature!)
  const digitalTwinData = {
    BF01: {
      tempTop: 185,
      tempBottom: 115,
      pressure: 2.1,
      flowRate: 62,
      vibration: 2.3,
      status: 'warning'
    },
    BF02: {
      tempTop: 165,
      tempBottom: 98,
      pressure: 1.9,
      flowRate: 68,
      vibration: 1.8,
      status: 'normal'
    }
  };

  // Scenario Simulator data (new feature!)
  const scenarioData = [
    { id: 1, name: '20% Cooling Flow Drop', description: 'Simulate BF-01 cooling flow reduction', impact: 'Critical', tempRise: 45, energyImpact: '+1200 kWh/day' },
    { id: 2, name: '10% Fuel Efficiency Increase', description: 'Simulate burner optimization', impact: 'Positive', tempRise: -8, energyImpact: '-800 kWh/day' },
    { id: 3, name: 'Filter Blockage', description: 'Simulate 50% filter blockage', impact: 'High', tempRise: 28, energyImpact: '+500 kWh/day' }
  ];

  // Anomaly Timeline data (new feature!)
  const anomalyTimelineData = [
    { id: 1, time: '19:30:00', type: 'info', title: 'System Initialization', description: 'Monitoring system started' },
    { id: 2, time: '19:35:12', type: 'warn', title: 'Anomaly Detected', description: 'Delta T trend rising in Circuit 4' },
    { id: 3, time: '19:38:45', type: 'agent', title: 'AI Analysis', description: 'Cross-referencing with SOP-2026-BF' },
    { id: 4, time: '19:42:10', type: 'error', title: 'Critical Alert', description: 'Pressure drop detected' },
    { id: 5, time: '19:45:00', type: 'success', title: 'Maintenance Scheduled', description: 'Team dispatched' },
  ];

  // AI Thinking Process (new explainable AI feature!)
  const aiThinkingSteps = [
    { id: 1, agent: 'Data Analyst', status: 'complete', step: 'Gathering telemetry from all circuits' },
    { id: 2, agent: 'Data Analyst', status: 'complete', step: 'Identifying abnormal temperature patterns' },
    { id: 3, agent: 'Reliability Engineer', status: 'in-progress', step: 'Cross-referencing with historical failure data' },
    { id: 4, agent: 'Safety Officer', status: 'pending', step: 'Verifying safety protocols' },
    { id: 5, agent: 'Lead Agent', status: 'pending', step: 'Final recommendation' },
  ];

  // Monthly maintenance data
  const monthlyData = [
    { name: 'Jan', maintenance: 4, issues: 2 },
    { name: 'Feb', maintenance: 5, issues: 1 },
    { name: 'Mar', maintenance: 3, issues: 3 },
    { name: 'Apr', maintenance: 6, issues: 0 },
    { name: 'May', maintenance: 4, issues: 2 },
    { name: 'Jun', maintenance: 5, issues: 1 },
  ];

  // System status distribution data
  const statusDistribution = [
    { name: 'Optimal', value: 2, color: '#10b981' },
    { name: 'Normal', value: 2, color: '#3b82f6' },
    { name: 'Warning', value: 1, color: '#f97316' },
    { name: 'Critical', value: 1, color: '#ef4444' },
  ];

  // Temperature trend data
  const tempTrendData = [
    { time: '00:00', BF01: 8.2, BF02: 4.5, BF03: 3.1 },
    { time: '04:00', BF01: 9.1, BF02: 4.7, BF03: 3.2 },
    { time: '08:00', BF01: 10.5, BF02: 5.1, BF03: 3.5 },
    { time: '12:00', BF01: 12.4, BF02: 4.9, BF03: 3.3 },
    { time: '16:00', BF01: 11.8, BF02: 4.8, BF03: 3.4 },
    { time: '20:00', BF01: 10.9, BF02: 4.6, BF03: 3.2 },
  ];

  // Knowledge base documents
  const knowledgeBaseDocs = [
    {
      id: 1,
      title: 'SOP: Blast Furnace Cooling System Maintenance',
      category: 'Maintenance',
      lastUpdated: '2026-05-15',
      content: `# SOP: Blast Furnace Cooling System Maintenance

## Overview
The Blast Furnace Cooling System is critical for preventing structural damage to the furnace shell. It consists of cooling plates, staves, and a water circulation system.

## Standard Operating Procedures (SOP)
### 1. Daily Inspection
- Check water flow rates in all circuits. Normal range: 50-70 m³/h per circuit.
- Monitor inlet and outlet temperatures. Maximum differential (Delta T) should not exceed 10°C.
- Inspect for visible leaks on the furnace shell.

### 2. Common Issues and Diagnostics
#### Symptom: High Delta T (>10°C)
- **Possible Cause**: Reduced water flow or internal scale buildup.
- **Action**: Check for pump efficiency. If flow is normal, schedule a chemical cleaning (descaling).

#### Symptom: Low Water Flow (<40 m³/h)
- **Possible Cause**: Blockage in the piping or valve failure.
- **Action**: Inspect and clean the primary filters. Check valve positions.

#### Symptom: Sudden Drop in Pressure
- **Possible Cause**: Pipe burst or stave failure.
- **Action**: IMMEDIATE SHUTDOWN of the affected circuit. Switch to backup cooling if available.

## Safety Protocols
- Wear heat-resistant PPE when working near the furnace.
- Ensure all lockout/tagout (LOTO) procedures are followed before electrical maintenance.`
    },
    {
      id: 2,
      title: 'Industrial Safety Protocols - Tata Steel',
      category: 'Safety',
      lastUpdated: '2026-04-20',
      content: `# Industrial Safety Protocols - Tata Steel

## General Safety (LOTO)
- **Lockout/Tagout (LOTO)**: Mandatory for all electrical and mechanical maintenance.
- No personnel should enter the cooling circuit zone without a calibrated gas monitor.

## Chemical Safety
- Chemical descaling involves acidic solutions. 
- Full-body chemical-resistant suits and face shields are required.
- Neutralization pits must be checked before disposal.

## Heat Safety
- Working near the Blast Furnace shell requires aluminized heat-reflective suits.
- Maximum continuous exposure time: 15 minutes if shell temperature exceeds 200°C.`
    },
    {
      id: 3,
      title: 'Predictive Maintenance Guide',
      category: 'Predictive',
      lastUpdated: '2026-06-01',
      content: `# Predictive Maintenance Guide

## Overview
Predictive maintenance uses real-time data and analytics to predict equipment failures before they occur.

## Key Metrics to Monitor
- **Temperature Trends**: Sudden increases may indicate impending failure.
- **Flow Rates**: Decreases can signal blockages or pump issues.
- **Vibration Analysis**: Abnormal vibrations often precede mechanical failures.

## AI-Powered Prediction
Our Maintenance Wizard uses machine learning to analyze historical data and predict failures with 92% accuracy.`
    }
  ];

  const toggleFault = () => {
    setIsFaultMode(!isFaultMode);
    if (!isFaultMode) {
      addEvent('ALERT: Massive pressure drop detected on BF-01 Circuit 4!', 'error');
      addEvent('Agent: Initiating emergency cross-unit risk assessment...', 'agent');
    } else {
      addEvent('System: Telemetry normalized for BF-01.', 'info');
    }
  };

  const [events, setEvents] = useState([
    { id: 1, time: '19:30:00', msg: 'System initialized. Monitoring BF-01...', type: 'info' },
    { id: 2, time: '19:35:12', msg: 'Anomalous Delta T trend detected in Cooling Circuit 4.', type: 'warn' },
    { id: 3, time: '19:38:45', msg: 'Cross-referencing sensor data with SOP-2026-BF...', type: 'agent' },
  ]);

  const addEvent = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setEvents(prev => [{ id: `${Date.now()}-${Math.random()}`, time, msg, type }, ...prev].slice(0, 5));
  };

  // Mock chart data
  const chartData = [
    { time: '08:00', flow: 55, temp: 6.5 },
    { time: '09:00', flow: 54, temp: 7.1 },
    { time: '10:00', flow: 42, temp: 9.8 },
    { time: '11:00', flow: 38, temp: 12.4 },
    { time: '12:00', flow: 35, temp: 14.2 },
  ];

  const getAgentColor = (name) => {
    switch (name) {
      case 'Analyst': return 'text-emerald-400';
      case 'Reliability': return 'text-orange-400';
      case 'Safety': return 'text-purple-400';
      case 'Lead': return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  const handleResolve = async () => {
    try {
      await axios.post(`${API_BASE}/resolve`, {
        equipment_id: selectedEq,
        issue: query,
        root_cause: "Confirmed via Wizard Assessment",
        action_taken: "Maintenance team dispatched"
      });
      setResolved(true);
      addEvent(`Corrective Action Executed for ${selectedEq}. Maintenance crew notified via SMS/Radio.`, 'success');
      addEvent(`Historical database updated with resolution REC-${Math.floor(Math.random() * 1000)}.`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle quick commands and AI queries
  const handleQuickCommand = (cmd) => {
    let userMessage = '';
    let aiResponse = '';

    switch(cmd) {
      case 'check-status':
        userMessage = `Check status of ${selectedEq}`;
        const eqData = fleetData[selectedEq];
        aiResponse = `**${selectedEq} Status Report**\n\n**Current Status**: ${eqData.status}\n**Flow Rate**: ${eqData.flow} m³/h ${eqData.flowTrend || ''}\n**Temperature**: ${eqData.temp}°C ${eqData.tempTrend || ''}\n\n${eqData.status === 'OPTIMAL' || eqData.status === 'NORMAL' ? '✅ Equipment is operating within normal parameters.' : eqData.status === 'WARNING' ? '⚠️ Monitor closely - some parameters are outside optimal range.' : '🚨 Critical issues detected - immediate attention required!'}`;
        break;
      case 'check-fleet':
        userMessage = 'Check fleet overview';
        const fleetStatus = Object.entries(fleetData).map(([id, data]) => `- ${id}: ${data.status}`).join('\n');
        aiResponse = `**Fleet Overview**\n\n${fleetStatus}\n\n**Total Equipment**: ${Object.keys(fleetData).length}\n**Optimal**: ${Object.values(fleetData).filter(d => d.status === 'OPTIMAL').length}\n**Normal**: ${Object.values(fleetData).filter(d => d.status === 'NORMAL').length}\n**Warning**: ${Object.values(fleetData).filter(d => d.status === 'WARNING').length}\n**Critical**: ${Object.values(fleetData).filter(d => d.status === 'CRITICAL' || d.status === 'EMERGENCY').length}`;
        break;
      case 'check-safety':
        userMessage = 'Show safety protocols';
        aiResponse = `**Safety Protocols**\n\n1. **Lockout/Tagout (LOTO)**: Always follow LOTO procedures before maintenance\n2. **PPE Requirements**:\n   - Heat-resistant suits near furnace\n   - Chemical-resistant gear for descaling\n3. **Gas Monitoring**: No entry without calibrated gas monitor\n4. **Exposure Limits**: Max 15 min continuous exposure at >200°C\n\nFor complete safety procedures, see the Knowledge Base.`;
        break;
      case 'check-maintenance':
        userMessage = 'Show maintenance history';
        const history = maintenanceLogs.map(log => `- ${log.date}: ${log.equipment} - ${log.type} (${log.status})`).join('\n');
        aiResponse = `**Maintenance History**\n\n${history}`;
        break;
      default:
        return;
    }

    // Add messages to conversation
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: 'user', text: userMessage },
      { id: Date.now() + 1, type: 'ai', text: aiResponse }
    ]);
    setQuery('');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: query }]);
    const currentQuery = query;
    setQuery('');
    
    setLoading(true);
    setError(null);
    setResolved(false);
    addEvent(`Analyzing ${selectedEq} request: "${currentQuery.slice(0, 30)}..."`, 'agent');
    
    try {
      const response = await axios.post(`${API_BASE}/analyze`, { 
        query: currentQuery, 
        equipment_id: selectedEq 
      });
      
      // Add AI response
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'ai', 
        text: response.data.analysis 
      }]);
      
      setAnalysis(response.data);
      addEvent(`Analysis complete for ${selectedEq}. Priority: ${response.data.prediction?.risk_score > 50 ? 'CRITICAL' : 'HIGH'}`, 'success');
    } catch (err) {
      // Fallback to mock response if API fails
      const fallbackResponse = `I'm analyzing "${currentQuery}" for ${selectedEq}.\n\nBased on current data:\n- Flow rate: ${fleetData[selectedEq].flow} m³/h\n- Temperature: ${fleetData[selectedEq].temp}°C\n- Status: ${fleetData[selectedEq].status}\n\n**Recommendation**: ${fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'Schedule immediate maintenance.' : 'Continue routine monitoring.'}`;
      
      setMessages(prev => [...prev, { id: Date.now(), type: 'ai', text: fallbackResponse }]);
      
      setError('Using offline mode - showing cached analysis.');
      addEvent('Offline Mode Activated', 'warn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysis = (text) => {
    return text.split('\n\n').map((section, idx) => {
      if (section.startsWith('###')) {
        return <h3 key={idx} className="text-xl font-bold text-cyan-400 mt-4 mb-2">{section.replace('###', '')}</h3>;
      }
      if (section.includes('**')) {
        const title = section.split('\n')[0].replace(/\*\*/g, '');
        const body = section.split('\n').slice(1).join('\n');
        return (
          <div key={idx} className="mb-4 bg-slate-800/50 p-4 rounded-lg border border-emerald-800/30">
            <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
              {title.includes('Status') && <Activity size={18} className="text-emerald-400" />}
              {title.includes('Root Cause') && <Cpu size={18} className="text-purple-400" />}
              {title.includes('Risk') && <AlertTriangle size={18} className="text-orange-400" />}
              {title.includes('Recommendations') && <CheckCircle2 size={18} className="text-cyan-400" />}
              {title.includes('Prioritization') && <AlertCircle size={18} className="text-red-400" />}
              {title}
            </h4>
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {body}
            </div>
          </div>
        );
      }
      return <p key={idx} className="text-slate-300 mb-2">{section}</p>;
    });
  };

  // Simple markdown renderer
  const renderMarkdown = (text) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className={`text-xl font-bold mb-3 mt-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className={`text-lg font-semibold mb-2 mt-3 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className={`ml-4 mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{line}</p>;
    });
  };

  // Export functions
  const exportAsMarkdown = (doc) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportMaintenanceLogsAsCSV = () => {
    const headers = ['Equipment', 'Date', 'Type', 'Status', 'Technician'];
    const csvContent = [
      headers.join(','),
      ...maintenanceLogs.map(log => [
        log.equipment,
        log.date,
        log.type,
        log.status,
        log.technician
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen w-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-emerald-950 via-slate-950 to-indigo-950 text-slate-100' : 'bg-gradient-to-br from-emerald-50 via-slate-50 to-indigo-50 text-slate-900'}`}>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-slate-900/80 border-emerald-800/30' : 'bg-white/80 border-emerald-200/50'} backdrop-blur-xl border-r transition-all duration-300 flex flex-col`}>
          <div className={`p-6 flex items-center gap-3 border-b ${darkMode ? 'border-emerald-800/20' : 'border-emerald-200/30'}`}>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg shadow-emerald-900/40">
              <Wrench className="text-white" size={24} />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`text-lg font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Nexus<span className="text-emerald-500">Ops</span></h1>
                <p className={`text-xs ${darkMode ? 'text-emerald-400/70' : 'text-emerald-700/70'} uppercase tracking-widest`}>Maintenance Hub</p>
              </div>
            )}
          </div>

          <nav className="flex-1 py-6 px-3 space-y-2">
                    {[
                      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                      { id: 'maintenance', icon: Calendar, label: 'Maintenance Logs' },
                      { id: 'energy', icon: Zap, label: 'Energy Analytics' },
                      { id: 'predictive', icon: BrainCircuit, label: 'Predictive Maintenance' },
                      { id: 'carbon', icon: TreePine, label: 'Carbon Tracker' },
                      { id: 'suggestions', icon: Lightbulb, label: 'AI Suggestions' },
                      { id: 'digitaltwin', icon: Cpu, label: 'Digital Twin' },
                      { id: 'simulator', icon: Settings2, label: 'Scenario Simulator' },
                      { id: 'comparison', icon: BarChart3, label: 'Fleet Comparison' },
                      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                      { id: 'knowledge', icon: BookOpen, label: 'Knowledge Base' },
                      { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/30'
                            : darkMode
                            ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <item.icon size={20} />
                        {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
                      </button>
                    ))}
                  </nav>

          <div className={`p-4 border-t ${darkMode ? 'border-emerald-800/20' : 'border-emerald-200/30'}`}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                darkMode
                  ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
              {sidebarOpen && <span className="font-bold text-sm">Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className={`backdrop-blur-xl border-b px-8 py-4 flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'bg-slate-900/60 border-emerald-800/20' : 'bg-white/60 border-emerald-200/30'}`}>
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2 rounded-lg ${darkMode ? 'bg-slate-800/50 text-slate-400 hover:text-white' : 'bg-emerald-50 text-slate-600 hover:text-emerald-700'}`}
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'maintenance' && 'Maintenance History'}
                  {activeTab === 'energy' && 'Energy Analytics'}
                  {activeTab === 'predictive' && 'Predictive Maintenance'}
                  {activeTab === 'carbon' && 'Carbon Footprint Tracker'}
                  {activeTab === 'suggestions' && 'AI Optimization Suggestions'}
                  {activeTab === 'digitaltwin' && 'Digital Twin Visualization'}
                  {activeTab === 'simulator' && 'Predictive Scenario Simulator'}
                  {activeTab === 'comparison' && 'Fleet Comparison & 2D Furnace View'}
                  {activeTab === 'analytics' && 'Analytics & Reports'}
                  {activeTab === 'knowledge' && 'Knowledge Base'}
                  {activeTab === 'chat' && 'AI Maintenance Assistant'}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-end">
              <button
                onClick={toggleFault}
                className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 border ${
                  isFaultMode 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-900/40' 
                  : darkMode
                  ? 'bg-slate-800/50 text-slate-300 border-emerald-800/30 hover:bg-slate-800'
                  : 'bg-emerald-50 text-slate-700 border-emerald-200/50 hover:bg-emerald-100'
                }`}
              >
                <AlertTriangle size={16} />
                {isFaultMode ? 'FAULT ACTIVE' : 'SIMULATE FAULT'}
              </button>

              <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200/50'} overflow-x-auto max-w-[350px]`}>
                {Object.keys(fleetData).map(eq => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEq(eq)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                      selectedEq === eq 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md' 
                      : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-100/50'
                    }`}
                  >
                    {eq}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-all"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  )}
                </button>
                <button className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-emerald-800/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black">U</div>
                  {sidebarOpen && <span className="text-sm font-bold text-slate-300">User</span>}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Equipment</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{Object.keys(fleetData).length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500 font-bold">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      All Systems Online
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-slate-900/70 border-orange-800/30' : 'bg-white/70 border-orange-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Critical Alerts</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{isFaultMode ? '2' : '1'}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <AlertTriangle size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-orange-500 font-bold">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      Immediate Attention
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-slate-900/70 border-blue-800/30' : 'bg-white/70 border-blue-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Maintenance Score</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>92%</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-blue-500 font-bold">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Excellent Performance
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-slate-900/70 border-purple-800/30' : 'bg-white/70 border-purple-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pending Tasks</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>5</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Calendar size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-500 font-bold">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      This Week
                    </div>
                  </div>
                </div>

                {/* Fleet Overview */}
                <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Activity size={16} className="text-emerald-500" />
                      Fleet Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(fleetData).map(([eq, data]) => (
                      <div key={eq} onClick={() => setSelectedEq(eq)} className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-105 min-h-[140px] flex flex-col justify-between ${
                        selectedEq === eq 
                          ? (darkMode ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg' : 'bg-emerald-50 border-emerald-300/50 shadow-md') 
                          : (darkMode ? 'bg-slate-800/30 border-slate-700/30 hover:border-emerald-800/30 hover:bg-slate-800/40' : 'bg-slate-50 border-slate-200/30 hover:border-emerald-200/30 hover:bg-slate-100/50')
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{eq}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            data.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400' :
                            data.status === 'NORMAL' ? 'bg-blue-500/20 text-blue-400' :
                            data.status === 'WARNING' ? 'bg-orange-500/20 text-orange-400' :
                            data.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            'bg-pink-500/20 text-pink-400'
                          }`}>{data.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className={`font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Flow</div>
                            <div className={`font-black text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{data.flow} m³/h</div>
                            {data.flowTrend && (
                              <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                                data.flowTrend.includes('▼') ? 'text-orange-400' : 'text-emerald-400'
                              }`}>
                                {data.flowTrend}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={`font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Temp</div>
                            <div className={`font-black text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{data.temp} °C</div>
                            {data.tempTrend && (
                              <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                                data.tempTrend.includes('▲') ? 'text-orange-400' : 'text-emerald-400'
                              }`}>
                                {data.tempTrend}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telemetry & Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Telemetry */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`backdrop-blur-xl border p-6 rounded-2xl relative overflow-hidden group min-h-[180px] ${darkMode ? 'bg-slate-900/70 border-cyan-800/30' : 'bg-white/70 border-cyan-200/50 shadow-sm'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Droplets size={48} className="text-cyan-500" />
                        </div>
                        <div className={`text-xs font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Flow Rate</div>
                        <div className={`text-2xl md:text-3xl font-black tracking-tight break-words ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {fleetData[selectedEq].flow} <span className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>m³/h</span>
                        </div>
                        <div className={`text-xs mt-3 font-bold flex items-center gap-2 ${fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'text-red-500' : 'text-emerald-500'}`}>
                          <Zap size={14} /> {fleetData[selectedEq].flowTrend} deviation
                        </div>
                      </div>

                      <div className={`backdrop-blur-xl border p-6 rounded-2xl relative overflow-hidden group min-h-[180px] ${darkMode ? 'bg-slate-900/70 border-orange-800/30' : 'bg-white/70 border-orange-200/50 shadow-sm'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Thermometer size={48} className="text-orange-500" />
                        </div>
                        <div className={`text-xs font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Delta Temperature</div>
                        <div className={`text-2xl md:text-3xl font-black tracking-tight break-words ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {fleetData[selectedEq].temp} <span className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>°C</span>
                        </div>
                        <div className={`text-xs mt-3 font-bold flex items-center gap-2 ${fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'text-red-500' : 'text-emerald-500'}`}>
                          <AlertTriangle size={14} /> {fleetData[selectedEq].tempTrend} rise
                        </div>
                      </div>

                      <div className={`backdrop-blur-xl border p-6 rounded-2xl relative overflow-hidden group min-h-[180px] ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <ShieldCheck size={48} className={fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'text-red-500' : 'text-emerald-500'} />
                        </div>
                        <div className={`text-xs font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Predictive Health</div>
                        <div className={`text-2xl md:text-3xl font-black tracking-tight break-words ${fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {fleetData[selectedEq].status}
                        </div>
                        <div className={`text-xs mt-3 font-medium italic ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {fleetData[selectedEq].status === 'CRITICAL' || fleetData[selectedEq].status === 'EMERGENCY' ? 'Urgent maintenance required' : 'System stable'}
                        </div>
                      </div>
                    </div>

                    {/* Area Chart */}
                    <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <LayoutDashboard size={16} className="text-emerald-500" />
                          Predictive Trend Analysis
                        </h3>
                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
                          <span className="flex items-center gap-2 text-cyan-500"><div className="w-2 h-2 bg-cyan-500 rounded-full"/> Flow</span>
                          <span className="flex items-center gap-2 text-orange-500"><div className="w-2 h-2 bg-orange-500 rounded-full"/> Temp</span>
                        </div>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                            <XAxis dataKey="time" stroke={darkMode ? '#64748b' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke={darkMode ? '#64748b' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: `1px solid ${darkMode ? '#065f46' : '#a7f3d0'}`, borderRadius: '8px', fontSize: '12px' }}
                              itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                            <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AI Assistant */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30 shadow-emerald-900/20' : 'bg-white/70 border-emerald-200/50 shadow-emerald-200/40'}`}>
                      <h2 className={`text-xl font-black mb-4 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Send size={20} className="text-emerald-500" />
                        AI Maintenance Assistant
                      </h2>
                      <form onSubmit={handleAnalyze} className="relative">
                        <textarea
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask the AI to diagnose an issue or check safety protocols..."
                          className={`w-full border rounded-xl px-4 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none h-32 font-medium ${
                            darkMode
                              ? 'bg-slate-800/50 border-emerald-800/30 text-slate-200 placeholder-slate-500'
                              : 'bg-emerald-50/50 border-emerald-200/50 text-slate-800 placeholder-slate-500'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={loading || !query.trim()}
                          className="absolute bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:bg-slate-700 text-white p-3 rounded-xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send size={20} />
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Digital Twin */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-6 ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                        Digital Twin: {selectedEq}
                        <span className={`${
                          fleetData[selectedEq].status === 'OPTIMAL' ? 'text-emerald-500' :
                          fleetData[selectedEq].status === 'NORMAL' ? 'text-blue-500' :
                          fleetData[selectedEq].status === 'WARNING' ? 'text-orange-500' :
                          fleetData[selectedEq].status === 'CRITICAL' ? 'text-red-500' :
                          'text-pink-500'
                        } animate-pulse`}>● LIVE</span>
                      </h3>
                      <div className="h-48 w-full flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          {/* Background grid */}
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={darkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1"/>
                            </pattern>
                            <linearGradient id="twinBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={darkMode ? '#334155' : '#f8fafc'} />
                              <stop offset="100%" stopColor={darkMode ? '#1e293b' : '#e2e8f0'} />
                            </linearGradient>
                            <filter id="twinGlow">
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Furnace Body Shadow */}
                          <rect x="53" y="43" width="100" height="120" rx="8" fill="rgba(0,0,0,0.15)"/>
                          
                          {/* Blast Furnace Body */}
                          <rect x="50" y="40" width="100" height="120" rx="8" 
                            fill="url(#twinBodyGradient)" 
                            stroke={
                              fleetData[selectedEq].status === 'OPTIMAL' ? '#10b981' :
                              fleetData[selectedEq].status === 'NORMAL' ? '#3b82f6' :
                              fleetData[selectedEq].status === 'WARNING' ? '#f97316' :
                              fleetData[selectedEq].status === 'CRITICAL' ? '#ef4444' :
                              '#ec4899'
                            } 
                            strokeWidth="4"
                            filter="url(#twinGlow)"
                          />
                          
                          {/* Top Stack */}
                          <rect x="75" y="20" width="50" height="22" rx="5" 
                            fill={darkMode ? '#475569' : '#cbd5e1'} 
                            stroke={
                              fleetData[selectedEq].status === 'OPTIMAL' ? '#10b981' :
                              fleetData[selectedEq].status === 'NORMAL' ? '#3b82f6' :
                              fleetData[selectedEq].status === 'WARNING' ? '#f97316' :
                              fleetData[selectedEq].status === 'CRITICAL' ? '#ef4444' :
                              '#ec4899'
                            }
                            strokeWidth="2"
                          />
                          
                          {/* Cooling Circuits */}
                          {[58, 83, 108].map((y, i) => (
                            <g key={i}>
                              {/* Left Panel */}
                              <rect x="60" y={y} width="30" height="18" rx="3" 
                                fill={
                                  fleetData[selectedEq].temp > 10 ? (i === 1 ? '#ef4444' : '#f87171') : '#10b981'
                                } 
                                className="animate-pulse"
                                opacity="0.9"
                              />
                              <rect x="63" y={y+3} width="12" height="5" rx="1.5" fill="rgba(255,255,255,0.35)"/>
                              
                              {/* Right Panel */}
                              <rect x="110" y={y} width="30" height="18" rx="3" 
                                fill={
                                  fleetData[selectedEq].temp > 10 ? (i === 0 ? '#ef4444' : '#f87171') : '#10b981'
                                } 
                                className="animate-pulse"
                                opacity="0.9"
                              />
                              <rect x="113" y={y+3} width="12" height="5" rx="1.5" fill="rgba(255,255,255,0.35)"/>
                            </g>
                          ))}
                          
                          {/* Flow Pipe */}
                          <rect x="40" y="138" width="120" height="16" rx="8" 
                            fill={darkMode ? '#0f172a' : '#f1f5f9'} 
                            stroke={darkMode ? '#334155' : '#e2e8f0'}
                            strokeWidth="2"
                          />
                          
                          {/* Flow Indicator */}
                          <rect x="50" y="142" width="100" height="8" rx="4" 
                            fill={
                              fleetData[selectedEq].flow < 40 ? '#ef4444' : 
                              fleetData[selectedEq].flow < 60 ? '#f59e0b' : 
                              '#06b6d4'
                            }
                          >
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.3s" repeatCount="indefinite"/>
                          </rect>
                          
                          <circle cx="100" cy="146" r="9" 
                            fill={
                              fleetData[selectedEq].flow < 40 ? '#ef4444' : 
                              fleetData[selectedEq].flow < 60 ? '#f59e0b' : 
                              '#06b6d4'
                            }
                            filter="url(#twinGlow)"
                          >
                            <animate attributeName="r" values="7;9;7" dur="1s" repeatCount="indefinite"/>
                          </circle>
                          
                          {/* Bolt Decorations */}
                          <circle cx="65" cy="55" r="3" fill={darkMode ? '#64748b' : '#94a3b8'} />
                          <circle cx="135" cy="55" r="3" fill={darkMode ? '#64748b' : '#94a3b8'} />
                          <circle cx="65" cy="145" r="3" fill={darkMode ? '#64748b' : '#94a3b8'} />
                          <circle cx="135" cy="145" r="3" fill={darkMode ? '#64748b' : '#94a3b8'} />
                        </svg>
                      </div>
                    </div>

                    {/* Agent Cluster */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-6 ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                        Agent Cluster Health
                        <span className="text-emerald-500 animate-pulse">● LIVE</span>
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Lead Orchestrator', status: 'Active', color: 'text-emerald-500' },
                          { name: 'Telemetry Analyst', status: 'Monitoring', color: 'text-cyan-500' },
                          { name: 'Reliability Engineer', status: 'Synced', color: 'text-orange-500' },
                          { name: 'Safety Validator', status: 'Standby', color: 'text-purple-500' },
                        ].map((agent, i) => (
                          <div key={i} className={`flex items-center justify-between group p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-emerald-50'}`}>
                            <span className={`text-sm font-bold transition-colors ${darkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{agent.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase ${agent.color}`}>{agent.status}</span>
                              <div className={`w-1.5 h-1.5 rounded-full bg-current ${agent.color}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Feed */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-6 flex flex-col h-80 ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                      <h3 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                        Agent Operations Feed
                      </h3>
                      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                        {events.map(event => (
                          <div key={event.id} className={`text-xs leading-relaxed border-l-2 pl-3 py-2 rounded-r-xl ${darkMode ? 'border-emerald-800/30 bg-slate-800/30' : 'border-emerald-200/50 bg-emerald-50/30'}`}>
                            <div className={`flex justify-between mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                              <span className="font-mono">{event.time}</span>
                              <span className={`px-2 py-0.5 rounded-sm font-black text-[9px] ${
                                event.type === 'error' ? 'bg-red-900/30 text-red-500' : 
                                event.type === 'warn' ? 'bg-orange-900/30 text-orange-500' : 
                                event.type === 'agent' ? 'bg-emerald-900/30 text-emerald-500' : darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                              }`}>{event.type}</span>
                            </div>
                            <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{event.msg}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {analysis && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {analysis.prediction && (
                      <div className="bg-gradient-to-r from-red-900/40 via-slate-900 to-slate-900 border border-red-800/50 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-red-900/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32" />
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-5">
                            <div className="bg-red-500 p-4 rounded-2xl shadow-lg shadow-red-500/20">
                              <AlertTriangle size={32} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-white tracking-tight">Failure Prediction Active</h3>
                              <p className="text-red-400 font-bold flex items-center gap-2">
                                <Activity size={16} /> High Risk Level Detected
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-12">
                            <div className="text-center">
                              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Time to Failure</div>
                              <div className="text-3xl font-black text-white tabular-nums">{analysis.prediction.predicted_failure_eta}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Risk Index</div>
                              <div className="text-3xl font-black text-red-400 tabular-nums">{analysis.prediction.risk_score}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysis.prediction.anomalies_detected.map((anomaly, i) => (
                            <div key={i} className="bg-slate-950/50 border border-red-800/20 px-4 py-3 rounded-xl text-sm text-slate-300 flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                              {anomaly}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detailed Assessment */}
                    <div className="bg-slate-900/70 backdrop-blur-xl border border-emerald-800/30 rounded-3xl overflow-hidden shadow-xl">
                      <div className="bg-slate-800/50 px-8 py-5 border-b border-emerald-800/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="text-emerald-500" size={20} />
                          <h2 className="text-lg font-black text-white uppercase tracking-tight">Maintenance Report: {selectedEq}</h2>
                          <div className="ml-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Agent Validated</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {analysis.sources && analysis.sources.map((src, i) => (
                            <span key={i} className="text-[10px] bg-cyan-500/10 px-2.5 py-1 rounded-full text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                              REF: {src}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="prose prose-invert max-w-none prose-headings:text-cyan-400 prose-strong:text-white prose-p:text-slate-300 prose-p:leading-relaxed">
                          {parseAnalysis(analysis.analysis)}
                        </div>
                        <div className="flex justify-end mt-8 border-t border-emerald-800/20 pt-8 gap-4">
                          <button
                            onClick={() => setShowWorkOrder(true)}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-800 text-slate-300 border border-emerald-800/30 hover:bg-slate-800 transition-all"
                          >
                            <FileText size={20} /> Preview Work Order
                          </button>
                          <button
                            onClick={handleResolve}
                            disabled={resolved}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:scale-105 ${
                              resolved 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xl shadow-emerald-900/40'
                            }`}
                          >
                            {resolved ? (
                              <><CheckCircle2 size={20} /> Resolution Logged</>
                            ) : (
                              <><Activity size={20} /> Execute Corrective Action</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Maintenance History</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={exportMaintenanceLogsAsCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all">
                      <Download size={16} />
                      Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-800 transition-all">
                      <Plus size={16} />
                      New Log
                    </button>
                  </div>
                </div>
                <div className={`backdrop-blur-xl border rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                  <table className="w-full text-left">
                    <thead className={darkMode ? 'bg-slate-800/50' : 'bg-emerald-50/50'}>
                      <tr>
                        <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Equipment</th>
                        <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Date</th>
                        <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Type</th>
                        <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Status</th>
                        <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Technician</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-emerald-800/20' : 'divide-emerald-200/30'}`}>
                      {maintenanceLogs.map((log) => (
                        <tr key={log.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-emerald-50/30'}`}>
                          <td className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{log.equipment}</td>
                          <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${
                              log.type === 'Emergency' ? 'bg-red-900/30 text-red-500' :
                              log.type === 'Preventive' ? 'bg-orange-900/30 text-orange-500' :
                              'bg-emerald-900/30 text-emerald-500'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${
                              log.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-500' :
                              'bg-yellow-900/30 text-yellow-500'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.technician}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Energy Consumption Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-yellow-800/30' : 'bg-white/70 border-yellow-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Total Energy (Today)</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>12,450 kWh</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-cyan-800/30' : 'bg-white/70 border-cyan-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Avg per BF</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>2,075 kWh</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Savings</p>
                        <p className={`text-3xl font-black mt-1 text-emerald-500`}>8.2%</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-red-800/30' : 'bg-white/70 border-red-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Peak Load</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>3,200 kW</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <AlertTriangle size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Energy Consumption Trend</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={energyConsumptionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="BF01" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF02" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF03" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Energy by Equipment</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'BF-01', value: '3,800 kWh', percent: 30, color: 'bg-red-500' },
                        { name: 'BF-02', value: '2,900 kWh', percent: 23, color: 'bg-blue-500' },
                        { name: 'BF-03', value: '2,600 kWh', percent: 21, color: 'bg-emerald-500' },
                        { name: 'BF-04', value: '1,800 kWh', percent: 14, color: 'bg-yellow-500' },
                        { name: 'BF-05', value: '1,350 kWh', percent: 12, color: 'bg-purple-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.name}</span>
                            <span className={`font-black ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.value}</span>
                          </div>
                          <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div 
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'predictive' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI-Powered Predictive Maintenance</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {predictiveData.map((item) => {
                    let statusColor, bgColor, borderColor;
                    if (item.status === 'critical') {
                      statusColor = 'text-red-500';
                      bgColor = darkMode ? 'bg-red-900/20' : 'bg-red-50';
                      borderColor = darkMode ? 'border-red-800/30' : 'border-red-200/50';
                    } else if (item.status === 'high') {
                      statusColor = 'text-orange-500';
                      bgColor = darkMode ? 'bg-orange-900/20' : 'bg-orange-50';
                      borderColor = darkMode ? 'border-orange-800/30' : 'border-orange-200/50';
                    } else if (item.status === 'medium') {
                      statusColor = 'text-yellow-500';
                      bgColor = darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50';
                      borderColor = darkMode ? 'border-yellow-800/30' : 'border-yellow-200/50';
                    } else {
                      statusColor = 'text-emerald-500';
                      bgColor = darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50';
                      borderColor = darkMode ? 'border-emerald-800/30' : 'border-emerald-200/50';
                    }
                    
                    return (
                      <div
                        key={item.id}
                        className={`backdrop-blur-xl border p-6 rounded-2xl ${bgColor} ${borderColor} shadow-sm`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.equipment}</span>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase ${
                            item.status === 'critical' 
                              ? 'bg-red-900/30 text-red-500' 
                              : item.status === 'high' 
                                ? 'bg-orange-900/30 text-orange-500' 
                                : item.status === 'medium' 
                                  ? 'bg-yellow-900/30 text-yellow-500' 
                                  : 'bg-emerald-900/30 text-emerald-500'
                          }`}>
                            {item.status}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Failure Risk</span>
                            <span className={statusColor}>{item.failureRisk}%</span>
                          </div>
                          <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.status === 'critical' 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                                  : item.status === 'high' 
                                    ? 'bg-gradient-to-r from-orange-500 to-yellow-600' 
                                    : item.status === 'medium' 
                                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                                      : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                              }`}
                              style={{ width: `${item.failureRisk}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Failure Type</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.failureType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Days to Failure</span>
                            <span className={`font-black ${statusColor}`}>{item.daysToFailure} days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Last Inspection</span>
                            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.lastInspection}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'carbon' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Carbon Footprint Tracker</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Emissions Today</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{carbonStats.totalToday} tCO₂</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <TreePine size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-cyan-800/30' : 'bg-white/70 border-cyan-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>YTD Reduction</p>
                        <p className={`text-3xl font-black mt-1 text-emerald-500`}>-{carbonStats.reductionYTD}%</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <TrendingUp size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-purple-800/30' : 'bg-white/70 border-purple-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Emission Intensity</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{carbonStats.intensity} tCO₂/ton</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-yellow-800/30' : 'bg-white/70 border-yellow-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Carbon Credits</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{carbonStats.creditsEarned}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Monthly Emissions vs Target</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={carbonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Legend />
                          <Bar dataKey="emissions" fill="#10b981" name="Actual Emissions" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="target" fill="#64748b" name="Target" radius={[4, 4, 0, 0]} opacity={0.5} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI-Powered Optimization Suggestions</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {aiSuggestions.map((suggestion) => {
                    let priorityColor, priorityBg;
                    if (suggestion.priority === 'high') {
                      priorityColor = 'text-red-500';
                      priorityBg = darkMode ? 'bg-red-900/20' : 'bg-red-50';
                    } else if (suggestion.priority === 'medium') {
                      priorityColor = 'text-orange-500';
                      priorityBg = darkMode ? 'bg-orange-900/20' : 'bg-orange-50';
                    } else {
                      priorityColor = 'text-emerald-500';
                      priorityBg = darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50';
                    }
                    
                    return (
                      <div
                        key={suggestion.id}
                        className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70' : 'bg-white/70'} ${darkMode ? 'border-emerald-800/30' : 'border-emerald-200/50'} shadow-sm`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${priorityBg}`}>
                              <Lightbulb size={24} className={priorityColor} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{suggestion.title}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${priorityBg} ${priorityColor}`}>
                                  {suggestion.priority}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-black ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {suggestion.category}
                                </span>
                              </div>
                              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{suggestion.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Impact</p>
                            <p className={`text-xl font-black ${suggestion.impact === 'High' || suggestion.impact === 'Critical' ? 'text-red-500' : 'text-emerald-500'}`}>{suggestion.impact}</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Est. Savings</p>
                            <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{suggestion.savings}</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Time to Implement</p>
                            <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{suggestion.timeToImplement}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <button className="px-6 py-3 rounded-xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center gap-2">
                            <Play size={16} />
                            Implement Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'digitaltwin' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Blast Furnace Digital Twin</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Simplified Digital Twin Visual */}
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70' : 'bg-white/70'} ${darkMode ? 'border-emerald-800/30' : 'border-emerald-200/50'} shadow-sm`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Simplified 2D Visualization</h4>
                    <div className="flex justify-center py-8">
                      <div className="relative">
                        {/* Furnace Body */}
                        <div className={`w-48 h-80 rounded-t-full border-4 ${darkMode ? 'border-slate-600' : 'border-slate-300'} ${darkMode ? 'bg-gradient-to-b from-slate-800 to-slate-700' : 'bg-gradient-to-b from-slate-200 to-slate-100'} flex flex-col justify-between p-4`}>
                          {/* Top Section */}
                          <div className="text-center">
                            <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Top Temp</p>
                            <p className={`text-2xl font-black ${digitalTwinData.BF01.tempTop > 180 ? 'text-red-500' : 'text-emerald-500'}`}>{digitalTwinData.BF01.tempTop}°C</p>
                          </div>
                          
                          {/* Middle Section */}
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pressure</p>
                              <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{digitalTwinData.BF01.pressure} bar</p>
                            </div>
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500 animate-pulse" />
                            <div className="text-center">
                              <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Flow</p>
                              <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{digitalTwinData.BF01.flowRate} m³/h</p>
                            </div>
                          </div>
                          
                          {/* Bottom Section */}
                          <div className="text-center">
                            <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bottom Temp</p>
                            <p className={`text-2xl font-black ${digitalTwinData.BF01.tempBottom > 110 ? 'text-orange-500' : 'text-emerald-500'}`}>{digitalTwinData.BF01.tempBottom}°C</p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-black uppercase ${
                          digitalTwinData.BF01.status === 'warning' 
                            ? 'bg-orange-500 text-white' 
                            : digitalTwinData.BF01.status === 'critical' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-emerald-500 text-white'
                        }`}>
                          {digitalTwinData.BF01.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Twin Parameters */}
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70' : 'bg-white/70'} ${darkMode ? 'border-emerald-800/30' : 'border-emerald-200/50'} shadow-sm`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Real-time Twin Parameters (BF-01)</h4>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'Vibration Level', value: `${digitalTwinData.BF01.vibration} mm/s`, status: digitalTwinData.BF01.vibration > 2 ? 'warning' : 'normal' },
                        { name: 'Oxygen Level', value: '21.2%', status: 'normal' },
                        { name: 'Slag Viscosity', value: '1.2 Pa·s', status: 'normal' },
                        { name: 'Hot Metal Temperature', value: '1520°C', status: 'normal' }
                      ].map((param, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 dark:bg-slate-800/30 bg-slate-100/50">
                          <span className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{param.name}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{param.value}</span>
                            <span className={`w-3 h-3 rounded-full ${
                              param.status === 'warning' ? 'bg-orange-500' : param.status === 'critical' ? 'bg-red-500' : 'bg-emerald-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Predictive Scenario Simulator</h3>
                
                {simulationResult && (
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200/50'} shadow-sm`}>
                    <h4 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Simulation Complete: {simulationResult.name}</h4>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{simulationResult.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-800/30 dark:bg-slate-800/30">
                        <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Predicted Temp Change</p>
                        <p className={`text-2xl font-black ${simulationResult.tempRise > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{simulationResult.tempRise > 0 ? `+${simulationResult.tempRise}` : simulationResult.tempRise}°C</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/30 dark:bg-slate-800/30">
                        <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Energy Impact</p>
                        <p className={`text-2xl font-black ${simulationResult.energyImpact.includes('+') ? 'text-red-500' : 'text-emerald-500'}`}>{simulationResult.energyImpact}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSimulationResult(null)}
                      className="mt-4 px-4 py-2 rounded-xl text-sm font-bold bg-slate-700 text-white hover:bg-slate-600 transition-all"
                    >
                      Clear Result
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {scenarioData.map((scenario) => {
                    const isSimulating = simulatingScenario === scenario.id;
                    
                    const runSimulation = async () => {
                      setSimulatingScenario(scenario.id);
                      // Simulate delay for realism
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      setSimulationResult(scenario);
                      setSimulatingScenario(null);
                    };
                    
                    return (
                      <div
                        key={scenario.id}
                        className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70' : 'bg-white/70'} ${darkMode ? 'border-emerald-800/30' : 'border-emerald-200/50'} shadow-sm`}
                      >
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{scenario.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                              scenario.impact === 'Critical' 
                                ? 'bg-red-900/30 text-red-500' 
                                : scenario.impact === 'High' 
                                  ? 'bg-orange-900/30 text-orange-500' 
                                  : 'bg-emerald-900/30 text-emerald-500'
                            }`}>
                              {scenario.impact}
                            </span>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{scenario.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed border-slate-300 dark:border-slate-700 mb-4">
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Temp Change</p>
                            <p className={`text-2xl font-black ${scenario.tempRise > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{scenario.tempRise > 0 ? `+${scenario.tempRise}` : scenario.tempRise}°C</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Energy Impact</p>
                            <p className={`text-2xl font-black ${scenario.energyImpact.includes('+') ? 'text-red-500' : 'text-emerald-500'}`}>{scenario.energyImpact}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={runSimulation}
                          disabled={isSimulating}
                          className={`w-full px-4 py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
                            isSimulating
                              ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-800'
                          }`}
                        >
                          {isSimulating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play size={16} />
                              Run Simulation
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div className="space-y-6">
                {/* Header & Equipment Selector */}
                <div className={darkMode ? "backdrop-blur-xl border p-6 rounded-2xl bg-slate-900/70 border-blue-800/30" : "backdrop-blur-xl border p-6 rounded-2xl bg-white/70 border-blue-200/50 shadow-sm"}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                      <h3 className={darkMode ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>Equipment Comparison Dashboard</h3>
                      <p className={darkMode ? "text-slate-400 mt-1" : "text-slate-600 mt-1"}>Compare performance metrics across all equipment</p>
                    </div>
                    <div className="flex gap-2">
                      {Object.keys(fleetData).map((eq) => (
                        <button
                          key={eq}
                          onClick={() => setSelectedEq(eq)}
                          className={
                            selectedEq === eq
                              ? "px-5 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                              : (darkMode
                                  ? "px-5 py-2 rounded-xl text-sm font-black bg-slate-700 text-slate-300 hover:bg-slate-600"
                                  : "px-5 py-2 rounded-xl text-sm font-black bg-slate-200 text-slate-700 hover:bg-slate-300")
                          }
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equipment Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {Object.entries(fleetData).map(([eq, data], idx) => {
                      const statusColors = {
                        'OPTIMAL': { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-500' },
                        'NORMAL': { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-500' },
                        'WARNING': { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-500' },
                        'CRITICAL': { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-500' }
                      };
                      const colors = statusColors[data.status] || statusColors['NORMAL'];
                      
                      return (
                        <div 
                          key={eq}
                          onClick={() => setSelectedEq(eq)}
                          className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                            selectedEq === eq
                              ? (darkMode
                                  ? colors.bg + ' ' + colors.border.replace('500/30', '500/50') + ' shadow-xl scale-105'
                                  : colors.bg + ' ' + colors.border.replace('500/30', '500/40') + ' shadow-lg scale-105')
                              : (darkMode
                                  ? 'bg-slate-800/30 border-slate-700/30'
                                  : 'bg-slate-50 border-slate-200/50')
                          } hover:shadow-2xl hover:border-opacity-80`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="transition-transform duration-300 hover:translate-x-1">
                              <h4 className={darkMode ? "text-xl font-black text-white mb-2" : "text-xl font-black text-slate-900 mb-2"}>Blast Furnace {eq.split('-')[1]}</h4>
                              <p className={darkMode ? "text-slate-400" : "text-slate-600"}>{['East Plant', 'West Plant', 'North Plant', 'South Plant', 'Central Plant'][idx % 5]}</p>
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                              {data.status === 'CRITICAL' ? (
                                <AlertTriangle size={28} className="text-red-500 animate-pulse" />
                              ) : (
                                <CheckCircle2 size={28} className={colors.text} />
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="transition-all duration-300 hover:bg-white/10 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap size={18} className={`${darkMode ? "text-yellow-400" : "text-yellow-600"} animate-pulse`} />
                                <span className={darkMode ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Efficiency</span>
                              </div>
                              <p className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"} transition-all duration-300`}>{Math.round((data.flow / 60) * 100)}%</p>
                            </div>
                            <div className="transition-all duration-300 hover:bg-white/10 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Thermometer size={18} className={`${darkMode ? "text-orange-400" : "text-orange-600"} ${data.temp > 10 ? 'animate-pulse text-red-500' : ''}`} />
                                <span className={darkMode ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Temp</span>
                              </div>
                              <p className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"} transition-all duration-300`}>{data.temp}°C</p>
                            </div>
                            <div className="transition-all duration-300 hover:bg-white/10 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Droplets size={18} className={`${darkMode ? "text-blue-400" : "text-blue-600"} ${data.flow < 45 ? 'animate-pulse text-red-500' : ''}`} />
                                <span className={darkMode ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Flow</span>
                              </div>
                              <p className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"} transition-all duration-300`}>{data.flow} m³/h</p>
                            </div>
                            <div className="transition-all duration-300 hover:bg-white/10 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp size={18} className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
                                <span className={darkMode ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Uptime</span>
                              </div>
                              <p className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"} transition-all duration-300`}>{90 + idx * 2}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Efficiency Bar Chart */}
                    <div className={darkMode ? "backdrop-blur-xl border p-6 rounded-2xl bg-slate-900/70 border-blue-800/30" : "backdrop-blur-xl border p-6 rounded-2xl bg-white/70 border-blue-200/50 shadow-sm"}>
                      <h4 className={darkMode ? "text-lg font-black mb-6 text-white flex items-center gap-2" : "text-lg font-black mb-6 text-slate-900 flex items-center gap-2"}>
                        <TrendingUp size={20} className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
                        Efficiency Comparison (%)
                      </h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(fleetData).map(([name, data]) => ({ name, efficiency: Math.round((data.flow / 60) * 100) }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                            <XAxis dataKey="name" stroke={darkMode ? '#64748b' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={darkMode ? '#64748b' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#1e40af' : '#bfdbfe'), borderRadius: '8px', fontSize: '12px' }}
                              itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Bar dataKey="efficiency" radius={[8,8,0,0]}>
                              {Object.entries(fleetData).map(([id, data], index) => {
                                let fill;
                                if (data.status === 'OPTIMAL') fill = 'url(#colorEffOpt)';
                                else if (data.status === 'NORMAL') fill = 'url(#colorEffNorm)';
                                else if (data.status === 'WARNING') fill = 'url(#colorEffWarn)';
                                else if (data.status === 'CRITICAL') fill = 'url(#colorEffCrit)';
                                else fill = 'url(#colorEffNorm)';
                                return <Cell key={"cell-" + index} fill={fill} />;
                              })}
                              <defs>
                                <linearGradient id="colorEffOpt" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" />
                                  <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="colorEffNorm" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                                <linearGradient id="colorEffWarn" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                                <linearGradient id="colorEffCrit" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#ef4444" />
                                  <stop offset="100%" stopColor="#dc2626" />
                                </linearGradient>
                              </defs>
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Performance Radar Chart */}
                    <div className={darkMode ? "backdrop-blur-xl border p-6 rounded-2xl bg-slate-900/70 border-blue-800/30" : "backdrop-blur-xl border p-6 rounded-2xl bg-white/70 border-blue-200/50 shadow-sm"}>
                      <h4 className={darkMode ? "text-lg font-black mb-6 text-white flex items-center gap-2" : "text-lg font-black mb-6 text-slate-900 flex items-center gap-2"}>
                        <Activity size={20} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                        Performance Radar
                      </h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={Object.entries(fleetData).map(([name, data]) => ({
                            subject: name,
                            Efficiency: Math.round((data.flow / 60) * 100),
                            'Flow Rate': Math.round((data.flow / 60) * 100),
                            'Temp Stability': 100 - data.temp * 3,
                            Uptime: 90 + Object.keys(fleetData).indexOf(name) * 2,
                            Health: 100 - (data.status === 'CRITICAL' ? 50 : data.status === 'WARNING' ? 25 : 0)
                          })).slice(0, 3)}>
                            <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                            <PolarAngleAxis dataKey="subject" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={darkMode ? '#475569' : '#94a3b8'} />
                            <Radar name="BF-01" dataKey="Efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                            <Radar name="BF-02" dataKey="Flow Rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                            <Radar name="BF-03" dataKey="Temp Stability" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                            <Legend />
                            <Tooltip 
                              contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#1e40af' : '#bfdbfe'), borderRadius: '8px', fontSize: '12px' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed View & 2D Furnace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Predictive Health Score */}
                  <div className={darkMode ? "backdrop-blur-xl border p-6 rounded-2xl bg-slate-900/70 border-blue-800/30" : "backdrop-blur-xl border p-6 rounded-2xl bg-white/70 border-blue-200/50 shadow-sm"}>
                    <div className="flex items-center justify-between mb-6 transition-all duration-300 hover:translate-x-1">
                      <h4 className={darkMode ? "text-lg font-black text-white" : "text-lg font-black text-slate-900"}>
                        <Activity size={20} className="inline mr-2 text-indigo-400 animate-pulse" />
                        Predictive Health Score
                      </h4>
                      <AlertTriangle size={20} className={`${darkMode ? "text-yellow-400" : "text-yellow-600"} ${fleetData[selectedEq].status === 'CRITICAL' ? 'animate-pulse text-red-500' : ''}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="relative w-32 h-32 transition-all duration-500 hover:scale-105">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="40" 
                            fill="none" 
                            stroke="url(#healthGradient)" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            strokeDasharray={`${2 * Math.PI * 40 * (68 + Object.keys(fleetData).indexOf(selectedEq) * 3) / 100} ${2 * Math.PI * 40}`}
                          >
                            <animate attributeName="stroke-dasharray" 
                              values={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40};${2 * Math.PI * 40 * (68 + Object.keys(fleetData).indexOf(selectedEq) * 3) / 100} ${2 * Math.PI * 40}`}
                              dur="1s"
                              fill="freeze"
                            />
                          </circle>
                          <defs>
                            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`${darkMode ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-900"} transition-all duration-300`}>
                            {68 + Object.keys(fleetData).indexOf(selectedEq) * 3}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 ml-6">
                        <div className="mb-4 transition-all duration-300 hover:translate-x-1">
                          <p className={darkMode ? "text-sm font-bold text-slate-400 uppercase tracking-wider" : "text-sm font-bold text-slate-600 uppercase tracking-wider"}>Status</p>
                          <p className={`${darkMode ? "text-sm font-black text-amber-400" : "text-sm font-black text-amber-600"} ${fleetData[selectedEq].status === 'CRITICAL' ? 'text-red-500' : ''}`}>
                            {fleetData[selectedEq].status === 'CRITICAL' ? 'Critical' : 'Good'}
                          </p>
                        </div>
                        <div className="transition-all duration-300 hover:translate-x-1">
                          <p className={darkMode ? "text-sm font-bold text-slate-400 uppercase tracking-wider" : "text-sm font-bold text-slate-600 uppercase tracking-wider"}>Prediction</p>
                          <p className={darkMode ? "text-sm font-black text-amber-400" : "text-sm font-black text-amber-600"}>
                            {fleetData[selectedEq].status === 'CRITICAL' ? '⚠️ Immediate attention needed' : 'Schedule preventive maintenance within 2 weeks'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2D Furnace Visualization (New Style) */}
                  <div className="lg:col-span-2">
                    <div className={darkMode ? "backdrop-blur-xl border p-6 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-slate-900/80 border-emerald-800/30" : "backdrop-blur-xl border p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-slate-50/80 border-emerald-200/50 shadow-sm"}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <BarChart3 size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className={darkMode ? "text-xl font-black text-white" : "text-xl font-black text-slate-900"}>2D Blast Furnace: {selectedEq}</h4>
                            <p className={darkMode ? "text-slate-400 text-sm" : "text-slate-600 text-sm"}>Real-time Operation Visualization</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={darkMode ? "px-3 py-1 rounded-full text-xs font-black bg-slate-700 text-slate-200" : "px-3 py-1 rounded-full text-xs font-black bg-slate-200 text-slate-700"}>
                            LIVE
                          </span>
                          <CheckCircle2 size={20} className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <svg viewBox="0 0 200 300" className="w-full max-w-[300px]">
                          <defs>
                            <linearGradient id="furnaceBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={darkMode ? '#1e293b' : '#f1f5f9'} />
                              <stop offset="50%" stopColor={darkMode ? '#0f172a' : '#e2e8f0'} />
                              <stop offset="100%" stopColor={darkMode ? '#020617' : '#cbd5e1'} />
                            </linearGradient>
                            <radialGradient id="coreGlow">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="50%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#78350f" />
                            </radialGradient>
                          </defs>

                          {/* Background Pattern */}
                          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <circle cx="5" cy="5" r="1" fill={darkMode ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.1)'} />
                          </pattern>
                          <rect width="200" height="300" fill="url(#smallGrid)" />

                          {/* Furnace Outer Body */}
                          <rect x="40" y="80" width="120" height="180" rx="20" ry="20" 
                            fill="url(#furnaceBodyGradient)" 
                            stroke="#3b82f6" 
                            strokeWidth="3"
                          />
                          
                          {/* Top Stack */}
                          <polygon points="100,30 60,80 140,80" 
                            fill={darkMode ? '#334155' : '#cbd5e1'} 
                            stroke="#3b82f6" 
                            strokeWidth="2"
                          />
                          <rect x="85" y="25" width="30" height="20" rx="5" 
                            fill={darkMode ? '#475569' : '#94a3b8'}
                          />
                          
                          {/* Hot Core */}
                          <ellipse cx="100" cy="180" rx="40" ry="60" 
                            fill="url(#coreGlow)" 
                            opacity={0.8}
                          >
                            <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite" />
                          </ellipse>
                          
                          {/* Particles Rising */}
                          {[...Array(8)].map((_, i) => (
                            <circle 
                              key={i} 
                              cx={90 + (i % 3) * 10} 
                              cy={120 - (i * 10)} 
                              r={2} 
                              fill="#facc15"
                              opacity={0.8}
                            >
                              <animate 
                                attributeName="cy" 
                                values={`${120 - (i * 10)};${40 - (i * 10)};${120 - (i * 10)}`} 
                                dur={`${2 + i * 0.2}s`} 
                                repeatCount="indefinite"
                              />
                              <animate 
                                attributeName="opacity" 
                                values="0;1;0" 
                                dur={`${2 + i * 0.2}s`} 
                                repeatCount="indefinite"
                              />
                            </circle>
                          ))}
                          
                          {/* Temperature Zones */}
                          <rect x="50" y="100" width="100" height="20" rx="5" 
                            fill="#10b981" 
                            opacity={0.7}
                          />
                          <rect x="50" y="130" width="100" height="20" rx="5" 
                            fill="#3b82f6" 
                            opacity={0.7}
                          />
                          <rect x="50" y="160" width="100" height="20" rx="5" 
                            fill="#f59e0b" 
                            opacity={0.7}
                          />
                          <rect x="50" y="190" width="100" height="20" rx="5" 
                            fill="#ef4444" 
                            opacity={0.7}
                          />
                          
                          {/* Cooling Rings */}
                          {[95, 125, 155, 185, 215].map((y, i) => (
                            <circle 
                              key={i} 
                              cx={50} 
                              cy={y} 
                              r={4} 
                              fill={fleetData[selectedEq].temp > 10 ? '#ef4444' : '#10b981'}
                            />
                          ))}
                          {[95, 125, 155, 185, 215].map((y, i) => (
                            <circle 
                              key={i} 
                              cx={150} 
                              cy={y} 
                              r={4} 
                              fill={fleetData[selectedEq].temp > 10 ? '#f97316' : '#10b981'}
                            />
                          ))}
                          
                          {/* Bottom Tap Hole */}
                          <rect x="60" y="260" width="80" height="18" rx="9" 
                            fill={darkMode ? '#1f2937' : '#cbd5e1'}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Analytics Dashboard</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Monthly Maintenance & Issues</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Bar dataKey="maintenance" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="issues" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>System Status Distribution</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Temperature Trend Comparison</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tempTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="BF01" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF02" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF03" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Key Metrics</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Mean Time Between Failures', value: '45 days', color: 'text-emerald-500' },
                        { label: 'Mean Time to Repair', value: '2.5 hours', color: 'text-cyan-500' },
                        { label: 'Overall Equipment Effectiveness', value: '89%', color: 'text-blue-500' },
                        { label: 'Preventive Maintenance Compliance', value: '96%', color: 'text-purple-500' },
                      ].map((metric, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-slate-800/30' : 'bg-emerald-50/30'}`}>
                          <span className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{metric.label}</span>
                          <span className={`text-2xl font-black ${metric.color}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="h-full flex gap-6">
                <div className={`w-80 flex-shrink-0 backdrop-blur-xl border rounded-2xl p-4 ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                  <h3 className={`text-lg font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Documents</h3>
                  <div className="space-y-3">
                    {knowledgeBaseDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${selectedDoc?.id === doc.id 
                          ? (darkMode ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-emerald-50 border border-emerald-300/50') 
                          : (darkMode ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-slate-50 hover:bg-slate-100')
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{doc.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            doc.category === 'Maintenance' ? 'bg-cyan-500/20 text-cyan-400' :
                            doc.category === 'Safety' ? 'bg-red-500/20 text-red-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>{doc.category}</span>
                          <span className={`${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{doc.lastUpdated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`flex-1 backdrop-blur-xl border rounded-2xl p-6 overflow-y-auto ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                  {selectedDoc ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedDoc.title}</h2>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              selectedDoc.category === 'Maintenance' ? 'bg-cyan-500/20 text-cyan-400' :
                              selectedDoc.category === 'Safety' ? 'bg-red-500/20 text-red-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>{selectedDoc.category}</span>
                            <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Updated {selectedDoc.lastUpdated}</span>
                          </div>
                        </div>
                        <button onClick={() => exportAsMarkdown(selectedDoc)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-800 transition-all">
                          <Download size={16} />
                          Export
                        </button>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {renderMarkdown(selectedDoc.content)}
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center py-20 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <BookOpen size={64} className="mx-auto mb-4 text-emerald-500 opacity-50" />
                      <p className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Select a document to view</p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Choose from the list of SOPs, safety protocols, and guides</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                {/* Quick Commands */}
                <div className={`flex flex-wrap gap-2 mb-4`}>
                  <button onClick={() => handleQuickCommand('check-status')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-emerald-800/30' : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'}`}>
                    📊 Check {selectedEq} Status
                  </button>
                  <button onClick={() => handleQuickCommand('check-fleet')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-emerald-800/30' : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'}`}>
                    🚀 Fleet Overview
                  </button>
                  <button onClick={() => handleQuickCommand('check-safety')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-emerald-800/30' : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'}`}>
                    🛡️ Safety Protocols
                  </button>
                  <button onClick={() => handleQuickCommand('check-maintenance')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-emerald-800/30' : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'}`}>
                    🔧 Maintenance History
                  </button>
                </div>

                {/* Chat Messages */}
                <div className={`flex-1 backdrop-blur-xl border rounded-2xl p-6 mb-6 overflow-y-auto ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                  {messages.length === 0 ? (
                    <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <MessageSquare size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
                      <p className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Start a conversation with the AI Assistant</p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Ask about equipment diagnostics, maintenance procedures, or safety protocols</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`${msg.type === 'user' ? 'order-2' : 'order-1'} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? (darkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-emerald-500 to-teal-600') : (darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-200 to-slate-300')}`}>
                            {msg.type === 'user' ? 'U' : 'AI'}
                          </div>
                          <div className={`max-w-[75%] ${msg.type === 'user' ? 'order-1' : 'order-2'} p-4 rounded-2xl ${msg.type === 'user' ? (darkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white') : (darkMode ? 'bg-slate-800/50 text-slate-200 border border-emerald-800/30' : 'bg-emerald-50/50 text-slate-800 border border-emerald-200/50')}`}>
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {msg.text.split('\n').map((line, i) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return <div key={i} className="font-bold text-lg mb-2">{line.replace(/\*\*/g, '')}</div>;
                                }
                                if (line.startsWith('- ')) {
                                  return <div key={i} className="flex gap-2 items-start">
                                    <span className="text-emerald-400 mt-1">•</span>
                                    <span>{line.replace('- ', '')}</span>
                                  </div>;
                                }
                                if (line.trim() === '') {
                                  return <br key={i} />;
                                }
                                return <div key={i}>{line}</div>;
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex gap-3 justify-start">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-200 to-slate-300'}`}>
                            AI
                          </div>
                          <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-800/50 text-slate-200 border border-emerald-800/30' : 'bg-emerald-50/50 text-slate-800 border border-emerald-200/50'}`}>
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleAnalyze} className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about equipment, maintenance, or safety..."
                    className={`w-full border rounded-xl px-4 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none h-24 font-medium ${darkMode ? 'bg-slate-800/50 border-emerald-800/30 text-slate-200 placeholder-slate-500' : 'bg-emerald-50/50 border-emerald-200/50 text-slate-800 placeholder-slate-500'}`}>
                  </textarea>
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:bg-slate-700 text-white p-3 rounded-xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Energy Consumption Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-yellow-800/30' : 'bg-white/70 border-yellow-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Total Energy (Today)</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>12,450 kWh</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-cyan-800/30' : 'bg-white/70 border-cyan-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Avg per BF</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>2,075 kWh</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Savings</p>
                        <p className={`text-3xl font-black mt-1 text-emerald-500`}>8.2%</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-red-800/30' : 'bg-white/70 border-red-200/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Peak Load</p>
                        <p className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>3,200 kW</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <AlertTriangle size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Energy Consumption Trend</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={energyConsumptionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', border: "1px solid " + (darkMode ? '#065f46' : '#a7f3d0'), borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="BF01" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF02" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="BF03" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl ${darkMode ? 'bg-slate-900/70 border-emerald-800/30' : 'bg-white/70 border-emerald-200/50 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Energy by Equipment</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'BF-01', value: '3,800 kWh', percent: 30, color: 'bg-red-500' },
                        { name: 'BF-02', value: '2,900 kWh', percent: 23, color: 'bg-blue-500' },
                        { name: 'BF-03', value: '2,600 kWh', percent: 21, color: 'bg-emerald-500' },
                        { name: 'BF-04', value: '1,800 kWh', percent: 14, color: 'bg-yellow-500' },
                        { name: 'BF-05', value: '1,350 kWh', percent: 12, color: 'bg-purple-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.name}</span>
                            <span className={`font-black ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.value}</span>
                          </div>
                          <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div 
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>

      {/* Digital Work Order Modal */}
      {showWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white text-slate-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-slate-100 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Maintenance Work Order</h2>
                <p className="text-xs font-bold text-slate-500 uppercase">Generated by NexusOps AI</p>
              </div>
              <Wrench size={32} className="text-emerald-600" />
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Equipment ID</label>
                  <div className="font-bold text-lg">{selectedEq}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Priority Level</label>
                  <div className="font-bold text-lg text-red-600">CRITICAL / EMERGENCY</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Report Date</label>
                  <div className="font-bold">{new Date().toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Order Status</label>
                  <div className="font-bold text-emerald-600 italic">Awaiting Execution</div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Diagnosis Summary</label>
                <p className="text-sm font-medium mt-1 leading-relaxed">
                  Severe scale buildup and silt accumulation detected in cooling staves. 
                  Efficiency drop at 31% with critical temperature rise. Immediate descaling and filter flush required.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <label className="text-[10px] font-black text-emerald-600 uppercase">Safety Mandate (LOTO-2026)</label>
                <ul className="mt-2 space-y-1">
                  <li className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div> Acid-Resistant PPE Required
                  </li>
                  <li className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div> Lockout/Tagout of Pump P-202
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setShowWorkOrder(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => {
                    setShowWorkOrder(false);
                    handleResolve();
                  }}
                  className="px-8 py-3 rounded-xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 transition-all"
                >
                  Approve & Dispatch Crew
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
