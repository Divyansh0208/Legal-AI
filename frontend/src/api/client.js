const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function handleResponse(response) {
  if (!response.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // response body wasn't JSON — keep default message
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function sendQuery(question, sessionId) {
  const response = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, session_id: sessionId ?? null }),
  });
  return handleResponse(response);
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}

export async function transcribeAudio(blob) {
  const formData = new FormData();
  formData.append("file", blob, "recording.webm");
  const response = await fetch(`${API_BASE}/voice`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}
