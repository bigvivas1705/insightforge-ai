from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.analytics import analyze_csv

router = APIRouter()

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Accepts a CSV file upload and returns full analytics summary.
    """

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    # Read file bytes
    file_bytes = await file.read()

    # Run analytics
    result = analyze_csv(file_bytes, file.filename)

    return result