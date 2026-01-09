#!/bin/bash
# Script to initialize FastAPI backend for the full-stack project

set -e

echo "Initializing FastAPI backend..."

# Create backend directory
mkdir -p src/backend

# Create basic FastAPI structure
cat > src/backend/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Full Stack App Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Create requirements file
cat > src/backend/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.1
EOF

# Create basic config
cat > src/backend/.env.example << 'EOF'
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
DEBUG=True
EOF

echo "FastAPI backend initialized successfully!"
echo "Backend structure created at src/backend/"