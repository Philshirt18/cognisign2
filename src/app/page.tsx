"use client";

import { useCallback, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import Recorder from "@/components/Recorder";
import FileUploader from "@/components/FileUploader";
import AnalysisSummary from "@/components/AnalysisSummary";
import AudioPreview from "@/components/AudioPreview";
import OnboardingSteps from "@/components/OnboardingSteps";
import { analyzeAudio } from "@/lib/api";
import type { AnalysisResult, RecorderPayload } from "@/types";

interface SourceState {
  label: string;
  payload: RecorderPayload | { file: File; url: string };
}

const demoClips = [
  {
    label: "Demo: healthy voice",
    path: "/demo/healthy.wav"
  },
  {
    label: "Demo: higher risk",
    path: "/demo/higher-risk.wav"
  }
];

export default function Home() {
  const [source, setSource] = useState<SourceState | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const resetState = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  const processBlob = useCallback(
    async (blob: Blob) => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeAudio(blob);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        setError("Unable to analyse audio. Wire this client to your backend API.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRecording = useCallback(
    (payload: RecorderPayload) => {
      resetState();
      setHintVisible(true);
      setSource({ label: "Recorded sample", payload });
      void processBlob(payload.blob);
    },
    [processBlob, resetState]
  );

  const handleUpload = useCallback(
    (file: File) => {
      resetState();
      setHintVisible(false);
      const url = URL.createObjectURL(file);
      setSource({ label: file.name, payload: { file, url } });
      void processBlob(file);
    },
    [processBlob, resetState]
  );

  const handleDemo = useCallback(
    async (clipPath: string, label: string) => {
      resetState();
      try {
        const res = await fetch(clipPath);
        if (!res.ok) throw new Error("Demo clip missing");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setSource({ label, payload: { file: new File([blob], label, { type: blob.type }), url } });
        void processBlob(blob);
        setHintVisible(false);
      } catch (err) {
        console.error(err);
        setError("Demo clip not found. Add audio files under public/demo.");
      }
    },
    [processBlob, resetState]
  );

  const previewPayload = useMemo(() => source?.payload ?? null, [source]);

  return (
    <main>
      <Hero />

      <section className="card">
        <h2>Choose how to start</h2>
        <div className="action-panels">
          <div className="action-panel">
            <strong>Try a demo clip</strong>
            <p>Explore Cognisight instantly with ready-to-use voices.</p>
            <div className="demo-buttons">
              {demoClips.map((clip) => (
                <button
                  key={clip.label}
                  type="button"
                  className="primary-button"
                  onClick={() => handleDemo(clip.path, clip.label)}
                >
                  {clip.label}
                </button>
              ))}
            </div>
            <p className="demo-hint">
              Replace these files with your own samples in <code>frontend/public/demo</code>.
            </p>
          </div>

          <div className="action-panel">
            <strong>Record an audio clip</strong>
            <p>Speak for at least 10 seconds to capture a new take.</p>
            <Recorder
              onComplete={(payload) => {
                setHintVisible(true);
                handleRecording(payload);
              }}
              onError={(message) => {
                setHintVisible(true);
                setError(message);
              }}
            />
            {hintVisible && (
              <p className="inline-hint">
                Works best in Chromium browsers. Connect to your backend in <code>src/lib/api.ts</code> to analyse the clip.
              </p>
            )}
          </div>

          <div className="action-panel">
            <strong>Upload an existing recording</strong>
            <p>Select a file you already have on disk.</p>
            <FileUploader onSelect={handleUpload} />
          </div>
        </div>
      </section>

      <OnboardingSteps />

      <AudioPreview source={previewPayload} />

      {loading && (
        <section className="card">
          <p>Analyzing audio…</p>
        </section>
      )}

      {error && (
        <section className="card error-callout">
          <p>{error}</p>
        </section>
      )}

      <AnalysisSummary result={analysis} />

      <section className="card">
        <h2>Integrating with the Python backend</h2>
        <ol>
          <li>Expose your Streamlit/Python processing logic as a REST endpoint (e.g., FastAPI).</li>
          <li>Update <code>src/lib/api.ts</code> to call the deployed endpoint instead of the local stub.</li>
          <li>Ensure CORS is configured to allow this Next.js app to interact with the backend.</li>
        </ol>
      </section>
    </main>
  );
}
