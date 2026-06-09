import React, { useState } from "react";
import { apiService } from "../services/api";

interface UploadPageProps {
  onAnalysisComplete: (data: any) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
    }
  };

  const startAnalysis = async () => {
    if (!file) {
      setError("Please select a video file first.");
      return;
    }

    setUploading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // 1. Upload the video
      const uploadData = await apiService.uploadVideo(file);
      const filePath = uploadData.file_path;

      // 2. Trigger analysis
      const result = await apiService.analyzeVideo(filePath);
      setAnalysisResult(result);

      // Notify parent component
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      console.error("Analysis Error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">🚗 RoadSense AI</h1>
          <p className="text-gray-400">
            Upload road video for context-aware safety analysis
          </p>
        </header>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center space-y-6">
          <div className="w-full max-w-md space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {file && (
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 text-sm">
                <p className="text-gray-300">
                  <strong>File:</strong> {file.name}
                </p>
                <p className="text-gray-300">
                  <strong>Size:</strong>{" "}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          <button
            onClick={startAnalysis}
            disabled={uploading || !file}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
              uploading || !file
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            }`}
          >
            {uploading ? "Processing AI Analysis..." : "Start Analysis"}
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg w-full max-w-md text-center">
              {error}
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-blue-300 border-b border-gray-700 pb-4">
              Analysis Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 text-center">
                <p className="text-gray-400 text-sm uppercase font-semibold">
                  Road Type
                </p>
                <p className="text-xl font-bold">
                  {analysisResult.summary.road_type}
                </p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 text-center">
                <p className="text-gray-400 text-sm uppercase font-semibold">
                  Risk Score
                </p>
                <p
                  className={`text-2xl font-bold ${
                    analysisResult.summary.risk_score > 70
                      ? "text-red-400"
                      : analysisResult.summary.risk_score > 30
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {analysisResult.summary.risk_score}%
                </p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 text-center">
                <p className="text-gray-400 text-sm uppercase font-semibold">
                  Driver Profile
                </p>
                <p className="text-xl font-bold">
                  {analysisResult.summary.driver_profile}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-300">
                Adaptive Alerts
              </h3>
              <div className="space-y-2">
                {analysisResult.alerts.map((alert: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 flex items-center justify-between ${
                      alert.priority === "critical"
                        ? "bg-red-900/30 border-red-500 text-red-100"
                        : alert.priority === "high"
                          ? "bg-orange-900/30 border-orange-500 text-orange-100"
                          : alert.priority === "medium"
                            ? "bg-yellow-900/30 border-yellow-500 text-yellow-100"
                            : "bg-green-900/30 border-green-500 text-green-100"
                    }`}
                  >
                    <span className="font-medium">{alert.message}</span>
                    <span className="text-xs font-bold uppercase opacity-70">
                      {alert.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
