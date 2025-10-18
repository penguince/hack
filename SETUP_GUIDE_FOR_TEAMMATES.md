# 🎉 Python OpenCV Integration - Complete Setup Guide

## ✅ What's Working Now

Your skin analysis application now uses **Python OpenCV** for professional image processing!

### System Architecture
```
Frontend (React) → Node.js Backend → Python OpenCV Service → Gemini AI
   Port 5173           Port 8787          Port 8788
```

## 📋 For New Teammates - Quick Start

### 1. Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd hack

# Install Node.js dependencies
cd backend && npm install
cd ../frontend && npm install

# Install Python dependencies
cd ../backend/python_service
pip install -r requirements.txt
```

### 2. Setup Environment

Create `backend/.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=8787
PYTHON_SERVICE_URL=http://localhost:8788
```

### 3. Start All Services (3 Terminals)

**Terminal 1 - Python OpenCV:**
```bash
cd backend/python_service
python app.py
```
Expected output:
```
INFO:__main__:Starting Python OpenCV Service...
INFO:     Uvicorn running on http://0.0.0.0:8788
```

**Terminal 2 - Node.js Backend:**
```bash
cd backend
npm run dev
```
Expected output:
```
🚀 SkinSight Live API running on http://localhost:8787
✅ Python OpenCV service connected: Python OpenCV Processing Service v1.0.0
```

**Terminal 3 - React Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v5.4.20  ready in 424 ms
➜  Local:   http://localhost:5173/
```

### 4. Verify Everything Works

Open http://localhost:5173 and click "Analyze"

**You should see in Terminal 2 (Backend):**
```
📸 Analyzing image (23008 bytes)...
🐍 Calling Python service: quality
📊 Image quality: brightness=97.00, contrast=38.00, sharpness=74.00
🔧 Preprocessing image with OpenCV...
🐍 Calling Python service: preprocess
✅ Image preprocessed successfully with Python OpenCV
✅ Analysis complete: low risk
```

## 🐍 Python OpenCV Service Details

### Location
`backend/python_service/`

### Key Files
- `app.py` - FastAPI server (port 8788)
- `opencv_processor.py` - OpenCV processing functions
- `requirements.txt` - Python dependencies
- `README.md` - Detailed documentation

### Dependencies
```
fastapi>=0.104.1      # Web framework
uvicorn>=0.24.0       # ASGI server
opencv-python>=4.8.1  # Computer vision library
numpy>=1.26.0         # Array operations
pillow>=10.1.0        # Image handling
python-multipart>=0.0.6
```

### What It Does

#### 1. Quality Analysis
```python
{
  "brightness": 97.0,    # 0-255
  "contrast": 38.0,      # 0-100
  "sharpness": 74.0,     # variance of Laplacian
  "is_good_quality": true
}
```

#### 2. Preprocessing (CLAHE + Denoising)
- Resizes image (max 800px)
- Applies CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Gaussian denoising to reduce noise
- Enhances image quality before AI analysis

#### 3. Edge Detection
- Canny edge detection algorithm
- Automatic threshold calculation
- Returns processed image

#### 4. ROI Extraction
- Crops specified region of interest
- Validates coordinates

#### 5. Contrast Enhancement
- Adaptive histogram equalization
- Improves image visibility

#### 6. Skin Tone Detection
- HSV-based skin detection
- Returns mask and skin percentage

## 🔧 Common Issues & Solutions

### Issue: "Python service not available"

**Solution:**
```bash
cd backend/python_service
python app.py
```

