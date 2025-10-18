import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { analyzeWithGemini, chatWithGemini } from "./gemini.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8788";

// Type definitions for Python service responses
interface PythonServiceResponse {
  processed_image?: string;
  quality?: {
    brightness: number;
    contrast: number;
    sharpness: number;
    is_good_quality: boolean;
  };
  skin_mask?: string;
  skin_percentage?: number;
}

// Helper function to call Python OpenCV service
async function callPythonService(imageBase64: string, operation: string, params: any = {}): Promise<PythonServiceResponse> {
  try {
    console.log(`🐍 Calling Python service: ${operation}`);
    const response = await fetch(`${PYTHON_SERVICE_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: imageBase64,
        operation,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Python service returned ${response.status}`);
    }

    return await response.json() as PythonServiceResponse;
  } catch (error) {
    console.error(`Python service error (${operation}):`, error);
    throw error;
  }
}

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

// Python service health check
app.get("/api/python-status", async (_req, res) => {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/`);
    const data = await response.json();
    res.json({
      python_service: "connected",
      details: data,
    });
  } catch (error: any) {
    res.status(503).json({
      python_service: "disconnected",
      error: error.message,
      note: "Make sure Python service is running on port 8788",
    });
  }
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

    let processedImage = imageBase64;
    let qualityInfo = null;

    try {
      // Analyze image quality using Python service
      const qualityResult = await callPythonService(imageBase64, "quality");
      qualityInfo = qualityResult.quality || null;
      
      if (qualityInfo) {
        console.log(`📊 Image quality: brightness=${qualityInfo.brightness}, contrast=${qualityInfo.contrast}, sharpness=${qualityInfo.sharpness}`);

        // Check if image quality is poor
        if (!qualityInfo.is_good_quality) {
          console.warn(`❌ Image quality is poor - rejecting analysis`);
          
          // Return static response without calling Gemini
          return res.json({
            summary: "Image quality is too poor for accurate analysis. Please retake the photo with better lighting and focus.",
            likely_categories: ["poor_image_quality"],
            risk_level: "low",
            next_steps: [
              "Ensure good lighting (natural light works best)",
              "Hold camera steady to avoid blur",
              "Make sure the area is in focus",
              "Try again with a clearer image"
            ],
            imageQuality: qualityInfo,
          });
        }
      }

      // Extract ROI if specified using Python service
      if (roi) {
        console.log(`✂️  Extracting ROI: x=${roi.x}, y=${roi.y}, w=${roi.w}, h=${roi.h}`);
        const roiResult = await callPythonService(imageBase64, "roi", {
          x: roi.x,
          y: roi.y,
          width: roi.w,
          height: roi.h,
        });
        if (roiResult.processed_image) {
          processedImage = roiResult.processed_image;
        }
      }

      // Preprocess image for better analysis using Python service
      console.log(`🔧 Preprocessing image with OpenCV...`);
      const preprocessResult = await callPythonService(processedImage, "preprocess");
      if (preprocessResult.processed_image) {
        processedImage = preprocessResult.processed_image;
        console.log(`✅ Image preprocessed successfully with Python OpenCV`);
      }
    } catch (cvError) {
      console.error("⚠️  Python OpenCV processing failed, using original image:", cvError);
      processedImage = imageBase64;
    }

    // Call Gemini Vision API with processed image
    const data = await analyzeWithGemini(processedImage, roi);

    console.log(`✅ Analysis complete: ${data.risk_level} risk`);

    // Include quality information in response
    return res.json({
      ...data,
      imageQuality: qualityInfo,
    });
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

    // Check quality of main image if provided
    if (imageBase64) {
      try {
        const qualityResult = await callPythonService(imageBase64, "quality");
        const qualityInfo = qualityResult.quality;
        
        if (qualityInfo && !qualityInfo.is_good_quality) {
          console.warn(`❌ Chat image quality is poor - rejecting`);
          return res.json({ 
            message: "The image you uploaded has poor quality. Please upload a clearer image with better lighting and focus for accurate analysis."
          });
        }
      } catch (error) {
        console.warn("⚠️ Could not check image quality, proceeding anyway");
      }
    }

    // Check quality of additional images if provided
    if (additionalImages && additionalImages.length > 0) {
      for (let i = 0; i < additionalImages.length; i++) {
        try {
          const qualityResult = await callPythonService(additionalImages[i], "quality");
          const qualityInfo = qualityResult.quality;
          
          if (qualityInfo && !qualityInfo.is_good_quality) {
            console.warn(`❌ Additional image ${i + 1} quality is poor - rejecting`);
            return res.json({ 
              message: `Image ${i + 1} has poor quality. Please upload clearer images with better lighting and focus for accurate analysis.`
            });
          }
        } catch (error) {
          console.warn(`⚠️ Could not check quality for additional image ${i + 1}, proceeding anyway`);
        }
      }
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

// Image processing endpoint
app.post("/api/process-image", async (req, res) => {
  try {
    const { imageBase64, operation } = z.object({
      imageBase64: z.string(),
      operation: z.enum(["edges", "preprocess", "quality", "contrast", "skin"]),
    }).parse(req.body);

    console.log(`🔧 Processing image with operation: ${operation} via Python OpenCV`);

    let result: any;

    try {
      const pythonResult = await callPythonService(imageBase64, operation);
      
      switch (operation) {
        case "edges":
          result = { 
            processedImage: pythonResult.processed_image, 
            operation: "edges" 
          };
          break;
        
        case "preprocess":
          result = { 
            processedImage: pythonResult.processed_image, 
            operation: "preprocess" 
          };
          break;
        
        case "quality":
          result = { 
            quality: pythonResult.quality, 
            operation: "quality" 
          };
          break;
        
        case "contrast":
          result = { 
            processedImage: pythonResult.processed_image, 
            operation: "contrast" 
          };
          break;
        
        case "skin":
          result = { 
            processedImage: pythonResult.processed_image,
            skinMask: pythonResult.skin_mask,
            skinPercentage: pythonResult.skin_percentage,
            operation: "skin" 
          };
          break;
        
        default:
          throw new Error("Invalid operation");
      }

      console.log(`✅ Image processing complete via Python OpenCV`);
      return res.json(result);
    } catch (pythonError: any) {
      console.error("❌ Python service error:", pythonError);
      return res.status(503).json({
        error: "Python OpenCV service unavailable",
        details: pythonError.message,
      });
    }
  } catch (e: any) {
    console.error("❌ Image processing error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request format",
        details: e.errors,
      });
    }

    return res.status(500).json({
      error: e.message ?? "Image processing failed. Please try again.",
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 SkinSight Live API running on http://localhost:${PORT}`);
  console.log(
    `📡 Ready to receive requests at http://localhost:${PORT}/api/analyze\n`
  );

  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "⚠️  WARNING: GEMINI_API_KEY not set. Using mock responses.\n"
    );
  }

  // Check Python service connectivity
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/`);
    const data = await response.json() as any;
    console.log(`✅ Python OpenCV service connected: ${data.service} v${data.version}`);
    console.log(`   Available at: ${PYTHON_SERVICE_URL}\n`);
  } catch (error) {
    console.warn(`⚠️  WARNING: Python OpenCV service not available at ${PYTHON_SERVICE_URL}`);
    console.warn(`   Please start it with: cd backend/python_service && python app.py\n`);
  }
});
