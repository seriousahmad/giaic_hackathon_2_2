#!/usr/bin/env python3
"""
Auto-Dev Agent for Full-Stack Project Automation
This agent automatically executes the appropriate skills based on context
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Optional
import re

class AutoDevAgent:
    def __init__(self):
        self.project_root = Path.cwd()
        self.scripts_dir = self.project_root / ".specify" / "scripts"

    def detect_project_state(self) -> Dict[str, bool]:
        """Detect current state of the project"""
        return {
            'frontend_exists': (self.project_root / "src" / "frontend").exists(),
            'backend_exists': (self.project_root / "src" / "backend").exists(),
            'database_exists': (self.project_root / "src" / "database").exists(),
            'frontend_package_json': (self.project_root / "src" / "frontend" / "package.json").exists(),
            'backend_main_py': (self.project_root / "src" / "backend" / "main.py").exists(),
        }

    def should_run_init_project(self, context: str) -> bool:
        """Determine if project initialization is needed"""
        if "initialize" in context.lower() or "setup" in context.lower():
            state = self.detect_project_state()
            return not (state['frontend_exists'] and state['backend_exists'])
        return False

    def should_run_init_frontend(self, context: str) -> bool:
        """Determine if frontend initialization is needed"""
        if "nextjs" in context.lower() or "frontend" in context.lower():
            state = self.detect_project_state()
            return not state['frontend_exists']
        return False

    def should_run_init_backend(self, context: str) -> bool:
        """Determine if backend initialization is needed"""
        if "fastapi" in context.lower() or "backend" in context.lower():
            state = self.detect_project_state()
            return not state['backend_exists']
        return False

    def should_run_create_endpoint(self, context: str) -> Optional[str]:
        """Determine if endpoint creation is needed and extract entity name"""
        # Look for patterns like "create user endpoint", "add task api", etc.
        patterns = [
            r"create (\w+) endpoint",
            r"add (\w+) api",
            r"new (\w+) endpoint",
            r"create (\w+) crud",
            r"add (\w+) model"
        ]

        for pattern in patterns:
            match = re.search(pattern, context.lower())
            if match:
                entity_name = match.group(1)
                return entity_name
        return None

    def should_run_create_component(self, context: str) -> Optional[str]:
        """Determine if component creation is needed and extract component name"""
        # Look for patterns like "create button component", "add header", etc.
        patterns = [
            r"create (\w+) component",
            r"add (\w+) component",
            r"new (\w+) component",
            r"create (\w+) ui",
            r"add (\w+) ui"
        ]

        for pattern in patterns:
            match = re.search(pattern, context.lower())
            if match:
                component_name = match.group(1).capitalize()
                return component_name
        return None

    def execute_script(self, script_path: str, *args) -> str:
        """Execute a script and return output"""
        try:
            cmd = ["bash", str(script_path)] + list(args)
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )

            if result.returncode == 0:
                return f"SUCCESS: {result.stdout}"
            else:
                return f"ERROR: {result.stderr}"
        except Exception as e:
            return f"EXCEPTION: {str(e)}"

    def process_request(self, context: str) -> str:
        """Process a request and automatically execute appropriate skills"""
        responses = []

        # Check for project initialization
        if self.should_run_init_project(context):
            script_path = self.scripts_dir / "bash" / "init-project.sh"
            if script_path.exists():
                response = self.execute_script(str(script_path))
                responses.append(f"Project initialization: {response}")

        # Check for frontend initialization
        if self.should_run_init_frontend(context):
            script_path = self.scripts_dir / "bash" / "init-frontend.sh"
            if script_path.exists():
                response = self.execute_script(str(script_path))
                responses.append(f"Frontend initialization: {response}")

        # Check for backend initialization
        if self.should_run_init_backend(context):
            script_path = self.scripts_dir / "bash" / "init-backend.sh"
            if script_path.exists():
                response = self.execute_script(str(script_path))
                responses.append(f"Backend initialization: {response}")

        # Check for endpoint creation
        entity_name = self.should_run_create_endpoint(context)
        if entity_name:
            script_path = self.scripts_dir / "bash" / "create-endpoint.sh"
            if script_path.exists():
                response = self.execute_script(str(script_path), entity_name)
                responses.append(f"Endpoint creation for '{entity_name}': {response}")

        # Check for component creation
        component_name = self.should_run_create_component(context)
        if component_name:
            script_path = self.scripts_dir / "python" / "create-component.py"
            if script_path.exists():
                response = self.execute_script(str(script_path), component_name)
                responses.append(f"Component creation for '{component_name}': {response}")

        if not responses:
            return "No automated actions were triggered based on the request."

        return "\n".join(responses)

def main():
    if len(sys.argv) < 2:
        print("Usage: python autodev_agent.py <request_context>")
        print("Example: python autodev_agent.py 'create user endpoint'")
        sys.exit(1)

    context = " ".join(sys.argv[1:])
    agent = AutoDevAgent()
    result = agent.process_request(context)
    print(result)

if __name__ == "__main__":
    main()