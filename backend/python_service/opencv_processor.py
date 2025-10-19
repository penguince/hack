"""
OpenCV Image Processing Module
Handles all image processing operations using Python OpenCV
"""

import cv2
import numpy as np
import base64
from typing import Dict, Tuple

def base64_to_image(base64_string: str) -> np.ndarray:
    """Convert base64 string to OpenCV image"""
    # Remove data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    img_data = base64.b64decode(base64_string)
    img_array = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Failed to decode image")
    
    return img

def image_to_base64(img: np.ndarray, format: str = '.jpg', quality: int = 85) -> str:
    """Convert OpenCV image to base64 string"""
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, buffer = cv2.imencode(format, img, encode_param)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return img_base64

def preprocess_image(base64_string: str) -> str:
    """
    Enhance image quality with:
    - Resizing to optimal dimensions
    - Contrast enhancement using CLAHE
    - Noise reduction
    """
    img = base64_to_image(base64_string)
    
    # Resize to reasonable dimensions (max 1024px)
    max_dim = 1024
    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        print(f"Resized image from {w}x{h} to {new_w}x{new_h}")
    
    # Convert to LAB color space for better contrast enhancement
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # Merge channels and convert back to BGR
    enhanced = cv2.merge([l, a, b])
    enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    # Apply denoising
    denoised = cv2.fastNlMeansDenoisingColored(enhanced, None, 3, 3, 7, 21)
    
    print("Image preprocessing complete")
    return image_to_base64(denoised)

def detect_edges(base64_string: str) -> str:
    """Apply Canny edge detection to highlight textures and borders"""
    img = base64_to_image(base64_string)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Canny edge detection
    edges = cv2.Canny(blurred, 50, 150)
    
    # Convert back to BGR for consistency
    edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    
    print("Edge detection complete")
    return image_to_base64(edges_bgr)

def analyze_quality(base64_string: str) -> Dict:
    """
    Analyze image quality metrics:
    - Brightness (mean intensity)
    - Contrast (standard deviation)
    - Sharpness (Laplacian variance)
    """
    img = base64_to_image(base64_string)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate brightness (mean intensity)
    brightness = float(np.mean(gray))
    
    # Calculate contrast (standard deviation)
    contrast = float(np.std(gray))
    
    # Calculate sharpness (Laplacian variance)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    sharpness = float(laplacian.var())
    
    # Determine if image quality is good
    is_good = (
        50 < brightness < 200 and  # Not too dark or bright
        contrast > 30 and  # Sufficient contrast
        sharpness > 45 #100            # Not too blurry
    )
    
    quality_info = {
        'brightness': int(brightness),
        'contrast': int(contrast),
        'sharpness': int(sharpness),
        'is_good_quality': is_good
    }
    
    print(f"Quality analysis: {quality_info}")
    return quality_info

def extract_roi(base64_string: str, x: int, y: int, w: int, h: int) -> str:
    """Extract region of interest from image"""
    img = base64_to_image(base64_string)
    
    # Get image dimensions
    height, width = img.shape[:2]
    
    # Ensure ROI is within image bounds
    x = max(0, min(x, width - 1))
    y = max(0, min(y, height - 1))
    w = min(w, width - x)
    h = min(h, height - y)
    
    # Extract ROI
    roi = img[y:y+h, x:x+w]
    
    print(f"Extracted ROI: x={x}, y={y}, w={w}, h={h}")
    return image_to_base64(roi)

def apply_contrast_enhancement(base64_string: str) -> str:
    """Apply adaptive histogram equalization for better contrast"""
    img = base64_to_image(base64_string)
    
    # Convert to LAB
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # Merge and convert back
    enhanced = cv2.merge([l, a, b])
    result = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    return image_to_base64(result)

def detect_skin_tone(base64_string: str) -> str:
    """Detect and isolate skin-colored regions using HSV color space"""
    img = base64_to_image(base64_string)
    
    # Convert to HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Define skin color range in HSV
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)
    
    # Create mask
    mask = cv2.inRange(hsv, lower_skin, upper_skin)
    
    # Apply morphological operations to remove noise
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Apply mask to original image
    result = cv2.bitwise_and(img, img, mask=mask)
    
    print("Skin tone detection complete")
    return image_to_base64(result)
