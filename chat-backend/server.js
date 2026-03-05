require("dotenv").config();
const WebSocket = require("ws");
const mongoose = require("mongoose");
const axios = require("axios");

/* ================= ENV CHECK ================= */
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY missing");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

/* ================= AI FUNCTION ================= */
async function getAIReply(userText) {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a non-clinical mental wellness chatbot.
You are NOT a doctor.
Do NOT diagnose or treat mental illness.
Respond with empathy, validation, and gentle reflection.
Encourage healthy thinking and emotional expression.
If distress seems severe, suggest trusted human support.
`,
          },
          { role: "user", content: userText },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ OpenRouter error:", err.response?.data || err.message);
    return "I’m here with you, but I’m having trouble responding right now.";
  }
}

/* ================= WEBSOCKET ================= */
const PORT = process.env.PORT || 4000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

wss.on("connection", async (ws) => {
  console.log("🔌 Client connected");

  // ✅ SEND HISTORY FIRST
  const history = await Message.find().sort({ time: 1 }).limit(50);
  ws.send(JSON.stringify({ type: "history", messages: history }));

  // ✅ SEND WELCOME ONLY IF CHAT IS EMPTY
  if (history.length === 0) {
    const welcomeText =
      "Hi 👋 I’m here to listen. How are you feeling today?";

    const welcomeMsg = await Message.create({
      sender: "ai",
      text: welcomeText,
    });

    ws.send(
      JSON.stringify({
        id: welcomeMsg._id,
        sender: "ai",
        text: welcomeMsg.text,
        time: welcomeMsg.time,
      })
    );
  }

  ws.on("message", async (data) => {
    try {
      const userData = JSON.parse(data.toString());
      if (!userData.text) return;

      const savedUser = await Message.create({
        sender: "user",
        text: userData.text,
      });

      broadcast({
        id: savedUser._id,
        sender: "user",
        text: savedUser.text,
        time: savedUser.time,
      });

      const aiText = await getAIReply(userData.text);

      const savedAI = await Message.create({
        sender: "ai",
        text: aiText,
      });

      broadcast({
        id: savedAI._id,
        sender: "ai",
        text: savedAI.text,
        time: savedAI.time,
      });
    } catch (err) {
      console.error("❌ Message handling error:", err);
    }
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

/* ================= BROADCAST ================= */
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}