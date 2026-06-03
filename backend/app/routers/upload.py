from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.services.analytics import analyze_csv
from app.database import get_db
from app.models import Dataset
from app.auth import verify_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        return verify_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    file_bytes = await file.read()
    result = analyze_csv(file_bytes, file.filename, db)
    return result

@router.get("/datasets")
def get_datasets(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
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