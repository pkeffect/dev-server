# Dockerfile

# Use the official Python 3.12 image based on Alpine Linux
FROM python:3.12-alpine

# Set the working directory in the container
WORKDIR /app

# --- Install system dependencies and global tools as root ---
# 1. Update pip
RUN python -m pip install --upgrade pip

# 2. Install Node.js, npm, and live-server
RUN apk add --no-cache nodejs npm curl && \
    npm install -g live-server 

# --- Create non-root user and group ---
#RUN addgroup -S dev-group && adduser -S dev-user -G dev-group

# --- Install Python application dependencies (as root) ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Install Node.js application dependencies (as root) ---
# Copy package files first for caching
COPY package.json package-lock.json* ./
# Install dependencies 
RUN npm install --no-fund --no-audit

# --- Copy application code (as root) ---
COPY app_flask.py .
COPY app_fastapi.py .
COPY app_node.js .
COPY ./src /app/src

# --- Add healthcheck script ---
COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# --- Change ownership of the application directory ---
#RUN chown -R dev-user:dev-group /app

# --- Switch to the non-root user ---
#USER dev-user

# --- Runtime configuration (runs as dev-user) ---
EXPOSE 8080
VOLUME /app