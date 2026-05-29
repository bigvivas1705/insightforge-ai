from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import upload
from app.routers import predict

# Create all tables in MySQL on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightForge AI",
    description="Industrial-level AI/Data Science Analytics Platform",
    version="1.0.0"
)

# Register routers
app.include_router(upload.router, tags=["Data Upload"])
app.include_router(predict.router, tags=["ML Models"])

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