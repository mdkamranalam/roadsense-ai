import { useEffect } from "react";
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
    { name: "Cars", count: aggCounts.cars, fill: "#3B82F6" },
    { name: "Bikes", count: aggCounts.bikes, fill: "#F59E0B" },
    { name: "Pedestrians", count: aggCounts.pedestrians, fill: "#EF4444" },
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-900 text-white rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-400">
          Safety Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Voice Alerts Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Trend Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-80">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Risk Profile Over Time
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="frame" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#F3F4F6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Object Distribution Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-80">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Object Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={objectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trip Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-xs uppercase font-bold">Avg Risk</p>
          <p className="text-2xl font-bold">{summary.risk_score}%</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-xs uppercase font-bold">Hazards</p>
          <p className="text-2xl font-bold text-red-400">
            {summary.total_hazards_detected}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-xs uppercase font-bold">
            Environment
          </p>
          <p className="text-lg font-bold truncate">{summary.road_type}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-xs uppercase font-bold">Profile</p>
          <p className="text-lg font-bold">{summary.driver_profile}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
