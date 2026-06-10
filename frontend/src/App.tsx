import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import AnalysisDashboard from "./pages/AnalysisDashboard";

function App() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <div className="app-wrapper animate-fade-in">
      {!analysisData ? (
        <UploadPage onAnalysisComplete={(data) => setAnalysisData(data)} />
      ) : (
        <div className="container" style={{ padding: '40px 24px', animation: 'slideUp 0.6s ease' }}>
          <AnalysisDashboard analysisData={analysisData} />
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="btn-primary" 
              onClick={() => setAnalysisData(null)}
            >
              Analyze Another Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
