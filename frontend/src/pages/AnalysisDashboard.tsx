import React, { useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import useVoiceAlerts from "../hooks/useVoiceAlerts";

interface DashboardProps {
  analysisData: any;
}

const AnalysisDashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  const { summary, detailed_analysis, alerts } = analysisData;

  // Trigger Voice Alerts when dashboard loads
  useVoiceAlerts(alerts);

  // Prepare data for Risk Trend Chart (Risk vs Frame)
  const riskTrendData = detailed_analysis.map((frame: any) => ({
    frame: frame.frame,
    risk: frame.risk_score,
  }));

  // Aggregate counts for Object Distribution Chart
  const aggCounts = {
    cars: 0,
    bikes: 0,
    pedestrians: 0,
  };
  detailed_analysis.forEach((f: any) => {
    aggCounts.cars += f.counts.cars || 0;
    aggCounts.bikes += f.counts.bikes || 0;
    aggCounts.pedestrians += f.counts.pedestrians || 0;
  });

  const objectData = [
    { name: "Cars", count: aggCounts.cars, fill: "#00d2ff" },
    { name: "Bikes", count: aggCounts.bikes, fill: "#f59e0b" },
    { name: "Pedestrians", count: aggCounts.pedestrians, fill: "#ef4444" },
  ];

  const getRiskColor = (score: number) => {
    if (score > 70) return "danger";
    if (score > 30) return "warning";
    return "success";
  };

  const getAlertClass = (priority: string) => {
    switch(priority) {
      case "critical": return "alert-critical";
      case "high": return "alert-high";
      case "medium": return "alert-medium";
      default: return "alert-low";
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
      <div className="dashboard-header">
        <h2 className="heading-2" style={{ marginBottom: 0 }}>
          Safety Analytics Dashboard
        </h2>
        <div className="status-badge">
          <span className="status-dot"></span>
          Voice Alerts Active
        </div>
      </div>

      <div className="grid-2">
        {/* Risk Trend Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="heading-3" style={{ marginBottom: '16px' }}>
            Risk Profile Over Time
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="frame" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: "8px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Object Distribution Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="heading-3" style={{ marginBottom: '16px' }}>
            Object Distribution
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={objectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: "8px"
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trip Summary Metrics */}
      <div className="metric-grid">
        <div className="glass-card metric-card">
          <p className="metric-label">Avg Risk</p>
          <p className={`metric-value ${getRiskColor(summary.risk_score)}`}>{summary.risk_score}%</p>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">Hazards</p>
          <p className="metric-value danger">
            {summary.total_hazards_detected}
          </p>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">Environment</p>
          <p className="metric-value text-gradient" style={{ fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary.road_type.replace('_', ' ')}
          </p>
        </div>
        <div className="glass-card metric-card">
          <p className="metric-label">Profile</p>
          <p className="metric-value" style={{ fontSize: '1.5rem' }}>{summary.driver_profile.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Adaptive Alerts */}
      <div style={{ marginTop: '40px' }}>
        <h3 className="heading-3" style={{ marginBottom: '16px', color: '#fff' }}>
          Adaptive Alerts
        </h3>
        <div className="alerts-list">
          {alerts.map((alert: any, idx: number) => (
            <div key={idx} className={`alert-item ${getAlertClass(alert.priority)}`}>
              <span style={{ fontWeight: 500 }}>{alert.message}</span>
              <span className="alert-level">{alert.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
