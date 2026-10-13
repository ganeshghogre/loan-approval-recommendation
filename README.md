
# Loan Approval Prediction System

An end-to-end Machine Learning application that predicts loan approval outcomes using applicant information. The project combines a Scikit-learn model, a FastAPI backend, a React frontend, and Docker for containerization.

**GitHub:** [loan-approval-recommendation](https://github.com/ganeshghogre/loan-approval-recommendation)

## Overview

The Loan Approval Prediction System demonstrates how a machine learning model can be integrated into a web application. Users enter applicant details through a web form and receive a prediction with an estimated approval probability.

> **Disclaimer:** This project is for educational and demonstration purposes only. Its predictions are not financial advice and must not be used as the sole basis for real loan decisions.

## Features

- Machine learning-based loan approval prediction
- Data inspection and exploratory analysis
- Scikit-learn preprocessing and Logistic Regression pipeline
- REST API built with FastAPI
- Interactive React frontend
- Prediction probability displayed in the interface
- Docker-based API deployment
- API health-check endpoint
- Automated API tests

## Tech Stack

| Component            | Technologies                      |
| -------------------- | --------------------------------- |
| Programming language | Python                            |
| Data processing      | Pandas, NumPy                     |
| Machine Learning     | Scikit-learn, Logistic Regression |
| Backend API          | FastAPI, Uvicorn                  |
| Frontend             | React, Vite, JavaScript, CSS      |
| Containerization     | Docker                            |
| Testing              | Pytest                            |
| Version control      | Git, GitHub                       |

## Architecture

```text
User
  |
  v
React Frontend
  |
  | HTTP POST /predict
  v
FastAPI Backend
  |
  v
Preprocessing Pipeline
  |
  v
Trained ML Model
  |
  v
Prediction + Probability
  |
  v
React Results Interface
```

## Project Structure

```text
loan-approval-recommendation/
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── notebooks/
│   └── 01_dataset_inspection.ipynb
├── src/
│   └── api/
│       ├── main.py
│       ├── schemas.py
│       └── logging_config.py
├── tests/
│   └── test_api.py
├── Dockerfile
├── requirements.txt
├── .gitignore
└── README.md
```

## Run the Frontend

**Prerequisites:** Node.js and npm.

Open a terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Run the Backend with Docker

**Prerequisites:** Docker Desktop.

Build the API image:

```powershell
docker build -t loan-approval-api:1.0.0 .
```

Start the container:

```powershell
docker run -d --name loan-approval-container -p 8001:8000 loan-approval-api:1.0.0
```

Check the API health endpoint:

```text
http://127.0.0.1:8001/health
```

Open the interactive API documentation:

```text
http://127.0.0.1:8001/docs
```

The Docker build requires the trained model artifact at the path expected by the application. The model artifact is excluded from GitHub, so it must be supplied or generated before building the image.

## API Endpoints

| Method | Endpoint     | Purpose               |
| ------ | ------------ | --------------------- |
| GET    | `/`        | API root              |
| GET    | `/health`  | Health check          |
| POST   | `/predict` | Predict loan approval |

See `/docs` for the request schema and interactive API testing.

## Model Workflow

The machine learning workflow includes:

1. Dataset inspection
2. Exploratory data analysis
3. Data preprocessing
4. Feature preparation
5. Logistic Regression model training
6. Prediction and probability estimation
7. API integration

Model performance metrics should be added here after verifying the final evaluation results.

## Testing

Run the API tests from the project root:

```powershell
python -m pytest
```

## Future Improvements

- Add a reproducible model-training script
- Document evaluation metrics and validation methodology
- Add continuous integration with GitHub Actions
- Add model versioning and monitoring
- Deploy the application to a cloud platform
- Improve model explainability and fairness evaluation

## Author

**Ganesh Ghogre**

- GitHub: [@ganeshghogre](https://github.com/ganeshghogre)

## License

No license has been specified yet. Add a license before permitting others to reuse, modify, or distribute this project.