Make sure you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8788
```

### Issue: "Module 'cv2' not found"

**Solution:**
```bash
pip install opencv-python>=4.8.1.78
```

### Issue: "Port 8788 already in use"

**Windows:**
```powershell
netstat -ano | findstr :8788
taskkill /F /PID <PID>
```

**Mac/Linux:**
```bash
lsof -ti:8788 | xargs kill -9
```

### Issue: Backend shows "Python service error"

Check:
1. Python service is running on port 8788
2. No firewall blocking localhost:8788
3. Correct `PYTHON_SERVICE_URL` in backend/.env

Test manually:
```bash
curl http://localhost:8788
```

Should return:
```json
{
  "service": "Python OpenCV Processing Service",
  "status": "running",
  "version": "1.0.0"
}
```

## 📊 Image Processing Flow

### When User Clicks "Analyze Button"

1. **Frontend captures frame** from camera (base64)
2. **POST to `/api/analyze`** → Node.js Backend
3. **Backend calls Python Service:**
   ```
   POST http://localhost:8788/process
   {
     "imageBase64": "data:image/jpeg;base64,...",
     "operation": "quality"
   }
   ```
4. **Python returns quality metrics**
5. **Backend calls Python again:**
   ```
   POST http://localhost:8788/process
   {
     "imageBase64": "...",
     "operation": "preprocess"
   }
   ```
6. **Python returns enhanced image**
7. **Backend sends to Gemini AI** for analysis
8. **Results return to Frontend**

### Processing Time
- Quality check: ~50-100ms
- Preprocessing: ~100-200ms
- Total OpenCV processing: ~200-300ms
- **Much faster than old 60-second OpenCV.js load!**

## 🎯 Adding New OpenCV Operations

### Step 1: Add Function to opencv_processor.py

```python
def my_new_operation(image_b64: str) -> str:
    """Your new OpenCV operation"""
    # Decode image
    img = decode_image(image_b64)
    
    # Your OpenCV processing here
    processed = cv2.yourOperation(img)
    
    # Encode and return
    return encode_image(processed)
```

### Step 2: Add Endpoint to app.py

```python
elif request.operation == "my_operation":
    result = cv_proc.my_new_operation(image_b64)
    return ProcessResponse(
        processedImage=result,
        message="Operation complete"
    )
```

### Step 3: Call from Backend (index.ts)

```typescript
const result = await callPythonService(imageBase64, "my_operation");
```

## 🧪 Testing

### Test Python Service Directly

```bash
# Health check
curl http://localhost:8788

# Test quality analysis
curl -X POST http://localhost:8788/process \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "your_base64_image",
    "operation": "quality"
  }'
```

### Test Full Stack

1. Start all 3 services
2. Open http://localhost:5173
3. Click "Start" then "Analyze"
4. Watch terminal logs

### Expected Logs

**Python Terminal:**
```
INFO: Processing image with operation: quality
INFO: Processing image with operation: preprocess
```

**Backend Terminal:**
```
📸 Analyzing image (23008 bytes)...
🐍 Calling Python service: quality
📊 Image quality: brightness=97.00, contrast=38.00, sharpness=74.00
🐍 Calling Python service: preprocess
✅ Analysis complete: low risk
```

## 📦 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Deploy Services

**Python Service:**
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8788
```

**Node.js Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
- Serve `frontend/dist/` with nginx/apache
- Or use Vercel/Netlify

### Environment Variables

Set in production:
```env
GEMINI_API_KEY=production_key
PORT=8787
PYTHON_SERVICE_URL=http://python-service:8788
NODE_ENV=production
```

## 🎓 Resources

### OpenCV Documentation
- https://docs.opencv.org/4.x/
- https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html

### FastAPI Documentation
- https://fastapi.tiangolo.com/

### Project Documentation
- Main README: `README.md`
- Python Service: `backend/python_service/README.md`
- Integration Docs: `INTEGRATION_COMPLETE.md`

## ✅ Summary for Teammates

### What Changed
- ❌ Removed: OpenCV.js (11MB, 60-second load, browser-only)
- ✅ Added: Python OpenCV microservice (instant, reliable, server-side)

### Benefits
- ⚡ **Faster**: No 60-second loading time
- 🔧 **More Powerful**: Full OpenCV library access
- 📈 **Scalable**: Easy to add new operations
- 🐛 **Easier to Debug**: Python is simpler than WebAssembly
- 🎯 **Better Results**: Professional image preprocessing

### Files to Know
- `backend/index.ts` - Main API, calls Python service
- `backend/python_service/app.py` - FastAPI server
- `backend/python_service/opencv_processor.py` - OpenCV operations
- `frontend/src/App.tsx` - React app (OpenCV.js code removed)

### Quick Commands
```bash
# Start everything
cd backend/python_service && python app.py &
cd backend && npm run dev &
cd frontend && npm run dev

# Check status
curl http://localhost:8788  # Python
curl http://localhost:8787  # Backend
curl http://localhost:8787/api/python-status  # Connection test
```

---

**Questions?** Check `backend/python_service/README.md` or ask the team! 🚀
