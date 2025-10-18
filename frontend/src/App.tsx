import { useRef, useState } from "react";
import CameraView from "./components/CameraView";
import ResultCard from "./components/ResultCard";
import type { AnalyzeResponse } from "./lib/types";
import "./App.css";

function App() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const grabRef = useRef<() => string>(() => "");

  async function analyzeOnce() {
    if (!running || !grabRef.current) return;
    
    const imageBase64 = grabRef.current();
    if (!imageBase64) {
      setError("Failed to capture frame. Please try again.");
      return;
    }

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

  function end() {
    setRunning(false);
    setResult(null);
    setError(null);
  }

  const appName = import.meta.env.VITE_APP_NAME || "SkinSight Live";

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <h1>{appName}</h1>
          <p className="app-subtitle">
            Privacy-first, text-only skin check. No storage.
          </p>
        </header>

        <CameraView 
          running={running} 
          onGrabBase64={(g) => (grabRef.current = g)} 
        />

        <div className="controls">
          {!running ? (
            <button 
              className="btn btn-start" 
              onClick={() => setRunning(true)}
            >
              Start
            </button>
          ) : (
            <button 
              className="btn btn-end" 
              onClick={end}
            >
              End
            </button>
          )}
          <button
            className="btn btn-analyze"
            onClick={analyzeOnce}
            disabled={!running || loading}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
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
  );
}

export default App;
