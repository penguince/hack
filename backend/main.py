from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AllergyShield API", version="0.1.0")

# CORS middleware - allows frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    """Health check endpoint"""
    return {"ok": True, "message": "AllergyShield API is running"}

# TODO: Add routers
# from app.routers import suggest, feedback, nudge
# app.include_router(suggest.router)
# app.include_router(feedback.router)
# app.include_router(nudge.router)
