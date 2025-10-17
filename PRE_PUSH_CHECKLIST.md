# Pre-Push Checklist ✅

## Files Created
- [x] Root .gitignore (ignores node_modules, .venv, .env files)
- [x] Frontend .gitignore (Next.js auto-generated)
- [x] Backend .gitignore (Python specific)
- [x] frontend/.env.local.example (Mapbox token template)
- [x] backend/.env.example (API keys template)
- [x] backend/requirements.txt (Python dependencies)
- [x] backend/main.py (FastAPI entry point with /health)
- [x] backend/app/__init__.py
- [x] backend/app/routers/__init__.py
- [x] backend/app/services/__init__.py
- [x] README.md (updated with setup instructions)

## Verified Working
- [x] Frontend scaffold (Next.js + TypeScript + Tailwind)
- [x] Backend scaffold (FastAPI structure)
- [x] Git repository initialized at root
- [x] .gitignore properly excludes build artifacts and secrets

## Before Your Team Clones

### Each teammate needs to do ONCE:
1. Copy `frontend/.env.local.example` to `frontend/.env.local`
2. Get a free Mapbox token: https://account.mapbox.com/access-tokens/
3. Paste token into `frontend/.env.local`

### To run the project:
```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev

# Terminal 2 - Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## What's NOT in Git (Correct ✅)
- node_modules/
- .venv/
- .env / .env.local
- __pycache__/
- .next/

## Ready to Push? 🚀
```bash
git add .
git commit -m "chore: initial scaffold (Next.js + FastAPI) with setup docs"
git branch -M main
git remote add origin https://github.com/<your-org>/HACK.git
git push -u origin main
```

## Next Steps (After Push)
1. Create feature branches:
   - feat/frontend-map (Person A)
   - feat/backend-suggest (Person B)
   - feat/data-openmeteo (Person C)
   - feat/sms-nudge (Person D)

2. Share repo link with team
3. Each person clones and follows README.md
4. Start building! 🎯
