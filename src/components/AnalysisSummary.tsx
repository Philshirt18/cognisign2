import type { AnalysisResult } from "@/types";

interface Props {
  result: AnalysisResult | null;
}

const badgeColors: Record<string, string> = {
  Low: "#2CA6A4",
  Medium: "#80D0E0",
  High: "#FF6B6B"
};

const AnalysisSummary = ({ result }: Props) => {
  if (!result) {
    return (
      <section className="card">
        <h2>Speech Risk Screening</h2>
        <p>Select a clip to preview quality checks and model outputs.</p>
      </section>
    );
  }

  return (
    <section className="card analysis-card">
      <h2>Speech Risk Screening</h2>
      <div className="analysis-grid">
        <div className="badge" style={{ backgroundColor: badgeColors[result.bucket] }}>
          {result.bucket} risk
        </div>
        <p className="probability">Probability: {(result.probability * 100).toFixed(1)}%</p>
        <p className="suggestion">{result.suggestion}</p>
      </div>
      <h3>Quality checks</h3>
      <ul className="qc-list">
        {result.qc.map((metric) => (
          <li key={metric.label} className="qc-item" data-status={metric.status}>
            <span className="label">{metric.label}</span>
            <span className="value">{metric.value}</span>
            {metric.hint && <span className="hint">{metric.hint}</span>}
          </li>
        ))}
      </ul>
      <h3>Key features</h3>
      <ul className="feature-list">
        {result.features.map((feature) => (
          <li key={feature.name} className="feature-item">
            <span className="label">{feature.name}</span>
            <span className="value">{feature.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AnalysisSummary;
