"use client";

import { useEffect, useRef, useState } from "react";
import type { RecorderPayload } from "@/types";

interface RecorderProps {
  onComplete(payload: RecorderPayload): void;
  onError?(message: string): void;
}

const Recorder = ({ onComplete, onError }: RecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setSupported(false);
    }
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = async () => {
    if (!supported || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        onComplete({ blob, mimeType: mediaRecorder.mimeType, url });
        setStatus("Recording ready");
      };

      mediaRecorder.start();
      setRecording(true);
      setStatus("Listening…");
    } catch (error) {
      console.error(error);
      setStatus("Unable to access microphone");
      setSupported(false);
      onError?.("Microphone access denied or unsupported browser.");
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state !== "recording") return;
    mediaRecorder.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    setRecording(false);
    setStatus("Processing clip…");
  };

  return (
    <div className="recorder">
      {!supported ? (
        <p className="hint">
          Recording isn&apos;t available in this preview or browser. In the published app this
          microphone recorder will work; for now, please upload a file or try a demo clip.
        </p>
      ) : (
        <div className="controls">
          <button type="button" onClick={startRecording} disabled={recording}>
            🎙️ Start recording
          </button>
          <button type="button" onClick={stopRecording} disabled={!recording}>
            ⏹️ Stop
          </button>
        </div>
      )}
      {status && <p className="status">{status}</p>}
      <style jsx>{`
        .recorder {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .controls {
          display: flex;
          gap: 1rem;
        }
        button {
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #0b2545, #2ca6a4);
          color: #fff;
          padding: 0.65rem 1.4rem;
          font-weight: 600;
          cursor: pointer;
        }
        button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .hint {
          margin: 0;
          font-size: 0.95rem;
          color: #4b5563;
        }
        .status {
          margin: 0;
          font-size: 0.9rem;
          color: #0b2545;
        }
      `}</style>
    </div>
  );
};

export default Recorder;
