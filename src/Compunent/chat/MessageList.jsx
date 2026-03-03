import Message from "./Message";
export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const formattedTime = msg.time
          ? new Date(msg.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <Message
            key={msg.id || msg._id}
            text={msg.text}
            sender={msg.sender}
            time={formattedTime} // ✅ STRING, NOT Date
          />
        );
      })}
    </div>
  );
}