from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.analytics import analyze_csv
from app.database import get_db
from app.models import Dataset

router = APIRouter()

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts a CSV file upload, runs analytics, and saves metadata to MySQL.
    """

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    # Read file bytes
    file_bytes = await file.read()

    # Run analytics and save to DB
    result = analyze_csv(file_bytes, file.filename, db)

    return result
@router.get("/datasets")
def get_datasets(db: Session = Depends(get_db)):
    """
    Returns all previously uploaded datasets from MySQL.
    """
    datasets = db.query(Dataset).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "rows_count": d.rows_count,
            "columns_count": d.columns_count,
            "uploaded_at": str(d.uploaded_at)
        }
        for d in datasets
    ]