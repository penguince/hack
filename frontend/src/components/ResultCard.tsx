import type { AnalyzeResponse } from "@/lib/types";

export default function ResultCard({ data }: { data: AnalyzeResponse }) {
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
        Informational purposes only. Not a diagnosis. Consult a dermatologist for concerns.
      </p>
    </div>
  );
}
