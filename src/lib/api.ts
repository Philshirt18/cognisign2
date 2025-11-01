import type { AnalysisResult } from "@/types";

export async function analyzeAudio(
  audio: Blob,
  options: { signal?: AbortSignal } = {}
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("audio", audio, "sample.webm");

  const response = await fetch("/api/process-audio", {
    method: "POST",
    body: formData,
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error("Processing failed");
  }

  return (await response.json()) as AnalysisResult;
}
