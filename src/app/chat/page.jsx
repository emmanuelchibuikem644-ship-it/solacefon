"use client";

import { useEffect, useRef, useState } from "react";

/* ================= CHAT INPUT ================= */
function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="p-4 bg-white border-t flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}

/* ================= MESSAGE LIST ================= */
function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}

            {msg.emotion && (
              <div className="text-xs mt-1 text-gray-500">
                Emotion: {msg.emotion}
              </div>
            )}

            {msg.is_safety_alert && (
              <div className="text-xs text-red-600 mt-1">
                ⚠️ Safety Alert
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      setTyping(true);

      const res = await fetch(
        "https://solace-2.onrender.com/api/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
          emotion: data.emotion,
          is_safety_alert: data.is_safety_alert,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="h-14 bg-white border-b flex items-center px-4 font-semibold">
        Solace AI Chat
      </header>

      <MessageList messages={messages} />

      {typing && (
        <div className="px-4 text-sm text-gray-500">Bot is typing...</div>
      )}

      <div ref={endRef} />

      <ChatInput onSend={handleSend} />
    </div>
  );
}