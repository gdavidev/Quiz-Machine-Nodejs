#!/bin/bash

# Check for process on port 3000
PID=$(lsof -ti :3000)

if [ -n "$PID" ]; then
    # Verify it's a Node.js process
    if ps -p $PID -o comm= | grep -q 'node'; then
        echo "Found Node.js process running on port 3000 (PID: $PID), killing it..."
        kill -9 $PID
    else
        echo "Found non-Node.js process running on port 3000 (PID: $PID), not killing it."
        exit 1
    fi
else
    echo "No process found running on port 3000"
fi

# Start npm processes
echo "Starting npm processes..."
npm i &
npm run node:start &
npm run webpack:start &

# Wait a moment for the server to start
sleep 3

# Open default browser
open "http://localhost:3000"

echo "Done!"