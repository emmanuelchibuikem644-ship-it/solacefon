"use client";

import ChatInput from "@/Compunent/chat/ChatInput";
import MessageList from "@/Compunent/chat/MessageList";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ================= SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {

    // ✅ CONNECT TO RENDER BACKEND
    socketRef.current = new WebSocket("wss://chat-backend-10.onrender.com");

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      console.log("📩 Message received:", msg);

      // ===== CHAT HISTORY =====
      if (msg.type === "history") {
        const formatted = msg.messages.map((m) => ({
          id: m._id,
          sender: m.sender,
          text: m.text,
          time: new Date(m.time),
        }));

        setMessages(formatted);
        return;
      }

      // ===== WELCOME MESSAGE =====
      if (msg.type === "welcome") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: msg.sender,
            text: msg.text,
            time: new Date(msg.time),
          },
        ]);
        return;
      }

      // ===== NORMAL MESSAGE =====
      const formatted = {
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        time: new Date(msg.time),
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === formatted.id)) return prev;
        return [...prev, formatted];
      });
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => socketRef.current?.close();
  }, []);

  /* ================= SEND MESSAGE ================= */
  const handleSend = (text) => {
    if (!text || !connected) return;

    socketRef.current.send(
      JSON.stringify({
        sender: "user",
        text,
      })
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      
      <header className="h-14 bg-white border-b flex items-center px-4 font-semibold">
        Solace
      </header>

      <MessageList messages={messages} />

      <div ref={messagesEndRef} />

      <ChatInput onSend={handleSend} connected={connected} />
    </div>
  );
}