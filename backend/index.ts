import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { analyzeWithGemini, chatWithGemini } from "./gemini.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Request validation schema
const ReqSchema = z.object({
  imageBase64: z.string().min(100, "Image data too short"),
  roi: z
    .object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    })
    .optional(),
});

const ChatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
  imageBase64: z.string().nullable().optional(),
  analysisContext: z.object({
    summary: z.string(),
    likely_categories: z.array(z.string()),
    risk_level: z.enum(["low", "medium", "high"]),
    next_steps: z.array(z.string()),
  }).nullable().optional(),
  additionalImages: z.array(z.string()).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
});

// Health check endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "SkinSight Live API",
    status: "running",
    version: "1.0.0",
  });
});

// Analysis endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    // Validate request body
    const { imageBase64, roi } = ReqSchema.parse(req.body);

    // Hard budget: reject huge payloads (roughly ~1.5MB base64)
    if (imageBase64.length > 1_400_000) {
      return res.status(413).json({
        error: "Image too large. Please use a smaller image (max ~1MB).",
      });
    }

    console.log(`📸 Analyzing image (${imageBase64.length} bytes)...`);

    // Call Gemini Vision API
    const data = await analyzeWithGemini(imageBase64, roi);

    console.log(`✅ Analysis complete: ${data.risk_level} risk`);

    return res.json(data);
  } catch (e: any) {
    console.error("❌ Analysis error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request format",
        details: e.errors,
      });
    }

    return res.status(500).json({
      error: e.message ?? "Internal server error. Please try again.",
    });
  }
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, imageBase64, analysisContext, additionalImages, conversationHistory } = ChatSchema.parse(req.body);

    console.log(`💬 Chat message received: ${message.substring(0, 50)}...`);
    if (imageBase64) {
      console.log(`📸 Image context included (${imageBase64.length} bytes)`);
    }
    if (additionalImages && additionalImages.length > 0) {
      console.log(`📎 ${additionalImages.length} additional image(s) included`);
    }
    if (conversationHistory && conversationHistory.length > 0) {
      console.log(`💭 Conversation history: ${conversationHistory.length} messages`);
    }

    const response = await chatWithGemini(
      message, 
      imageBase64 || undefined, 
      analysisContext || undefined, 
      additionalImages,
      conversationHistory
    );

    console.log(`✅ Chat response sent`);

    return res.json({ message: response });
  } catch (e: any) {
    console.error("❌ Chat error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid message format",
        details: e.errors,
      });
    }

    return res.status(500).json({
      error: "Failed to process chat message. Please try again.",
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SkinSight Live API running on http://localhost:${PORT}`);
  console.log(
    `📡 Ready to receive requests at http://localhost:${PORT}/api/analyze\n`
  );

  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "⚠️  WARNING: GEMINI_API_KEY not set. Using mock responses.\n"
    );
  }
});
