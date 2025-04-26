#!/bin/bash
# Simple API testing script for the development environment

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URLs
FLASK_URL="http://localhost:8082"
FASTAPI_URL="http://localhost:8083"
NODE_URL="http://localhost:8084"

# Test function
test_endpoint() {
    local service=$1
    local url=$2
    local endpoint=$3
    local method=${4:-GET}
    local data=${5:-""}
    
    echo "Testing $service - $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$url$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X $method "$url$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=${response: -3}
    body=${response:0:${#response}-3}
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}Success: $http_code${NC}"
        echo "$body" | json_pp
    else
        echo -e "${RED}Failed: $http_code${NC}"
        echo "$body"
    fi
    echo ""
}

echo "=== Testing Flask API ==="
test_endpoint "Flask" "$FLASK_URL" "/"
test_endpoint "Flask" "$FLASK_URL" "/health"
test_endpoint "Flask" "$FLASK_URL" "/echo" "POST" '{"message": "Hello from test script"}'

echo "=== Testing FastAPI ==="
test_endpoint "FastAPI" "$FASTAPI_URL" "/"
test_endpoint "FastAPI" "$FASTAPI_URL" "/health"
test_endpoint "FastAPI" "$FASTAPI_URL" "/echo" "POST" '{"message": "Hello from test script"}'

echo "=== Testing Node.js Express ==="
test_endpoint "Node.js" "$NODE_URL" "/"
test_endpoint "Node.js" "$NODE_URL" "/health"
test_endpoint "Node.js" "$NODE_URL" "/echo" "POST" '{"message": "Hello from test script"}'

echo "=== All tests completed ==="
