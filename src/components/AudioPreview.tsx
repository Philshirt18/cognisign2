import { useEffect, useState } from "react";
import type { RecorderPayload } from "@/types";

interface Props {
  source: RecorderPayload | { file: File; url: string } | null;
}

const AudioPreview = ({ source }: Props) => {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setActiveUrl(null);
      return;
    }
    if ("file" in source) {
      const url = URL.createObjectURL(source.file);
      setActiveUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setActiveUrl(source.url);
    }
  }, [source]);

  if (!source || !activeUrl) {
    return (
      <section className="card">
        <h2>Audio preview</h2>
        <p>No clip selected yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Audio preview</h2>
      <audio src={activeUrl} controls style={{ width: "100%" }} />
    </section>
  );
};

export default AudioPreview;
