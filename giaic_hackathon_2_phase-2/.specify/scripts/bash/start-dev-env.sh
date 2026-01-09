#!/bin/bash
# Script to start the full development environment

set -e

echo "Starting full-stack development environment..."

# Check if backend is running
if [ -d "src/backend" ]; then
    echo "Starting backend server..."
    cd src/backend
    # Run backend in background
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ../..
else
    echo "Backend not found, please run init-backend first"
    exit 1
fi

# Check if frontend is running
if [ -d "src/frontend" ]; then
    echo "Starting frontend server..."
    cd src/frontend
    # Run frontend in background
    npm run dev &
    FRONTEND_PID=$!
    cd ../..
else
    echo "Frontend not found, please run init-frontend first"
    exit 1
fi

echo "Full-stack development environment started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Function to stop servers on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID