export type AnalyzeRequest = {
  imageBase64: string; // JPEG base64 (downscaled)
  roi?: { x: number; y: number; w: number; h: number };
};

export type AnalyzeResponse = {
  summary: string; // 1–2 sentence plain-English
  likely_categories: string[]; // e.g., ["acne","folliculitis"]
  confidence_percentages?: number[]; // confidence for each category (0-100)
  risk_level: "low" | "medium" | "high";
  next_steps: string[]; // actionable, non-diagnostic
};
