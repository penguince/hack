export type AnalyzeRequest = {
  imageBase64: string; // JPEG base64 (downscaled)
  roi?: { x: number; y: number; w: number; h: number };
};

export type AnalyzeResponse = {
  summary: string; // 1–2 sentence plain-English
  likely_categories: string[]; // e.g., ["acne","folliculitis"]
  risk_level: "low" | "medium" | "high";
  next_steps: string[]; // actionable, non-diagnostic
};
