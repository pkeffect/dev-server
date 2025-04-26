#!/usr/bin/env python3
# Python test suite for the development environment
# Note: This is a standalone script, not a pytest file

import requests
import json
import sys
from datetime import datetime

# Base URLs
FLASK_URL = "http://localhost:8082"
FASTAPI_URL = "http://localhost:8083"
NODE_URL = "http://localhost:8084"


class Colors:
    GREEN = "\033[0;32m"
    RED = "\033[0;31m"
    NC = "\033[0m"  # No Color


def test_endpoint(service, url, endpoint, method="GET", data=None):
    """Test an API endpoint and print the results.
    
    This is not a pytest function, just a helper function.
    """
    print(f"Testing {service} - {method} {endpoint}")

    try:
        if method == "GET":
            response = requests.get(f"{url}{endpoint}", timeout=5)
        else:
            response = requests.post(f"{url}{endpoint}", json=data, timeout=5)

        if response.status_code == 200:
            print(f"{Colors.GREEN}Success: {response.status_code}{Colors.NC}")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)
        else:
            print(f"{Colors.RED}Failed: {response.status_code}{Colors.NC}")
            print(response.text)
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.NC}")

    print("")


def run_tests():
    print(f"=== Running tests at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===")

    print("=== Testing Flask API ===")
    test_endpoint("Flask", FLASK_URL, "/")
    test_endpoint("Flask", FLASK_URL, "/health")
    test_endpoint("Flask", FLASK_URL, "/echo", "POST", {"message": "Hello from Python test"})

    print("=== Testing FastAPI ===")
    test_endpoint("FastAPI", FASTAPI_URL, "/")
    test_endpoint("FastAPI", FASTAPI_URL, "/health")
    test_endpoint(
        "FastAPI", FASTAPI_URL, "/echo", "POST", {"message": "Hello from Python test"}
    )

    print("=== Testing Node.js Express ===")
    test_endpoint("Node.js", NODE_URL, "/")
    test_endpoint("Node.js", NODE_URL, "/health")
    test_endpoint(
        "Node.js", NODE_URL, "/echo", "POST", {"message": "Hello from Python test"}
    )

    print("=== Cross-service Tests ===")
    # Add cross-service tests here

    print("=== All tests completed ===")


if __name__ == "__main__":
    run_tests()