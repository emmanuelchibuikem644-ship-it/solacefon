 export default function Message({ text, from }) {
  const isUser = from === "user";
  return (
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        isUser
          ? "bg-blue-200 self-end text-right"
          : "bg-green-200 self-start text-left"
      }`}
    >
      {text}
    </div>
  );
}