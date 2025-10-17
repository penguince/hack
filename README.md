# AllergyShield - Pollen-Aware Route Planning

Full-stack hackathon project: Predict hyperlocal pollen exposure for walking routes and suggest cleaner alternatives.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Team Guidelines](#team-guidelines)

## ⚡ Quick Start

```bash
# Clone the repo
git clone <repository-url>
cd hack

# Frontend setup
cd frontend
cp .env.local.example .env.local  # Add your Mapbox token
npm install
npm run dev  # Runs on http://localhost:3000

# Backend setup (new terminal)
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
# OR: source .venv/Scripts/activate  # Git Bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000  # Runs on http://localhost:8000
```

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Mapbox GL JS** - Interactive maps (add later)

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.8+** - Programming language
- **Uvicorn** - ASGI server
- **OSRM** - Walking route calculations (external API)
- **Open-Meteo** - Pollen & wind data (external API)

## 📁 Project Structure

```
hack/
├── frontend/                    # Next.js Application
│   ├── app/                    # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── public/                # Static assets
│   ├── .env.local.example     # Environment template (copy to .env.local)
│   ├── package.json           # Node dependencies
│   └── tsconfig.json          # TypeScript config
│
├── backend/                    # FastAPI Application
│   ├── app/
│   │   ├── routers/           # API route handlers (TODO)
│   │   └── services/          # Business logic (TODO)
│   ├── main.py                # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template (copy to .env if needed)
│
├── .gitignore                 # Root ignore rules
└── README.md                  # This file
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **Mapbox Account** - [Sign up](https://account.mapbox.com/) for free token

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd hack
```

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local  # Windows
# OR
cp .env.local.example .env.local    # macOS/Linux

# Edit .env.local and add your Mapbox token:
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey...your_token
```

### 3️⃣ Backend Setup

```bash
# Navigate to backend directory (from root)
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.\.venv\Scripts\activate.bat
# Git Bash (Windows):
source .venv/Scripts/activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Create .env file if you need custom config
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux
```

## ▶️ Running the Application

### Start Backend Server

```bash
# From the backend directory
cd backend

# Activate virtual environment (if not already active)
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
source .venv/Scripts/activate  # Git Bash / macOS / Linux

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

✅ Backend runs on: **http://localhost:8000**  
📚 API docs: **http://localhost:8000/docs**

### Start Frontend Server

```bash
# Open a NEW terminal
# From the frontend directory
cd frontend

# Run Next.js development server
npm run dev
```

✅ Frontend runs on: **http://localhost:3000**

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs (interactive testing)
- **Health Check**: http://localhost:8000/health

### Current Endpoints

- `GET /health` - Returns `{"ok": true}` if API is running

### Planned Endpoints (TODO)

- `POST /suggest` - Get pollen-aware route suggestions
- `POST /feedback` - Submit symptom feedback
- `POST /nudge` - Trigger SMS reminder

## 👥 Team Guidelines

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/issue-description` - Urgent fixes
- `chore/task-description` - Maintenance tasks

### Commit Message Format
```
type: Brief description

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Workflow
1. Create a new branch from `main`
2. Make your changes
3. Test locally
4. Commit with meaningful messages
5. Push to your branch
6. Create a Pull Request

### Before Pushing
- [ ] Code runs without errors
- [ ] No sensitive data (API keys, passwords) in commits
- [ ] Update documentation if needed

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change port with `uvicorn main:app --reload --port 8001`
- **Module not found**: Ensure virtual environment is activated and dependencies are installed

### Frontend Issues
- **Port 3000 in use**: Next.js will prompt to use another port, or manually set with `npm run dev -- -p 3001`
- **Dependencies error**: Delete `node_modules` and run `npm install` again

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

## 🤝 Contributing

1. Pull the latest changes: `git pull origin main`
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For questions or issues, contact the team lead or create an issue in the repository.

---

**Happy Coding! 🚀**
