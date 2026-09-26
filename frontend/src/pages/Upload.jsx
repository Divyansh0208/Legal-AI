import FileUpload from "../components/FileUpload.jsx";

export default function Upload() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-medium">Upload a document</h1>
      <p className="mt-2 mb-8 max-w-md text-ink/70">
        We&rsquo;ll read it and give you a plain-language summary — what kind of document it is,
        what it asks of you, and anything worth double-checking.
      </p>
      <FileUpload />
    </div>
  );
}
