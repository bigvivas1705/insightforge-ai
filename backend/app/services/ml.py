import pandas as pd
import numpy as np
from io import BytesIO
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

def run_linear_regression(file_bytes: bytes, target_column: str) -> dict:
    """
    Trains a Linear Regression model on the uploaded CSV
    and returns predictions and model performance metrics.
    """

    # Load CSV into DataFrame
    df = pd.read_csv(BytesIO(file_bytes))

    # Check if target column exists
    if target_column not in df.columns:
        raise ValueError(f"Column '{target_column}' not found in dataset.")

    # Drop non-numeric columns and rows with missing values
    df = df.select_dtypes(include=[np.number]).dropna()

    # Separate features (X) and target (y)
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Split into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train the model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Evaluate model performance
    r2 = round(r2_score(y_test, y_pred), 4)
    mse = round(mean_squared_error(y_test, y_pred), 4)

    return {
        "model": "Linear Regression",
        "target_column": target_column,
        "training_samples": len(X_train),
        "testing_samples": len(X_test),
        "r2_score": r2,
        "mean_squared_error": mse,
        "predictions": y_pred.tolist()[:10]  # Return first 10 predictions
    }