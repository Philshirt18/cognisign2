export type RiskBucket = "Low" | "Medium" | "High";

export interface QcMetric {
  label: string;
  value: string;
  hint?: string;
  status: "good" | "warn";
}

export interface AnalysisResult {
  qc: QcMetric[];
  probability: number;
  bucket: RiskBucket;
  suggestion: string;
  features: Array<{ name: string; value: string }>;
}

export interface RecorderPayload {
  blob: Blob;
  mimeType: string;
  url: string;
  duration?: number;
}
