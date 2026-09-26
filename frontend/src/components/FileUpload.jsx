import { useRef, useState } from "react";
import { uploadDocument } from "../api/client.js";

function FormattedText({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-ink/50" aria-hidden="true" />
              <p className="leading-relaxed text-ink/90">{trimmed.replace(/^[-•*]\s+/, "")}</p>
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-ink/90">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function FileUpload() {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    setStatus("uploading");
    setErrorMessage("");
    try {
      const response = await uploadDocument(file);
      setResult(response);
      setStatus("done");
    } catch (err) {
      setErrorMessage(err.message || "Upload failed. Please try a different file.");
      setStatus("error");
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? "border-brass bg-brass/5" : "border-ink/20 bg-white/40"
        }`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-3 text-moss"
          aria-hidden="true"
        >
          <path
            d="M12 3v11m0 0-3.5-3.5M12 14l3.5-3.5M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mb-3 text-ink/80">Drag a PDF here, or</p>
        <label className="inline-block cursor-pointer rounded-md bg-moss px-4 py-2 font-medium text-paper transition-opacity hover:opacity-90">
          Choose a file
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
            aria-describedby="upload-status"
          />
        </label>
        <p className="mt-2 text-xs text-ink/50">PDF only, up to 15MB.</p>
      </div>

      <div id="upload-status" aria-live="polite">
        {status === "uploading" && (
          <div className="flex animate-fade-up items-center gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-card">
            <svg
              className="h-4 w-4 flex-none animate-spin text-moss"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-ink/70">Reading {fileName}…</p>
          </div>
        )}

        {status === "error" && (
          <div className="animate-fade-up rounded-lg border border-signal/20 bg-signal/5 p-4">
            <p role="alert" className="text-sm text-signal">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-sm font-medium text-ink/70 underline underline-offset-2 hover:text-ink"
            >
              Try again
            </button>
          </div>
        )}

        {status === "done" && result && (
          <div className="animate-fade-up rounded-lg border border-ink/15 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-medium">Summary of {result.filename}</h3>
              <button
                type="button"
                onClick={reset}
                className="flex-none rounded-md border border-ink/15 px-2.5 py-1 text-xs font-medium text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
              >
                Upload another
              </button>
            </div>
            <FormattedText text={result.summary} />
            <p className="mt-4 border-t border-ink/10 pt-3 text-xs text-ink/50">
              {result.page_count} page{result.page_count === 1 ? "" : "s"} read
              {result.ocr_used ? ", including scanned pages read with OCR" : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}