"use client";

import { useRef, useState } from "react";

interface FileUploaderProps {
  onSelect(file: File): void;
}

const FileUploader = ({ onSelect }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onSelect(file);
    }
  };

  return (
    <div className="uploader">
      <input
        ref={inputRef}
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={handleChange}
        hidden
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        📁 Choose audio file
      </button>
      {fileName && <p className="file-name">Selected: {fileName}</p>}
      <style jsx>{`
        .uploader {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        button {
          border: 1px solid rgba(11, 37, 69, 0.15);
          border-radius: 12px;
          padding: 0.65rem 1rem;
          background: #fff;
          color: #0b2545;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: rgba(44, 166, 164, 0.1);
        }
        .file-name {
          margin: 0;
          font-size: 0.9rem;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
