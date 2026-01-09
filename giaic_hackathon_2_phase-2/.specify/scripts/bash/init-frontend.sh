#!/bin/bash
# Script to initialize Next.js frontend for the full-stack project

set -e

echo "Initializing Next.js frontend..."

# Create frontend directory
mkdir -p src/frontend

# Navigate to frontend directory
cd src/frontend

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

echo "Next.js frontend initialized successfully!"
echo "Frontend structure created at src/frontend/"