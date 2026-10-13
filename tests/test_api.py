
from fastapi.testclient import TestClient

from src.api.main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_predict_endpoint():
    payload = {
        "Gender": "Male",
        "Married": "Yes",
        "Dependents": "0",
        "Education": "Graduate",
        "Self_Employed": "No",
        "ApplicantIncome": 5000,
        "CoapplicantIncome": 2000,
        "LoanAmount": 120,
        "Loan_Amount_Term": 360,
        "Credit_History": 1,
        "Property_Area": "Urban",
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 200

    result = response.json()
    assert result["predicted_status"] in ["Y", "N"]
    assert 0 <= result["approval_probability"] <= 1
    assert result["model_version"] == "1.0.0"
    assert "notice" in result


def test_predict_rejects_invalid_input():
    payload = {
        "Gender": "Male",
        "Married": "Yes",
        "Dependents": "0",
        "Education": "Graduate",
        "Self_Employed": "No",
        "ApplicantIncome": -5000,
        "CoapplicantIncome": 2000,
        "LoanAmount": 120,
        "Loan_Amount_Term": 360,
        "Credit_History": 1,
        "Property_Area": "Urban",
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 422
