"use client";

import { useEffect, useRef, useState } from "react";

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
              msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
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

  /* ================= SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (text) => {
    if (!text.trim()) return;

    // 1️⃣ Add user's message to chat
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: text },
    ]);

    try {
      // 2️⃣ Send to Django API
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      // 3️⃣ Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response, emotion: data.emotion },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
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