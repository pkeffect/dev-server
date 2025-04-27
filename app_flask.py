# app_flask.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restx import Api, Resource, fields

app = Flask(__name__)
# Enable CORS for all routes with explicit origins
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Setup Flask-RESTx
api = Api(
    app,
    version='1.0.0',
    title='Flask API',
    description='Flask API Documentation',
    doc='/docs',  # Set documentation endpoint to /docs as requested
)

# Get environment or use default
env = os.environ.get("FLASK_ENV", "development")

# Define namespaces
ns = api.namespace('', description='Core operations')

# Define models
service_info_model = api.model('ServiceInfo', {
    'message': fields.String(example='Hello from Flask!'),
    'service': fields.String(example='Flask API'),
    'environment': fields.String(example='development'),
    'version': fields.String(example='1.0.0')
})

health_model = api.model('Health', {
    'status': fields.String(example='healthy'),
    'service': fields.String(example='Flask API')
})

echo_model = api.model('Echo', {
    'echo': fields.Raw(example={'message': 'Hello world', 'data': {'key': 'value'}}),
    'service': fields.String(example='Flask API')
})

input_model = api.model('EchoInput', {
    'message': fields.String(example='Hello world'),
    'data': fields.Raw(example={'key': 'value'})
})


@ns.route('/')
class Root(Resource):
    @ns.response(200, 'Success', service_info_model)
    def get(self):
        """Root endpoint - returns basic service information"""
        return {
            "message": "Hello from Flask!",
            "service": "Flask API",
            "environment": env,
            "version": "1.0.0",
        }


@ns.route('/health')
class Health(Resource):
    @ns.response(200, 'Success', health_model)
    def get(self):
        """Health check endpoint - returns service health status"""
        return {"status": "healthy", "service": "Flask API"}


@ns.route('/echo')
class Echo(Resource):
    @ns.expect(input_model, validate=True)
    @ns.response(200, 'Success', echo_model)
    def post(self):
        """Echo endpoint - returns the JSON sent in the request"""
        data = request.get_json()
        return {"echo": data, "service": "Flask API"}

# Add a plain route outside of RESTx for simple health checks
@app.route('/ping')
def ping():
    return jsonify({"status": "ok"})

# Gunicorn will run this, so no app.run() here.