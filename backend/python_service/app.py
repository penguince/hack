"""
FastAPI service for OpenCV image processing
Provides endpoints for various image processing operations
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import opencv_processor as cv_proc
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OpenCV Processing Service",
    description="Image processing service using Python OpenCV",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    imageBase64: str
    operation: str
    roi: Optional[Dict[str, int]] = None

class ProcessResponse(BaseModel):
    processedImage: Optional[str] = None
    quality: Optional[Dict] = None
    message: Optional[str] = None

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "service": "Python OpenCV Processing Service",
        "status": "running",
        "version": "1.0.0",
        "operations": [
            "preprocess",
            "edges",
            "quality",
            "roi",
            "contrast",
            "skin"
        ]
    }

@app.get("/health")
def health_check():
    """Health check for monitoring"""
    return {"status": "healthy"}

@app.post("/process", response_model=ProcessResponse)
async def process_image(request: ProcessRequest):
    """
    Process image with specified operation
    
    Operations:
    - preprocess: Enhance image quality (resize, CLAHE, denoise)
    - edges: Apply Canny edge detection
    - quality: Analyze image quality metrics
    - roi: Extract region of interest
    - contrast: Apply contrast enhancement
    - skin: Detect and isolate skin tone regions
    """
    try:
        logger.info(f"Processing image with operation: {request.operation}")
        
        # Remove data URL prefix if present
        image_b64 = request.imageBase64
        if ',' in image_b64:
            image_b64 = image_b64.split(',')[1]
        
        # Process based on operation type
        if request.operation == "preprocess":
            result = cv_proc.preprocess_image(image_b64)
            return ProcessResponse(
                processedImage=result,
                message="Image preprocessed successfully"
            )
        
        elif request.operation == "edges":
            result = cv_proc.detect_edges(image_b64)
            return ProcessResponse(
                processedImage=result,
                message="Edge detection applied"
            )
        
        elif request.operation == "quality":
            result = cv_proc.analyze_quality(image_b64)
            return ProcessResponse(
                quality=result,
                message="Quality analysis complete"
            )
        
        elif request.operation == "roi":
            if not request.roi:
                raise HTTPException(
                    status_code=400,
                    detail="ROI coordinates required for ROI operation"
                )
            
            result = cv_proc.extract_roi(
                image_b64,
                request.roi.get('x', 0),
                request.roi.get('y', 0),
                request.roi.get('w', 100),
                request.roi.get('h', 100)
            )
            return ProcessResponse(
                processedImage=result,
                message="ROI extracted successfully"
            )
        
        elif request.operation == "contrast":
            result = cv_proc.apply_contrast_enhancement(image_b64)
            return ProcessResponse(
                processedImage=result,
                message="Contrast enhancement applied"
            )
        
        elif request.operation == "skin":
            result = cv_proc.detect_skin_tone(image_b64)
            return ProcessResponse(
                processedImage=result,
                message="Skin tone detection applied"
            )
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid operation: {request.operation}. "
                       f"Valid operations: preprocess, edges, quality, roi, contrast, skin"
            )
    
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Image processing failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting Python OpenCV Service...")
    logger.info("Service will be available at http://localhost:8788")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8788,
        log_level="info"
    )
