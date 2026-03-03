"use client";
import ChatInput from "@/Compunent/chat/ChatInput";
import MessageList from "@/Compunent/chat/MessageList";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- Scroll to bottom when messages update ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:4000");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "history") {
        const formatted = msg.messages.map((m) => ({
          id: m._id,
          sender: m.sender,
          text: m.text,
          time: new Date(m.time),
        }));
        setMessages(formatted);
      } else {
        const formatted = {
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          time: new Date(msg.time),
        };
        setMessages((prev) => [...prev, formatted]);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => socketRef.current.close();
  }, []);

  const handleSend = (text) => {
    if (!text) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        sender: "user",
        text,
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket not connected");
    }
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