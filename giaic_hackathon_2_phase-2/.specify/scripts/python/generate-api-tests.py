#!/usr/bin/env python3
"""
Script to generate API tests for FastAPI endpoints
"""

import os
import sys
from pathlib import Path

def generate_api_tests(endpoint_name: str):
    """Generate API tests for a given endpoint"""

    # Create tests directory if it doesn't exist
    tests_dir = Path("src/backend/tests")
    tests_dir.mkdir(parents=True, exist_ok=True)

    # Create API tests directory
    api_tests_dir = tests_dir / "api"
    api_tests_dir.mkdir(exist_ok=True)

    endpoint_lower = endpoint_name.lower()

    test_content = f'''# tests/api/test_{endpoint_lower}.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..database import Base
from ..main import app
from ..database.models import get_db

# Create a test database in memory
SQLALCHEMY_DATABASE_URL = "sqlite:///file:memdb1?mode=memory&cache=shared"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={{"check_same_thread": False}},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_{endpoint_lower}():
    response = client.post(
        "/{endpoint_lower}s/",
        json={{
            "name": "Test {endpoint_name}",
            "description": "Test description for {endpoint_name}",
            "is_active": True
        }}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test {endpoint_name}"
    assert data["is_active"] is True

def test_read_{endpoint_lower}s():
    response = client.get("/{endpoint_lower}s/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_{endpoint_lower}():
    # First create a {endpoint_name}
    create_response = client.post(
        "/{endpoint_lower}s/",
        json={{
            "name": "Test {endpoint_name}",
            "description": "Test description",
            "is_active": True
        }}
    )
    {endpoint_lower}_id = create_response.json()["id"]

    # Then read it back
    response = client.get(f"/{endpoint_lower}s/{{{endpoint_lower}_id}}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test {endpoint_name}"

def test_update_{endpoint_lower}():
    # First create a {endpoint_name}
    create_response = client.post(
        "/{endpoint_lower}s/",
        json={{
            "name": "Original {endpoint_name}",
            "description": "Original description",
            "is_active": True
        }}
    )
    {endpoint_lower}_id = create_response.json()["id"]

    # Then update it
    response = client.put(
        f"/{endpoint_lower}s/{{{endpoint_lower}_id}}",
        json={{
            "name": "Updated {endpoint_name}",
            "description": "Updated description",
            "is_active": False
        }}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated {endpoint_name}"
    assert data["is_active"] is False

def test_delete_{endpoint_lower}():
    # First create a {endpoint_name}
    create_response = client.post(
        "/{endpoint_lower}s/",
        json={{
            "name": "To be deleted {endpoint_name}",
            "description": "Will be deleted",
            "is_active": True
        }}
    )
    {endpoint_lower}_id = create_response.json()["id"]

    # Then delete it
    response = client.delete(f"/{endpoint_lower}s/{{{endpoint_lower}_id}}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == {endpoint_lower}_id
'''

    with open(api_tests_dir / f"test_{endpoint_lower}.py", "w") as f:
        f.write(test_content)

    # Create a conftest.py for test configuration
    conftest_content = '''# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database.models import Base
from src.main import app
from src.database import get_db

@pytest.fixture(scope="module")
def client():
    # Create a test database in memory
    SQLALCHEMY_DATABASE_URL = "sqlite:///file:memdb1?mode=memory&cache=shared"

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c
'''

    with open(tests_dir / "conftest.py", "w") as f:
        f.write(conftest_content)

    print(f"API tests for {endpoint_name} generated successfully!")
    print(f"Files created:")
    print(f"- {api_tests_dir}/test_{endpoint_lower}.py")
    print(f"- {tests_dir}/conftest.py")

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate-api-tests.py <endpoint_name>")
        print("Example: python generate-api-tests.py User")
        sys.exit(1)

    endpoint_name = sys.argv[1]
    generate_api_tests(endpoint_name)

if __name__ == "__main__":
    main()