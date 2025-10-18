import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalyzeResponse } from "./types.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeWithGemini(
  imageBase64: string,
  _roi?: any
): Promise<AnalyzeResponse> {
  // If no API key, return a mock response
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  No GEMINI_API_KEY found. Returning mock response.");
    return {
      summary: "Looks like a mild inflammatory lesion with even borders.",
      likely_categories: ["acne", "folliculitis"],
      risk_level: "low",
      next_steps: [
        "Keep area clean",
        "Avoid picking",
        "Use OTC benzoyl peroxide 2.5%",
      ],
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
