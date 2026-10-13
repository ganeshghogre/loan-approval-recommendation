
from pydantic import BaseModel, Field


class LoanApplication(BaseModel):
    Gender: str = Field(description="Male or Female")
    Married: str = Field(description="Yes or No")
    Dependents: str = Field(description="0, 1, 2, or 3+")
    Education: str = Field(description="Graduate or Not Graduate")
    Self_Employed: str = Field(description="Yes or No")
    ApplicantIncome: float = Field(ge=0)
    CoapplicantIncome: float = Field(ge=0)
    LoanAmount: float = Field(gt=0)
    Loan_Amount_Term: float = Field(gt=0)
    Credit_History: float = Field(ge=0, le=1)
    Property_Area: str = Field(
        description="Urban, Semiurban, or Rural"
    )


class LoanPredictionResponse(BaseModel):
    predicted_status: str
    approval_probability: float
    model_version: str
    notice: str
