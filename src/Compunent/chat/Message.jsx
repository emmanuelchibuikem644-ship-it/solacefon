export default function Message({ text, sender, time }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
      >
        <p>{text}</p>
        <span className="block text-[10px] opacity-70 mt-1 text-right">
          {time}
        </span>
      </div>
    </div>
  );
}