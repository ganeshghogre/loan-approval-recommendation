
import logging
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.logging_config import configure_logging
from src.api.schemas import LoanApplication, LoanPredictionResponse


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = (
    PROJECT_ROOT
    / "artifacts"
    / "loan_approval_logistic_regression.joblib"
)


# Configure logging
configure_logging()
logger = logging.getLogger(__name__)


# Create FastAPI application
app = FastAPI(
    title="Loan Approval Prediction API",
    description=(
        "An educational machine learning API "
        "for loan approval prediction."
    ),
    version="1.0.0",
)


# Enable CORS for the local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# Load the trained model
if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Trained model not found: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)

logger.info("Loan prediction model loaded successfully")


# Home endpoint
@app.get("/")
def home():
    logger.info("Home endpoint accessed")

    return {
        "message": "Loan Approval Prediction API is running!",
        "status": "healthy",
    }


# Health check endpoint
@app.get("/health")
def health_check():
    logger.info("Health check requested")

    return {
        "status": "healthy"
    }


# Loan prediction endpoint
@app.post(
    "/predict",
    response_model=LoanPredictionResponse,
)
def predict(application: LoanApplication):
    logger.info("Loan prediction requested")

    # Convert validated input into a DataFrame
    input_df = pd.DataFrame(
        [application.model_dump()]
    )

    # Predict loan status
    prediction = str(
        model.predict(input_df)[0]
    )

    # Calculate approval probability
    probabilities = model.predict_proba(input_df)[0]

    approval_index = list(
        model.classes_
    ).index("Y")

    approval_probability = float(
        probabilities[approval_index]
    )

    logger.info(
        "Loan prediction completed successfully"
    )

    return {
        "predicted_status": prediction,
        "approval_probability": round(
            approval_probability, 4
        ),
        "model_version": "1.0.0",
        "notice": (
            "Educational demonstration only; "
            "not a real lending decision."
        ),
    }

