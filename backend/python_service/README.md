# Python OpenCV Service

Fast and reliable image processing using Python OpenCV.

## Quick Start

### 1. Install Dependencies

```bash
cd backend/python_service
pip install -r requirements.txt
```

### 2. Run the Service

```bash
python app.py
```

Or with uvicorn:
```bash
uvicorn app:app --host 0.0.0.0 --port 8788 --reload
```

Service will run on: **http://localhost:8788**

## API Endpoints

### GET `/`
Health check and service info

### POST `/process`
Process image with specified operation

**Request:**
```json
{
  "imageBase64": "base64-encoded-image",
  "operation": "preprocess|edges|quality|roi|contrast|skin",
  "roi": {
    "x": 0,
    "y": 0,
    "w": 100,
    "h": 100
  }
}
```

## Operations

| Operation | Description | Returns |
|-----------|-------------|---------|
| `preprocess` | Enhance quality (CLAHE + denoise) | Processed image |
| `edges` | Canny edge detection | Edge image |
| `quality` | Analyze brightness/contrast/sharpness | Quality metrics |
| `roi` | Extract region of interest | Cropped image |
| `contrast` | Enhance contrast only | Enhanced image |
| `skin` | Detect skin tone regions | Masked image |

## Testing

```bash
# Test with curl
curl -X POST http://localhost:8788/process \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "YOUR_BASE64_HERE",
    "operation": "quality"
  }'
```

## Why Python OpenCV?

✅ **Fast**: Native C++ performance
✅ **Reliable**: No browser issues
✅ **Complete**: Full OpenCV library
✅ **Easy**: Simple pip install
✅ **Professional**: Industry standard

## Architecture

```
Frontend → Node.js (8787) → Python Service (8788) → OpenCV
```
