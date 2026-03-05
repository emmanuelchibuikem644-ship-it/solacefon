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
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    if (!WS_URL) {
      console.error("❌ NEXT_PUBLIC_WS_URL not set");
      return;
    }

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // ===== HISTORY =====
      if (msg.type === "history") {
        const formatted = msg.messages.map((m) => ({
          id: m._id,
          sender: m.sender,
          text: m.text,
          time: new Date(m.time).toISOString(),
        }));
        setMessages(formatted);
        return;
      }

      // ===== SINGLE MESSAGE (ANTI-DUPLICATE) =====
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            time: new Date(msg.time).toISOString(),
          },
        ];
      });
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => socket.close();
  }, []);

  /* ================= SEND ================= */
  const handleSend = (text) => {
    if (!text || !connected) return;

    socketRef.current.send(
      JSON.stringify({
        sender: "user",
        text,
      })
    );
  };

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