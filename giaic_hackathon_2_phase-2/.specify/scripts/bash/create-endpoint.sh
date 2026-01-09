#!/bin/bash
# Script to create a new API endpoint with model, schema, and route

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <endpoint_name>"
    echo "Example: $0 user"
    exit 1
fi

ENDPOINT_NAME=$1
ENDPOINT_NAME_LOWER=$(echo "$ENDPOINT_NAME" | tr '[:upper:]' '[:lower:]')
ENDPOINT_NAME_CAMEL=$(echo "$ENDPOINT_NAME" | sed 's/\<./\U&/g')

echo "Creating new API endpoint: $ENDPOINT_NAME"

# Create the database directory if it doesn't exist
mkdir -p src/database

# Create the model in the database directory
cat > "src/database/models_${ENDPOINT_NAME_LOWER}.py" << EOF
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from . import Base

class ${ENDPOINT_NAME_CAMEL}(Base):
    __tablename__ = "${ENDPOINT_NAME_LOWER}s"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
EOF

# Create backend directories if they don't exist
mkdir -p src/backend/schemas
mkdir -p src/backend/crud
mkdir -p src/backend/api/routes

# Create Pydantic schemas
cat > "src/backend/schemas/${ENDPOINT_NAME_LOWER}.py" << EOF
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ${ENDPOINT_NAME_CAMEL}Base(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class ${ENDPOINT_NAME_CAMEL}Create(${ENDPOINT_NAME_CAMEL}Base):
    pass

class ${ENDPOINT_NAME_CAMEL}Update(${ENDPOINT_NAME_CAMEL}Base):
    name: Optional[str] = None

class ${ENDPOINT_NAME_CAMEL}Response(${ENDPOINT_NAME_CAMEL}Base):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
EOF

# Create CRUD operations
cat > "src/backend/crud/${ENDPOINT_NAME_LOWER}.py" << EOF
from sqlalchemy.orm import Session
from ..database.models import Base
from ..database.models_${ENDPOINT_NAME_LOWER} import ${ENDPOINT_NAME_CAMEL}
from ..schemas.${ENDPOINT_NAME_LOWER} import ${ENDPOINT_NAME_CAMEL}Create, ${ENDPOINT_NAME_CAMEL}Update

def get_${ENDPOINT_NAME_LOWER}(db: Session, ${ENDPOINT_NAME_LOWER}_id: int):
    return db.query(${ENDPOINT_NAME_CAMEL}).filter(${ENDPOINT_NAME_CAMEL}.id == ${ENDPOINT_NAME_LOWER}_id).first()

def get_${ENDPOINT_NAME_LOWER}s(db: Session, skip: int = 0, limit: int = 100):
    return db.query(${ENDPOINT_NAME_CAMEL}).offset(skip).limit(limit).all()

def create_${ENDPOINT_NAME_LOWER}(db: Session, ${ENDPOINT_NAME_LOWER}: ${ENDPOINT_NAME_CAMEL}Create):
    db_${ENDPOINT_NAME_LOWER} = ${ENDPOINT_NAME_CAMEL}(**${ENDPOINT_NAME_LOWER}.dict())
    db.add(db_${ENDPOINT_NAME_LOWER})
    db.commit()
    db.refresh(db_${ENDPOINT_NAME_LOWER})
    return db_${ENDPOINT_NAME_LOWER}

def update_${ENDPOINT_NAME_LOWER}(db: Session, ${ENDPOINT_NAME_LOWER}_id: int, ${ENDPOINT_NAME_LOWER}: ${ENDPOINT_NAME_CAMEL}Update):
    db_${ENDPOINT_NAME_LOWER} = db.query(${ENDPOINT_NAME_CAMEL}).filter(${ENDPOINT_NAME_CAMEL}.id == ${ENDPOINT_NAME_LOWER}_id).first()
    if db_${ENDPOINT_NAME_LOWER}:
        for key, value in ${ENDPOINT_NAME_LOWER}.dict(exclude_unset=True).items():
            setattr(db_${ENDPOINT_NAME_LOWER}, key, value)
        db.commit()
        db.refresh(db_${ENDPOINT_NAME_LOWER})
    return db_${ENDPOINT_NAME_LOWER}

def delete_${ENDPOINT_NAME_LOWER}(db: Session, ${ENDPOINT_NAME_LOWER}_id: int):
    db_${ENDPOINT_NAME_LOWER} = db.query(${ENDPOINT_NAME_CAMEL}).filter(${ENDPOINT_NAME_CAMEL}.id == ${ENDPOINT_NAME_LOWER}_id).first()
    if db_${ENDPOINT_NAME_LOWER}:
        db.delete(db_${ENDPOINT_NAME_LOWER})
        db.commit()
    return db_${ENDPOINT_NAME_LOWER}
EOF

# Create the API route
cat > "src/backend/api/routes/${ENDPOINT_NAME_LOWER}.py" << EOF
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from ...schemas.${ENDPOINT_NAME_LOWER} import ${ENDPOINT_NAME_CAMEL}Response, ${ENDPOINT_NAME_CAMEL}Create, ${ENDPOINT_NAME_CAMEL}Update
from ...crud.${ENDPOINT_NAME_LOWER} import get_${ENDPOINT_NAME_LOWER}, get_${ENDPOINT_NAME_LOWER}s, create_${ENDPOINT_NAME_LOWER}, update_${ENDPOINT_NAME_LOWER}, delete_${ENDPOINT_NAME_LOWER}

router = APIRouter(prefix="/${ENDPOINT_NAME_LOWER}s", tags=["${ENDPOINT_NAME_LOWER}s"])

@router.get("/", response_model=list[${ENDPOINT_NAME_CAMEL}Response])
def read_${ENDPOINT_NAME_LOWER}s(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ${ENDPOINT_NAME_LOWER}s = get_${ENDPOINT_NAME_LOWER}s(db, skip=skip, limit=limit)
    return ${ENDPOINT_NAME_LOWER}s

@router.get("/{${ENDPOINT_NAME_LOWER}_id}", response_model=${ENDPOINT_NAME_CAMEL}Response)
def read_${ENDPOINT_NAME}(${ENDPOINT_NAME_LOWER}_id: int, db: Session = Depends(get_db)):
    ${ENDPOINT_NAME_LOWER} = get_${ENDPOINT_NAME_LOWER}(db, ${ENDPOINT_NAME_LOWER}_id=${ENDPOINT_NAME_LOWER}_id)
    if ${ENDPOINT_NAME_LOWER} is None:
        raise HTTPException(status_code=404, detail="${ENDPOINT_NAME_CAMEL} not found")
    return ${ENDPOINT_NAME_LOWER}

@router.post("/", response_model=${ENDPOINT_NAME_CAMEL}Response)
def create_${ENDPOINT_NAME_LOWER}_item(${ENDPOINT_NAME_LOWER}: ${ENDPOINT_NAME_CAMEL}Create, db: Session = Depends(get_db)):
    return create_${ENDPOINT_NAME_LOWER}(db=db, ${ENDPOINT_NAME_LOWER}=${ENDPOINT_NAME_LOWER})

@router.put("/{${ENDPOINT_NAME_LOWER}_id}", response_model=${ENDPOINT_NAME_CAMEL}Response)
def update_${ENDPOINT_NAME_LOWER}_item(${ENDPOINT_NAME_LOWER}_id: int, ${ENDPOINT_NAME_LOWER}: ${ENDPOINT_NAME_CAMEL}Update, db: Session = Depends(get_db)):
    db_${ENDPOINT_NAME_LOWER} = update_${ENDPOINT_NAME_LOWER}(db, ${ENDPOINT_NAME_LOWER}_id=${ENDPOINT_NAME_LOWER}_id, ${ENDPOINT_NAME_LOWER}=${ENDPOINT_NAME_LOWER})
    if db_${ENDPOINT_NAME_LOWER} is None:
        raise HTTPException(status_code=404, detail="${ENDPOINT_NAME_CAMEL} not found")
    return db_${ENDPOINT_NAME_LOWER}

@router.delete("/{${ENDPOINT_NAME_LOWER}_id}", response_model=${ENDPOINT_NAME_CAMEL}Response)
def delete_${ENDPOINT_NAME_LOWER}_item(${ENDPOINT_NAME_LOWER}_id: int, db: Session = Depends(get_db)):
    db_${ENDPOINT_NAME_LOWER} = delete_${ENDPOINT_NAME_LOWER}(db, ${ENDPOINT_NAME_LOWER}_id=${ENDPOINT_NAME}_id)
    if db_${ENDPOINT_NAME_LOWER} is None:
        raise HTTPException(status_code=404, detail="${ENDPOINT_NAME_CAMEL} not found")
    return db_${ENDPOINT_NAME_LOWER}
EOF

# Update the main app to include the new router
if [ -f "src/backend/main.py" ]; then
    # Add the import and include_router to the main.py file
    sed -i.bak "/app = FastAPI/a\from .api.routes import ${ENDPOINT_NAME_LOWER}\\n\\napp.include_router(${ENDPOINT_NAME_LOWER}.router)" src/backend/main.py
    rm src/backend/main.py.bak
fi

echo "API endpoint for ${ENDPOINT_NAME} created successfully!"
echo "Files created:"
echo "- src/database/models_${ENDPOINT_NAME_LOWER}.py"
echo "- src/backend/schemas/${ENDPOINT_NAME_LOWER}.py"
echo "- src/backend/crud/${ENDPOINT_NAME_LOWER}.py"
echo "- src/backend/api/routes/${ENDPOINT_NAME_LOWER}.py"