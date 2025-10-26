# app_flask.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec",
            "route": "/apispec.json",
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/docs"  # Set the endpoint to /docs as requested
}
swagger = Swagger(app, config=swagger_config)

# Get environment or use default
env = os.environ.get("FLASK_ENV", "development")


@app.route("/")
def hello_flask():
    """
    Root endpoint
    ---
    responses:
      200:
        description: Basic service information
        schema:
          type: object
          properties:
            message:
              type: string
              example: Hello from Flask!
            service:
              type: string
              example: Flask API
            environment:
              type: string
              example: development
            version:
              type: string
              example: 1.0.0
    """
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
    """
    Health check endpoint
    ---
    responses:
      200:
        description: Service health status
        schema:
          type: object
          properties:
            status:
              type: string
              example: healthy
            service:
              type: string
              example: Flask API
    """
    return jsonify({"status": "healthy", "service": "Flask API"})


@app.route("/echo", methods=["POST"])
def echo():
    """
    Echo endpoint - returns the JSON sent in the request
    ---
    parameters:
      - in: body
        name: body
        description: JSON to be echoed back
        required: true
        schema:
          type: object
          example: {"message": "Hello world", "data": {"key": "value"}}
    responses:
      200:
        description: Echoed response
        schema:
          type: object
          properties:
            echo:
              type: object
              example: {"message": "Hello world", "data": {"key": "value"}}
            service:
              type: string
              example: Flask API
    """
    data = request.get_json()
    return jsonify({"echo": data, "service": "Flask API"})


# Gunicorn will run this, so no app.run() here.