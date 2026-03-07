"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE = "https://solace-2.onrender.com";

/* ================= CHAT INPUT COMPONENT ================= */
function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSendClick = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="p-4 bg-white flex gap-2 border-t">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleEnter}
      />
      <button
        onClick={handleSendClick}
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
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
            {msg.emotion && (
              <div className="text-xs text-gray-500 mt-1">
                Emotion: {msg.emotion}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= MAIN CHAT PAGE ================= */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    console.log("User message:", text);

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      const token = localStorage.getItem("access");
      console.log("JWT Token:", token);

      const res = await fetch(`${API_BASE}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("API response:", data);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || data.reply || "No response from AI.",
          emotion: data.emotion,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      <header className="h-14 bg-white border-b flex items-center px-4 font-semibold">
        Solace AI Chat
      </header>

      <MessageList messages={messages} />
      <div ref={messagesEndRef} />

      <ChatInput onSend={handleSend} />
    </div>
  );
} 