# app_fastapi.py
import os
from typing import Dict, Any, Optional
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="FastAPI Service",
    description="FastAPI example for the development environment",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get environment or use default
env = os.environ.get("FLASK_ENV", "development")


class EchoRequest(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None


@app.get("/")
async def read_root():
    return {
        "message": "Hello from FastAPI!",
        "service": "FastAPI",
        "environment": env,
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FastAPI"}


@app.post("/echo")
async def echo(data: EchoRequest):
    return {"echo": data.dict(), "service": "FastAPI"}

@app.get("/ping")
async def ping():
    return {"status": "ok", "service": "FastAPI"}
    
# Uvicorn will run this, so no uvicorn.run() here.