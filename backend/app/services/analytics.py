import pandas as pd
import math
from sqlalchemy.orm import Session
from app.models import Dataset

def clean_nan(obj):
    """
    Recursively replaces NaN float values with None (JSON null).
    NaN is valid in Python/pandas but NOT in JSON — this fixes that.
    """
    if isinstance(obj, float) and math.isnan(obj):
        return None
    elif isinstance(obj, dict):
        return {k: clean_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan(i) for i in obj]
    return obj

def analyze_csv(file_bytes: bytes, filename: str, db: Session) -> dict:
    from io import BytesIO
    df = pd.read_csv(BytesIO(file_bytes))

    rows, cols = df.shape

    column_summary = []
    for col in df.columns:
        column_summary.append({
            "column": col,
            "dtype": str(df[col].dtype),
            "missing_values": int(df[col].isnull().sum()),
            "missing_percent": round(df[col].isnull().mean() * 100, 2)
        })

    stats = clean_nan(df.describe().round(2).to_dict())
    preview = clean_nan(df.head(5).to_dict(orient="records"))

    # Save dataset metadata to MySQL
    dataset_record = Dataset(
        filename=filename,
        rows_count=rows,
        columns_count=cols
    )
    db.add(dataset_record)
    db.commit()
    db.refresh(dataset_record)

    return {
        "id": dataset_record.id,
        "filename": filename,
        "rows": rows,
        "columns": cols,
        "column_summary": column_summary,
        "descriptive_stats": stats,
        "preview": preview
    }