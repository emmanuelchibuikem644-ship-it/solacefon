"use client";

import { useState } from "react";
import Message from "./Message";

export default function ChatBox() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const userMsg = { text, from: "user" };
    setHistory([...history, userMsg]);
    setText("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const { reply, intent, emotion } = await res.json();

    setHistory([
      ...history,
      userMsg,
      { text: `(${emotion}, ${intent}) — ${reply}`, from: "bot" },
    ]);
  }

  return (
    <div className="flex flex-col space-y-3 h-[500px] overflow-auto p-4 border rounded-lg bg-white shadow-md">
      {history.map((m, i) => (
        <Message key={i} text={m.text} from={m.from} />
      ))}

      <form onSubmit={handleSend} className="flex mt-2">
        <input
          className="flex-1 border p-2 rounded-l focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type how you feel..."
        />
        <button className="bg-blue-500 text-white px-4 rounded-r">Send</button>
      </form>
    </div>
  );
}