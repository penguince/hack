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
      <div className="result-detail">
        <strong>Likely:</strong> {data.likely_categories.join(", ")}
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
        Informational only—this is not a diagnosis. Consult a clinician for concerns.
      </p>
    </div>
  );
}
