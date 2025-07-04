import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import DataPreview from './components/DataPreview';
import ManuscriptEditor from './components/ManuscriptEditor';
import AIAssistant from './components/AIAssistant';
import LiveTestWindow from './components/LiveTestWindow';
import Navbar from './components/Navbar';
import About from './components/About';

function App() {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [uploadedHeaders, setUploadedHeaders] = useState<string[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [manuscript, setManuscript] = useState<any[]>([]);
  const [runningFullManuscript, setRunningFullManuscript] = useState<boolean>(false);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <>
                <DataPreview
                  setUploadedData={setUploadedData}
                  setUploadedHeaders={setUploadedHeaders}
                  setUploadedFilename={setUploadedFilename}
                  uploadedData={uploadedData}
                  uploadedHeaders={uploadedHeaders}
                  uploadedFilename={uploadedFilename}
                />
                <ManuscriptEditor
                  uploadedData={uploadedData}
                  uploadedHeaders={uploadedHeaders}
                  uploadedFilename={uploadedFilename}
                  runningFullManuscript={runningFullManuscript}
                  setRunningFullManuscript={setRunningFullManuscript}
                  headers={uploadedHeaders}
                  manuscript={manuscript}
                  setManuscript={setManuscript}
                />
                <AIAssistant uploadedHeaders={uploadedHeaders} />
                <LiveTestWindow uploadedData={uploadedData} uploadedHeaders={uploadedHeaders} />
              </>
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;