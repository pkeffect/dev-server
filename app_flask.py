# app_flask.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get environment or use default
env = os.environ.get("FLASK_ENV", "development")


@app.route("/")
def hello_flask():
    return jsonify(
        {
            "message": "Hello from Flask!",
            "service": "Flask API",
            "environment": env,
            "version": "1.0.0",
        }
    )


@app.route("/health")
def health_check():
    return jsonify({"status": "healthy", "service": "Flask API"})


@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({"echo": data, "service": "Flask API"})


# Gunicorn will run this, so no app.run() here.