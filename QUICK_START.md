# 🚀 Quick Reference - Start Commands

## Start All Services (Copy-Paste Ready)

### Windows PowerShell

**Terminal 1:**
```powershell
cd c:\Users\xiaji\hack\hack\backend\python_service
python app.py
```

**Terminal 2:**
```powershell
cd c:\Users\xiaji\hack\hack\backend
npm run dev
```

**Terminal 3:**
```powershell
cd c:\Users\xiaji\hack\hack\frontend
npm run dev
```

---

### Mac/Linux

**Terminal 1:**
```bash
cd backend/python_service
python3 app.py
```

**Terminal 2:**
```bash
cd backend
npm run dev
```

**Terminal 3:**
```bash
cd frontend
npm run dev
```

---

## Health Checks

```bash
# Python Service
curl http://localhost:8788

# Node Backend
curl http://localhost:8787

# Backend → Python Connection
curl http://localhost:8787/api/python-status

# Frontend
# Open browser: http://localhost:5173
```

---

## Kill Processes

### Windows
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Kill Python process
netstat -ano | findstr :8788
taskkill /F /PID <PID>
```

### Mac/Linux
```bash
# Kill Node processes
killall node

# Kill Python process
lsof -ti:8788 | xargs kill -9
```

---

## Expected Terminal Output

### Terminal 1 (Python)
```
INFO:__main__:Starting Python OpenCV Service...
INFO:     Uvicorn running on http://0.0.0.0:8788
```

### Terminal 2 (Backend)
```
🚀 SkinSight Live API running on http://localhost:8787
✅ Python OpenCV service connected: Python OpenCV Processing Service v1.0.0
```

### Terminal 3 (Frontend)
```
VITE v5.4.20  ready in 424 ms
➜  Local:   http://localhost:5173/
```

---

## When You Click "Analyze" (Backend Logs)

```
📸 Analyzing image (23008 bytes)...
🐍 Calling Python service: quality
📊 Image quality: brightness=97.00, contrast=38.00, sharpness=74.00
🔧 Preprocessing image with OpenCV...
🐍 Calling Python service: preprocess
✅ Image preprocessed successfully with Python OpenCV
✅ Analysis complete: low risk
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Kill process using that port |
| Python import error | `pip install -r requirements.txt` |
| Backend can't connect | Check Python service is running on 8788 |
| Frontend error | Check backend is running on 8787 |
| "Unexpected JSON" | Backend not running |

---

## File Structure

```
hack/
├── backend/
│   ├── index.ts              ← Main API
│   ├── gemini.ts             ← AI integration
│   ├── package.json
│   └── python_service/       ← OpenCV service
│       ├── app.py            ← FastAPI server
│       ├── opencv_processor.py ← OpenCV functions
│       └── requirements.txt  ← Python deps
└── frontend/
    ├── src/
    │   ├── App.tsx           ← Main React app
    │   └── components/
    └── package.json
```

---

## Documentation

- **Main README**: `README.md`
- **Setup Guide**: `SETUP_GUIDE_FOR_TEAMMATES.md`
- **Python Service**: `backend/python_service/README.md`
- **Integration Info**: `INTEGRATION_COMPLETE.md`

---

**Quick Start**: Just run the 3 terminal commands above! 🎯
