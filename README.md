# SkinSight Live

Real-time skin analysis using AI. Camera → Analyze → Get instant feedback.

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
```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run the App

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
→ Runs on http://localhost:8787

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
→ Runs on http://localhost:5173

### 5. Open Browser
Go to http://localhost:5173

## How It Works
1. Click **Start** → camera opens
2. Click **Analyze** → AI analyzes the image
3. View results: summary, categories, risk level, next steps
4. Click **End** → camera stops

## Tech Stack
- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + TypeScript + Gemini Vision API

## Project Structure
```
hack/
├── frontend/    # React app
└── backend/     # API server
```

---

**Privacy First**: No data is stored. Everything happens in memory.
