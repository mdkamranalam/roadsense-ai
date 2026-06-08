import React, { useState } from 'react';
import UploadPage from './pages/UploadPage';
import AnalysisDashboard from './pages/AnalysisDashboard';

function App() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <UploadPage onAnalysisComplete={(data) => setAnalysisData(data)} />

      {analysisData && (
        <div className="max-w-6xl mx-auto mb-20 mt-12 px-4">
          <AnalysisDashboard analysisData={analysisData} />
        </div>
      )}
    </div>
  );
}

export default App;
