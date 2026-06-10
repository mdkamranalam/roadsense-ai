import React, { useState } from "react";
import { apiService } from "../services/api";

interface UploadPageProps {
  onAnalysisComplete: (data: any) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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

    try {
      // 1. Upload the video
      const uploadData = await apiService.uploadVideo(file);
      const filePath = uploadData.file_path;

      // 2. Trigger analysis
      const result = await apiService.analyzeVideo(filePath);

      // Notify parent component
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      console.error("Analysis Error:", err);
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="upload-container animate-fade-in">
        <header className="upload-header">
          <h1 className="heading-1">RoadSense AI</h1>
          <p className="upload-subtitle">
            Upload road video for context-aware safety analysis
          </p>
        </header>

        <div className="upload-dropzone glass-panel">
          <div style={{ width: '100%' }}>
            <label className="file-label" style={{ display: 'inline-block', marginBottom: '20px' }}>
              Select Video File
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
            
            {file && (
              <div className="file-info animate-slide-up">
                <p><strong>File:</strong> {file.name}</p>
                <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          <button
            onClick={startAnalysis}
            disabled={uploading || !file}
            className="btn-primary"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            {uploading ? "Processing AI Analysis..." : "Start Analysis"}
          </button>

          {error && (
            <div className="error-message animate-fade-in">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
