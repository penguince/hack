# SkinSight Live - Skin Analysis Application

Privacy-first skin analysis application powered by AI and Python OpenCV image processing.

## 🏗️ Architecture

```
┌─────────────────────┐
│  React Frontend     │  Port 5173/5174
│  (Vite + TypeScript)│  Camera capture, UI
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│  Node.js Backend    │  Port 8787
│  (Express + TS)     │  API routing, Gemini AI
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│  Python Service     │  Port 8788
│  (FastAPI + OpenCV) │  Image processing
└─────────────────────┘
```

## ✨ Features

- 🎥 **Real-time Camera Feed** - Live video capture
- 🔬 **AI-Powered Analysis** - Gemini Vision API for skin analysis
- 🐍 **Python OpenCV Processing** - Professional image enhancement
  - CLAHE (Contrast Limited Adaptive Histogram Equalization)
  - Image quality detection (brightness, contrast, sharpness)
  - Gaussian denoising
  - Edge detection for texture analysis
- 💬 **Interactive Chat** - Ask questions about your analysis
- 🔒 **Privacy First** - No data storage, text-only results

## 🐍 Python OpenCV Service

The Python microservice provides:
- **Quality Analysis** - Brightness, contrast, sharpness metrics
- **Preprocessing** - CLAHE enhancement + denoising before AI analysis
- **Edge Detection** - Canny algorithm
- **ROI Extraction** - Region of interest cropping
- **Contrast Enhancement** - Adaptive histogram equalization
- **Skin Tone Detection** - HSV-based skin detection

For detailed Python service docs, see [backend/python_service/README.md](./backend/python_service/README.md)

## Setup

### 1. Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy it

### 2. Configure Backend
```powershell
cd backend
copy .env.example .env
notepad .env
```
Add your key:
```
GEMINI_API_KEY=your_key_here
PORT=8787
```

### 3. Install Dependencies
```bash
# Backend (Node.js)
cd backend
npm install

# Frontend (React)
cd ../frontend
npm install

# Python OpenCV Service
cd ../backend/python_service
pip install -r requirements.txt
```

### 4. Run the App (3 Terminals Required)

**Terminal 1 - Python OpenCV Service:**
```bash
cd backend/python_service
python app.py
```
→ Runs on http://localhost:8788

**Terminal 2 - Node.js Backend:**
```bash
cd backend
npm run dev
```
→ Runs on http://localhost:8787

**Terminal 3 - React Frontend:**
```bash
cd frontend
npm run dev
```
→ Runs on http://localhost:5173 or 5174

### 5. Open Browser
Go to http://localhost:5173 (or 5174)

## How It Works
1. Click **Start** → camera opens
2. Click **Analyze** → image is captured
3. **Backend**: Calls Python service for OpenCV preprocessing
   - Quality check (brightness, contrast, sharpness)
   - CLAHE enhancement + denoising
4. **Backend**: Sends enhanced image to Gemini AI
5. View results: summary, categories, risk level, next steps
6. Click **End** → camera stops

## Tech Stack
- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + TypeScript + Gemini Vision API  
- **Python Service**: FastAPI + opencv-python + NumPy

## Project Structure
```
hack/
├── frontend/    # React app
└── backend/     # API server
```

---

**Privacy First**: No data is stored. Everything happens in memory.

todo:
1. Chatbot ✅
2. File Upload ✅
3. Landing page 
4. OpenCV 
5. prompt tune