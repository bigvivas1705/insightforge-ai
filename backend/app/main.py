from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routers import upload, predict, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightForge AI",
    description="Industrial-level AI/Data Science Analytics Platform",
    version="1.0.0"
)

# Allow React frontend to talk to FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://secure-charm-production-0b55.up.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, tags=["Data Upload"])
app.include_router(predict.router, tags=["ML Models"])
app.include_router(auth.router, tags=["Authentication"])

@app.get("/")
def root():
    return {"message": "InsightForge AI Backend Running"}

@app.get("/status")
def status():
    return {
        "status": "running",
        "project": "InsightForge AI",
        "version": "1.0"
    }

@app.post("/analyze")
def analyze(data: list[int]):
    return {
        "count": len(data),
        "sum": sum(data),
        "average": sum(data) / len(data) if data else 0
    }