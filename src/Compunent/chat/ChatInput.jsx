import { useEffect, useState, useRef } from "react";
import MessageList from "./MessageList";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:4000");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log("📩 WS RAW:", event.data); // IMPORTANT
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.messages);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (!input || !connected) return;

    const localMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessage]);

    ws.current.send(
      JSON.stringify({
        sender: "user",
        text: input,
      })
    );

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <MessageList messages={messages} />

      <div className="p-4 flex gap-2 bg-white border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message…"
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className={`px-4 py-2 rounded text-white ${
            connected ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}