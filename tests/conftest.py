# /app/tests/conftest.py
import pytest
import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

# Import the Flask app directly instead of a factory function
from app_flask import app as flask_app

@pytest.fixture(scope='module')
def app():
    """Provide the Flask app for testing."""
    flask_app.config.update({
        "TESTING": True,
    })
    return flask_app

@pytest.fixture()
def client(app):
    """A test client for the Flask app."""
    return app.test_client()

@pytest.fixture()
def service(client):
    """Alias fixture that provides the test client under the name 'service'."""
    return client