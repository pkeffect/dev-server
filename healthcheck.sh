#!/bin/sh
# Simple healthcheck script that can be customized for each service

# Default values
HEALTH_ENDPOINT=${HEALTH_ENDPOINT:-"/health"}
HOST=${HOST:-"localhost"}
PORT=${PORT:-"8080"}

# Check if curl is available
if command -v curl >/dev/null 2>&1; then
    # Perform the health check with curl
    response=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT$HEALTH_ENDPOINT)
    if [ "$response" -eq 200 ]; then
        exit 0
    else
        exit 1
    fi
else
    # Fallback to basic check with wget if available
    if command -v wget >/dev/null 2>&1; then
        if wget -q --spider http://$HOST:$PORT$HEALTH_ENDPOINT; then
            exit 0
        else
            exit 1
        fi
    else
        # Assume service is up if we can't check
        echo "Neither curl nor wget found for health check"
        exit 0
    fi
fi
