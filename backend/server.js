import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Website-INCEPTION Chatbot Backend is running!",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages tidak valid.",
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY belum diset di backend.",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "OpenRouter API error.",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot backend berjalan di http://localhost:${PORT}`);
});