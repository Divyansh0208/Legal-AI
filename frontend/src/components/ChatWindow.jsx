import { useEffect, useRef, useState } from "react";
import VoiceInput from "./VoiceInput.jsx";

const EXAMPLE_PROMPTS = [
  "Can my landlord raise rent mid-lease?",
  "What happens if I miss a hostel fee deadline?",
  "Can I be evicted without notice?",
];

function FormattedText({ text }) {
  // The model is instructed to reply in plain text with "- " list lines.
  // Render those as real list items without needing a markdown parser.
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
              <p className="leading-relaxed">{trimmed.replace(/^[-•*]\s+/, "")}</p>
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function Avatar({ isUser }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-medium ${
        isUser ? "bg-ink/10 text-ink/70" : "bg-moss text-paper"
      }`}
    >
      {isUser ? "You" : "S"}
    </div>
  );
}

function Message({ role, content, disclaimer, sources }) {
  const isUser = role === "user";
  return (
    <div className={`flex animate-fade-up gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar isUser={isUser} />
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-moss px-4 py-3 text-paper shadow-card"
            : "max-w-[80%] rounded-2xl rounded-tl-sm border border-ink/10 bg-white px-4 py-3 text-ink shadow-card"
        }
      >
        <FormattedText text={content} />
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-ink/10 pt-2">
            {sources.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink/60"
                title={s.source}
              >
                Source {i + 1}
              </span>
            ))}
          </div>
        )}
        {disclaimer && <p className="mt-2 text-xs text-ink/50">{disclaimer}</p>}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-moss text-paper text-xs font-medium">
        S
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-ink/10 bg-white px-4 py-3.5 shadow-card">
        <span className="sr-only">Looking into your question…</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.15}s` }}
            className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-ink/40"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, onSend, isLoading, error }) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  function submit(text) {
    const value = text ?? draft;
    if (!value.trim() || isLoading) return;
    onSend(value);
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function autoGrow(event) {
    setDraft(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
  }

  return (
    <div className="flex h-full flex-col">
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
      >
        {messages.length === 0 && (
          <div className="animate-fade-up">
            <p className="text-ink/60">
              Ask a question about a tenancy, contract, or consumer-rights issue to get started.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => submit(p)}
                  className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink/70 transition-colors hover:border-brass hover:text-ink"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        {isLoading && <ThinkingIndicator />}
        {error && (
          <p role="alert" className="text-sm text-signal">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-ink/10 bg-paper/90 p-4">
        <label htmlFor="chat-input" className="sr-only">
          Type your legal question
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={autoGrow}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Can my landlord raise rent mid-lease?"
          className="max-h-40 flex-1 resize-none rounded-md border border-ink/20 bg-white px-3 py-2.5 leading-relaxed transition-colors focus:border-brass"
        />
        <VoiceInput onTranscript={(text) => setDraft((prev) => (prev ? `${prev} ${text}` : text))} />
        <button
          type="submit"
          disabled={!draft.trim() || isLoading}
          className="rounded-md bg-brass px-4 py-2 font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}