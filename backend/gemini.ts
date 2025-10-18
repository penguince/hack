import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalyzeResponse } from "./types.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function analyzeWithGemini(
  imageBase64: string,
  _roi?: any
): Promise<AnalyzeResponse> {
  if (!process.env.GEMINI_API_KEY) {
    return "no gemini api key found" as unknown as AnalyzeResponse;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a friendly, supportive skin care assistant who helps people understand their skin better.

Analyze this image and provide guidance in plain English. Return ONLY a valid JSON object with this exact structure:
{
  "summary": "1-2 sentence plain-English description of what you observe",
  "likely_categories": ["category1", "category2"],
  "confidence_percentages": [65, 35],
  "risk_level": "low" or "medium" or "high",
  "next_steps": ["step 1", "step 2", "step 3"]
}

Your approach:
- Be warm and conversational, like talking to a friend
- Use simple everyday language, avoid technical terms
- Provide 2-4 likely categories (like acne, eczema, dry skin, rash)
- Give 2-4 concrete, actionable next steps
- For healthy skin, suggest maintenance tips like "Continue your current skincare routine" or "Keep skin moisturized"
- Always include "Consult a dermatologist if it persists or worsens" as a next step (unless skin is healthy)
- DO NOT provide medical diagnoses - you're here to guide, not diagnose
- Return ONLY valid JSON, no other text
- Never use asterisks, bold formatting, or special characters in your text

Remember: You're a caring guide helping them understand their skin, not a doctor making diagnoses.`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate response structure
    const categories = Array.isArray(parsed.likely_categories)
      ? parsed.likely_categories
      : ["unknown"];
    
    let confidences = Array.isArray(parsed.confidence_percentages)
      ? parsed.confidence_percentages
      : undefined;

    // Normalize confidence percentages to add up to 100
    if (confidences && confidences.length > 0) {
      const sum = confidences.reduce((acc: number, val: number) => acc + val, 0);
      if (sum !== 100 && sum > 0) {
        // Normalize to 100
        confidences = confidences.map((val: number) => Math.round((val / sum) * 100));
        
        // Adjust for rounding errors
        const newSum = confidences.reduce((acc: number, val: number) => acc + val, 0);
        if (newSum !== 100) {
          confidences[0] += (100 - newSum);
        }
      }
    }

    return {
      summary: parsed.summary || "Unable to analyze image",
      likely_categories: categories,
      confidence_percentages: confidences,
      risk_level:
        parsed.risk_level === "low" ||
        parsed.risk_level === "medium" ||
        parsed.risk_level === "high"
          ? parsed.risk_level
          : "low",
      next_steps: Array.isArray(parsed.next_steps)
        ? parsed.next_steps
        : ["Consult a healthcare professional"],
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Fallback to mock response on error
    return {
      summary:
        "Unable to analyze the image at this time. Please try again later.",
      likely_categories: ["analysis_error"],
      risk_level: "low",
      next_steps: [
        "Try taking another photo with better lighting",
        "Consult a dermatologist for professional evaluation",
      ],
    };
  }
}

export async function chatWithGemini(
  message: string,
  imageBase64?: string,
  analysisContext?: {
    summary: string;
    likely_categories: string[];
    risk_level: "low" | "medium" | "high";
    next_steps: string[];
  },
  additionalImages?: string[],
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "Sorry, the chat service is currently unavailable. Please check your API key configuration.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let systemPrompt = `You are a friendly, supportive skin care assistant who helps people understand and care for their skin.

Your personality:
- Warm and conversational, like chatting with a knowledgeable friend
- Make it flow naturally like a real conversation
- Knowledgeable but approachable
- Use plain everyday language
- Supportive guide, not a medical professional

You help with:
- Understanding skin conditions and concerns
- General skin care advice and routines
- Product types and ingredients guidance
- Daily habits for healthy skin
- Answering follow-up questions about analyzed images

Your approach:
- Keep responses concise and focused, under 75 words
- Speak naturally without any formatting like asterisks or bold text
- Avoid technical jargon when possible
- Be encouraging and reassuring
- Reference previous conversation naturally
- Connect your analysis with follow-up questions
- DO NOT diagnose medical conditions
- DO NOT prescribe treatments
- Always recommend consulting a dermatologist for persistent concerns

Remember: You just analyzed their image (if applicable) and now you're here to answer their questions as a caring, consistent guide. Speak naturally like you're having a real conversation.
`;

    // Add conversation history for context continuity
    if (conversationHistory && conversationHistory.length > 0) {
      systemPrompt += `\n\nPREVIOUS CONVERSATION:`;
      conversationHistory.forEach((msg) => {
        const speaker = msg.role === "user" ? "User" : "You";
        systemPrompt += `\n${speaker}: ${msg.content}`;
      });
      systemPrompt += `\n---\n`;
    }

    // Add image context if available
    if (analysisContext) {
      systemPrompt += `\nYour earlier analysis of their image:
- Summary: ${analysisContext.summary}
- Possible categories: ${analysisContext.likely_categories.join(", ")}
- Risk level: ${analysisContext.risk_level}
- Suggested next steps: ${analysisContext.next_steps.join("; ")}

Reference this naturally when they ask about "it", "this", "the image", or their skin concern.
`;
    }

    systemPrompt += `\nUser's question: ${message}`;

    // Build content parts array
    const contentParts: any[] = [systemPrompt];
    
    // Add main analyzed image if available
    if (imageBase64 && analysisContext) {
      contentParts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    // Add additional uploaded images (works with or without analysis)
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach((img) => {
        contentParts.push({
          inlineData: {
            data: img,
            mimeType: "image/jpeg",
          },
        });
      });
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "I'm having trouble responding right now. Please try asking again in a moment.";
  }
}