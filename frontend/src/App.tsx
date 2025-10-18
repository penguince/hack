import { useRef, useState } from "react";
import CameraView from "./components/CameraView";
import ResultCard from "./components/ResultCard";
import ChatPanel from "./components/ChatPanel";
import type { AnalyzeResponse } from "./lib/types";
import "./App.css";

function App() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const grabRef = useRef<() => string>(() => "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function analyzeImage(imageBase64: string) {
    setCurrentImage(imageBase64);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      setResult(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Analysis failed";
      setError(errorMessage);
      console.error("Analysis error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeOnce() {
    if (!running || !grabRef.current) return;
    
    const imageBase64 = grabRef.current();
    if (!imageBase64) {
      setError("Failed to capture frame. Please try again.");
      return;
    }

    await analyzeImage(imageBase64);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64.split(',')[1];
      await analyzeImage(base64Data);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  }

  function end() {
    setRunning(false);
    setResult(null);
    setCurrentImage(null);
    setError(null);
  }

  const appName = import.meta.env.VITE_APP_NAME || "";

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="content-wrapper">
          <header className="app-header">
            <h1>{appName}</h1>
            <p className="app-subtitle">
              Privacy-first skin analysis. No storage required.
            </p>
          </header>

          <CameraView 
            running={running} 
            onGrabBase64={(g) => (grabRef.current = g)} 
          />

          {!running && !result && !loading && (
            <div className="hint-overlay">
              <p>📸 Press "Start Camera" to take a picture, or "Upload Image" to use an existing photo</p>
            </div>
          )}

        <div className="controls">
          {!running ? (
            <>
              <button 
                className="btn btn-start" 
                onClick={() => setRunning(true)}
              >
                Start Camera
              </button>
              <button 
                className="btn btn-upload" 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <>
              <button 
                className="btn btn-end" 
                onClick={end}
              >
                Exit Camera Mode
              </button>
              <button
                className="btn btn-analyze"
                onClick={analyzeOnce}
                disabled={!running || loading}
              >
                {loading ? "Analyzing…" : "Analyze"}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Analyzing your image...</p>
          </div>
        )}

        {result && <ResultCard data={result} />}
        </div>
      </div>
      
      <aside className="chat-sidebar">
        <ChatPanel 
          analysisResult={result}
          imageBase64={currentImage}
        />
      </aside>
    </div>
  );
}

export default App;
