from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ml import run_linear_regression

router = APIRouter()

@router.post("/predict")
async def predict(target_column: str, file: UploadFile = File(...)):
    """
    Accepts a CSV file and a target column name,
    trains a Linear Regression model and returns predictions.
    """

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    # Read file bytes
    file_bytes = await file.read()

    # Run ML model
    try:
        result = run_linear_regression(file_bytes, target_column)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result