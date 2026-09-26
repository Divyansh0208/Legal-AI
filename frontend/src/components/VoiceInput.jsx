import { useRef, useState } from "react";
import { transcribeAudio } from "../api/client.js";

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-3a6 6 0 0 0 12 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-[18px] w-[18px] animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function VoiceInput({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setIsTranscribing(true);
      try {
        const result = await transcribeAudio(blob);
        onTranscript(result.transcript);
      } catch {
        onTranscript("");
      } finally {
        setIsTranscribing(false);
      }
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      aria-pressed={isRecording}
      disabled={isTranscribing}
      className={`flex h-[42px] w-[42px] flex-none items-center justify-center rounded-md border transition-colors disabled:opacity-40 ${
        isRecording
          ? "animate-pulse-ring border-signal bg-signal/10 text-signal"
          : "border-ink/20 text-ink/70 hover:border-ink/40 hover:text-ink"
      }`}
    >
      <span className="sr-only">
        {isRecording ? "Stop recording" : isTranscribing ? "Transcribing" : "Record a voice question"}
      </span>
      {isTranscribing ? <Spinner /> : isRecording ? <StopIcon /> : <MicIcon />}
    </button>
  );
}
