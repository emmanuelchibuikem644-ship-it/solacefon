require("dotenv").config();
const WebSocket = require("ws");
const mongoose = require("mongoose");
const OpenAI = require("openai");

/* ================= SAFETY CHECK ================= */
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing. Check your .env file.");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

/* ================= WEBSOCKET ================= */
const PORT = 4000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

wss.on("connection", async (ws) => {
  console.log("🔌 Client connected");

  // Send chat history
  const history = await Message.find().sort({ time: 1 }).limit(50);
  ws.send(JSON.stringify({ type: "history", messages: history }));

  ws.on("message", async (data) => {
    try {
      const userData = JSON.parse(data.toString());
      if (!userData.text) return;

      /* ===== SAVE USER MESSAGE ===== */
      const savedUserMsg = await Message.create({
        sender: "user",
        text: userData.text,
      });

      broadcast({
        id: savedUserMsg._id,
        sender: "user",
        text: savedUserMsg.text,
        time: savedUserMsg.time,
      });

      /* ===== OPENAI RESPONSE ===== */
      let aiText = "I'm here with you. Please tell me more.";

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a mental wellness support chatbot.
You are NOT a medical professional.
Do NOT diagnose or treat mental illness.
Offer empathy, validation, reflection, and gentle guidance.
Encourage healthy coping, emotional expression, and self-awareness.
If distress is severe, suggest reaching trusted people or professionals.
Never be judgmental.
`,
            },
            {
              role: "user",
              content: userData.text,
            },
          ],
          temperature: 0.7,
        });

        aiText = completion.choices[0].message.content;
      } catch (aiError) {
        console.error("❌ OpenAI error:", aiError.message);
        aiText =
          "Sorry, I'm having trouble responding right now. Please try again.";
      }

      /* ===== SAVE AI MESSAGE ===== */
      const savedAiMsg = await Message.create({
        sender: "ai",
        text: aiText,
      });

      broadcast({
        id: savedAiMsg._id,
        sender: "ai",
        text: savedAiMsg.text,
        time: savedAiMsg.time,
      });

    } catch (err) {
      console.error("❌ Message handling error:", err);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

/* ================= BROADCAST ================= */
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}