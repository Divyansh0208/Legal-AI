import { Link } from "react-router-dom";

const features = [
  {
    title: "Ask in your own words",
    body: "No legal jargon required. Describe your situation the way you'd tell a friend.",
    icon: (
      <path
        d="M4 5h16v10H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Upload any document",
    body: "Tenancy agreements, notices, contracts — even scanned copies, read via OCR.",
    icon: (
      <path
        d="M12 3v11m0 0-3.5-3.5M12 14l3.5-3.5M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Speak instead of typing",
    body: "Record your question by voice and we'll transcribe it before answering.",
    icon: (
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-3a6 6 0 0 0 12 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-medium tracking-wide text-ink/60">
        <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
        Plain-language legal help
      </p>

      <h1 className="max-w-xl text-4xl font-medium leading-[1.15] sm:text-5xl">
        Understand your legal documents and rights, in plain language.
      </h1>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
        Sahayak reads tenancy agreements, contracts, and notices, and answers your
        questions about them — in the language and words you actually use.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          to="/chat"
          className="rounded-md bg-brass px-5 py-3 font-medium text-paper shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-raised"
        >
          Ask a question
        </Link>
        <Link
          to="/upload"
          className="rounded-md border border-ink/20 bg-white px-5 py-3 font-medium text-ink transition-colors hover:border-ink/40"
        >
          Upload a document
        </Link>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-up rounded-lg border border-ink/10 bg-white p-5 shadow-card"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mb-3 text-moss" aria-hidden="true">
              {f.icon}
            </svg>
            <h2 className="text-base font-medium text-ink">{f.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/65">{f.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink/50">
        This tool gives general legal information, not legal advice. For anything urgent
        or high-stakes, please speak with a qualified lawyer or local legal aid service.
      </p>
    </div>
  );
}
