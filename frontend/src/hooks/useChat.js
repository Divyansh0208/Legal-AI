import { useCallback, useState } from "react";
import { sendQuery } from "../api/client.js";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = useCallback(
    async (question) => {
      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setIsLoading(true);
      try {
        const result = await sendQuery(question, sessionId);
        if (result.session_id) setSessionId(result.session_id);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.answer,
            disclaimer: result.disclaimer,
            sources: result.sources,
          },
        ]);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  return { messages, sendMessage, isLoading, error };
}
