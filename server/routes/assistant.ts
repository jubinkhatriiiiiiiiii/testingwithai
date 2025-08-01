import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

const PRIMARY_NVIDIA_API_KEY = process.env.PRIMARY_NVIDIA_API_KEY || "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";
const PRIMARY_MODEL = "opengpt-x/teuken-7b-instruct-commercial-v0.4";

const SECONDARY_NVIDIA_API_KEY = process.env.SECONDARY_NVIDIA_API_KEY || "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";
const SECONDARY_MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5";

const TERTIARY_NVIDIA_API_KEY = process.env.TERTIARY_NVIDIA_API_KEY || "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";
const TERTIARY_MODEL = "google/gemma-3n-e4b-it";

const SPECIAL_QUERIES: Record<string, string> = {
  "who made you": "I was made by Jubin Khatri for this site named as EduVault.",
  "who created you": "I was made by Jubin Khatri for this site named as EduVault.",
  "who is your creator": "I was made by Jubin Khatri for this site named as EduVault.",
  "who built you": "I was made by Jubin Khatri for this site named as EduVault.",
  "who developed you": "I was made by Jubin Khatri for this site named as EduVault.",
  "who is behind you": "I was made by Jubin Khatri for this site named as EduVault.",
  "who is your owner": "I was made by Jubin Khatri for the website named as EduVault for the ease of students so I address Jubin Khatri as my owner.",
  "what model": "That information is not disclosed yet.",
  "your model": "That information is not disclosed yet.",
  "what ai model": "That information is not disclosed yet.",
  "which model do you use": "That information is not disclosed yet.",
  "can you tell your model": "That information is not disclosed yet.",
  "model you run on": "That information is not disclosed yet.",
  "backend model": "That information is not disclosed yet.",
  "tell me the model": "That information is not disclosed yet.",
  "model information": "That information is not disclosed yet.",
  "do you use chatgpt": "That information is not disclosed yet.",
  "are you gpt": "That information is not disclosed yet.",
  "are you chatgpt": "That information is not disclosed yet.",
  "are you using openai": "That information is not disclosed yet.",
  "are you based on llama": "That information is not disclosed yet.",
  "based on nvidia": "That information is not disclosed yet.",
  "who are you": "I'm your AI assistant created by Jubin Khatri.",
  "what is your name": "I'm your AI assistant.",
  "are you an ai": "Yes, I'm an AI assistant built to help with your questions.",
  "what are you": "I'm an AI built for EduVault by Jubin Khatri.",
  "what is your purpose": "My purpose is to assist you with your questions and tasks.",
  "what can you do": "I can help answer questions, provide information, assist with tasks, and guide you through EduVault.",
  "describe yourself": "I'm an AI assistant built to serve users of EduVault with helpful information and smart responses.",
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! What can I assist you with?",
  "how are you": "I'm just code, but I'm functioning well!",
  "thank you": "You're welcome!",
  "thanks": "Glad I could help!",
  "good job": "Thank you!",
  "well done": "Thanks!",
  "bye": "Goodbye! Let me know if you need anything else.",
  "good night": "Good night! Rest well.",
  "good morning": "Good morning! Ready to assist.",
  "good evening": "Good evening! I'm here to help.",
  "tell me a joke": "Why don't computers take their hats off? Because they have bad cache!",
  "say something funny": "I'm reading a book on anti-gravity—it's impossible to put down!",
  "make me laugh": "Why did the AI go to school? To improve its 'net' worth!",
  "what is eduvault": "EduVault is a platform built to help students and educators preview, request, and manage academic resources securely.",
  "do you work offline": "Some features might work offline, but I'm designed to work best with internet access.",
  "can you do calculations": "Yes, I can help with math, code, and logic too!",
  "can you translate": "Yes, I can help with multilingual translation."
};

function cleanResponse(text: string): string {
  let cleaned = text.replace(/<think>.*?<\/think>/gs, "").trim();
  cleaned = cleaned.replace(/\*{1,3}([^*]+?)\*{1,3}/g, "$1");
  cleaned = cleaned.replace(/[*_`]+/g, "");
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  return cleaned;
}

// Get special reply for a given phrase or null
function getSpecialReply(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  for (const query in SPECIAL_QUERIES) {
    if (lowerMsg.includes(query)) {
      return SPECIAL_QUERIES[query];
    }
  }
  return null;
}

// Split user input on common delimiters to isolate multiple questions
function splitQuestions(text: string): string[] {
  // Split on question marks, 'and', newlines, semicolons, etc.
  return text
    .split(/[\?\.!\n;]/g)
    .map(s => s.trim())
    .filter(Boolean);
}

async function callNvidiaAPI(messages: any[], apiKey: string, model: string): Promise<string> {
  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return cleanResponse(data.choices?.[0]?.message?.content || "No reply from NVIDIA");
}

router.post("/assistant", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid or missing 'messages'" });
  }

  try {
    // Get the last user message content
    const lastUserMessage = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";

    // Split into multiple questions
    const questions = splitQuestions(lastUserMessage);

    const specialReplies: string[] = [];
    const questionsForAI: string[] = [];

    // Check each question if special reply exists
    for (const q of questions) {
      const special = getSpecialReply(q);
      if (special) {
        specialReplies.push(special);
      } else {
        questionsForAI.push(q);
      }
    }

    let finalReply = "";

    // Add all special replies first
    if (specialReplies.length > 0) {
      finalReply += specialReplies.join("\n\n");
    }

    // If there are questions without special replies, call AI model on those combined
    if (questionsForAI.length > 0) {
      const systemPrompt = "You are Jarvis, a helpful AI assistant.";
      // Prepare messages for API with system prompt and user's questions as one user message
      const messagesForApi = [
        { role: "system", content: systemPrompt },
        { role: "user", content: questionsForAI.join(". ") }
      ];

      let modelReply = "";
      try {
        modelReply = await callNvidiaAPI(messagesForApi, PRIMARY_NVIDIA_API_KEY, PRIMARY_MODEL);
      } catch {
        try {
          modelReply = await callNvidiaAPI(messagesForApi, SECONDARY_NVIDIA_API_KEY, SECONDARY_MODEL);
        } catch {
          modelReply = await callNvidiaAPI(messagesForApi, TERTIARY_NVIDIA_API_KEY, TERTIARY_MODEL);
        }
      }

      if (finalReply.length > 0) {
        finalReply += "\n\n" + modelReply;
      } else {
        finalReply = modelReply;
      }
    }

    return res.json({ reply: finalReply.trim() });

  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ error: "Sorry, I'm having trouble. Try again later." });
  }
});

export default router;
