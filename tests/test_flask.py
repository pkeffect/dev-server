# Simple tests for the Flask application

def test_flask_app_exists(app):
    """Test that the Flask app exists and has the correct name."""
    assert app is not None
    assert app.name == 'app_flask'

def test_root_endpoint(client):
    """Test the root endpoint returns 200 status code."""
    response = client.get('/')
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    data = response.get_json()
    assert 'message' in data
    assert 'service' in data
    assert data['service'] == 'Flask API'

def test_health_endpoint(client):
    """Test the health endpoint returns 200 status code."""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert 'status' in data
    assert data['status'] == 'healthy'
    assert data['service'] == 'Flask API'

def test_echo_endpoint(client):
    """Test the echo endpoint returns the data sent to it."""
    test_data = {'message': 'Test message', 'data': {'key': 'value'}}
    response = client.post('/echo', json=test_data)
    assert response.status_code == 200
    data = response.get_json()
    assert 'echo' in data
    assert data['echo'] == test_data
    assert data['service'] == 'Flask API'