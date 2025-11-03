"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    label: "Demo: higher risk",
    path: "/demo/higher-risk.wav"
  },
  {
    label: "Demo: healthy voice",
    path: "/demo/healthy.wav"
  }
];

export default function Home() {
  const router = useRouter();
  const [source, setSource] = useState<SourceState | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<"demo" | "record" | "upload" | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [analysisExplanation, setAnalysisExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = window.localStorage.getItem("disclaimerAccepted") === "true";
    if (!accepted) {
      router.replace("/disclaimer");
    } else {
      setDisclaimerAccepted(true);
    }
  }, [router]);

  const resetState = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setAnalysisExplanation(null);
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
      setAnalysisExplanation(
        "AI estimation based on simple acoustic patterns. Results are illustrative and not diagnostic."
      );
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
      setAnalysisExplanation(
        "AI estimation based on uploaded audio. Use in a quiet space for clearer results."
      );
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
        const isHighRiskDemo = clipPath.includes("higher") || clipPath.includes("alz");
        const filename = isHighRiskDemo ? "demo_higherrisk.wav" : "demo_healthy.wav";
        setSource({
          label,
          payload: { file: new File([blob], filename, { type: blob.type }), url }
        });
        setAnalysisExplanation(
          isHighRiskDemo
            ? "AI detected voice-energy and articulation patterns often seen in our Alzheimer's training samples, so it flags an elevated risk (demo)."
            : "AI compared this voice to healthy training samples and found the patterns typical, so risk stays low (demo)."
        );
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

  if (!disclaimerAccepted) {
    return null;
  }

  return (
    <>
      <main>
      <Hero />

      <section className="card">
        <h2>Choose how to start</h2>
        <div className="selector-grid">
          <button
            type="button"
            className="selector-tile"
            data-active={activePanel === "demo"}
            onClick={() => setActivePanel(activePanel === "demo" ? null : "demo")}
          >
            <span className="selector-title">Try a sample</span>
            <span className="selector-copy">Explore Cognisight instantly with ready-to-use voices.</span>
          </button>

          <button
            type="button"
            className="selector-tile"
            data-active={activePanel === "record"}
            onClick={() => setActivePanel(activePanel === "record" ? null : "record")}
          >
            <span className="selector-title">Record an audio</span>
            <span className="selector-copy">Speak for at least 10 seconds to capture a new take.</span>
          </button>

          <button
            type="button"
            className="selector-tile"
            data-active={activePanel === "upload"}
            onClick={() => setActivePanel(activePanel === "upload" ? null : "upload")}
          >
            <span className="selector-title">Upload a recording</span>
            <span className="selector-copy">Select a file you already have on disk.</span>
          </button>
        </div>

        {activePanel === "demo" && (
          <div className="panel-body">
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
        )}

        {activePanel === "record" && (
          <div className="panel-body">
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
        )}

        {activePanel === "upload" && (
          <div className="panel-body">
            <FileUploader onSelect={handleUpload} />
          </div>
        )}
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

      <AnalysisSummary result={analysis} explanation={analysisExplanation} />

    </main>
    </>
  );
}
