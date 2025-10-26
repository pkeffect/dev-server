# Use the official Python 3.12 image based on Alpine Linux
FROM python:3.12-alpine

# Set the working directory in the container
WORKDIR /app

# --- Install system dependencies and global tools ---
RUN python -m pip install --upgrade pip
RUN apk add --no-cache nodejs npm curl && \
    npm install -g live-server 

# --- Install Python application dependencies ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Install Node.js application dependencies ---
# CORRECTED: Copy package files from their new, correct location
COPY app/node/package.json app/node/package-lock.json* ./
RUN npm install --no-fund --no-audit

# --- Add healthcheck script ---
COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# --- Runtime configuration ---
EXPOSE 8080
VOLUME /app