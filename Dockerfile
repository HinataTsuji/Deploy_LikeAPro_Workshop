# 1. Base image
FROM python:3.11-slim

# 2. Workdir
WORKDIR /app

# 3. Install system deps (figlet for ASCII fallback)
RUN apt-get update && apt-get install -y --no-install-recommends figlet && rm -rf /var/lib/apt/lists/*

# 4. Install Python deps first for better caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy application source
COPY . .

# 6. Expose port and run
EXPOSE 8080
CMD ["python", "app.py"]