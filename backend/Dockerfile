FROM python:3.12-slim

# Prevent Python from writing .pyc files to disk and ensure unbuffered stdout/stderr
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

WORKDIR /app

# Install security updates and curl for container health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definition and install packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY . .

# Run as non-root user for container security (P2-5)
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose Cloud Run default ingress port 8080
EXPOSE 8080

# Container Healthcheck against FastAPI endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Production command for Cloud Run container execution
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
