# app_flask.py
import os
from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from flask_restx import Api, Resource, fields

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes with explicit origins
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Get environment or use default
env = os.environ.get("FLASK_ENV", "development")

# Create a Blueprint for direct routes that bypass Flask-RESTX
direct_routes = Blueprint('direct_routes', __name__)

# Add root route to the Blueprint
@direct_routes.route('/')
def direct_root():
    """Direct root endpoint that bypasses Flask-RESTX"""
    return jsonify({
        "message": "Hello from Flask!",
        "service": "Flask API",
        "environment": env,
        "version": "1.0.0",
    })

# Register the Blueprint BEFORE setting up Flask-RESTX
app.register_blueprint(direct_routes)

# Add a plain route for ping outside of RESTx and Blueprint
@app.route('/ping')
def ping():
    """Simple ping endpoint for health checks"""
    return jsonify({"status": "ok"})

# Setup Flask-RESTx with explicit prefix and doc URL
api = Api(
    app,
    version='1.0.0',
    title='Flask API',
    description='Flask API Documentation',
    doc='/docs',  # Set documentation endpoint to /docs as requested
    prefix='',    # Explicitly set empty prefix to avoid URL mapping issues
)

# Define namespaces - use '/api' prefix to avoid conflict with direct routes
ns = api.namespace('/api', description='Core operations')

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

# Flask-RESTX routes within the namespace
@ns.route('/')
class ApiRoot(Resource):
    @ns.response(200, 'Success', service_info_model)
    def get(self):
        """API root endpoint - returns basic service information"""
        return {
            "message": "Hello from Flask API Namespace!",
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

# Add the original '/health' endpoint at the root level (outside namespace)
@app.route('/health')
def health():
    """Health check endpoint at root level"""
    return jsonify({"status": "healthy", "service": "Flask API"})

# Debug endpoint to help troubleshoot routing issues
@app.route('/debug/routes')
def debug_routes():
    """Debug endpoint that shows all registered routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods) if rule.methods else [],
            'rule': str(rule)
        })
    return jsonify(routes)

# Gunicorn will run this, so no app.run() here.
# The app variable is imported by Gunicorn