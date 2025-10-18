import type { AnalyzeResponse } from "@/lib/types";

export default function ResultCard({ data }: { data: AnalyzeResponse }) {
  // Check if this is a poor quality image response
  const isPoorQuality = data.likely_categories.includes("poor_image_quality");

  if (isPoorQuality) {
    return (
      <div className="result-card result-card-warning">
        <div className="result-header">⚠️ Image Quality Issue</div>
        <p className="result-summary">{data.summary}</p>
        <div className="result-steps">
          <strong>Tips for better photos:</strong>
          <ul>
            {data.next_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card">
      <div className="result-header">Result</div>
      <p className="result-summary">{data.summary}</p>
      
      {/* Likely conditions with confidence percentages */}
      <div className="result-detail">
        <strong>Likely Conditions:</strong>
        {data.confidence_percentages && data.confidence_percentages.length === data.likely_categories.length ? (
          <div className="conditions-list">
            {data.likely_categories.map((category, i) => (
              <div key={i} className="condition-item">
                <div className="condition-label">
                  <span className="condition-name">{category.replace(/_/g, ' ')}</span>
                  <span className="condition-percentage">{data.confidence_percentages![i]}%</span>
                </div>
                <div className="confidence-bar-container">
                  <div 
                    className="confidence-bar" 
                    style={{ width: `${data.confidence_percentages![i]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span> {data.likely_categories.join(", ")}</span>
        )}
      </div>
      
      <div className="result-detail">
        <strong>Risk:</strong> <span className={`risk-${data.risk_level}`}>{data.risk_level}</span>
      </div>
      <div className="result-steps">
        <strong>Next steps:</strong>
        <ul>
          {data.next_steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>
      <p className="result-disclaimer">
        Informational purposes only. Not a diagnosis. Consult a dermatologist for concerns.
      </p>
    </div>
  );
}
