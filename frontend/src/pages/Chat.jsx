import { useChat } from "../hooks/useChat.js";
import ChatWindow from "../components/ChatWindow.jsx";

export default function Chat() {
  const { messages, sendMessage, isLoading, error } = useChat();

  return (
    <div className="mx-auto max-w-2xl px-0 py-0 sm:px-6 sm:py-6">
      <div className="flex h-[calc(100vh-3.75rem)] flex-col sm:h-[calc(100vh-6rem)] sm:rounded-lg sm:border sm:border-ink/10 sm:bg-white sm:shadow-card">
        <ChatWindow messages={messages} onSend={sendMessage} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
