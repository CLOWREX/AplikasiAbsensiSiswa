# misal base image
FROM python:3.11-slim

# set working directory
WORKDIR /app

# copy requirements dan install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy seluruh app
COPY . .

# jalankan main.py
CMD ["python", "main.py"]
