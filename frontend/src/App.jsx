
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8001/predict";

const INITIAL_FORM = {
  Gender: "Male",
  Married: "Yes",
  Dependents: "0",
  Education: "Graduate",
  Self_Employed: "No",
  ApplicantIncome: "5000",
  CoapplicantIncome: "0",
  LoanAmount: "120",
  Loan_Amount_Term: "360",
  Credit_History: "1",
  Property_Area: "Urban",
};

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setResult(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    const payload = {
      ...form,
      ApplicantIncome: Number(form.ApplicantIncome),
      CoapplicantIncome: Number(form.CoapplicantIncome),
      LoanAmount: Number(form.LoanAmount),
      Loan_Amount_Term: Number(form.Loan_Amount_Term),
      Credit_History: Number(form.Credit_History),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const details = Array.isArray(data.detail)
          ? data.detail
              .map((item) => `${item.loc?.join(".")}: ${item.msg}`)
              .join("; ")
          : data.detail;

        throw new Error(
          details || `Request failed with status ${response.status}`
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the API. Make sure the Docker container is running and http://127.0.0.1:8001/health works."
          : err.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setResult(null);
    setError("");
  }

  const isApproved = result?.predicted_status === "Y";

  const approvalPercent =
    result && Number.isFinite(Number(result.approval_probability))
      ? Math.min(
          100,
          Math.max(0, Number(result.approval_probability) * 100)
        )
      : 0;

  return (
    <main className="page">
      <section className="panel">
        <header>
          <p className="eyebrow">MACHINE LEARNING PROJECT</p>
          <h1>Loan Approval Prediction</h1>
          <p className="subtitle">
            Enter the applicant's details to get a prediction from our
            trained machine learning model.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Gender
              <select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>

            <label>
              Marital Status
              <select
                name="Married"
                value={form.Married}
                onChange={handleChange}
                required
              >
                <option value="Yes">Married</option>
                <option value="No">Not married</option>
              </select>
            </label>

            <label>
              Number of Dependents
              <select
                name="Dependents"
                value={form.Dependents}
                onChange={handleChange}
                required
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3 or more</option>
              </select>
            </label>

            <label>
              Education
              <select
                name="Education"
                value={form.Education}
                onChange={handleChange}
                required
              >
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
            </label>

            <label>
              Self-employed
              <select
                name="Self_Employed"
                value={form.Self_Employed}
                onChange={handleChange}
                required
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>

            <label>
              Applicant Income
              <input
                type="number"
                name="ApplicantIncome"
                min="0"
                step="any"
                value={form.ApplicantIncome}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Co-applicant Income
              <input
                type="number"
                name="CoapplicantIncome"
                min="0"
                step="any"
                value={form.CoapplicantIncome}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Loan Amount (dataset units)
              <input
                type="number"
                name="LoanAmount"
                min="0.01"
                step="any"
                value={form.LoanAmount}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Loan Term (months)
              <input
                type="number"
                name="Loan_Amount_Term"
                min="0.01"
                step="any"
                value={form.Loan_Amount_Term}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Credit History
              <select
                name="Credit_History"
                value={form.Credit_History}
                onChange={handleChange}
                required
              >
                <option value="1">Positive history (coded 1)</option>
                <option value="0">No positive history (coded 0)</option>
              </select>
            </label>

            <label>
              Property Area
              <select
                name="Property_Area"
                value={form.Property_Area}
                onChange={handleChange}
                required
              >
                <option value="Urban">Urban</option>
                <option value="Semiurban">Semiurban</option>
                <option value="Rural">Rural</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict Loan Status"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Form
            </button>
          </div>
        </form>

        {loading && (
          <div className="status-message" role="status">
            Sending application details to the machine learning model...
          </div>
        )}

        {error && (
          <div className="error-message" role="alert">
            <strong>Prediction failed</strong>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <section className="result-card" aria-live="polite">
            <p className="result-label">MODEL PREDICTION</p>

            <h2 className={isApproved ? "approved" : "rejected"}>
              {isApproved
                ? "Predicted: Approved"
                : "Predicted: Not Approved"}
            </h2>

            <div className="probability">
              <span>Predicted approval probability</span>
              <strong>{approvalPercent.toFixed(2)}%</strong>
            </div>

            <div
              className="probability-track"
              role="progressbar"
              aria-label="Predicted approval probability"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(approvalPercent.toFixed(2))}
            >
              <div
                className="probability-fill"
                style={{ width: `${approvalPercent}%` }}
              />
            </div>

            <p className="model-version">
              Model version: {result.model_version}
            </p>

            <p className="notice">{result.notice}</p>
          </section>
        )}

        <footer className="notice">
          Educational demonstration only. This prediction is not a real
          lending decision, a guarantee of loan approval, or financial
          advice. The model may be inaccurate.
        </footer>
      </section>
    </main>
  );
}

export default App;
