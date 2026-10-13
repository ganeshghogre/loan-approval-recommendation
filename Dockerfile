
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and trained model
COPY src/ ./src/
COPY artifacts/ ./artifacts/

# Create directory for application logs
RUN mkdir -p /app/logs

# Expose the API port
EXPOSE 8000

# Start the FastAPI application
CMD ["python", "-m", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
