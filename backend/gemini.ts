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

    const prompt = `You are not a doctor. Give non-diagnostic guidance for a visible skin concern.

Analyze this image and return ONLY a valid JSON object with this exact structure:
{
  "summary": "1-2 sentence plain-English description of what you observe",
  "likely_categories": ["category1", "category2"],
  "risk_level": "low" or "medium" or "high",
  "next_steps": ["step 1", "step 2", "step 3"]
}

Rules:
- Be concise and respectful
- Use plain language, no medical jargon
- Provide 2-4 likely categories (e.g., acne, eczema, dry skin, rash)
- Give 2-4 concrete, actionable next steps
- Always include "Consult a dermatologist if it persists or worsens" as a next step
- Return ONLY valid JSON, no other text`;

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
    return {
      summary: parsed.summary || "Unable to analyze image",
      likely_categories: Array.isArray(parsed.likely_categories)
        ? parsed.likely_categories
        : ["unknown"],
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
  }
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "Sorry, the chat service is currently unavailable. Please check your API key configuration.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let systemPrompt = `You are a helpful, friendly skin care assistant. Provide informative, concise answers about:
- General skin care advice
- Common skin conditions (informational only)
- Skin care product types and ingredients
- Daily routines and habits for healthy skin

Important guidelines:
- Keep responses under 200 words
- Use friendly, conversational tone
- DO NOT provide medical diagnoses
- DO NOT prescribe treatments
- Always recommend consulting a dermatologist for specific concerns
- Be supportive and reassuring
- Avoid technical medical jargon
`;

    // Add image context if available
    if (analysisContext) {
      systemPrompt += `\n\nCONTEXT: The user has analyzed an image with the following results:
- Summary: ${analysisContext.summary}
- Possible categories: ${analysisContext.likely_categories.join(", ")}
- Risk level: ${analysisContext.risk_level}
- Suggested next steps: ${analysisContext.next_steps.join("; ")}

You can reference this analysis when answering the user's questions. If they ask about the image or "this", refer to this context.
`;
    }

    systemPrompt += `\n\nUser question: ${message}`;

    // If we have an image, include it in the request
    const contentParts: any[] = [systemPrompt];
    
    if (imageBase64 && analysisContext) {
      contentParts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
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