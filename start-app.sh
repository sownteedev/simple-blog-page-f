#!/bin/bash

# Start the backend
cd simple-blog-page-b
source venv/bin/activate
python -m uvicorn app.main:app --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend
cd ../simple-blog-page-f
npm start &
FRONTEND_PID=$!

# Function to handle exit
function cleanup {
  echo "Shutting down services..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap Ctrl+C
trap cleanup INT

# Keep script running
echo "Both services are now running."
echo "Press Ctrl+C to stop all services."
wait 